package premeees.lafam.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

import premeees.lafam.Entity.Note;

public class NoteResponse {

    private UUID id;
    private UUID groupId;
    private String title;
    private String content;
    private UUID createdBy;
    private String creatorName;
    private UUID updatedBy;
    private String updaterName;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public NoteResponse(UUID id, UUID groupId, String title, String content,
                        UUID createdBy, String creatorName,
                        UUID updatedBy, String updaterName,
                        OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.groupId = groupId;
        this.title = title;
        this.content = content;
        this.createdBy = createdBy;
        this.creatorName = creatorName;
        this.updatedBy = updatedBy;
        this.updaterName = updaterName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static NoteResponse fromEntity(Note note) {
        return new NoteResponse(
            note.getId(),
            note.getGroup().getId(),
            note.getTitle(),
            note.getContent(),
            note.getCreatedBy().getId(),
            note.getCreatedBy().getDisplayName(),
            note.getUpdatedBy() != null ? note.getUpdatedBy().getId() : null,
            note.getUpdatedBy() != null ? note.getUpdatedBy().getDisplayName() : null,
            note.getCreatedAt(),
            note.getUpdatedAt()
        );
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getGroupId() {
        return groupId;
    }

    public void setGroupId(UUID groupId) {
        this.groupId = groupId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public UUID getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(UUID updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getUpdaterName() {
        return updaterName;
    }

    public void setUpdaterName(String updaterName) {
        this.updaterName = updaterName;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
