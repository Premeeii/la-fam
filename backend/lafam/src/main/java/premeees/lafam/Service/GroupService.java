package premeees.lafam.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import premeees.lafam.Entity.Group;
import premeees.lafam.Entity.GroupMember;
import premeees.lafam.Entity.InviteToken;
import premeees.lafam.Entity.User;
import premeees.lafam.Repository.GroupMemberRepository;
import premeees.lafam.Repository.GroupRepository;
import premeees.lafam.Repository.InviteTokenRepository;
import premeees.lafam.Repository.UserRepository;
import premeees.lafam.dto.request.CreateGroupRequest;
import premeees.lafam.dto.response.GroupMemberResponse;
import premeees.lafam.dto.response.GroupResponse;
import premeees.lafam.dto.response.InviteTokenResponse;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final InviteTokenRepository inviteTokenRepository;
    private final UserRepository userRepository;

    public GroupService(GroupRepository groupRepository, GroupMemberRepository groupMemberRepository,
            InviteTokenRepository inviteTokenRepository, UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.inviteTokenRepository = inviteTokenRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public GroupResponse createGroup(CreateGroupRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 1. Create the group
        Group group = new Group(request.getName(), user);
        groupRepository.save(group);

        // 2. Add user as OWNER in group_members
        GroupMember member = new GroupMember(group, user, "OWNER");
        groupMemberRepository.save(member);

        return GroupResponse.fromEntity(group);
    }

    

    @Transactional(readOnly = true)
    public List<GroupMemberResponse> getUserGroups(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<GroupMember> memberships = groupMemberRepository.findAllByUserIdAndGroupDeletedAtIsNull(user.getId());

        return memberships.stream()
                .map(GroupMemberResponse::fromEntity)
                .toList();
    }

    @Transactional
    public void softDeleteGroup(UUID groupId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group is already deleted");
        }

        // Only OWNER can delete a group
        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        if (!"OWNER".equals(member.getRole())) {
            throw new IllegalArgumentException("Only the group owner can delete this group");
        }

        group.setDeletedAt(OffsetDateTime.now());
        groupRepository.save(group);
    }

    @Transactional
    public GroupMemberResponse joinGroupByToken(String token, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 1. Find the invite token
        InviteToken inviteToken = inviteTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid invite token"));

        // 2. Check if token is already used
        if (inviteToken.getUsedAt() != null) {
            throw new IllegalArgumentException("Invite token has already been used");
        }

        // 3. Check if token is expired
        if (inviteToken.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new IllegalArgumentException("Invite token has expired");
        }

        // 4. Check if group is not deleted
        Group group = inviteToken.getGroup();
        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        // 5. Check if user is already a member
        if (groupMemberRepository.findByGroupIdAndUserId(group.getId(), user.getId()).isPresent()) {
            throw new IllegalArgumentException("You are already a member of this group");
        }

        // 6. Add user to group_members with the role from the invite token
        GroupMember member = new GroupMember(group, user, inviteToken.getRole());
        groupMemberRepository.save(member);

        // 7. Mark invite token as used
        inviteToken.setUsedAt(OffsetDateTime.now());
        inviteToken.setUsedBy(user);
        inviteTokenRepository.save(inviteToken);

        return GroupMemberResponse.fromEntity(member);
    }

    @Transactional
    public InviteTokenResponse generateInviteToken(UUID groupId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        // Only OWNER can generate invite tokens
        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        if (!"OWNER".equals(member.getRole())) {
            throw new IllegalArgumentException("Only the group owner can generate invite tokens");
        }

        String token = UUID.randomUUID().toString();
        OffsetDateTime expiresAt = OffsetDateTime.now().plusDays(7);

        InviteToken inviteToken = new InviteToken(group, token, user, "MEMBER", expiresAt);
        inviteTokenRepository.save(inviteToken);

        return InviteTokenResponse.fromEntity(inviteToken);
    }
}
