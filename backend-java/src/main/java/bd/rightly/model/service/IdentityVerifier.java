package bd.rightly.model.service;

import bd.rightly.model.entity.VerificationStatus;
import java.util.UUID;

public interface IdentityVerifier {

    VerificationStatus verify(UUID userId, String nidKey, String selfieKey);
}