package com.gridweaver.dto.user;

import java.util.UUID;

/**
 * Lightweight user summary DTO used in lists and search results.
 *
 * <p>Contains only the minimum fields needed to display a user in a list,
 * reducing payload size for paginated responses.
 *
 * @param id       the user's UUID
 * @param username login name
 * @param email    email address
 * @param fullName computed display name
 * @param enabled  account status
 */
public record UserSummaryResponse(
    UUID    id,
    String  username,
    String  email,
    String  fullName,
    boolean enabled
) {}
