package bd.rightly.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rightly.storage")
public record RightlyStorageProperties(String driver, String localDir) {

    public boolean useFilesystem() {
        return "filesystem".equalsIgnoreCase(driver);
    }
}