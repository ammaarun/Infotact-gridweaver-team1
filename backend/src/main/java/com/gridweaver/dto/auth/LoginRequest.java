package com.gridweaver.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Immutable request DTO for user login.
 *
 * <p>Uses Java Record for maximum immutability and minimal boilerplate.
 * Validation annotations enforce constraints before the request reaches the service layer.
 *
 * @param email    the user's registered email address
 * @param password the plain-text password (never stored — compared against BCrypt hash)
 */
public record LoginRequest(

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 128, message = "Password must be between 6 and 128 characters")
    String password
) {}
