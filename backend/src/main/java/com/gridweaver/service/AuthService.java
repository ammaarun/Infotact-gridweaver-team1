package com.gridweaver.service;

import com.gridweaver.dto.auth.AuthResponse;
import com.gridweaver.dto.auth.LoginRequest;
import com.gridweaver.dto.auth.RefreshTokenRequest;
import com.gridweaver.dto.auth.RegisterRequest;

/**
 * Authentication service contract.
 *
 * <p>Defines all authentication-related operations:
 * <ul>
 *   <li>User registration with role assignment</li>
 *   <li>User login with JWT token generation</li>
 *   <li>Access token refresh via refresh token rotation</li>
 *   <li>Logout with token revocation</li>
 * </ul>
 *
 * <p>Implementations must enforce security checks, BCrypt hashing,
 * and transaction boundaries.
 *
 * @author GridWeaver Team
 */
public interface AuthService {

    /**
     * Registers a new user account and returns authentication tokens.
     *
     * @param request the registration details
     * @return authentication response with access + refresh tokens
     * @throws com.gridweaver.exception.DuplicateResourceException if email or username already exists
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticates a user with email + password and returns tokens.
     *
     * @param request the login credentials
     * @return authentication response with access + refresh tokens
     * @throws org.springframework.security.core.AuthenticationException if credentials are invalid
     */
    AuthResponse login(LoginRequest request);

    /**
     * Rotates a refresh token: validates, revokes the old one, issues a new pair.
     *
     * @param request containing the current refresh token
     * @return new authentication response with rotated tokens
     * @throws com.gridweaver.exception.TokenExpiredException if the refresh token is expired or revoked
     */
    AuthResponse refreshToken(RefreshTokenRequest request);

    /**
     * Logs out the user by revoking all their active refresh tokens.
     *
     * @param userId the UUID string of the user to log out
     */
    void logout(String userId);
}
