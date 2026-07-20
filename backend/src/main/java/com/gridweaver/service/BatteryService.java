package com.gridweaver.service;

import com.gridweaver.entity.Battery;
import com.gridweaver.entity.Device;
import com.gridweaver.repository.BatteryRepository;
import com.gridweaver.repository.DeviceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BatteryService {

    private final BatteryRepository batteryRepository;
    private final DeviceRepository deviceRepository;

    public BatteryService(BatteryRepository batteryRepository, DeviceRepository deviceRepository) {
        this.batteryRepository = batteryRepository;
        this.deviceRepository = deviceRepository;
    }

    public List<Battery> getAllBatteries() {
        return batteryRepository.findAll();
    }

    public Optional<Battery> getBatteryByDeviceId(String deviceId) {
        return batteryRepository.findByDeviceId(deviceId);
    }

    public Battery createBattery(String deviceId, double level, double capacity, String state, double voltage) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found: " + deviceId));
        Battery battery = new Battery(device, level, capacity, state, voltage);
        return batteryRepository.save(battery);
    }

    public Battery updateBattery(String deviceId, double level, String state, double voltage) {
        Battery battery = batteryRepository.findByDeviceId(deviceId)
                .orElseThrow(() -> new RuntimeException("Battery not found for device: " + deviceId));
        battery.setLevel(level);
        battery.setState(state);
        battery.setVoltage(voltage);
        return batteryRepository.save(battery);
    }
}