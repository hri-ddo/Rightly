package bd.rightly.controller.dto;

import bd.rightly.model.entity.Role;
import java.util.UUID;

public record ProfessionalProfileResponse(
        UUID id,
        UUID userId,
        String displayName,
        String district,
        String specialty,
        int feeBdt,
        String languages,
        String bio,
        Role role) {
}