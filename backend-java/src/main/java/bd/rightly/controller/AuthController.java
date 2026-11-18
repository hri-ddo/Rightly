package bd.rightly.controller;

import bd.rightly.controller.dto.AuthSessionResult;
import bd.rightly.controller.dto.OtpContactRequest;
import bd.rightly.controller.dto.OtpVerifyRequest;
import bd.rightly.controller.dto.RegisterRequest;
import bd.rightly.controller.dto.UserResponse;
import bd.rightly.middleware.ApiException;
import bd.rightly.model.service.AuthService;
import bd.rightly.util.SecurityUtils;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/otp/request")
    public ResponseEntity<Map<String, String>> requestOtp(@RequestBody OtpContactRequest request) {
        authService.requestOtp(request.email(), request.phone());
        return ResponseEntity.ok(Map.of("status", "OTP_SENT"));
    }

    @PostMapping("/otp/verify")
    public AuthSessionResult verifyOtp(@Valid @RequestBody OtpVerifyRequest request, HttpServletResponse response) {
        return authService.verifyOtp(request.email(), request.phone(), request.otp(), response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public UserResponse me() {
        UUID userId = SecurityUtils.currentUserId()
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated"));
        return authService.me(userId);
    }
}