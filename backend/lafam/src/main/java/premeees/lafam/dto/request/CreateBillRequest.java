package premeees.lafam.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateBillRequest {

    @NotNull(message = "Bill category ID is required")
    private UUID billCategoryId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Bill month is required")
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
