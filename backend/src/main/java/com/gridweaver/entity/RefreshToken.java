package com.gridweaver.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * JPA entity that persists JWT refresh tokens in the database.
 *
 * <p>Storing refresh tokens in the database enables:
 * <ul>
 *   <li>Token revocation on logout (soft-delete or physical delete)</li>
 *   <li>Detection of refresh token reuse (rotation attack detection)</li>
 *   <li>User session management (list active sessions)</li>
 * </ul>
 *
 * <p>Access tokens are stateless (validated via JWT signature only) and are
 * therefore NOT stored in the database.
 *
 * @author GridWeaver Team
 */
@Entity
@Table(
    name = "refresh_tokens",
    indexes = {
        @Index(name = "idx_refresh_token_value",   columnList = "token",      unique = true),
        @Index(name = "idx_refresh_token_user",    columnList = "user_id"),
        @Index(name = "idx_refresh_token_expires", columnList = "expires_at")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "token")
public class RefreshToken extends BaseEntity {

    /**
     * The opaque refresh token string (UUID-based, cryptographically random).
     */
    @Column(name = "token", nullable = false, unique = true, length = 512)
    private String token;

    /**
     * The user this refresh token belongs to.
     * Many tokens per user are allowed (multi-device support).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Absolute expiry timestamp. After this moment the token is invalid regardless
     * of its revocation state.
     */
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    /**
     * Whether this token has been explicitly revoked (e.g., on logout).
     * Revoked tokens cannot be used even before {@link #expiresAt}.
     */
    @Column(name = "revoked", nullable = false)
    @Builder.Default
    private boolean revoked = false;

    /**
     * User-agent string captured at token creation for session tracking.
     */
    @Column(name = "user_agent", length = 512)
    private String userAgent;

    /**
     * IP address captured at token creation for session tracking and anomaly detection.
     */
    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    /**
     * Checks whether this refresh token is still valid (not revoked and not expired).
     *
     * @return {@code true} if the token may be used for rotation
     */
    public boolean isValid() {
        return !revoked && Instant.now().isBefore(expiresAt) && !isDeleted();
    }

    /**
     * Revokes this token, preventing any further use.
     */
    public void revoke() {
        this.revoked = true;
    }
}
