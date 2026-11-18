package bd.rightly.controller;

import bd.rightly.model.service.HealthService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final HealthService healthService;

    public HealthController(HealthService healthService) {
        this.healthService = healthService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> body = healthService.check();
        boolean up = "UP".equals(body.get("status"));
        return up ? ResponseEntity.ok(body) : ResponseEntity.status(503).body(body);
    }
}