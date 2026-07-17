package com.gridweaver.dto;

import java.time.Instant;

public record EventDto(
        String id,
        String deviceId,
        String eventType,
        String data,
        Instant timestamp
) {
}