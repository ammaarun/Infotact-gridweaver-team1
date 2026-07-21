package com.gridweaver.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

/**
 * Full user response DTO — returned for profile views and admin user management.
 *
 * <p>Never exposes the password hash. Only data safe to send to the client is included.
 *
 * @param id                the user's UUID
 * @param username          login username
 * @param email             email address
 * @param firstName         optional first name
 * @param lastName          optional last name
 * @param fullName          computed display name
 * @param enabled           whether the account is active
 * @param accountLocked     whether the account is locked
 * @param roles             set of role names (e.g., ROLE_ADMIN)
 * @param createdAt         account creation timestamp
 * @param updatedAt         last modification timestamp
 */
public record UserResponse(

    UUID    id,
    String  username,
    String  email,

    @JsonProperty("first_name")
    String firstName,

    @JsonProperty("last_name")
    String lastName,

    @JsonProperty("full_name")
    String fullName,

    boolean enabled,

    @JsonProperty("account_locked")
    boolean accountLocked,

    Set<String> roles,

    @JsonProperty("created_at")
    Instant createdAt,

    @JsonProperty("updated_at")
    Instant updatedAt
) {}
