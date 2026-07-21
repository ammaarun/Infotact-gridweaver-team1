package com.gridweaver.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "state")
public class State {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String name;        // e.g. IDLE, CHARGING, DISCHARGING, FAULT

    private String description;

    protected State() {
        // required by JPA
    }

    public State(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
}