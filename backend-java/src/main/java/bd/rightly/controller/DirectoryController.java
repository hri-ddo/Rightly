package bd.rightly.controller;

import bd.rightly.controller.dto.DirectoryPageResponse;
import bd.rightly.model.entity.Role;
import bd.rightly.model.service.DirectoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/directory")
public class DirectoryController {

    private final DirectoryService directoryService;

    public DirectoryController(DirectoryService directoryService) {
        this.directoryService = directoryService;
    }

    @GetMapping
    public DirectoryPageResponse directory(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String specialty,
            @RequestParam(required = false) Integer maxFee,
            @RequestParam(required = false) String language,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return directoryService.search(role, district, specialty, maxFee, language, page, size);
    }
}