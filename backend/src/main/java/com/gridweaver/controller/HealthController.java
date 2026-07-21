package com.gridweaver.controller;

import com.gridweaver.dto.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Simple health check controller providing application metadata.
 *
 * <p>Supplements Spring Actuator's {@code /actuator/health} with a custom
 * business-level health endpoint that does not expose infrastructure details.
 *
 * @author GridWeaver Team
 */
@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health", description = "Application health and version information")
public class HealthController {

    @Value("${spring.application.name}")
    private String applicationName;

    /**
     * Returns a simple health payload with application name and current timestamp.
     *
     * @return {@code 200 OK} with health metadata
     */
    @GetMapping
    @Operation(summary = "Application health check")
    public ResponseEntity<ApiResponse<Map<String, Object>>> health() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("application", applicationName);
        data.put("status", "UP");
        data.put("timestamp", Instant.now().toString());
        data.put("version", "1.0.0");
        return ResponseEntity.ok(ApiResponse.success("Application is healthy", data));
    }
}
