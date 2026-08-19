package premeees.lafam.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

import premeees.lafam.Entity.Bill;

public class BillResponse {

    private UUID id;
    private UUID groupId;
    private UUID billCategoryId;
    private String categoryName;
    private String title;
    private BigDecimal amount;
    private LocalDate billMonth;
    private OffsetDateTime createdAt;
    private UUID createdBy;

    public BillResponse(UUID id, UUID groupId, UUID billCategoryId, String categoryName, String title,
                        BigDecimal amount, LocalDate billMonth, OffsetDateTime createdAt, UUID createdBy) {
        this.id = id;
        this.groupId = groupId;
        this.billCategoryId = billCategoryId;
        this.categoryName = categoryName;
        this.title = title;
        this.amount = amount;
        this.billMonth = billMonth;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
    }

    public static BillResponse fromEntity(Bill bill) {
        return new BillResponse(
            bill.getId(),
            bill.getGroup().getId(),
            bill.getBillCategory().getId(),
            bill.getBillCategory().getName(),
            bill.getTitle(),
            bill.getAmount(),
            bill.getBillMonth(),
            bill.getCreatedAt(),
            bill.getCreatedBy().getId()
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

    public UUID getBillCategoryId() {
        return billCategoryId;
    }

    public void setBillCategoryId(UUID billCategoryId) {
        this.billCategoryId = billCategoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getBillMonth() {
        return billMonth;
    }

    public void setBillMonth(LocalDate billMonth) {
        this.billMonth = billMonth;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }
}
