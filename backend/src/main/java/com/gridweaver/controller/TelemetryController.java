package com.gridweaver.controller;

import com.gridweaver.dto.common.ApiResponse;
import com.gridweaver.dto.telemetry.*;
import com.gridweaver.service.TelemetryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/telemetry")
@PreAuthorize("isAuthenticated()")
public class TelemetryController {

    private final TelemetryService telemetryService;

    public TelemetryController(TelemetryService telemetryService) {
        this.telemetryService = telemetryService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<GridStatsDto>> getGridStats() {
        return ResponseEntity.ok(ApiResponse.success("Grid stats retrieved", telemetryService.getGridStats()));
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<AlertDto>>> getAlerts() {
        return ResponseEntity.ok(ApiResponse.success("Alerts retrieved", telemetryService.getAlerts()));
    }

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<EventLogDto>>> getEvents() {
        return ResponseEntity.ok(ApiResponse.success("Events retrieved", telemetryService.getEventLogs()));
    }

    @GetMapping("/devices/faults")
    public ResponseEntity<ApiResponse<List<DeviceDto>>> getFaultDevices() {
        return ResponseEntity.ok(ApiResponse.success("Fault devices retrieved", telemetryService.getFaultDevices()));
    }

    @GetMapping("/charts/power")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPowerData() {
        return ResponseEntity.ok(ApiResponse.success("Power data retrieved", telemetryService.getPowerData()));
    }

    @GetMapping("/charts/voltage")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getVoltageData() {
        return ResponseEntity.ok(ApiResponse.success("Voltage data retrieved", telemetryService.getVoltageData()));
    }

    @GetMapping("/charts/battery")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getBatteryData() {
        return ResponseEntity.ok(ApiResponse.success("Battery data retrieved", telemetryService.getBatteryData()));
    }

    @GetMapping("/charts/load")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getGridLoadData() {
        return ResponseEntity.ok(ApiResponse.success("Grid load data retrieved", telemetryService.getGridLoadData()));
    }

    @GetMapping("/charts/weekly")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getWeeklyGenerationData() {
        return ResponseEntity.ok(ApiResponse.success("Weekly data retrieved", telemetryService.getWeeklyGenerationData()));
    }

    @GetMapping("/charts/monthly")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMonthlyGenerationData() {
        return ResponseEntity.ok(ApiResponse.success("Monthly data retrieved", telemetryService.getMonthlyGenerationData()));
    }

    @GetMapping("/charts/faults")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getFaultStatisticsData() {
        return ResponseEntity.ok(ApiResponse.success("Fault stats retrieved", telemetryService.getFaultStatisticsData()));
    }

    @GetMapping("/charts/zones")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getZoneComparisonData() {
        return ResponseEntity.ok(ApiResponse.success("Zone comparison retrieved", telemetryService.getZoneComparisonData()));
    }

    @GetMapping("/charts/peak")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPeakHoursData() {
        return ResponseEntity.ok(ApiResponse.success("Peak hours retrieved", telemetryService.getPeakHoursData()));
    }

    @GetMapping("/devices")
    public ResponseEntity<ApiResponse<List<DeviceDto>>> getAllDevices() {
        return ResponseEntity.ok(ApiResponse.success("Devices retrieved", telemetryService.getAllDevices()));
    }

    @GetMapping("/devices/{id}")
    public ResponseEntity<ApiResponse<DeviceDto>> getDeviceById(@org.springframework.web.bind.annotation.PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Device retrieved", telemetryService.getDeviceById(id)));
    }

    @GetMapping("/zones")
    public ResponseEntity<ApiResponse<List<GridZoneDto>>> getGridZones() {
        return ResponseEntity.ok(ApiResponse.success("Zones retrieved", telemetryService.getGridZones()));
    }

    @GetMapping("/notifications")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getNotifications() {
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", telemetryService.getNotifications()));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<OperatorProfileDto>> getOperatorProfile() {
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", telemetryService.getOperatorProfile()));
    }
}
