package com.gridweaver.service;

import com.gridweaver.entity.Device;
import com.gridweaver.repository.DeviceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;

    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    public Optional<Device> getDeviceById(String id) {
        return deviceRepository.findById(id);
    }

    public Device createDevice(Device device) {
        return deviceRepository.save(device);
    }

    public Device updateDevice(String id, Device updatedDevice) {
        return deviceRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedDevice.getName());
                    existing.setType(updatedDevice.getType());
                    existing.setLocation(updatedDevice.getLocation());
                    existing.setStatus(updatedDevice.getStatus());
                    return deviceRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Device not found: " + id));
    }

    public void deleteDevice(String id) {
        deviceRepository.deleteById(id);
    }
}