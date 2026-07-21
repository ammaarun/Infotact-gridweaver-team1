package com.gridweaver.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for access token refresh.
 *
 * <p>The client sends the previously issued refresh token to obtain a new access token.
 * If the refresh token is valid, a new access + refresh token pair is issued and
 * the old refresh token is revoked (token rotation).
 *
 * @param refreshToken the stored refresh token value
 */
public record RefreshTokenRequest(

    @NotBlank(message = "Refresh token is required")
    @JsonProperty("refresh_token")
    String refreshToken
) {}
