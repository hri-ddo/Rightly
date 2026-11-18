package bd.rightly.model.service;

import bd.rightly.constant.RedisKeys;
import bd.rightly.controller.dto.DirectoryPageResponse;
import bd.rightly.controller.dto.ProfessionalProfileResponse;
import bd.rightly.model.entity.ProfessionalProfile;
import bd.rightly.model.entity.Role;
import bd.rightly.model.repository.ProfessionalProfileRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Duration;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DirectoryService {

    private final ProfessionalProfileRepository profileRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public DirectoryService(
            ProfessionalProfileRepository profileRepository,
            StringRedisTemplate redisTemplate,
            ObjectMapper objectMapper) {
        this.profileRepository = profileRepository;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    /** Searches directory profiles with optional filters; caches unfiltered page 0 in Redis for 60s. */
    @Transactional(readOnly = true)
    public DirectoryPageResponse search(
            Role role, String district, String specialty, Integer maxFee, String language, int page, int size) {
        boolean defaultQuery = role == null
                && district == null
                && specialty == null
                && maxFee == null
                && language == null
                && page == 0;

        if (defaultQuery) {
            String cached = redisTemplate.opsForValue().get(RedisKeys.DIRECTORY_DEFAULT);
            if (cached != null) {
                try {
                    return objectMapper.readValue(cached, DirectoryPageResponse.class);
                } catch (JsonProcessingException ignored) {
                    redisTemplate.delete(RedisKeys.DIRECTORY_DEFAULT);
                }
            }
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<ProfessionalProfile> result =
                profileRepository.search(role, district, specialty, maxFee, language, pageable);
        DirectoryPageResponse response = toPageResponse(result);

        if (defaultQuery) {
            try {
                redisTemplate
                        .opsForValue()
                        .set(RedisKeys.DIRECTORY_DEFAULT, objectMapper.writeValueAsString(response), Duration.ofSeconds(60));
            } catch (JsonProcessingException ignored) {
                // skip cache write
            }
        }
        return response;
    }

    private DirectoryPageResponse toPageResponse(Page<ProfessionalProfile> page) {
        List<ProfessionalProfileResponse> items = page.getContent().stream().map(this::toResponse).toList();
        return new DirectoryPageResponse(items, page.getNumber(), page.getSize(), page.getTotalElements());
    }

    private ProfessionalProfileResponse toResponse(ProfessionalProfile profile) {
        Role role = profile.getUser().getRole();
        return new ProfessionalProfileResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getDisplayName(),
                profile.getDistrict(),
                profile.getSpecialty(),
                profile.getFeeBdt(),
                profile.getLanguages(),
                profile.getBio(),
                role);
    }
}