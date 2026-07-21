package com.gridweaver.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "transition")
public class Transition {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @ManyToOne
    @JoinColumn(name = "from_state_id", nullable = false)
    private State fromState;

    @ManyToOne
    @JoinColumn(name = "to_state_id", nullable = false)
    private State toState;

    private String condition;   // e.g. "grid_load > 80%"

    private Instant timestamp;

    protected Transition() {
        // required by JPA
    }

    public Transition(Device device, State fromState, State toState, String condition, Instant timestamp) {
        this.device = device;
        this.fromState = fromState;
        this.toState = toState;
        this.condition = condition;
        this.timestamp = timestamp;
    }

    public String getId() { return id; }
    public Device getDevice() { return device; }
    public State getFromState() { return fromState; }
    public State getToState() { return toState; }
    public String getCondition() { return condition; }
    public Instant getTimestamp() { return timestamp; }
}