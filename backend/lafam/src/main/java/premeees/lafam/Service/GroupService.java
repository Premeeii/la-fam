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
import premeees.lafam.dto.response.AvatarUploadResponse;
import premeees.lafam.dto.response.GroupMemberResponse;
import premeees.lafam.dto.response.GroupResponse;
import premeees.lafam.dto.response.InviteTokenResponse;
import premeees.lafam.dto.response.InviteTokenPreviewResponse;
import premeees.lafam.dto.request.UpdateGroupRequest;
import java.util.Optional;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final InviteTokenRepository inviteTokenRepository;
    private final UserRepository userRepository;
    private final R2StorageService r2StorageService;

    public GroupService(GroupRepository groupRepository, GroupMemberRepository groupMemberRepository,
            InviteTokenRepository inviteTokenRepository, UserRepository userRepository,
            R2StorageService r2StorageService) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.inviteTokenRepository = inviteTokenRepository;
        this.userRepository = userRepository;
        this.r2StorageService = r2StorageService;
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

    @Transactional
    public GroupResponse updateGroup(UUID groupId, UpdateGroupRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        // Only OWNER can update group
        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        if (!"OWNER".equals(member.getRole())) {
            throw new IllegalArgumentException("Only the group owner can update this group");
        }

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            group.setName(request.getName().trim());
        }

        groupRepository.save(group);

        return GroupResponse.fromEntity(group);
    }

    @Transactional(readOnly = true)
    public List<GroupMemberResponse> getUserGroups(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<GroupMember> memberships = groupMemberRepository
                .findAllByUserIdAndGroupDeletedAtIsNullAndLeavedAtIsNull(user.getId());

        return memberships.stream()
                .map(GroupMemberResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GroupMemberResponse> getGroupMembers(UUID groupId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        if (member.getLeavedAt() != null) {
            throw new IllegalArgumentException("You have already left this group");
        }

        List<GroupMember> members = groupMemberRepository.findAllByGroupIdAndLeavedAtIsNull(groupId);

        return members.stream()
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
    public void softLeaveGroup(UUID groupId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));
        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        if (member.getLeavedAt() != null) {
            throw new IllegalArgumentException("You have already left this group");
        }

        if ("OWNER".equals(member.getRole())) {
            throw new IllegalArgumentException("You are the owner of this group");
        }

        member.setLeavedAt(OffsetDateTime.now());
        groupMemberRepository.save(member);
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

        Optional<GroupMember> existingMemberOpt = groupMemberRepository.findByGroupIdAndUserId(group.getId(),
                user.getId());
        // 5. Check if user is already a member
        if (existingMemberOpt.isPresent()) {
            GroupMember existingMember = existingMemberOpt.get();
            if (existingMember.getLeavedAt() == null) {
                throw new IllegalArgumentException("You are already a member of this group");
            } else {
                // if user was a member but left, welcome them back
                existingMember.setLeavedAt(null);
                existingMember.setRole(inviteToken.getRole());
                inviteToken.setUsedAt(OffsetDateTime.now());
                inviteToken.setUsedBy(user);
                inviteTokenRepository.save(inviteToken);
                groupMemberRepository.save(existingMember);
                return GroupMemberResponse.fromEntity(existingMember);
            }
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

    @Transactional(readOnly = true)
    public InviteTokenPreviewResponse previewInviteToken(String token) {
        InviteToken inviteToken = inviteTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid invite token"));

        if (inviteToken.getUsedAt() != null) {
            throw new IllegalArgumentException("Invite token has already been used");
        }

        if (inviteToken.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new IllegalArgumentException("Invite token has expired");
        }

        if (inviteToken.getGroup().getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        return InviteTokenPreviewResponse.fromEntity(inviteToken);
    }

    // use for request presigned url to upload picture
    public AvatarUploadResponse requestGroupAvatarUpload(UUID groupId, String email, String contentType) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        // Only OWNER can update group
        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        if (!"OWNER".equals(member.getRole())) {
            throw new IllegalArgumentException("Only the group owner can update this group");
        }

        // convert contentType to be extension like "image/webp" → "webp"
        String extension = contentType.split("/")[1];

        // create objectKey use for userId have a file name in one row
        String objectKey = "GroupAvatar/" + user.getId() + "." + extension;

        // Generate presigned URL
        String uploadUrl = r2StorageService.generatePresignedUploadUrl(objectKey, contentType);

        // Create publicUrl for show picture after upload
        String publicUrl = r2StorageService.buildPublicUrl(objectKey);

        return new AvatarUploadResponse(uploadUrl, publicUrl, objectKey);
    }

    @Transactional
    public GroupResponse confirmGroupAvatarUpload(UUID groupId, String email, String objectKey) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("Group has been deleted");
        }

        // Only OWNER can update group
        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        if (!"OWNER".equals(member.getRole())) {
            throw new IllegalArgumentException("Only the group owner can update this group");
        }

        // delete oldAvatarUrl out of R2 if has it
        String oldAvatarUrl = group.getGroupAvatarUrl();
        if (oldAvatarUrl != null && !oldAvatarUrl.isBlank()) {
            try {
                String oldKey = oldAvatarUrl.substring(oldAvatarUrl.lastIndexOf("GroupAvatar/"));
                // remove timestamp query param if exists
                if (oldKey.contains("?")) {
                    oldKey = oldKey.substring(0, oldKey.indexOf("?"));
                }

                // if old key and new key are same don't need to delete
                // because PUT already overwrite the same file(like re-upload .png file)
                if (!oldKey.equals(objectKey)) {
                    r2StorageService.deleteObject(oldKey);
                }
            } catch (Exception e) {
                System.out.println("Failed to delete old avatar: " + e.getMessage());
            }
        }
        // create new public Url in DB with timestamp to bust browser cache
        String newAvatarUrl = r2StorageService.buildPublicUrl(objectKey) + "?t=" + System.currentTimeMillis();
        group.setGroupAvatarUrl(newAvatarUrl);
        groupRepository.save(group);
        return GroupResponse.fromEntity(group);
    }

}
