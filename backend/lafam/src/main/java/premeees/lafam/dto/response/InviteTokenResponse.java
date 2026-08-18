package premeees.lafam.dto.response;

import java.time.OffsetDateTime;

import premeees.lafam.Entity.InviteToken;

public class InviteTokenResponse {
    
    private String token;
    private String role;
    private OffsetDateTime expiresAt;

    public InviteTokenResponse(String token, String role, OffsetDateTime expiresAt) {
        this.token = token;
        this.role = role;
        this.expiresAt = expiresAt;
    }

    public static InviteTokenResponse fromEntity(InviteToken inviteToken) {
        return new InviteTokenResponse(
            inviteToken.getToken(),
            inviteToken.getRole(),
            inviteToken.getExpiresAt()
        );
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public OffsetDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(OffsetDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}
