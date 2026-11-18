package bd.rightly.model.service;

import bd.rightly.controller.dto.DashboardSummaryResponse;
import bd.rightly.model.entity.Role;
import bd.rightly.model.entity.VerificationStatus;
import bd.rightly.model.repository.ProfessionalProfileRepository;
import bd.rightly.model.repository.UserRepository;
import bd.rightly.util.SecurityUtils;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final ProfessionalProfileRepository profileRepository;
    private final UserRepository userRepository;

    public DashboardService(ProfessionalProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    /** Returns live PostgreSQL counts for directory professionals, verified users, and current user status. */
    @Transactional(readOnly = true)
    public DashboardSummaryResponse summary() {
        long totalProfessionals = profileRepository.count();
        long lawyersCount = profileRepository.countByUserRole(Role.LAWYER);
        long psychiatristsCount = profileRepository.countByUserRole(Role.PSYCHIATRIST);
        long verifiedUsersCount = userRepository.countByVerificationStatus(VerificationStatus.VERIFIED);

        Optional<UUID> userId = SecurityUtils.currentUserId();
        VerificationStatus verificationStatus = userId
                .flatMap(userRepository::findById)
                .map(u -> u.getVerificationStatus())
                .orElse(null);

        return new DashboardSummaryResponse(
                totalProfessionals,
                lawyersCount,
                psychiatristsCount,
                verifiedUsersCount,
                verificationStatus);
    }
}