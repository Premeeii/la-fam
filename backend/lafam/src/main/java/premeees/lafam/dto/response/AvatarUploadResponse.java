package premeees.lafam.dto.response;

public class AvatarUploadResponse {
    
    private String uploadUrl; // Presigned PUT URL — Frontend use to PUT a file to this URL
    private String publicUrl; // URL use to show image after success upload
    private String objectKey;   //// key name of file use to put in like "avatars/{userId}.webp"
    
    public AvatarUploadResponse() {}

    public AvatarUploadResponse(String uploadUrl, String publicUrl, String objectKey) {
        this.uploadUrl = uploadUrl;
        this.publicUrl = publicUrl;
        this.objectKey = objectKey;
    }
    public String getUploadUrl() {
        return uploadUrl;
    }


    public void setUploadUrl(String uploadUrl) {
        this.uploadUrl = uploadUrl;
    }


    public String getPublicUrl() {
        return publicUrl;
    }


    public void setPublicUrl(String publicUrl) {
        this.publicUrl = publicUrl;
    }


    public String getObjectKey() {
        return objectKey;
    }


    public void setObjectKey(String objectKey) {
        this.objectKey = objectKey;
    }

    
}
