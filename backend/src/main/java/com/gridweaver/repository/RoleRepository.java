package com.gridweaver.repository;

import com.gridweaver.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link Role} entities.
 *
 * @author GridWeaver Team
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

    /**
     * Finds a role by its name (e.g., {@code ROLE_USER}).
     *
     * @param name the role name
     * @return an {@link Optional} containing the role, or empty
     */
    Optional<Role> findByName(String name);

    /**
     * Checks whether a role with the given name exists.
     *
     * @param name the role name to check
     * @return {@code true} if the role exists
     */
    boolean existsByName(String name);

    /**
     * Finds all roles whose names are in the provided set.
     * Used for bulk role assignment during user creation.
     *
     * @param names the set of role names
     * @return matching roles
     */
    @Query("SELECT r FROM Role r WHERE r.name IN :names AND r.deletedAt IS NULL")
    Set<Role> findAllByNameIn(@Param("names") Set<String> names);
}
