package com.gridweaver.dto;

import java.time.Instant;

public record DeviceResponseDto(
        String id,
        String name,
        String type,
        String location,
        String status,
        Instant createdAt
) {
}