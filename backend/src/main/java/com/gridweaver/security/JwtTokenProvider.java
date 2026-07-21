package com.gridweaver.security;

import com.gridweaver.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

/**
 * Core JWT utility component responsible for generating, parsing, and validating
 * JSON Web Tokens for both access and refresh token lifecycles.
 *
 * <p>Uses JJWT 0.12.x API with HMAC-SHA512 signature algorithm.
 * The secret key is derived from the configured secret string using {@link Keys#hmacShaKeyFor}.
 *
 * <p><b>Security notes:</b>
 * <ul>
 *   <li>Access tokens are short-lived (default 15 min)</li>
 *   <li>The key must be at least 512 bits for HS512</li>
 *   <li>Secrets are injected via environment variables — never hardcoded</li>
 * </ul>
 *
 * @author GridWeaver Team
 */
@Slf4j
@Component
public class JwtTokenProvider {

    private final SecretKey signingKey;
    private final long accessTokenExpirationMs;
    private final String issuer;

    /**
     * Constructs the provider with externalized JWT configuration.
     *
     * @param secret                  JWT HMAC signing secret (must be &ge;512 bits / 64 chars)
     * @param accessTokenExpirationMs access token TTL in milliseconds
     * @param issuer                  JWT {@code iss} claim value
     */
    public JwtTokenProvider(
            @Value("${gridweaver.jwt.secret}") String secret,
            @Value("${gridweaver.jwt.access-token-expiration}") long accessTokenExpirationMs,
            @Value("${gridweaver.jwt.issuer}") String issuer) {

        this.signingKey             = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpirationMs = accessTokenExpirationMs;
        this.issuer                 = issuer;
    }

    // -------------------------------------------------------------------------
    // Token Generation
    // -------------------------------------------------------------------------

    /**
     * Generates a signed JWT access token for the given user.
     *
     * <p>Claims included:
     * <ul>
     *   <li>{@code sub} — user UUID</li>
     *   <li>{@code email} — user email</li>
     *   <li>{@code username} — user login</li>
     *   <li>{@code type} — {@code "access"}</li>
     *   <li>{@code jti} — random UUID for token uniqueness</li>
     * </ul>
     *
     * @param user the authenticated user
     * @return signed JWT string
     */
    public String generateAccessToken(User user) {
        Instant now    = Instant.now();
        Instant expiry = now.plusMillis(accessTokenExpirationMs);

        return Jwts.builder()
            .issuer(issuer)
            .subject(user.getId().toString())
            .claims(Map.of(
                "email",    user.getEmail(),
                "username", user.getUsername(),
                "type",     "access"
            ))
            .id(UUID.randomUUID().toString())
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiry))
            .signWith(signingKey, Jwts.SIG.HS512)
            .compact();
    }

    // -------------------------------------------------------------------------
    // Token Parsing
    // -------------------------------------------------------------------------

    /**
     * Parses a JWT and returns its claims payload.
     *
     * @param token the raw JWT string
     * @return parsed {@link Claims}
     * @throws JwtException if the token is malformed, expired, or has an invalid signature
     */
    public Claims parseToken(String token) {
        return Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    // -------------------------------------------------------------------------
    // Token Validation
    // -------------------------------------------------------------------------

    /**
     * Validates a JWT token and returns {@code true} if valid.
     *
     * <p>Catches all JJWT exceptions and logs them at appropriate levels,
     * returning {@code false} instead of propagating to callers.
     *
     * @param token the raw JWT string
     * @return {@code true} if the token is well-formed, signed correctly, and not expired
     */
    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.info("JWT token expired: {}", e.getMessage());
        } catch (SignatureException e) {
            log.warn("JWT signature validation failed: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("Malformed JWT token: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("Unsupported JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT token argument error: {}", e.getMessage());
        }
        return false;
    }

    // -------------------------------------------------------------------------
    // Claims Extractors
    // -------------------------------------------------------------------------

    /**
     * Extracts the {@code sub} (user UUID) claim from a validated token.
     *
     * @param token the raw JWT string
     * @return the user's UUID string
     */
    public String getUserIdFromToken(String token) {
        return parseToken(token).getSubject();
    }

    /**
     * Extracts the {@code email} claim from a validated token.
     *
     * @param token the raw JWT string
     * @return the user's email
     */
    public String getEmailFromToken(String token) {
        return parseToken(token).get("email", String.class);
    }

    /**
     * Returns the configured access token TTL in milliseconds.
     *
     * @return access token expiration in ms
     */
    public long getAccessTokenExpirationMs() {
        return accessTokenExpirationMs;
    }
}
