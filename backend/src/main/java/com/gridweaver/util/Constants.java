package com.gridweaver.util;

/**
 * Application-wide string constants.
 *
 * <p>Centralizes magic strings to prevent typos and enable easy refactoring.
 *
 * @author GridWeaver Team
 */
public final class Constants {

    // -------------------------------------------------------------------------
    // Cache names
    // -------------------------------------------------------------------------
    public static final String CACHE_USERS       = "users";
    public static final String CACHE_ROLES        = "roles";
    public static final String CACHE_PERMISSIONS  = "permissions";

    // -------------------------------------------------------------------------
    // Role names
    // -------------------------------------------------------------------------
    public static final String ROLE_ADMIN     = "ROLE_ADMIN";
    public static final String ROLE_USER      = "ROLE_USER";
    public static final String ROLE_MODERATOR = "ROLE_MODERATOR";

    // -------------------------------------------------------------------------
    // Permission names
    // -------------------------------------------------------------------------
    public static final String PERM_USER_READ   = "user:read";
    public static final String PERM_USER_WRITE  = "user:write";
    public static final String PERM_USER_DELETE = "user:delete";
    public static final String PERM_ADMIN_ALL   = "admin:all";

    // -------------------------------------------------------------------------
    // HTTP headers
    // -------------------------------------------------------------------------
    public static final String HEADER_AUTHORIZATION  = "Authorization";
    public static final String HEADER_CORRELATION_ID = "X-Correlation-Id";
    public static final String BEARER_PREFIX         = "Bearer ";

    // -------------------------------------------------------------------------
    // WebSocket destinations
    // -------------------------------------------------------------------------
    public static final String WS_TOPIC_NOTIFICATIONS  = "/topic/notifications";
    public static final String WS_USER_QUEUE_PRIVATE   = "/queue/private";

    // -------------------------------------------------------------------------
    // Default pagination
    // -------------------------------------------------------------------------
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE     = 100;

    private Constants() {
        // Utility class — no instantiation
    }
}
