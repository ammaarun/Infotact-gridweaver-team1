package com.gridweaver.dto.telemetry;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EventLogDto {
    private String id;
    private String deviceId;
    private String deviceName;
    private String deviceType;
    private String oldState;
    private String newState;
    private String reason;
    private String timestamp;
    private String zone;
}
