package com.gridweaver.repository;

import com.gridweaver.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link Permission} entities.
 *
 * @author GridWeaver Team
 */
@Repository
public interface PermissionRepository extends JpaRepository<Permission, UUID> {

    /**
     * Finds a permission by its name (e.g., {@code user:read}).
     *
     * @param name the permission name
     * @return an {@link Optional} containing the permission, or empty
     */
    Optional<Permission> findByName(String name);

    /**
     * Checks whether a permission with the given name exists.
     *
     * @param name the permission name
     * @return {@code true} if found
     */
    boolean existsByName(String name);
}
