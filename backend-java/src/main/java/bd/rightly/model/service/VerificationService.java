package bd.rightly.model.service;

import bd.rightly.config.RightlyMinioProperties;
import bd.rightly.middleware.ApiException;
import bd.rightly.model.entity.User;
import bd.rightly.model.entity.VerificationStatus;
import bd.rightly.model.repository.UserRepository;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import java.io.InputStream;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class VerificationService {

    private final UserRepository userRepository;
    private final MinioClient minioClient;
    private final RightlyMinioProperties minioProperties;
    private final IdentityVerifier identityVerifier;

    public VerificationService(
            UserRepository userRepository,
            MinioClient minioClient,
            RightlyMinioProperties minioProperties,
            IdentityVerifier identityVerifier) {
        this.userRepository = userRepository;
        this.minioClient = minioClient;
        this.minioProperties = minioProperties;
        this.identityVerifier = identityVerifier;
    }

    /** Uploads the user's NID document to MinIO and moves status from UNVERIFIED to PENDING. */
    @Transactional
    public User uploadNid(UUID userId, MultipartFile file) {
        User user = loadUser(userId);
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "NID file is required");
        }
        String key = objectKey(userId, "nid");
        upload(key, file);
        if (user.getVerificationStatus() == VerificationStatus.UNVERIFIED) {
            user.setVerificationStatus(VerificationStatus.PENDING);
        }
        return userRepository.save(user);
    }

    /** Uploads a selfie to MinIO and runs IdentityVerifier to mark the user VERIFIED or REJECTED. */
    @Transactional
    public User uploadSelfie(UUID userId, MultipartFile file) {
        User user = loadUser(userId);
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Selfie file is required");
        }
        String selfieKey = objectKey(userId, "selfie");
        upload(selfieKey, file);
        String nidKey = objectKey(userId, "nid");
        VerificationStatus status = identityVerifier.verify(userId, nidKey, selfieKey);
        if (status == VerificationStatus.REJECTED && user.getVerificationStatus() == VerificationStatus.PENDING) {
            user.setVerificationStatus(VerificationStatus.PENDING);
        } else {
            user.setVerificationStatus(status);
        }
        return userRepository.save(user);
    }

    private void upload(String key, MultipartFile file) {
        try (InputStream stream = file.getInputStream()) {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(minioProperties.bucket())
                    .object(key)
                    .stream(stream, file.getSize(), -1)
                    .contentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                    .build());
        } catch (Exception e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload file");
        }
    }

    private String objectKey(UUID userId, String kind) {
        return "verification/" + userId + "/" + kind;
    }

    private User loadUser(UUID userId) {
        return userRepository
                .findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }
}