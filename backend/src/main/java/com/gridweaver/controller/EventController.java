package com.gridweaver.controller;

import com.gridweaver.dto.EventDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @GetMapping
    public List<EventDto> getRecentEvents() {
        // TEMPORARY: mock data until EventRepository/StateLog persistence exists (Week 2)
        return List.of(
                new EventDto("1", "24", "DEVICE_CONNECTED", "Device connected successfully", Instant.now()),
                new EventDto("2", "12", "BATTERY_WARNING", "Battery level below threshold", Instant.now()),
                new EventDto("3", "A", "POWER_SPIKE", "Power spike detected on grid", Instant.now())
        );
    }
}