package premeees.lafam.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMin;

public class UpdateBillRequest {

    private UUID billCategoryId;

    private String title;

    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    private LocalDate billMonth;

    public UUID getBillCategoryId() {
        return billCategoryId;
    }

    public void setBillCategoryId(UUID billCategoryId) {
        this.billCategoryId = billCategoryId;
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
}
