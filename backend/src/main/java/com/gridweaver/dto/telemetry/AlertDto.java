package com.gridweaver.dto.telemetry;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AlertDto {
    private String id;
    private String deviceId;
    private String deviceName;
    private String deviceType;
    private String zone;
    private String severity;
    private String status;
    private String title;
    private String message;
    private String timestamp;
}
