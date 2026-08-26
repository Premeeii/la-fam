package premeees.lafam.dto.response;

public class InviteTokenPreviewResponse {

    private String groupName;
    private String groupAvatarUrl;
    private String inviterName;
    private String inviterAvatarUrl;
    private String role;

    public InviteTokenPreviewResponse(String groupName, String groupAvatarUrl, String inviterName, String inviterAvatarUrl, String role) {
        this.groupName = groupName;
        this.groupAvatarUrl = groupAvatarUrl;
        this.inviterName = inviterName;
        this.inviterAvatarUrl = inviterAvatarUrl;
        this.role = role;
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

    public String getInviterName() {
        return inviterName;
    }

    public void setInviterName(String inviterName) {
        this.inviterName = inviterName;
    }

    public String getInviterAvatarUrl() {
        return inviterAvatarUrl;
    }

    public void setInviterAvatarUrl(String inviterAvatarUrl) {
        this.inviterAvatarUrl = inviterAvatarUrl;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public static InviteTokenPreviewResponse fromEntity(premeees.lafam.Entity.InviteToken inviteToken) {
        return new InviteTokenPreviewResponse(
            inviteToken.getGroup().getName(),
            inviteToken.getGroup().getGroupAvatarUrl(),
            inviteToken.getInvitedBy().getDisplayName(),
            inviteToken.getInvitedBy().getAvatarUrl(),
            inviteToken.getRole()
        );
    }
}
