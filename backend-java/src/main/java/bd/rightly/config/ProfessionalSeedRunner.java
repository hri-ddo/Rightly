package bd.rightly.config;

import bd.rightly.model.entity.ProfessionalProfile;
import bd.rightly.model.entity.Role;
import bd.rightly.model.entity.User;
import bd.rightly.model.entity.VerificationStatus;
import bd.rightly.model.repository.ProfessionalProfileRepository;
import bd.rightly.model.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ProfessionalSeedRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(ProfessionalSeedRunner.class);

    private final UserRepository userRepository;
    private final ProfessionalProfileRepository profileRepository;

    public ProfessionalSeedRunner(UserRepository userRepository, ProfessionalProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (profileRepository.count() >= 3) {
            return;
        }
        seedIfMissing(
                "lawyer.dhaka.family@rightly.local",
                "+8801711000001",
                "Adv. Fatema Rahman",
                Role.LAWYER,
                "Adv. Fatema Rahman",
                "Dhaka",
                "Family Law",
                3500,
                "Bengali, English",
                "Dhaka-based family law advocate supporting survivors with court filings and mediation.");
        seedIfMissing(
                "lawyer.chattogram.criminal@rightly.local",
                "+8801711000002",
                "Adv. Karim Chowdhury",
                Role.LAWYER,
                "Adv. Karim Chowdhury",
                "Chattogram",
                "Criminal Law",
                5000,
                "Bengali",
                "Chattogram criminal defense and bail support for urgent matters.");
        seedIfMissing(
                "psych.dhaka@rightly.local",
                "+8801711000003",
                "Dr. Nusrat Jahan",
                Role.PSYCHIATRIST,
                "Dr. Nusrat Jahan",
                "Dhaka",
                "Trauma & PTSD",
                2500,
                "Bengali, English",
                "Licensed psychiatrist offering trauma-informed tele-sessions in Dhaka.");
        log.info("Seeded professional directory profiles");
    }

    private void seedIfMissing(
            String email,
            String phone,
            String fullName,
            Role role,
            String displayName,
            String district,
            String specialty,
            int fee,
            String languages,
            String bio) {
        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseGet(() -> {
                    User u = new User();
                    u.setEmail(email);
                    u.setPhone(phone);
                    u.setFullName(fullName);
                    u.setRole(role);
                    u.setVerificationStatus(VerificationStatus.VERIFIED);
                    return userRepository.save(u);
                });

        profileRepository.findByUser(user).orElseGet(() -> {
            ProfessionalProfile profile = new ProfessionalProfile();
            profile.setUser(user);
            profile.setDisplayName(displayName);
            profile.setDistrict(district);
            profile.setSpecialty(specialty);
            profile.setFeeBdt(fee);
            profile.setLanguages(languages);
            profile.setBio(bio);
            return profileRepository.save(profile);
        });
    }
}