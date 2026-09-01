package premeees.lafam.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ConfirmAvatarRequest {
    @NotBlank(message = "objectKey is required")
    private String objectKey;

    public ConfirmAvatarRequest() {}

    public String getObjectKey() {
        return objectKey;
    }

    public void setObjectKey(String objectKey) {
        this.objectKey = objectKey;
    }
}
