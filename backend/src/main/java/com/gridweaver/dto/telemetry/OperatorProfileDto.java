package com.gridweaver.dto.telemetry;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OperatorProfileDto {
    private String id;
    private String name;
    private String role;
    private String avatar;
    private String email;
    private String station;
    private String shift;
}
