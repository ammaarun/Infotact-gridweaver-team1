package com.gridweaver.service.impl;

import com.gridweaver.dto.auth.AuthResponse;
import com.gridweaver.dto.auth.LoginRequest;
import com.gridweaver.dto.auth.RefreshTokenRequest;
import com.gridweaver.dto.auth.RegisterRequest;
import com.gridweaver.entity.RefreshToken;
import com.gridweaver.entity.Role;
import com.gridweaver.entity.User;
import com.gridweaver.exception.DuplicateResourceException;
import com.gridweaver.exception.ResourceNotFoundException;
import com.gridweaver.exception.TokenExpiredException;
import com.gridweaver.repository.RefreshTokenRepository;
import com.gridweaver.repository.RoleRepository;
import com.gridweaver.repository.UserRepository;
import com.gridweaver.security.JwtTokenProvider;
import com.gridweaver.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

/**
 * Implementation of {@link AuthService} handling user registration, login,
 * token refresh, and logout.
 *
 * <p><b>Security invariants</b>:
 * <ul>
 *   <li>Passwords are BCrypt-hashed before persistence</li>
 *   <li>Refresh tokens are rotated on every use (old token revoked)</li>
 *   <li>All database mutations are wrapped in transactions</li>
 * </ul>
 *
 * @author GridWeaver Team
 */
@Slf4j
@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository          userRepository;
    private final RoleRepository          roleRepository;
    private final RefreshTokenRepository  refreshTokenRepository;
    private final JwtTokenProvider        jwtTokenProvider;
    private final PasswordEncoder         passwordEncoder;
    private final AuthenticationManager   authenticationManager;

    @Value("${gridweaver.jwt.refresh-token-expiration}")
    private long refreshTokenExpirationMs;

    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           RefreshTokenRepository refreshTokenRepository,
                           JwtTokenProvider jwtTokenProvider,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager) {
        this.userRepository         = userRepository;
        this.roleRepository         = roleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtTokenProvider       = jwtTokenProvider;
        this.passwordEncoder        = passwordEncoder;
        this.authenticationManager  = authenticationManager;
    }

    // -------------------------------------------------------------------------
    // Registration
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.email());

        // Duplicate check
        if (userRepository.existsByEmailAndNotDeleted(request.email())) {
            throw new DuplicateResourceException("Email already registered: " + request.email());
        }
        if (userRepository.existsByUsernameAndNotDeleted(request.username())) {
            throw new DuplicateResourceException("Username already taken: " + request.username());
        }

        // Assign default role
        Role defaultRole = roleRepository.findByName(Role.Names.USER)
            .orElseThrow(() -> new ResourceNotFoundException("Default role not found. Please run data seeding."));

        // Build user entity
        User user = User.builder()
            .username(request.username())
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .firstName(request.firstName())
            .lastName(request.lastName())
            .enabled(true)
            .build();
        user.addRole(defaultRole);

        User savedUser = userRepository.save(user);
        log.info("User registered with ID: {}", savedUser.getId());

        return buildAuthResponse(savedUser);
    }

    // -------------------------------------------------------------------------
    // Login
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.email());

        // Delegate credential validation to Spring Security (throws on failure)
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmailAndDeletedAtIsNull(request.email())
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.email()));

        log.info("Login successful for user ID: {}", user.getId());
        return buildAuthResponse(user);
    }

    // -------------------------------------------------------------------------
    // Token Refresh
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken stored = refreshTokenRepository.findActiveByToken(request.refreshToken())
            .orElseThrow(() -> new TokenExpiredException("Refresh token is invalid or has been revoked."));

        if (!stored.isValid()) {
            throw new TokenExpiredException("Refresh token has expired. Please log in again.");
        }

        // Token rotation: revoke the old token
        stored.revoke();
        refreshTokenRepository.save(stored);

        // Issue new pair
        User user = stored.getUser();
        log.info("Refresh token rotated for user ID: {}", user.getId());
        return buildAuthResponse(user);
    }

    // -------------------------------------------------------------------------
    // Logout
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void logout(String userId) {
        User user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        refreshTokenRepository.revokeAllTokensForUser(user);
        log.info("All refresh tokens revoked for user ID: {}", userId);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Builds an {@link AuthResponse} by generating a new access token and
     * persisting a new refresh token for the given user.
     *
     * @param user the authenticated user
     * @return populated auth response
     */
    private AuthResponse buildAuthResponse(User user) {
        String accessToken  = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = UUID.randomUUID().toString();

        RefreshToken refreshEntity = RefreshToken.builder()
            .token(refreshToken)
            .user(user)
            .expiresAt(Instant.now().plusMillis(refreshTokenExpirationMs))
            .build();
        refreshTokenRepository.save(refreshEntity);

        long expiresInSeconds = jwtTokenProvider.getAccessTokenExpirationMs() / 1000;

        return AuthResponse.of(
            accessToken,
            refreshToken,
            expiresInSeconds,
            user.getId().toString(),
            user.getUsername(),
            user.getEmail()
        );
    }
}
