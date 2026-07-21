package com.gridweaver.service;

import com.gridweaver.dto.auth.RegisterRequest;
import com.gridweaver.dto.auth.AuthResponse;
import com.gridweaver.entity.Role;
import com.gridweaver.entity.User;
import com.gridweaver.exception.DuplicateResourceException;
import com.gridweaver.repository.RefreshTokenRepository;
import com.gridweaver.repository.RoleRepository;
import com.gridweaver.repository.UserRepository;
import com.gridweaver.security.JwtTokenProvider;
import com.gridweaver.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

/**
 * Unit tests for {@link AuthServiceImpl}.
 *
 * <p>Uses Mockito for all dependencies — no Spring context is loaded.
 * Tests cover the happy path and key failure scenarios for each operation.
 *
 * @author GridWeaver Team
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock private UserRepository         userRepository;
    @Mock private RoleRepository         roleRepository;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private JwtTokenProvider       jwtTokenProvider;
    @Mock private PasswordEncoder        passwordEncoder;
    @Mock private AuthenticationManager  authenticationManager;

    @InjectMocks
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshTokenExpirationMs", 604800000L);
    }

    // -------------------------------------------------------------------------
    // Registration tests
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("register — happy path — returns auth response")
    void register_happyPath_returnsAuthResponse() {
        // Arrange
        RegisterRequest request = new RegisterRequest(
            "johndoe", "john@example.com", "Password123!", "John", "Doe");

        Role defaultRole = new Role();
        defaultRole.setName(Role.Names.USER);

        User savedUser = User.builder()
            .username("johndoe")
            .email("john@example.com")
            .password("encoded_password")
            .firstName("John")
            .lastName("Doe")
            .build();

        // Simulate UUID being set (normally done by JPA)
        ReflectionTestUtils.setField(savedUser, "id", UUID.randomUUID());

        given(userRepository.existsByEmailAndNotDeleted(request.email())).willReturn(false);
        given(userRepository.existsByUsernameAndNotDeleted(request.username())).willReturn(false);
        given(roleRepository.findByName(Role.Names.USER)).willReturn(Optional.of(defaultRole));
        given(passwordEncoder.encode(request.password())).willReturn("encoded_password");
        given(userRepository.save(any(User.class))).willReturn(savedUser);
        given(jwtTokenProvider.generateAccessToken(any(User.class))).willReturn("access_token_123");
        given(jwtTokenProvider.getAccessTokenExpirationMs()).willReturn(900000L);
        given(refreshTokenRepository.save(any())).willReturn(null);

        // Act
        AuthResponse response = authService.register(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.accessToken()).isEqualTo("access_token_123");
        assertThat(response.tokenType()).isEqualTo("Bearer");
        assertThat(response.username()).isEqualTo("johndoe");
        assertThat(response.email()).isEqualTo("john@example.com");
    }

    @Test
    @DisplayName("register — duplicate email — throws DuplicateResourceException")
    void register_duplicateEmail_throwsDuplicateResourceException() {
        // Arrange
        RegisterRequest request = new RegisterRequest(
            "johndoe", "john@example.com", "Password123!", null, null);

        given(userRepository.existsByEmailAndNotDeleted(request.email())).willReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(request))
            .isInstanceOf(DuplicateResourceException.class)
            .hasMessageContaining("john@example.com");

        then(userRepository).should(never()).save(any());
    }

    @Test
    @DisplayName("register — duplicate username — throws DuplicateResourceException")
    void register_duplicateUsername_throwsDuplicateResourceException() {
        // Arrange
        RegisterRequest request = new RegisterRequest(
            "johndoe", "john@example.com", "Password123!", null, null);

        given(userRepository.existsByEmailAndNotDeleted(request.email())).willReturn(false);
        given(userRepository.existsByUsernameAndNotDeleted(request.username())).willReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(request))
            .isInstanceOf(DuplicateResourceException.class)
            .hasMessageContaining("johndoe");
    }

    // -------------------------------------------------------------------------
    // Logout tests
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("logout — valid user ID — revokes all tokens")
    void logout_validUserId_revokesAllTokens() {
        // Arrange
        UUID userId = UUID.randomUUID();
        User user = User.builder().username("johndoe").email("john@example.com").build();
        ReflectionTestUtils.setField(user, "id", userId);

        given(userRepository.findById(userId)).willReturn(Optional.of(user));
        willDoNothing().given(refreshTokenRepository).revokeAllTokensForUser(user);

        // Act
        authService.logout(userId.toString());

        // Assert
        then(refreshTokenRepository).should().revokeAllTokensForUser(user);
    }
}
