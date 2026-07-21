package com.gridweaver.repository;

import com.gridweaver.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link User} entities.
 *
 * <p>Implements {@link JpaSpecificationExecutor} for dynamic, type-safe filtering
 * via {@link com.gridweaver.repository.specification.UserSpecification}.
 *
 * <p>All queries automatically exclude soft-deleted records via the
 * {@code deleted_at IS NULL} filter expressed in JPQL {@code WHERE} clauses.
 *
 * @author GridWeaver Team
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {

    /**
     * Finds an active (non-deleted) user by email address.
     *
     * @param email the email to search for (case-sensitive)
     * @return an {@link Optional} containing the matching user, or empty
     */
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.deletedAt IS NULL")
    Optional<User> findByEmailAndNotDeleted(@Param("email") String email);

    /**
     * Finds an active user by username.
     *
     * @param username the username to search for
     * @return an {@link Optional} containing the matching user, or empty
     */
    @Query("SELECT u FROM User u WHERE u.username = :username AND u.deletedAt IS NULL")
    Optional<User> findByUsernameAndNotDeleted(@Param("username") String username);

    /**
     * Checks whether an active user with the given email already exists.
     * Used for duplicate detection during registration.
     *
     * @param email the email to check
     * @return {@code true} if an active user with that email exists
     */
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.email = :email AND u.deletedAt IS NULL")
    boolean existsByEmailAndNotDeleted(@Param("email") String email);

    /**
     * Checks whether an active user with the given username already exists.
     *
     * @param username the username to check
     * @return {@code true} if an active user with that username exists
     */
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.username = :username AND u.deletedAt IS NULL")
    boolean existsByUsernameAndNotDeleted(@Param("username") String username);

    /**
     * Returns a page of active users with their roles eagerly loaded to avoid N+1 queries.
     *
     * @param pageable pagination and sort parameters
     * @return a page of active users
     */
    @Query(
        value       = "SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles WHERE u.deletedAt IS NULL",
        countQuery  = "SELECT COUNT(u) FROM User u WHERE u.deletedAt IS NULL"
    )
    Page<User> findAllActiveUsersWithRoles(Pageable pageable);

    /**
     * Simple email lookup used by {@link com.gridweaver.security.CustomUserDetailsService}.
     * Includes soft-deleted check inline.
     *
     * @param email the user's email
     * @return an {@link Optional} containing the user if found and active
     */
    Optional<User> findByEmailAndDeletedAtIsNull(String email);
}
