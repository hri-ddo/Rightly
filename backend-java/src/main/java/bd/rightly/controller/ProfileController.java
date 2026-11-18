package bd.rightly.controller;

import bd.rightly.controller.dto.ProfessionalProfileResponse;
import bd.rightly.controller.dto.ProfileUpdateRequest;
import bd.rightly.model.service.ProfileService;
import bd.rightly.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PutMapping("/me")
    public ProfessionalProfileResponse updateMe(@Valid @RequestBody ProfileUpdateRequest request) {
        return profileService.updateMyProfile(SecurityUtils.requireUserId(), request);
    }
}