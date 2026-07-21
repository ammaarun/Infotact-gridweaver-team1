package com.gridweaver.dto.telemetry;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GridStatsDto {
    private int totalDevices;
    private int onlineDevices;
    private int offlineDevices;
    private int faultDevices;
    private double solarOutput;
    private double batteryCapacity;
    private double powerConsumption;
    private double gridStability;
}
