package com.gridweaver.repository;

import com.gridweaver.entity.Battery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BatteryRepository extends JpaRepository<Battery, String> {

    Optional<Battery> findByDeviceId(String deviceId);
}