package bd.rightly.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rightly.otp")
public record RightlyOtpProperties(int ttlMinutes, int sendCooldownSeconds) {
}