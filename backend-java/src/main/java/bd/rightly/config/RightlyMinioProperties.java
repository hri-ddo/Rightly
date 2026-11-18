package bd.rightly.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rightly.minio")
public record RightlyMinioProperties(
        String endpoint,
        String accessKey,
        String secretKey,
        String bucket) {
}