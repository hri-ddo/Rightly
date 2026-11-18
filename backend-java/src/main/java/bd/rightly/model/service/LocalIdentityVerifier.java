package bd.rightly.model.service;

import bd.rightly.config.RightlyMinioProperties;
import bd.rightly.model.entity.VerificationStatus;
import io.minio.MinioClient;
import io.minio.StatObjectArgs;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class LocalIdentityVerifier implements IdentityVerifier {

    private final MinioClient minioClient;
    private final RightlyMinioProperties minioProperties;

    public LocalIdentityVerifier(MinioClient minioClient, RightlyMinioProperties minioProperties) {
        this.minioClient = minioClient;
        this.minioProperties = minioProperties;
    }

    @Override
    public VerificationStatus verify(UUID userId, String nidKey, String selfieKey) {
        if (nidKey == null || nidKey.isBlank() || selfieKey == null || selfieKey.isBlank()) {
            return VerificationStatus.REJECTED;
        }
        try {
            var nidStat = minioClient.statObject(
                    StatObjectArgs.builder().bucket(minioProperties.bucket()).object(nidKey).build());
            var selfieStat = minioClient.statObject(
                    StatObjectArgs.builder().bucket(minioProperties.bucket()).object(selfieKey).build());
            String selfieContentType = selfieStat.contentType();
            boolean image = selfieContentType != null && selfieContentType.startsWith("image/");
            if (nidStat.size() > 0 && selfieStat.size() > 0 && image) {
                return VerificationStatus.VERIFIED;
            }
            return VerificationStatus.REJECTED;
        } catch (Exception e) {
            return VerificationStatus.REJECTED;
        }
    }
}