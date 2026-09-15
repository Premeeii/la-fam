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
    private String displayName;
    private String bio;
    private String userAvatarUrl;
    private Boolean isBooked;

    public GroupMemberResponse(UUID userId, UUID groupId, String role, OffsetDateTime joinedAt, String groupName, String groupAvatarUrl, String displayName, String userAvatarUrl, String bio, Boolean isBooked) {
        this.userId = userId;
        this.groupId = groupId;
        this.role = role;
        this.joinedAt = joinedAt;
        this.groupName = groupName;
        this.groupAvatarUrl = groupAvatarUrl;
        this.displayName = displayName;
        this.userAvatarUrl = userAvatarUrl;
        this.bio = bio;
        this.isBooked = isBooked;
    }

    public static GroupMemberResponse fromEntity(GroupMember member) {
        return new GroupMemberResponse(
            member.getUser().getId(),
            member.getGroup().getId(),
            member.getRole(),
            member.getJoinedAt(),
            member.getGroup().getName(),
            member.getGroup().getGroupAvatarUrl(),
            member.getUser().getDisplayName(),
            member.getUser().getAvatarUrl(),
            member.getUser().getBio(),
            member.getIsBooked()
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

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getUserAvatarUrl() {
        return userAvatarUrl;
    }

    public void setUserAvatarUrl(String userAvatarUrl) {
        this.userAvatarUrl = userAvatarUrl;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Boolean getIsBooked() {
        return isBooked;
    }

    public void setIsBooked(Boolean isBooked) {
        this.isBooked = isBooked;
    }
}
