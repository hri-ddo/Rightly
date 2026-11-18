package bd.rightly.model.service;

import bd.rightly.controller.dto.ProfileUpdateRequest;
import bd.rightly.controller.dto.ProfessionalProfileResponse;
import bd.rightly.middleware.ApiException;
import bd.rightly.model.entity.ProfessionalProfile;
import bd.rightly.model.entity.Role;
import bd.rightly.model.entity.User;
import bd.rightly.model.repository.ProfessionalProfileRepository;
import bd.rightly.model.repository.UserRepository;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final ProfessionalProfileRepository profileRepository;

    public ProfileService(UserRepository userRepository, ProfessionalProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    /** Creates or updates the signed-in professional's directory profile. */
    @Transactional
    public ProfessionalProfileResponse updateMyProfile(UUID userId, ProfileUpdateRequest request) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        if (user.getRole() != Role.LAWYER && user.getRole() != Role.PSYCHIATRIST) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only professionals can edit a directory profile");
        }

        ProfessionalProfile profile = profileRepository
                .findByUser(user)
                .orElseGet(() -> {
                    ProfessionalProfile created = new ProfessionalProfile();
                    created.setUser(user);
                    return created;
                });
        profile.updateDetails(
                request.displayName(),
                request.district(),
                request.specialty(),
                request.feeBdt(),
                request.languages(),
                request.bio());
        profile = profileRepository.save(profile);
        return toResponse(profile);
    }

    private ProfessionalProfileResponse toResponse(ProfessionalProfile profile) {
        return new ProfessionalProfileResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getDisplayName(),
                profile.getDistrict(),
                profile.getSpecialty(),
                profile.getFeeBdt(),
                profile.getLanguages(),
                profile.getBio(),
                profile.getUser().getRole());
    }
}