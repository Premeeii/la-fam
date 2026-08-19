package premeees.lafam.dto.response;

import java.util.UUID;

import premeees.lafam.Entity.BillCategory;

public class BillCategoryResponse {

    private UUID id;
    private String name;

    public BillCategoryResponse(UUID id, String name) {
        this.id = id;
        this.name = name;
    }

    public static BillCategoryResponse fromEntity(BillCategory category) {
        return new BillCategoryResponse(category.getId(), category.getName());
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
}
