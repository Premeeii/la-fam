package premeees.lafam.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

import premeees.lafam.Entity.Event;

public class EventResponse {

    private UUID id;
    private UUID groupId;
    private String title;
    private String description;
    private UUID ownerId;
    private OffsetDateTime startDate;
    private OffsetDateTime endDate;
    private String color;
    private OffsetDateTime createdAt;

    public EventResponse(UUID id, UUID groupId, String title, String description, UUID ownerId,
            OffsetDateTime startDate, OffsetDateTime endDate, String color, OffsetDateTime createdAt) {
        this.id = id;
        this.groupId = groupId;
        this.title = title;
        this.description = description;
        this.ownerId = ownerId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.color = color;
        this.createdAt = createdAt;
    }

    public static EventResponse fromEntity(Event event) {
        return new EventResponse(
                event.getId(),
                event.getGroup().getId(),
                event.getTitle(),
                event.getDescription(),
                event.getOwner().getId(),
                event.getStartDate(),
                event.getEndDate(),
                event.getColor(),
                event.getCreatedAt());
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }

    public OffsetDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(OffsetDateTime startDate) {
        this.startDate = startDate;
    }

    public OffsetDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(OffsetDateTime endDate) {
        this.endDate = endDate;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
