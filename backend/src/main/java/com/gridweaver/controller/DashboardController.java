package com.gridweaver.controller;

import com.gridweaver.dto.DashboardSummaryDto;
import com.gridweaver.entity.Battery;
import com.gridweaver.entity.Device;
import com.gridweaver.service.BatteryService;
import com.gridweaver.service.DeviceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DeviceService deviceService;
    private final BatteryService batteryService;

    public DashboardController(DeviceService deviceService, BatteryService batteryService) {
        this.deviceService = deviceService;
        this.batteryService = batteryService;
    }

    @GetMapping
    public DashboardSummaryDto getDashboardSummary() {
        List<Device> devices = deviceService.getAllDevices();
        List<Battery> batteries = batteryService.getAllBatteries();

        int totalDevices = devices.size();
        int onlineDevices = (int) devices.stream()
                .filter(d -> "ONLINE".equalsIgnoreCase(d.getStatus()))
                .count();

        double avgBatteryHealth = batteries.stream()
                .mapToDouble(Battery::getLevel)
                .average()
                .orElse(0.0);

        // TODO: replace with real live telemetry once WebSocket ingestion
        // persists power readings — hardcoded until that's wired up.
        double powerUsageMw = 4.8;

        return new DashboardSummaryDto(totalDevices, onlineDevices, powerUsageMw, avgBatteryHealth);
    }
}