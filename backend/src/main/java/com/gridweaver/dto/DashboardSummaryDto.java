package com.gridweaver.dto;

public record DashboardSummaryDto(
        int totalDevices,
        int onlineDevices,
        double powerUsageMw,
        double batteryHealthPercent
) {
}