package bd.rightly.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rightly.jwt")
public record RightlyJwtProperties(String secret, int sessionTtlHours) {
}