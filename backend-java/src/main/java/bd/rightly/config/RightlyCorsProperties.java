package bd.rightly.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rightly.cors")
public record RightlyCorsProperties(List<String> allowedOrigins) {
}