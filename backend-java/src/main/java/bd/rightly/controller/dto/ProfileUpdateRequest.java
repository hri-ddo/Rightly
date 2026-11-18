package bd.rightly.controller.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ProfileUpdateRequest(
        @NotBlank String displayName,
        @NotBlank String district,
        @NotBlank String specialty,
        @Min(0) int feeBdt,
        @NotBlank String languages,
        String bio) {
}