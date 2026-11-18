package bd.rightly.model.service;

import bd.rightly.model.entity.VerificationStatus;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class LocalIdentityVerifier implements IdentityVerifier {

    private final ObjectStorage objectStorage;

    public LocalIdentityVerifier(ObjectStorage objectStorage) {
        this.objectStorage = objectStorage;
    }

    @Override
    public VerificationStatus verify(UUID userId, String nidKey, String selfieKey) {
        if (nidKey == null || nidKey.isBlank() || selfieKey == null || selfieKey.isBlank()) {
            return VerificationStatus.REJECTED;
        }
        ObjectStorage.ObjectStat nidStat = objectStorage.stat(nidKey);
        ObjectStorage.ObjectStat selfieStat = objectStorage.stat(selfieKey);
        String selfieContentType = selfieStat.contentType();
        boolean image = selfieContentType != null && selfieContentType.startsWith("image/");
        if (nidStat.exists() && selfieStat.exists() && nidStat.size() > 0 && selfieStat.size() > 0 && image) {
            return VerificationStatus.VERIFIED;
        }
        return VerificationStatus.REJECTED;
    }
}