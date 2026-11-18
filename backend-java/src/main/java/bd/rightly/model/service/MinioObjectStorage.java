package bd.rightly.model.service;

import bd.rightly.config.RightlyMinioProperties;
import bd.rightly.middleware.ApiException;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.StatObjectArgs;
import java.io.InputStream;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "rightly.storage.driver", havingValue = "minio", matchIfMissing = true)
public class MinioObjectStorage implements ObjectStorage {

    private final MinioClient minioClient;
    private final RightlyMinioProperties properties;

    public MinioObjectStorage(MinioClient minioClient, RightlyMinioProperties properties) {
        this.minioClient = minioClient;
        this.properties = properties;
    }

    @Override
    public void put(String key, InputStream content, long size, String contentType) {
        try {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(properties.bucket())
                    .object(key)
                    .stream(content, size, -1)
                    .contentType(contentType != null ? contentType : "application/octet-stream")
                    .build());
        } catch (Exception e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload file");
        }
    }

    @Override
    public ObjectStat stat(String key) {
        try {
            var stat = minioClient.statObject(StatObjectArgs.builder()
                    .bucket(properties.bucket())
                    .object(key)
                    .build());
            return new ObjectStat(true, stat.size(), stat.contentType());
        } catch (Exception e) {
            return new ObjectStat(false, 0, null);
        }
    }
}