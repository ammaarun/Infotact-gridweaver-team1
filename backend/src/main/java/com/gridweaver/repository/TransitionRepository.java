package com.gridweaver.repository;

import com.gridweaver.entity.Transition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransitionRepository extends JpaRepository<Transition, String> {
    List<Transition> findByDeviceIdOrderByTimestampDesc(String deviceId);
    List<Transition> findTop50ByOrderByTimestampDesc();
}