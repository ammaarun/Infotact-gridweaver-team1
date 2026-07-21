package com.gridweaver.dto.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.UUID;

/**
 * Generic API response envelope wrapping all successful API responses.
 *
 * <p>Every response from GridWeaver's REST API follows this consistent structure:
 * <pre>{@code
 * {
 *   "success": true,
 *   "message": "User retrieved successfully",
 *   "data": { ... },
 *   "timestamp": "2026-07-18T14:00:00Z",
 *   "correlation_id": "uuid"
 * }
 * }</pre>
 *
 * <p>Use the static factory methods ({@link #success}, {@link #error}) for construction.
 *
 * @param <T> the type of the data payload
 * @param success       whether the operation succeeded
 * @param message       human-readable result message
 * @param data          the response payload (null on error)
 * @param timestamp     when the response was generated
 * @param correlationId request trace identifier for log correlation
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(

    boolean success,
    String  message,
    T       data,
    Instant timestamp,

    @JsonProperty("correlation_id")
    String correlationId
) {

    // -------------------------------------------------------------------------
    // Factory methods
    // -------------------------------------------------------------------------

    /**
     * Creates a successful response with data payload.
     *
     * @param message descriptive success message
     * @param data    the response payload
     * @param <T>     payload type
     * @return success response
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, Instant.now(), UUID.randomUUID().toString());
    }

    /**
     * Creates a successful response without a data payload (e.g., delete operations).
     *
     * @param message descriptive success message
     * @param <T>     payload type (will be null)
     * @return success response
     */
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null, Instant.now(), UUID.randomUUID().toString());
    }

    /**
     * Creates a failure response without data.
     *
     * @param message descriptive error message
     * @param <T>     payload type (will be null)
     * @return error response
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, Instant.now(), UUID.randomUUID().toString());
    }
}
