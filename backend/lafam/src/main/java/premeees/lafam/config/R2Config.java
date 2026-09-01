package premeees.lafam.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.net.URI;

import software.amazon.awssdk.regions.Region;

import org.springframework.beans.factory.annotation.Value;

@Configuration
public class R2Config {
    @Value("${app.r2.account-id}")
    private String accountId;
    @Value("${app.r2.access-key}")
    private String accessKey;
    @Value("${app.r2.secret-key}")
    private String secretKey;

    private URI endpoint() {
        return URI.create("https://" + accountId + ".r2.cloudflarestorage.com");
    }

    private AwsCredentialsProvider credentials() {
        return StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey));
    }

    @Bean
    public S3Presigner s3Presigner() {
        return S3Presigner.builder()
            .endpointOverride(endpoint())
            .credentialsProvider(credentials())
            .region(Region.of("auto"))
            .build();
    }

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
            .endpointOverride(endpoint())
            .credentialsProvider(credentials())
            .region(Region.of("auto"))
            .build();
    }

}
