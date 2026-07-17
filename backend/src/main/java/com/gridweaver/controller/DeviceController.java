package com.gridweaver.controller;

import com.gridweaver.dto.DeviceResponseDto;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    // TEMPORARY: in-memory mock data until entity/repository layer is built (Week 2).
    private static final List<DeviceResponseDto> MOCK_DEVICES = List.of(
            new DeviceResponseDto("1", "Solar Panel A1", "SOLAR_PANEL", "Zone-A", "ONLINE", Instant.now()),
            new DeviceResponseDto("2", "Home Battery B1", "HOME_BATTERY", "Zone-B", "CHARGING", Instant.now()),
            new DeviceResponseDto("3", "Solar Panel A2", "SOLAR_PANEL", "Zone-A", "FAULT", Instant.now())
    );

    @GetMapping
    public List<DeviceResponseDto> getAllDevices() {
        return MOCK_DEVICES;
    }

    @GetMapping("/{id}")
    public DeviceResponseDto getDeviceById(@PathVariable String id) {
        return MOCK_DEVICES.stream()
                .filter(d -> d.id().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Device not found: " + id));
    }

    @PostMapping
    public Map<String, String> createDevice(@RequestBody DeviceResponseDto device) {
        // TODO Week 2: persist via DeviceRepository
        return Map.of("message", "Device created (mock)", "id", device.id());
    }

    @PutMapping("/{id}")
    public Map<String, String> updateDevice(@PathVariable String id, @RequestBody DeviceResponseDto device) {
        // TODO Week 2: persist update via DeviceRepository
        return Map.of("message", "Device updated (mock)", "id", id);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteDevice(@PathVariable String id) {
        // TODO Week 2: delete via DeviceRepository
        return Map.of("message", "Device deleted (mock)", "id", id);
    }
}