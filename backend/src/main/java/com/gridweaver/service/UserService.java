package com.gridweaver.service;

import com.gridweaver.dto.common.PagedResponse;
import com.gridweaver.dto.user.UserResponse;
import com.gridweaver.dto.user.UserSummaryResponse;
import com.gridweaver.dto.user.UserUpdateRequest;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * User management service contract.
 *
 * <p>Covers CRUD operations, search with filtering, and role management.
 * All operations enforce authorization rules at the service layer in addition
 * to controller-level annotations.
 *
 * @author GridWeaver Team
 */
public interface UserService {

    /**
     * Retrieves a user by their UUID.
     *
     * @param id the user UUID
     * @return the full user response DTO
     * @throws com.gridweaver.exception.ResourceNotFoundException if not found
     */
    UserResponse getUserById(UUID id);

    /**
     * Retrieves a user by their email.
     *
     * @param email the user's email
     * @return the full user response DTO
     */
    UserResponse getUserByEmail(String email);

    /**
     * Returns a paginated list of all active users.
     *
     * @param search   optional free-text search (username/email/name)
     * @param role     optional role filter
     * @param enabled  optional enabled/disabled filter
     * @param pageable pagination and sort parameters
     * @return paginated list of user summaries
     */
    PagedResponse<UserSummaryResponse> getAllUsers(String search, String role, Boolean enabled, Pageable pageable);

    /**
     * Updates a user's profile fields. Only provided (non-null) fields are changed.
     *
     * @param id      the user UUID
     * @param request the update payload
     * @return the updated user response
     * @throws com.gridweaver.exception.DuplicateResourceException if new email/username conflicts
     */
    UserResponse updateUser(UUID id, UserUpdateRequest request);

    /**
     * Soft-deletes a user by setting their {@code deletedAt} timestamp.
     *
     * @param id the user UUID
     * @throws com.gridweaver.exception.ResourceNotFoundException if not found
     */
    void deleteUser(UUID id);

    /**
     * Enables or disables a user account.
     *
     * @param id      the user UUID
     * @param enabled the desired account state
     * @return the updated user response
     */
    UserResponse setUserEnabled(UUID id, boolean enabled);
}
