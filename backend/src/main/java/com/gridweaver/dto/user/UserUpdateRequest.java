package com.gridweaver.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

/**
 * Partial update DTO for user profile modifications.
 *
 * <p>All fields are optional — only non-null fields are applied during update.
 * Uses standard Lombok for mutable state (unlike request DTOs which are Records).
 *
 * @param firstName optional first name update
 * @param lastName  optional last name update
 * @param email     optional email update (must be unique)
 * @param username  optional username update (must be unique)
 */
public record UserUpdateRequest(

    @Size(max = 100, message = "First name may not exceed 100 characters")
    @JsonProperty("first_name")
    String firstName,

    @Size(max = 100, message = "Last name may not exceed 100 characters")
    @JsonProperty("last_name")
    String lastName,

    @Email(message = "Must be a valid email address")
    @Size(max = 255)
    String email,

    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    String username
) {}
