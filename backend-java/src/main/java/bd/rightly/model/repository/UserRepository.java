package bd.rightly.model.repository;

import bd.rightly.model.entity.Role;
import bd.rightly.model.entity.User;
import bd.rightly.model.entity.VerificationStatus;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByPhone(String phone);

    long countByVerificationStatus(VerificationStatus status);

    long countByRole(Role role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role IN (bd.rightly.model.entity.Role.LAWYER, bd.rightly.model.entity.Role.PSYCHIATRIST)")
    long countProfessionals();
}