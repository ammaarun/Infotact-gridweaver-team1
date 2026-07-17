package com.gridweaver.dto;

/**
 * Full state machine (Spring State Machine) lands in Week 2.
 * For now this is just the shape of the data flowing through ingestion.
 */
public enum NodeState {
    CHARGING,
    DISCHARGING,
    IDLE,
    FAULT
}