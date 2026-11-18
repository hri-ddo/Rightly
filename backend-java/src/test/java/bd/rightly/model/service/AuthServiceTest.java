package bd.rightly.model.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import bd.rightly.config.RightlyJwtProperties;
import bd.rightly.config.RightlyOtpProperties;
import bd.rightly.constant.RedisKeys;
import bd.rightly.middleware.ApiException;
import bd.rightly.model.entity.Role;
import bd.rightly.model.entity.User;
import bd.rightly.model.entity.VerificationStatus;
import bd.rightly.model.repository.UserRepository;
import bd.rightly.util.CookieUtils;
import bd.rightly.util.CsrfTokenGenerator;
import bd.rightly.util.JwtService;
import bd.rightly.util.OtpHasher;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @Mock
    private NotificationGateway notificationGateway;

    private final OtpHasher otpHasher = new OtpHasher();

    @Mock
    private JwtService jwtService;

    @Mock
    private CsrfTokenGenerator csrfTokenGenerator;

    @Mock
    private CookieUtils cookieUtils;

    @Mock
    private HttpServletResponse response;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                userRepository,
                redisTemplate,
                notificationGateway,
                otpHasher,
                jwtService,
                csrfTokenGenerator,
                cookieUtils,
                new RightlyOtpProperties(5, 60),
                new RightlyJwtProperties("test-secret-minimum-32-characters-long", 168));
    }

    @Test
    void requestOtpStoresHashedCodeAndNotifiesUser() {
        UUID id = UUID.randomUUID();
        User user = user();
        user.setId(id);
        user.setEmail("user@example.com");

        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(user));
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.hasKey(RedisKeys.otpSend(id))).thenReturn(false);

        authService.requestOtp("user@example.com", null);

        verify(valueOperations).set(eq(RedisKeys.otp(id)), any(String.class), eq(Duration.ofMinutes(5)));
        verify(valueOperations).set(eq(RedisKeys.otpSend(id)), eq("1"), eq(Duration.ofSeconds(60)));
        verify(notificationGateway).sendEmail(eq("user@example.com"), any(), any());
    }

    @Test
    void requestOtpRespectsSendRateLimit() {
        UUID id = UUID.randomUUID();
        User user = user();
        user.setId(id);
        user.setEmail("user@example.com");

        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(user));
        when(redisTemplate.hasKey(RedisKeys.otpSend(id))).thenReturn(true);

        assertThatThrownBy(() -> authService.requestOtp("user@example.com", null))
                .isInstanceOf(ApiException.class)
                .extracting(ex -> ((ApiException) ex).getStatus())
                .isEqualTo(HttpStatus.TOO_MANY_REQUESTS);

        verify(valueOperations, never()).set(eq(RedisKeys.otp(id)), any(), any());
    }

    @Test
    void verifyOtpSucceedsWhenHashMatches() {
        UUID id = UUID.randomUUID();
        User user = user();
        user.setId(id);
        user.setEmail("user@example.com");

        String otp = "123456";
        String hashed = otpHasher.hash(otp);

        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(user));
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(RedisKeys.otp(id))).thenReturn(hashed);
        when(jwtService.createSessionToken(id)).thenReturn("jwt-token");
        when(csrfTokenGenerator.generate()).thenReturn("csrf-token");

        var result = authService.verifyOtp("user@example.com", null, otp, response);

        assertThat(result.user().email()).isEqualTo("user@example.com");
        verify(redisTemplate).delete(RedisKeys.otp(id));
        verify(cookieUtils).writeSession(eq(response), eq("jwt-token"), any());
        verify(cookieUtils).writeCsrf(eq(response), eq("csrf-token"), any());
    }

    @Test
    void verifyOtpRejectsInvalidCode() {
        UUID id = UUID.randomUUID();
        User user = user();
        user.setId(id);
        user.setEmail("user@example.com");

        String storedHash = otpHasher.hash("111111");
        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(user));
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(RedisKeys.otp(id))).thenReturn(storedHash);

        assertThatThrownBy(() -> authService.verifyOtp("user@example.com", null, "222222", response))
                .isInstanceOf(ApiException.class)
                .extracting(ex -> ((ApiException) ex).getStatus())
                .isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    private User user() {
        User user = new User();
        user.setFullName("Test User");
        user.setRole(Role.USER);
        user.setVerificationStatus(VerificationStatus.UNVERIFIED);
        return user;
    }
}