package com.gridweaver.dto.telemetry;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationDto {
    private String id;
    private String title;
    private String message;
    private String type;
    private String timestamp;
    private boolean read;
}
