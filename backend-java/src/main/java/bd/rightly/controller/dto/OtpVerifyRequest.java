package bd.rightly.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record OtpVerifyRequest(String email, String phone, @NotBlank String otp) {
}