package com.gridweaver.repository;

import com.gridweaver.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository extends JpaRepository<Device, String> {
    // Spring Data JPA auto-generates save(), findById(), findAll(), deleteById() for free
}