package com.gridweaver.dto.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Standard error response DTO returned for all API failures.
 *
 * <p>Used by {@link com.gridweaver.exception.GlobalExceptionHandler} to produce
 * a consistent machine-readable error contract.
 *
 * @param success       always {@code false} for errors
 * @param status        HTTP status code
 * @param message       top-level error description
 * @param errors        field-level validation error details (null for non-validation errors)
 * @param path          the request URI that triggered the error
 * @param timestamp     when the error occurred
 * @param correlationId request trace identifier
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(

    boolean success,
    int     status,
    String  message,

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    List<FieldError> errors,

    String  path,
    Instant timestamp,

    @JsonProperty("correlation_id")
    String correlationId
) {

    /**
     * Creates a simple error response without field-level errors.
     *
     * @param status  HTTP status code
     * @param message error message
     * @param path    request URI
     * @return the error response
     */
    public static ErrorResponse of(int status, String message, String path) {
        return new ErrorResponse(false, status, message, null, path,
                                 Instant.now(), UUID.randomUUID().toString());
    }

    /**
     * Creates a validation error response with field-level details.
     *
     * @param status  HTTP status code
     * @param message top-level message
     * @param errors  list of field validation errors
     * @param path    request URI
     * @return the validation error response
     */
    public static ErrorResponse validation(int status, String message, List<FieldError> errors, String path) {
        return new ErrorResponse(false, status, message, errors, path,
                                 Instant.now(), UUID.randomUUID().toString());
    }

    /**
     * Represents a single field-level validation error.
     *
     * @param field   the name of the invalid field
     * @param message the validation failure description
     */
    public record FieldError(String field, String message) {}
}
