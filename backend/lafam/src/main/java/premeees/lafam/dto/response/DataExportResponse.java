package premeees.lafam.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record DataExportResponse(
    OffsetDateTime exportedAt,
    UserProfileExport userProfile,
    List<UserGroupExport> groups,
    List<UserBillExport> createdBills,
    List<UserEventExport> createdEvents
 ) {
    public record UserProfileExport(
        UUID id,
        String email,
        String displayName,
        String bio,
        String avatarUrl,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
    ) {}

    public record UserGroupExport(
        UUID groupId,
        String groupName,
        String role,
        OffsetDateTime joinedAt
    ) {}

    public record UserBillExport(
        UUID billId,
        UUID groupId,
        String title,
        BigDecimal amount,
        LocalDate billMonth,
        String categoryName,
        OffsetDateTime createdAt
    ) {}

    public record UserEventExport(
        UUID eventId,
        UUID groupId,
        String title,
        String description,
        OffsetDateTime startDate,
        OffsetDateTime endDate,
        String color,
        OffsetDateTime createdAt
    ) {}
}

