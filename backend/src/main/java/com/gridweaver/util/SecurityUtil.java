package com.gridweaver.util;

import com.gridweaver.security.SecurityUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

/**
 * Utility class for extracting the current authenticated user from the Spring Security context.
 *
 * <p>All methods are static and thread-safe (they read from {@link SecurityContextHolder}
 * which is ThreadLocal-backed).
 *
 * @author GridWeaver Team
 */
public final class SecurityUtil {

    private SecurityUtil() {
        // Utility class — no instantiation
    }

    /**
     * Returns the currently authenticated {@link SecurityUser}, if present.
     *
     * @return an {@link Optional} containing the principal, or empty if unauthenticated
     */
    public static Optional<SecurityUser> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null
                && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof SecurityUser securityUser) {
            return Optional.of(securityUser);
        }
        return Optional.empty();
    }

    /**
     * Returns the UUID of the currently authenticated user.
     *
     * @return the user's UUID
     * @throws IllegalStateException if no authenticated user is present
     */
    public static UUID getCurrentUserId() {
        return getCurrentUser()
            .map(SecurityUser::getUserId)
            .orElseThrow(() -> new IllegalStateException("No authenticated user found in security context"));
    }

    /**
     * Returns the email of the currently authenticated user.
     *
     * @return the user's email
     * @throws IllegalStateException if no authenticated user is present
     */
    public static String getCurrentUserEmail() {
        return getCurrentUser()
            .map(SecurityUser::getEmail)
            .orElseThrow(() -> new IllegalStateException("No authenticated user found in security context"));
    }

    /**
     * Checks whether the current user has a specific role.
     *
     * @param role the role name (e.g., {@code ROLE_ADMIN})
     * @return {@code true} if the current user has the role
     */
    public static boolean hasRole(String role) {
        return getCurrentUser()
            .map(u -> u.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(role)))
            .orElse(false);
    }
}
