package com.gridweaver.controller;

import com.gridweaver.dto.DashboardSummaryDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @GetMapping
    public DashboardSummaryDto getDashboardSummary() {
        // TEMPORARY: mock values until TelemetryIngestionService + repository feed real numbers
        return new DashboardSummaryDto(128, 114, 4.8, 96.0);
    }
}