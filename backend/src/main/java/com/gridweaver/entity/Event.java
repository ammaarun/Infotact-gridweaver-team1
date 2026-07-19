package com.gridweaver.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "event")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Column(name = "event_type", nullable = false)
    private String eventType;

    private String data;

    private Instant timestamp;

    protected Event() {
        // required by JPA
    }

    public Event(Device device, String eventType, String data, Instant timestamp) {
        this.device = device;
        this.eventType = eventType;
        this.data = data;
        this.timestamp = timestamp;
    }

    public String getId() { return id; }
    public Device getDevice() { return device; }
    public String getEventType() { return eventType; }
    public String getData() { return data; }
    public Instant getTimestamp() { return timestamp; }
}