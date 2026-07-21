package com.gridweaver.service;

import com.gridweaver.dto.telemetry.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TelemetryService {

    private final Random random = new Random();
    private List<DeviceDto> deviceCache;

    public TelemetryService() {
        this.deviceCache = generateMockDevices(100); // 100 devices to keep it light
    }

    public GridStatsDto getGridStats() {
        long online = deviceCache.stream().filter(d -> "online".equals(d.getStatus())).count();
        long offline = deviceCache.stream().filter(d -> "offline".equals(d.getStatus())).count();
        long fault = deviceCache.stream().filter(d -> "fault".equals(d.getStatus())).count();
        
        double solar = deviceCache.stream()
            .filter(d -> "solar_panel".equals(d.getType()) && "online".equals(d.getStatus()))
            .mapToDouble(d -> d.getTelemetry().getPower())
            .sum();
            
        double battery = deviceCache.stream()
            .filter(d -> "battery".equals(d.getType()))
            .mapToDouble(DeviceDto::getCapacity)
            .sum();
            
        double consumption = deviceCache.stream()
            .filter(d -> "online".equals(d.getStatus()))
            .mapToDouble(d -> d.getTelemetry().getPower())
            .sum();

        return GridStatsDto.builder()
                .totalDevices(deviceCache.size())
                .onlineDevices((int) online)
                .offlineDevices((int) offline)
                .faultDevices((int) fault)
                .solarOutput(solar / 1000.0)
                .batteryCapacity(battery / 1000.0)
                .powerConsumption(consumption / 1000.0)
                .gridStability(94.0 + random.nextDouble() * 5.5)
                .build();
    }

    public List<AlertDto> getAlerts() {
        List<AlertDto> alerts = new ArrayList<>();
        for (int i = 0; i < 15; i++) {
            DeviceDto d = deviceCache.get(random.nextInt(deviceCache.size()));
            alerts.add(AlertDto.builder()
                    .id("ALT-" + String.format("%04d", i + 1))
                    .deviceId(d.getId())
                    .deviceName(d.getName())
                    .deviceType(d.getType())
                    .zone(d.getZone())
                    .severity(random.nextDouble() < 0.3 ? "critical" : "warning")
                    .status(random.nextDouble() < 0.5 ? "active" : "acknowledged")
                    .title("System Alert " + (i + 1))
                    .message("Alert triggered on " + d.getName())
                    .timestamp(Instant.now().minusSeconds(random.nextInt(86400)).toString())
                    .build());
        }
        return alerts;
    }

    public List<EventLogDto> getEventLogs() {
        List<EventLogDto> logs = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            DeviceDto d = deviceCache.get(random.nextInt(deviceCache.size()));
            logs.add(EventLogDto.builder()
                    .id("EVT-" + String.format("%05d", i + 1))
                    .deviceId(d.getId())
                    .deviceName(d.getName())
                    .deviceType(d.getType())
                    .oldState("idle")
                    .newState("charging")
                    .reason("Auto-protection")
                    .timestamp(Instant.now().minusSeconds(random.nextInt(86400)).toString())
                    .zone(d.getZone())
                    .build());
        }
        return logs;
    }

    public List<DeviceDto> getFaultDevices() {
        return deviceCache.stream()
                .filter(d -> "fault".equals(d.getStatus()))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getPowerData() {
        List<Map<String, Object>> data = new ArrayList<>();
        for (int i = 0; i < 24; i++) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("name", String.format("%02d:00", i));
            map.put("consumption", 120 + random.nextDouble() * 220);
            map.put("generation", 80 + random.nextDouble() * 300);
            data.add(map);
        }
        return data;
    }

    public List<Map<String, Object>> getVoltageData() {
        List<Map<String, Object>> data = new ArrayList<>();
        for (int i = 0; i < 48; i++) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("name", String.format("%02d:%s", i / 2, i % 2 == 0 ? "00" : "30"));
            map.put("voltage", 228 + random.nextDouble() * 14);
            map.put("nominal", 230);
            data.add(map);
        }
        return data;
    }

    public List<Map<String, Object>> getBatteryData() {
        List<Map<String, Object>> data = new ArrayList<>();
        for (int i = 0; i < 24; i++) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("name", String.format("%02d:00", i));
            map.put("charge", 20 + random.nextDouble() * 75);
            map.put("discharge", 5 + random.nextDouble() * 55);
            data.add(map);
        }
        return data;
    }

    public List<Map<String, Object>> getGridLoadData() {
        List<Map<String, Object>> data = new ArrayList<>();
        for (int i = 0; i < 24; i++) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("name", String.format("%02d:00", i));
            map.put("load", 55 + random.nextDouble() * 40);
            map.put("capacity", 100);
            data.add(map);
        }
        return data;
    }

    public List<Map<String, Object>> getWeeklyGenerationData() {
        List<Map<String, Object>> data = new ArrayList<>();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        for (String day : days) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("name", day);
            map.put("solar", 800 + random.nextDouble() * 800);
            map.put("wind", 400 + random.nextDouble() * 800);
            map.put("other", 200 + random.nextDouble() * 400);
            data.add(map);
        }
        return data;
    }

    public List<Map<String, Object>> getMonthlyGenerationData() {
        List<Map<String, Object>> data = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        for (String month : months) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("name", month);
            map.put("generation", 25000 + random.nextDouble() * 30000);
            map.put("consumption", 20000 + random.nextDouble() * 30000);
            data.add(map);
        }
        return data;
    }

    public List<Map<String, Object>> getFaultStatisticsData() {
        List<Map<String, Object>> data = new ArrayList<>();
        String[] types = {"Solar Panel", "Battery", "Ev Charger", "Wind Turbine", "Transformer", "Smart Meter", "Power Station"};
        for (String t : types) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("name", t);
            map.put("faults", 2 + random.nextInt(43));
            map.put("warnings", 10 + random.nextInt(70));
            data.add(map);
        }
        return data;
    }

    public List<Map<String, Object>> getZoneComparisonData() {
        List<Map<String, Object>> data = new ArrayList<>();
        String[] zones = {"Downtown Core", "Solar Farm West", "Industrial Park North"};
        for (String z : zones) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("name", z);
            map.put("power", 50 + random.nextDouble() * 250);
            map.put("efficiency", 75 + random.nextDouble() * 23);
            data.add(map);
        }
        return data;
    }

    public List<Map<String, Object>> getPeakHoursData() {
        List<Map<String, Object>> data = new ArrayList<>();
        for (int i = 0; i < 24; i++) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("name", String.format("%02d:00", i));
            map.put("demand", 100 + random.nextDouble() * 350);
            map.put("supply", 120 + random.nextDouble() * 380);
            data.add(map);
        }
        return data;
    }

    public List<DeviceDto> getAllDevices() {
        return deviceCache;
    }
    
    public DeviceDto getDeviceById(String id) {
        return deviceCache.stream().filter(d -> d.getId().equals(id)).findFirst().orElse(null);
    }
    
    public List<GridZoneDto> getGridZones() {
        List<GridZoneDto> zones = new ArrayList<>();
        String[] zoneNames = {"Downtown Core", "Solar Farm West", "Industrial Park North"};
        String[] regions = {"Central", "West", "North"};
        String[] colors = {"#2563EB", "#EF4444", "#10B981"};
        
        for (int i = 0; i < zoneNames.length; i++) {
            Map<String, Double> center = new HashMap<>();
            center.put("lat", 40.7580 + random.nextDouble());
            center.put("lng", -73.9855 + random.nextDouble());
            
            zones.add(GridZoneDto.builder()
                .id("zone-" + (i + 1))
                .name(zoneNames[i])
                .region(regions[i])
                .totalDevices(deviceCache.size() / 3)
                .onlineDevices(deviceCache.size() / 4)
                .offlineDevices(5)
                .faultDevices(2)
                .powerProduced(150.0 + random.nextDouble() * 100)
                .powerConsumed(100.0 + random.nextDouble() * 100)
                .batteryCapacity(200.0)
                .gridHealth(90.0 + random.nextDouble() * 9)
                .faultCount(2)
                .center(center)
                .color(colors[i])
                .build());
        }
        return zones;
    }
    
    public List<NotificationDto> getNotifications() {
        List<NotificationDto> notifs = new ArrayList<>();
        for (int i = 0; i < 15; i++) {
            notifs.add(NotificationDto.builder()
                .id("NOT-" + (i + 1))
                .title("Critical fault detected")
                .message("Automated system notification requiring operator review.")
                .type(random.nextDouble() > 0.5 ? "alert" : "info")
                .timestamp(Instant.now().minusSeconds(random.nextInt(86400)).toString())
                .read(random.nextDouble() > 0.4)
                .build());
        }
        return notifs;
    }
    
    public OperatorProfileDto getOperatorProfile() {
        return OperatorProfileDto.builder()
            .id("OP-001")
            .name("System Admin")
            .role("OPERATOR")
            .avatar("")
            .email("admin@gridweaver.io")
            .station("Control Center Alpha")
            .shift("Day Shift (06:00 - 18:00)")
            .build();
    }

    private List<DeviceDto> generateMockDevices(int count) {
        List<DeviceDto> devices = new ArrayList<>();
        String[] types = {"solar_panel", "battery", "transformer"};
        String[] zones = {"Downtown Core", "Solar Farm West", "Industrial Park North"};
        String[] manufacturers = {"SolarEdge", "Tesla", "Siemens", "ABB", "Schneider"};
        String[] models = {"SE-3000", "PW-2", "T-400", "PCS-100", "SM-6"};
        double[][] zoneCoords = {{40.7580, -73.9855}, {40.7420, -74.0060}, {40.7680, -73.9500}};
        
        for (int i = 0; i < count; i++) {
            String type = types[i % types.length];
            String status = random.nextDouble() < 0.85 ? "online" : (random.nextDouble() < 0.95 ? "offline" : "fault");
            int zoneIdx = i % zones.length;
            
            Map<String, Double> location = new LinkedHashMap<>();
            location.put("lat", zoneCoords[zoneIdx][0] + (random.nextDouble() - 0.5) * 0.02);
            location.put("lng", zoneCoords[zoneIdx][1] + (random.nextDouble() - 0.5) * 0.02);
            
            devices.add(DeviceDto.builder()
                    .id("GW-" + String.format("%05d", i + 1))
                    .name("Device " + i)
                    .type(type)
                    .status(status)
                    .state("idle")
                    .zone(zones[zoneIdx])
                    .zoneId("zone-" + (zoneIdx + 1))
                    .location(location)
                    .capacity(100.0)
                    .lastUpdated(Instant.now().toString())
                    .installedDate(Instant.now().minusSeconds(86400L * (30 + random.nextInt(365))).toString())
                    .manufacturer(manufacturers[i % manufacturers.length])
                    .model(models[i % models.length])
                    .firmware("v" + (1 + random.nextInt(3)) + "." + random.nextInt(10) + "." + random.nextInt(5))
                    .telemetry(TelemetryDto.builder()
                            .power(random.nextDouble() * 100)
                            .voltage(228 + random.nextDouble() * 6)
                            .current(random.nextDouble() * 15)
                            .temperature(30 + random.nextDouble() * 20)
                            .battery(random.nextDouble() * 100)
                            .frequency(49.8 + random.nextDouble() * 0.4)
                            .powerFactor(0.85 + random.nextDouble() * 0.15)
                            .build())
                    .build());
        }
        return devices;
    }
}
