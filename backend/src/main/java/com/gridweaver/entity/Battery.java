package com.gridweaver.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "battery")
public class Battery {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne
    @JoinColumn(name = "device_id", nullable = false, unique = true)
    private Device device;

    private double level;      // state of charge, %
    private double capacity;   // total capacity, kWh
    private String state;      // CHARGING / DISCHARGING / IDLE / FAULT
    private double voltage;

    protected Battery() {
        // required by JPA
    }

    public Battery(Device device, double level, double capacity, String state, double voltage) {
        this.device = device;
        this.level = level;
        this.capacity = capacity;
        this.state = state;
        this.voltage = voltage;
    }

    public String getId() { return id; }
    public Device getDevice() { return device; }
    public double getLevel() { return level; }
    public double getCapacity() { return capacity; }
    public String getState() { return state; }
    public double getVoltage() { return voltage; }

    public void setLevel(double level) { this.level = level; }
    public void setState(String state) { this.state = state; }
    public void setVoltage(double voltage) { this.voltage = voltage; }
}