package bd.rightly.model.service;

import bd.rightly.config.RightlyJwtProperties;
import bd.rightly.config.RightlyOtpProperties;
import bd.rightly.constant.RedisKeys;
import bd.rightly.controller.dto.AuthSessionResult;
import bd.rightly.controller.dto.RegisterRequest;
import bd.rightly.controller.dto.UserResponse;
import bd.rightly.middleware.ApiException;
import bd.rightly.model.entity.User;
import bd.rightly.model.entity.VerificationStatus;
import bd.rightly.model.repository.UserRepository;
import bd.rightly.util.CookieUtils;
import bd.rightly.util.CsrfTokenGenerator;
import bd.rightly.util.JwtService;
import bd.rightly.util.OtpHasher;
import jakarta.servlet.http.HttpServletResponse;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final StringRedisTemplate redisTemplate;
    private final NotificationGateway notificationGateway;
    private final OtpHasher otpHasher;
    private final JwtService jwtService;
    private final CsrfTokenGenerator csrfTokenGenerator;
    private final CookieUtils cookieUtils;
    private final RightlyOtpProperties otpProperties;
    private final RightlyJwtProperties jwtProperties;

    public AuthService(
            UserRepository userRepository,
            StringRedisTemplate redisTemplate,
            NotificationGateway notificationGateway,
            OtpHasher otpHasher,
            JwtService jwtService,
            CsrfTokenGenerator csrfTokenGenerator,
            CookieUtils cookieUtils,
            RightlyOtpProperties otpProperties,
            RightlyJwtProperties jwtProperties) {
        this.userRepository = userRepository;
        this.redisTemplate = redisTemplate;
        this.notificationGateway = notificationGateway;
        this.otpHasher = otpHasher;
        this.jwtService = jwtService;
        this.csrfTokenGenerator = csrfTokenGenerator;
        this.cookieUtils = cookieUtils;
        this.otpProperties = otpProperties;
        this.jwtProperties = jwtProperties;
    }

    /** Registers a new user (email or phone required) with UNVERIFIED status. */
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if ((request.email() == null || request.email().isBlank())
                && (request.phone() == null || request.phone().isBlank())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email or phone is required");
        }
        if (request.email() != null && !request.email().isBlank()) {
            userRepository.findByEmailIgnoreCase(request.email().trim()).ifPresent(u -> {
                throw new ApiException(HttpStatus.CONFLICT, "Email already registered");
            });
        }
        if (request.phone() != null && !request.phone().isBlank()) {
            userRepository.findByPhone(request.phone().trim()).ifPresent(u -> {
                throw new ApiException(HttpStatus.CONFLICT, "Phone already registered");
            });
        }

        User user = new User();
        user.setFullName(request.fullName().trim());
        if (request.email() != null && !request.email().isBlank()) {
            user.setEmail(request.email().trim().toLowerCase());
        }
        if (request.phone() != null && !request.phone().isBlank()) {
            user.setPhone(request.phone().trim());
        }
        user.setRole(request.role());
        user.setVerificationStatus(VerificationStatus.UNVERIFIED);
        user = userRepository.save(user);
        return toResponse(user);
    }

    /** Generates a 6-digit OTP, stores its hash in Redis with TTL, and sends it via email/SMS. */
    public void requestOtp(String email, String phone) {
        User user = resolveUser(email, phone)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        String sendKey = RedisKeys.otpSend(user.getId());
        if (Boolean.TRUE.equals(redisTemplate.hasKey(sendKey))) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "OTP recently sent; please wait");
        }

        String otp = generateOtp();
        String hashed = otpHasher.hash(otp);
        redisTemplate
                .opsForValue()
                .set(RedisKeys.otp(user.getId()), hashed, Duration.ofMinutes(otpProperties.ttlMinutes()));
        redisTemplate
                .opsForValue()
                .set(sendKey, "1", Duration.ofSeconds(otpProperties.sendCooldownSeconds()));

        String message = "Your Rightly verification code is: " + otp;
        try {
            if (user.getEmail() != null) {
                notificationGateway.sendEmail(user.getEmail(), "Rightly OTP", message);
            }
            if (user.getPhone() != null) {
                notificationGateway.sendSms(user.getPhone(), message);
            }
        } catch (IllegalStateException ex) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage());
        }
    }

    /** Verifies the OTP from Redis and writes HttpOnly JWT + CSRF cookies to the response. */
    public AuthSessionResult verifyOtp(String email, String phone, String otp, HttpServletResponse response) {
        User user = resolveUser(email, phone)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        String stored = redisTemplate.opsForValue().get(RedisKeys.otp(user.getId()));
        if (stored == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "OTP expired or not requested");
        }
        if (!stored.equals(otpHasher.hash(otp))) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid OTP");
        }
        redisTemplate.delete(RedisKeys.otp(user.getId()));

        String jwt = jwtService.createSessionToken(user.getId());
        String csrf = csrfTokenGenerator.generate();
        Duration maxAge = Duration.ofHours(jwtProperties.sessionTtlHours());
        cookieUtils.writeSession(response, jwt, maxAge);
        cookieUtils.writeCsrf(response, csrf, maxAge);
        return new AuthSessionResult(toResponse(user));
    }

    /** Clears session and CSRF auth cookies. */
    public void logout(HttpServletResponse response) {
        cookieUtils.clearAuthCookies(response);
    }

    /** Loads the currently authenticated user's profile summary. */
    @Transactional(readOnly = true)
    public UserResponse me(UUID userId) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found"));
        return toResponse(user);
    }

    private Optional<User> resolveUser(String email, String phone) {
        if (email != null && !email.isBlank()) {
            return userRepository.findByEmailIgnoreCase(email.trim());
        }
        if (phone != null && !phone.isBlank()) {
            return userRepository.findByPhone(phone.trim());
        }
        return Optional.empty();
    }

    String generateOtp() {
        int code = 100000 + RANDOM.nextInt(900000);
        return String.valueOf(code);
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getVerificationStatus(),
                user.isVerified(),
                user.getCreatedAt());
    }
}