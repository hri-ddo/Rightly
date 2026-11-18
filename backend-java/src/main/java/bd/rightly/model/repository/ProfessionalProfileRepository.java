package bd.rightly.model.repository;

import bd.rightly.model.entity.ProfessionalProfile;
import bd.rightly.model.entity.Role;
import bd.rightly.model.entity.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProfessionalProfileRepository extends JpaRepository<ProfessionalProfile, UUID> {

    Optional<ProfessionalProfile> findByUser(User user);

    Optional<ProfessionalProfile> findByUserId(UUID userId);

    long count();

    @Query("SELECT COUNT(p) FROM ProfessionalProfile p WHERE p.user.role = :role")
    long countByUserRole(@Param("role") Role role);

    @Query("""
            SELECT p FROM ProfessionalProfile p
            JOIN p.user u
            WHERE (:role IS NULL OR u.role = :role)
              AND (:district IS NULL OR LOWER(p.district) = LOWER(CAST(:district AS string)))
              AND (:specialty IS NULL OR LOWER(p.specialty) LIKE LOWER(CONCAT('%', CAST(:specialty AS string), '%')))
              AND (:maxFee IS NULL OR p.feeBdt <= :maxFee)
              AND (:language IS NULL OR LOWER(p.languages) LIKE LOWER(CONCAT('%', CAST(:language AS string), '%')))
            """)
    Page<ProfessionalProfile> search(
            @Param("role") Role role,
            @Param("district") String district,
            @Param("specialty") String specialty,
            @Param("maxFee") Integer maxFee,
            @Param("language") String language,
            Pageable pageable);
}