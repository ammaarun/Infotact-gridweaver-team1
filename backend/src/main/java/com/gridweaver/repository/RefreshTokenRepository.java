package com.gridweaver.repository;

import com.gridweaver.entity.RefreshToken;
import com.gridweaver.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link RefreshToken} entities.
 *
 * <p>Provides token lifecycle management: lookup, revocation, and cleanup
 * of expired tokens via scheduled purge queries.
 *
 * @author GridWeaver Team
 */
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    /**
     * Finds an active, non-revoked refresh token by its value.
     *
     * @param token the raw token string
     * @return an {@link Optional} containing the token entity, or empty
     */
    @Query("SELECT rt FROM RefreshToken rt WHERE rt.token = :token AND rt.revoked = false AND rt.deletedAt IS NULL")
    Optional<RefreshToken> findActiveByToken(@Param("token") String token);

    /**
     * Returns all active (non-revoked, non-expired) refresh tokens for a given user.
     * Used for session listing and cross-device logout.
     *
     * @param user      the owning user
     * @param threshold the current time boundary for expiry check
     * @return list of active tokens
     */
    @Query("""
           SELECT rt FROM RefreshToken rt
           WHERE rt.user = :user
             AND rt.revoked = false
             AND rt.expiresAt > :threshold
             AND rt.deletedAt IS NULL
           """)
    List<RefreshToken> findActiveTokensByUser(@Param("user") User user,
                                              @Param("threshold") Instant threshold);

    /**
     * Revokes all active refresh tokens for the given user in a single UPDATE.
     * Called on logout to invalidate all existing sessions.
     *
     * @param user the target user
     */
    @Modifying
    @Transactional
    @Query("UPDATE RefreshToken rt SET rt.revoked = true WHERE rt.user = :user AND rt.revoked = false")
    void revokeAllTokensForUser(@Param("user") User user);

    /**
     * Physically deletes all expired OR revoked refresh tokens.
     * Intended to be called by a scheduled cleanup task to keep the table lean.
     *
     * @param threshold the timestamp boundary — tokens expired before this are deleted
     * @return the number of rows deleted
     */
    @Modifying
    @Transactional
    @Query("""
           DELETE FROM RefreshToken rt
           WHERE rt.expiresAt < :threshold OR rt.revoked = true
           """)
    int deleteExpiredAndRevokedTokens(@Param("threshold") Instant threshold);
}
