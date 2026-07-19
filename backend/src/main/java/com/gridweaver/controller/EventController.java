package com.gridweaver.controller;

import com.gridweaver.dto.EventDto;
import com.gridweaver.entity.Event;
import com.gridweaver.service.EventService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public List<EventDto> getRecentEvents() {
        return eventService.getRecentEvents().stream()
                .map(this::toDto)
                .toList();
    }

    private EventDto toDto(Event event) {
        return new EventDto(
                event.getId(),
                event.getDevice().getId(),
                event.getEventType(),
                event.getData(),
                event.getTimestamp()
        );
    }
}