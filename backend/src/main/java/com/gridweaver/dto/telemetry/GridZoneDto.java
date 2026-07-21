package com.gridweaver.dto.telemetry;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class GridZoneDto {
    private String id;
    private String name;
    private String region;
    private int totalDevices;
    private int onlineDevices;
    private int offlineDevices;
    private int faultDevices;
    private double powerProduced;
    private double powerConsumed;
    private double batteryCapacity;
    private double gridHealth;
    private int faultCount;
    private Map<String, Double> center;
    private String color;
}
