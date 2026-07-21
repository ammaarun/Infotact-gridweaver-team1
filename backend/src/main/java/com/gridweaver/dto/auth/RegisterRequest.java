package com.gridweaver.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Immutable request DTO for new user registration.
 *
 * @param username  desired login username (3–50 chars, alphanumeric + underscore)
 * @param email     unique email address
 * @param password  plain-text password (will be BCrypt-hashed before persistence)
 * @param firstName optional first name
 * @param lastName  optional last name
 */
public record RegisterRequest(

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$",
             message = "Username may only contain letters, digits, and underscores")
    String username,

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    @Size(max = 255)
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
    String password,

    @Size(max = 100, message = "First name may not exceed 100 characters")
    String firstName,

    @Size(max = 100, message = "Last name may not exceed 100 characters")
    String lastName
) {}
