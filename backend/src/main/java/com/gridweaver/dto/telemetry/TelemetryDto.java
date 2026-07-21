package com.gridweaver.dto.telemetry;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TelemetryDto {
    private double power;
    private double voltage;
    private double current;
    private double temperature;
    private double battery;
    private double frequency;
    private double powerFactor;
}
