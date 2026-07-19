package com.gridweaver.repository;

import com.gridweaver.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {

    // Auto-implemented by Spring Data JPA based on the method name —
    // finds all events for a given device, most recent first.
    List<Event> findByDeviceIdOrderByTimestampDesc(String deviceId);

    // Supports the "recent events" list your EventController needs
    List<Event> findTop20ByOrderByTimestampDesc();
}