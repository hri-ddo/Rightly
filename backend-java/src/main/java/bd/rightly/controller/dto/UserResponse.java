package bd.rightly.controller.dto;

import bd.rightly.model.entity.Role;
import bd.rightly.model.entity.VerificationStatus;
import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String fullName,
        String email,
        String phone,
        Role role,
        VerificationStatus verificationStatus,
        boolean verified,
        Instant createdAt) {
}