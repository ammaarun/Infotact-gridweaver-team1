package com.gridweaver.service;

import com.gridweaver.entity.Device;
import com.gridweaver.entity.Event;
import com.gridweaver.repository.DeviceRepository;
import com.gridweaver.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final DeviceRepository deviceRepository;

    public EventService(EventRepository eventRepository, DeviceRepository deviceRepository) {
        this.eventRepository = eventRepository;
        this.deviceRepository = deviceRepository;
    }

    public List<Event> getRecentEvents() {
        return eventRepository.findTop20ByOrderByTimestampDesc();
    }

    public List<Event> getEventsForDevice(String deviceId) {
        return eventRepository.findByDeviceIdOrderByTimestampDesc(deviceId);
    }

    public Event createEvent(String deviceId, String eventType, String data) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found: " + deviceId));
        Event event = new Event(device, eventType, data, Instant.now());
        return eventRepository.save(event);
    }
}