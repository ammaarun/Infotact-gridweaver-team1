package com.gridweaver.controller;

import com.gridweaver.dto.common.ApiResponse;
import com.gridweaver.dto.common.PagedResponse;
import com.gridweaver.dto.user.UserResponse;
import com.gridweaver.dto.user.UserSummaryResponse;
import com.gridweaver.dto.user.UserUpdateRequest;
import com.gridweaver.security.SecurityUser;
import com.gridweaver.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST controller for user management operations.
 *
 * <p>Endpoints:
 * <ul>
 *   <li>{@code GET    /api/v1/users} — list users (ADMIN only, paginated)</li>
 *   <li>{@code GET    /api/v1/users/me} — get own profile</li>
 *   <li>{@code GET    /api/v1/users/{id}} — get user by ID (ADMIN)</li>
 *   <li>{@code PATCH  /api/v1/users/me} — update own profile</li>
 *   <li>{@code PATCH  /api/v1/users/{id}} — update any user (ADMIN)</li>
 *   <li>{@code DELETE /api/v1/users/{id}} — soft-delete user (ADMIN)</li>
 *   <li>{@code PATCH  /api/v1/users/{id}/status} — enable/disable user (ADMIN)</li>
 * </ul>
 *
 * @author GridWeaver Team
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "User management — profile and administration")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // -------------------------------------------------------------------------
    // List (ADMIN)
    // -------------------------------------------------------------------------

    /**
     * Returns a paginated, filterable list of all active users.
     *
     * @param search  optional free-text search
     * @param role    optional role filter
     * @param enabled optional enabled filter
     * @param page    zero-based page number (default 0)
     * @param size    page size (default 20, max 100)
     * @param sortBy  field to sort by (default "createdAt")
     * @param sortDir sort direction: ASC or DESC (default DESC)
     * @return paginated user summaries
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all users (Admin only)")
    public ResponseEntity<ApiResponse<PagedResponse<UserSummaryResponse>>> listUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean enabled,
            @Parameter(description = "Zero-based page index")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size (max 100)")
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        // Clamp size to prevent abuse
        int clampedSize = Math.min(size, 100);
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, clampedSize, sort);

        PagedResponse<UserSummaryResponse> users = userService.getAllUsers(search, role, enabled, pageable);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    // -------------------------------------------------------------------------
    // Get own profile
    // -------------------------------------------------------------------------

    /**
     * Returns the full profile of the currently authenticated user.
     *
     * @param currentUser the JWT principal
     * @return the user's own profile
     */
    @GetMapping("/me")
    @Operation(summary = "Get your own user profile")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(
            @AuthenticationPrincipal SecurityUser currentUser) {

        log.debug("GET /api/v1/users/me — user ID: {}", currentUser.getUserId());
        UserResponse user = userService.getUserById(currentUser.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", user));
    }

    // -------------------------------------------------------------------------
    // Get by ID (ADMIN)
    // -------------------------------------------------------------------------

    /**
     * Returns the full profile of any user by UUID.
     *
     * @param id the user UUID
     * @return the user's profile
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user by ID (Admin only)")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable UUID id) {

        log.debug("GET /api/v1/users/{}", id);
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }

    // -------------------------------------------------------------------------
    // Update own profile
    // -------------------------------------------------------------------------

    /**
     * Partially updates the authenticated user's profile.
     *
     * @param currentUser the JWT principal
     * @param request     the update payload
     * @return the updated profile
     */
    @PatchMapping("/me")
    @Operation(summary = "Update your own profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyProfile(
            @AuthenticationPrincipal SecurityUser currentUser,
            @Valid @RequestBody UserUpdateRequest request) {

        log.debug("PATCH /api/v1/users/me — user ID: {}", currentUser.getUserId());
        UserResponse updated = userService.updateUser(currentUser.getUserId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    // -------------------------------------------------------------------------
    // Update any user (ADMIN)
    // -------------------------------------------------------------------------

    /**
     * Partially updates any user's profile (admin operation).
     *
     * @param id      the target user UUID
     * @param request the update payload
     * @return the updated profile
     */
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update any user's profile (Admin only)")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UserUpdateRequest request) {

        log.debug("PATCH /api/v1/users/{}", id);
        UserResponse updated = userService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updated));
    }

    // -------------------------------------------------------------------------
    // Delete (soft) — ADMIN
    // -------------------------------------------------------------------------

    /**
     * Soft-deletes a user by UUID.
     *
     * @param id the user UUID
     * @return 200 OK with success message
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Soft-delete a user (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        log.info("DELETE /api/v1/users/{}", id);
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }

    // -------------------------------------------------------------------------
    // Enable / Disable — ADMIN
    // -------------------------------------------------------------------------

    /**
     * Enables or disables a user account.
     *
     * @param id      the user UUID
     * @param enabled the desired state
     * @return the updated profile
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Enable or disable a user account (Admin only)")
    public ResponseEntity<ApiResponse<UserResponse>> setUserStatus(
            @PathVariable UUID id,
            @RequestParam boolean enabled) {

        log.info("PATCH /api/v1/users/{}/status — enabled={}", id, enabled);
        UserResponse updated = userService.setUserEnabled(id, enabled);
        return ResponseEntity.ok(ApiResponse.success(
            enabled ? "User enabled successfully" : "User disabled successfully", updated));
    }
}
