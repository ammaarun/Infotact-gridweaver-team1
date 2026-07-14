package com.infotact.gridweaver.model;

/**
 * Immutable telemetry ping from a single IoT node (solar panel or home battery).
 */
public record NodeTelemetry(
        String nodeId,
        NodeType nodeType,
        double powerOutputKw,
        double stateOfChargePercent,
        long timestampEpochMillis
) {
}