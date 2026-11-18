package bd.rightly.controller.dto;

import bd.rightly.model.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(
        @NotNull Role role,
        @NotBlank String fullName,
        String email,
        String phone) {
}