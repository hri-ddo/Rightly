package bd.rightly.controller.dto;

import java.util.List;

public record DirectoryPageResponse(
        List<ProfessionalProfileResponse> items, int page, int size, long totalElements) {
}