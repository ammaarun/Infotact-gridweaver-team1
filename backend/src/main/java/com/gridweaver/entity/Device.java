package com.gridweaver.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "device")
public class Device {

    @Id
    private String id;

    private String name;
    private String type;
    private String location;
    private String status;

    @Column(name = "created_at")
    private Instant createdAt;

    protected Device() {
        // required by JPA
    }

    public Device(String id, String name, String type, String location, String status, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.location = location;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }
    public String getLocation() { return location; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }

    public void setName(String name) { this.name = name; }
    public void setType(String type) { this.type = type; }
    public void setLocation(String location) { this.location = location; }
    public void setStatus(String status) { this.status = status; }
}