package bd.rightly.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({
        RightlyJwtProperties.class,
        RightlyOtpProperties.class,
        RightlyCorsProperties.class,
        RightlyMinioProperties.class,
        RightlyStorageProperties.class
})
public class RightlyConfig {
}