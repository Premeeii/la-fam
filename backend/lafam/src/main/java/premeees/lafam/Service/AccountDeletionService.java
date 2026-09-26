package premeees.lafam.Service;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import premeees.lafam.Entity.Group;
import premeees.lafam.Entity.GroupMember;
import premeees.lafam.Entity.User;
import premeees.lafam.Repository.BillRepository;
import premeees.lafam.Repository.EventRepository;
import premeees.lafam.Repository.GroupMemberRepository;
import premeees.lafam.Repository.GroupRepository;
import premeees.lafam.Repository.InviteTokenRepository;
import premeees.lafam.Repository.UserRepository;

@Service
public class AccountDeletionService {

    private final UserRepository userRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final GroupRepository groupRepository;
    private final BillRepository billRepository;
    private final EventRepository eventRepository;
    private final InviteTokenRepository inviteTokenRepository;
    private final R2StorageService r2StorageService;
    private final PasswordEncoder passwordEncoder;

    public AccountDeletionService(
            UserRepository userRepository,
            GroupMemberRepository groupMemberRepository,
            GroupRepository groupRepository,
            BillRepository billRepository,
            EventRepository eventRepository,
            InviteTokenRepository inviteTokenRepository,
            R2StorageService r2StorageService,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.groupRepository = groupRepository;
        this.billRepository = billRepository;
        this.eventRepository = eventRepository;
        this.inviteTokenRepository = inviteTokenRepository;
        this.r2StorageService = r2StorageService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void deleteAccount(String email, String password) {
        // 1. Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 2. Verify password
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Incorrect password");
        }

        // 3. Handle group ownership
        List<GroupMember> memberships = groupMemberRepository
                .findAllByUserIdAndGroupDeletedAtIsNullAndLeavedAtIsNull(user.getId());

        for (GroupMember membership : memberships) {
            if ("OWNER".equals(membership.getRole())) {
                handleOwnerDeletion(membership.getGroup(), user);
            }
        }

        // 4. Delete user's bills
        billRepository.deleteAllByCreatedBy(user);

        // 5. Delete user's events
        eventRepository.deleteAllByOwner(user);

        // 6. Nullify invite token references
        inviteTokenRepository.nullifyInvitedBy(user);
        inviteTokenRepository.nullifyUsedBy(user);

        // 7. Delete avatar from R2
        deleteAvatarFromR2(user.getAvatarUrl());

        // 8. Delete user (cascade: group_members, refresh_tokens,
        //    password_reset_tokens, email_change_tokens)
        userRepository.delete(user);
    }

    private void handleOwnerDeletion(Group group, User currentUser) {
        // Find next member (joined earliest, excluding current user)
        var nextOwner = groupMemberRepository
                .findFirstByGroupIdAndUserIdNotAndLeavedAtIsNullOrderByJoinedAtAsc(
                        group.getId(), currentUser.getId());

        if (nextOwner.isPresent()) {
            // Transfer ownership
            GroupMember newOwnerMember = nextOwner.get();
            newOwnerMember.setRole("OWNER");
            groupMemberRepository.save(newOwnerMember);

            // Update group.createdBy
            group.setCreatedBy(newOwnerMember.getUser());
            groupRepository.save(group);
        } else {
            // Only member → soft delete group
            group.setDeletedAt(OffsetDateTime.now());
            groupRepository.save(group);
        }
    }

    private void deleteAvatarFromR2(String avatarUrl) {
        if (avatarUrl == null || avatarUrl.isBlank()) return;

        try {
            int index = avatarUrl.indexOf("avatar/");
            if (index == -1) return; //catch url not contain avatar/

            String objectKey = avatarUrl.substring(index);
            if (objectKey.contains("?")) {
                objectKey = objectKey.substring(0, objectKey.indexOf("?"));
            }

            r2StorageService.deleteObject(objectKey);
        } catch (Exception e) {
            // Log but don't block account deletion
            System.err.println("Failed to delete avatar from R2: " + e.getMessage());
        }
    }
}
