package com.gridweaver.controller;

import com.gridweaver.dto.DeviceResponseDto;
import com.gridweaver.entity.Device;
import com.gridweaver.service.DeviceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping
    public List<DeviceResponseDto> getAllDevices() {
        return deviceService.getAllDevices().stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public DeviceResponseDto getDeviceById(@PathVariable String id) {
        Device device = deviceService.getDeviceById(id)
                .orElseThrow(() -> new RuntimeException("Device not found: " + id));
        return toDto(device);
    }

    @PostMapping
    public DeviceResponseDto createDevice(@RequestBody DeviceResponseDto request) {
        Device device = new Device(
                request.id(),
                request.name(),
                request.type(),
                request.location(),
                request.status(),
                request.createdAt()
        );
        return toDto(deviceService.createDevice(device));
    }

    @PutMapping("/{id}")
    public DeviceResponseDto updateDevice(@PathVariable String id, @RequestBody DeviceResponseDto request) {
        Device updated = new Device(
                id,
                request.name(),
                request.type(),
                request.location(),
                request.status(),
                request.createdAt()
        );
        return toDto(deviceService.updateDevice(id, updated));
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteDevice(@PathVariable String id) {
        deviceService.deleteDevice(id);
        return Map.of("message", "Device deleted", "id", id);
    }

    private DeviceResponseDto toDto(Device device) {
        return new DeviceResponseDto(
                device.getId(),
                device.getName(),
                device.getType(),
                device.getLocation(),
                device.getStatus(),
                device.getCreatedAt()
        );
    }
}