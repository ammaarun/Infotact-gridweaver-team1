package com.gridweaver.controller;

import com.gridweaver.dto.auth.AuthResponse;
import com.gridweaver.dto.auth.LoginRequest;
import com.gridweaver.dto.auth.RefreshTokenRequest;
import com.gridweaver.dto.auth.RegisterRequest;
import com.gridweaver.dto.common.ApiResponse;
import com.gridweaver.security.SecurityUser;
import com.gridweaver.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for authentication operations.
 *
 * <p>Endpoints:
 * <ul>
 *   <li>{@code POST /api/v1/auth/register} — new user registration</li>
 *   <li>{@code POST /api/v1/auth/login} — credential-based login</li>
 *   <li>{@code POST /api/v1/auth/refresh} — access token rotation</li>
 *   <li>{@code POST /api/v1/auth/logout} — session revocation</li>
 * </ul>
 *
 * <p>No business logic resides here — all delegated to {@link AuthService}.
 *
 * @author GridWeaver Team
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Registration, login, token refresh, and logout")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // -------------------------------------------------------------------------
    // Register
    // -------------------------------------------------------------------------

    /**
     * Registers a new user and returns an auth token pair.
     *
     * @param request the registration payload (validated)
     * @return {@code 201 Created} with auth response
     */
    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        log.debug("POST /api/v1/auth/register — email: {}", request.email());
        AuthResponse authResponse = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Registration successful", authResponse));
    }

    // -------------------------------------------------------------------------
    // Login
    // -------------------------------------------------------------------------

    /**
     * Authenticates a user with email + password.
     *
     * @param request the login payload (validated)
     * @return {@code 200 OK} with auth response
     */
    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        log.debug("POST /api/v1/auth/login — email: {}", request.email());
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    // -------------------------------------------------------------------------
    // Refresh
    // -------------------------------------------------------------------------

    /**
     * Rotates a refresh token and issues a new access + refresh token pair.
     *
     * @param request the refresh token payload
     * @return {@code 200 OK} with new auth response
     */
    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token using a valid refresh token")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest request) {

        log.debug("POST /api/v1/auth/refresh");
        AuthResponse authResponse = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", authResponse));
    }

    // -------------------------------------------------------------------------
    // Logout
    // -------------------------------------------------------------------------

    /**
     * Revokes all refresh tokens for the currently authenticated user.
     *
     * @param currentUser the JWT-authenticated principal (injected by Spring Security)
     * @return {@code 200 OK} with success message
     */
    @PostMapping("/logout")
    @Operation(summary = "Logout and revoke all active sessions")
    public ResponseEntity<ApiResponse<Void>> logout(
            @AuthenticationPrincipal SecurityUser currentUser) {

        log.debug("POST /api/v1/auth/logout — user ID: {}", currentUser.getUserId());
        authService.logout(currentUser.getUserId().toString());
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }
}
