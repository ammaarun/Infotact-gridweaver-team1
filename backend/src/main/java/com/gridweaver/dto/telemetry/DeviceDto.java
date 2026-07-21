package com.gridweaver.dto.telemetry;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DeviceDto {
    private String id;
    private String name;
    private String type;
    private String status;
    private String state;
    private String zone;
    private String zoneId;
    private Map<String, Double> location;
    private TelemetryDto telemetry;
    private String lastUpdated;
    private String installedDate;
    private String manufacturer;
    private String model;
    private String firmware;
    private double capacity;
}
