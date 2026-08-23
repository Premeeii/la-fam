package premeees.lafam.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

import premeees.lafam.Entity.GroupMember;

public class GroupMemberResponse {

    private UUID userId;
    private UUID groupId;
    private String role;
    private OffsetDateTime joinedAt;
    private String groupName;
    private String groupAvatarUrl;

    public GroupMemberResponse(UUID userId, UUID groupId, String role, OffsetDateTime joinedAt, String groupName, String groupAvatarUrl) {
        this.userId = userId;
        this.groupId = groupId;
        this.role = role;
        this.joinedAt = joinedAt;
        this.groupName = groupName;
        this.groupAvatarUrl = groupAvatarUrl;
    }

    public static GroupMemberResponse fromEntity(GroupMember member) {
        return new GroupMemberResponse(
            member.getUser().getId(),
            member.getGroup().getId(),
            member.getRole(),
            member.getJoinedAt(),
            member.getGroup().getName(),
            member.getGroup().getGroupAvatarUrl()
        );
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getGroupId() {
        return groupId;
    }

    public void setGroupId(UUID groupId) {
        this.groupId = groupId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public OffsetDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(OffsetDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getGroupAvatarUrl() {
        return groupAvatarUrl;
    }

    public void setGroupAvatarUrl(String groupAvatarUrl) {
        this.groupAvatarUrl = groupAvatarUrl;
    }
}
