package bd.rightly.controller.dto;

import java.time.Instant;

public record ErrorResponse(String message, String path, Instant timestamp) {

    public ErrorResponse(String message, String path) {
        this(message, path, Instant.now());
    }
}