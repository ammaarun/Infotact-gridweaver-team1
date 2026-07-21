package com.gridweaver.repository;

import com.gridweaver.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StateRepository extends JpaRepository<State, String> {
    Optional<State> findByName(String name);
}