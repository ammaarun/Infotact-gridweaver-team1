package com.gridweaver.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Immutable response DTO returned on successful authentication.
 *
 * <p>Contains both the short-lived access token and the longer-lived refresh token.
 * The client must:
 * <ol>
 *   <li>Store the access token in memory (NOT localStorage)</li>
 *   <li>Store the refresh token in an HttpOnly cookie (managed by the server)</li>
 *   <li>Use the refresh endpoint before the access token expires</li>
 * </ol>
 *
 * @param accessToken           signed JWT for API authorization
 * @param refreshToken          opaque token for access token renewal
 * @param tokenType             always {@code "Bearer"}
 * @param expiresIn             access token TTL in seconds
 * @param userId                the authenticated user's UUID string
 * @param username              the authenticated user's username
 * @param email                 the authenticated user's email
 */
public record AuthResponse(

    @JsonProperty("access_token")
    String accessToken,

    @JsonProperty("refresh_token")
    String refreshToken,

    @JsonProperty("token_type")
    String tokenType,

    @JsonProperty("expires_in")
    long expiresIn,

    @JsonProperty("user_id")
    String userId,

    String username,
    String email
) {
    /** Canonical token type value used in Authorization headers. */
    public static final String BEARER = "Bearer";

    /**
     * Factory method for building a standard auth response.
     *
     * @param accessToken  the JWT access token
     * @param refreshToken the refresh token
     * @param expiresIn    TTL in seconds
     * @param userId       user UUID as string
     * @param username     user's login name
     * @param email        user's email
     * @return the constructed response record
     */
    public static AuthResponse of(String accessToken, String refreshToken,
                                  long expiresIn, String userId,
                                  String username, String email) {
        return new AuthResponse(accessToken, refreshToken, BEARER,
                                expiresIn, userId, username, email);
    }
}
