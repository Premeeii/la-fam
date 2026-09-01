package premeees.lafam.Service;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import org.springframework.stereotype.Service;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;

@Service
public class R2StorageService {

    private final S3Presigner presigner;
    private final S3Client s3Client;

    public R2StorageService(S3Presigner presigner, S3Client s3Client) {
        this.presigner = presigner;
        this.s3Client = s3Client;
    }

    @Value("${app.r2.bucket-name}")
    private String bucketName;

    @Value("${app.r2.public-url}")
    private String publicUrl;

    // param objectKey = avatars/abc-123.webp param contentType="image/webp"
    public String generatePresignedUploadUrl(String objectKey, String contentType) {
        // create presigned url for upload object with PutObjectRequest
        PutObjectRequest putObject = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType(contentType)
                .build();
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(5))
                .putObjectRequest(putObject)
                .build();
        //give presigner create URL that have signature attached
        PresignedPutObjectRequest presigned = presigner.presignPutObject(presignRequest);
        return presigned.url().toString();
    }
    
    public void deleteObject(String objectKey) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
            .bucket(bucketName)
            .key(objectKey)
            .build();
        //call s3 client to delete object
        s3Client.deleteObject(deleteObjectRequest);
    }
    
    //<https://pub-xxxxx.r2.dev/avatars/abc-123.webp>
    public String buildPublicUrl(String objectKey) {
        // connect publicUrl and objectKey together
        return publicUrl + "/" + objectKey;
    }
}
