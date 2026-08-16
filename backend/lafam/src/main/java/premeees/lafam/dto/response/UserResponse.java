package premeees.lafam.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

import premeees.lafam.Entity.User;

public class UserResponse {
    
    private UUID id;
    private String email;
    private String displayName;
    private String avatarUrl;
    private String bio;
    private OffsetDateTime created_at;

    public UserResponse() {
    }

    public UserResponse(UUID id, String email, String displayName, String avatarUrl, String bio, OffsetDateTime created_at) {
        this.id = id;
        this.email = email;
        this.displayName = displayName;
        this.avatarUrl = avatarUrl;
        this.bio = bio;
        this.created_at = created_at;
    }

    //Factory Method use in Service for
    public static UserResponse fromEntity(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getDisplayName(),
                user.getAvatarUrl(),
                user.getBio(),
                user.getCreatedAt()
        );
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public OffsetDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(OffsetDateTime created_at) {
        this.created_at = created_at;
    }
}
