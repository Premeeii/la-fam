package premeees.lafam.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

import premeees.lafam.Entity.Group;

public class GroupResponse {

    private UUID id;
    private String name;
    private UUID createdBy;
    private OffsetDateTime createdAt;

    public GroupResponse() {}

    public GroupResponse(UUID id, String name, UUID createdBy, OffsetDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    public static GroupResponse fromEntity(Group group) {
        return new GroupResponse(
            group.getId(),
            group.getName(),
            group.getCreatedBy().getId(),
            group.getCreatedAt()
        );
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
