package bd.rightly.controller;

import bd.rightly.controller.dto.UserResponse;
import bd.rightly.model.entity.User;
import bd.rightly.model.service.AuthService;
import bd.rightly.model.service.VerificationService;
import bd.rightly.util.SecurityUtils;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/verification")
public class VerificationController {

    private final VerificationService verificationService;
    private final AuthService authService;

    public VerificationController(VerificationService verificationService, AuthService authService) {
        this.verificationService = verificationService;
        this.authService = authService;
    }

    @PostMapping(value = "/nid", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UserResponse uploadNid(@RequestPart("file") MultipartFile file) {
        UUID userId = SecurityUtils.requireUserId();
        User user = verificationService.uploadNid(userId, file);
        return authService.toResponse(user);
    }

    @PostMapping(value = "/selfie", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UserResponse uploadSelfie(@RequestPart("file") MultipartFile file) {
        UUID userId = SecurityUtils.requireUserId();
        User user = verificationService.uploadSelfie(userId, file);
        return authService.toResponse(user);
    }
}