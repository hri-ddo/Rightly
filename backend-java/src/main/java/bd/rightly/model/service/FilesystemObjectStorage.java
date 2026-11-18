package bd.rightly.model.service;

import bd.rightly.config.RightlyStorageProperties;
import bd.rightly.middleware.ApiException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "rightly.storage.driver", havingValue = "filesystem")
public class FilesystemObjectStorage implements ObjectStorage {

    private final Path root;

    public FilesystemObjectStorage(RightlyStorageProperties properties) {
        this.root = Path.of(properties.localDir()).toAbsolutePath().normalize();
    }

    @Override
    public void put(String key, InputStream content, long size, String contentType) {
        try {
            Path target = root.resolve(key).normalize();
            if (!target.startsWith(root)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid object key");
            }
            Files.createDirectories(target.getParent());
            Files.copy(content, target, StandardCopyOption.REPLACE_EXISTING);
            if (contentType != null && !contentType.isBlank()) {
                Files.writeString(metaPath(target), contentType);
            }
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store file locally");
        }
    }

    @Override
    public ObjectStat stat(String key) {
        Path target = root.resolve(key).normalize();
        if (!target.startsWith(root) || !Files.isRegularFile(target)) {
            return new ObjectStat(false, 0, null);
        }
        try {
            long size = Files.size(target);
            Path meta = metaPath(target);
            String contentType = Files.exists(meta) ? Files.readString(meta).trim() : probeContentType(target);
            return new ObjectStat(true, size, contentType);
        } catch (IOException e) {
            return new ObjectStat(false, 0, null);
        }
    }

    private static Path metaPath(Path file) {
        return file.resolveSibling(file.getFileName() + ".content-type");
    }

    private static String probeContentType(Path file) throws IOException {
        String guessed = Files.probeContentType(file);
        return guessed != null ? guessed : "application/octet-stream";
    }
}