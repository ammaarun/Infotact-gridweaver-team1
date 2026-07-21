package com.gridweaver.repository;

import com.gridweaver.entity.Role;
import com.gridweaver.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import com.gridweaver.config.AuditingConfig;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * Repository integration tests for {@link UserRepository}.
 *
 * <p>Uses {@link DataJpaTest} which auto-configures H2 in-memory database,
 * JPA repositories, and runs each test in a transaction that is rolled back.
 *
 * <p>For tests requiring PostgreSQL-specific features, use TestContainers
 * with the {@code @Testcontainers} and {@code @Container} annotations.
 *
 * @author GridWeaver Team
 */
@DataJpaTest
@Import(AuditingConfig.class)
@ActiveProfiles("dev")
@DisplayName("UserRepository Integration Tests")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        // Create and persist a default role
        Role userRole = new Role();
        userRole.setName(Role.Names.USER);
        userRole.setDescription("Standard user role");
        userRole = roleRepository.saveAndFlush(userRole);

        // Create and persist a test user
        testUser = User.builder()
            .username("johndoe")
            .email("john@example.com")
            .password("encoded_password")
            .firstName("John")
            .lastName("Doe")
            .build();
        testUser.addRole(userRole);
        testUser = userRepository.saveAndFlush(testUser);
    }

    @Test
    @DisplayName("findByEmailAndDeletedAtIsNull — existing email — returns user")
    void findByEmailAndDeletedAtIsNull_existingEmail_returnsUser() {
        Optional<User> result = userRepository.findByEmailAndDeletedAtIsNull("john@example.com");
        assertThat(result).isPresent();
        assertThat(result.get().getUsername()).isEqualTo("johndoe");
    }

    @Test
    @DisplayName("findByEmailAndDeletedAtIsNull — non-existent email — returns empty")
    void findByEmailAndDeletedAtIsNull_nonExistentEmail_returnsEmpty() {
        Optional<User> result = userRepository.findByEmailAndDeletedAtIsNull("nobody@example.com");
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("existsByEmailAndNotDeleted — existing email — returns true")
    void existsByEmailAndNotDeleted_existingEmail_returnsTrue() {
        boolean exists = userRepository.existsByEmailAndNotDeleted("john@example.com");
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("existsByUsernameAndNotDeleted — existing username — returns true")
    void existsByUsernameAndNotDeleted_existingUsername_returnsTrue() {
        boolean exists = userRepository.existsByUsernameAndNotDeleted("johndoe");
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("soft delete — deleted user — not found by email query")
    void softDelete_deletedUser_notFoundByEmailQuery() {
        // Act: soft-delete the user
        testUser.softDelete();
        userRepository.save(testUser);

        // Assert: soft-deleted user is not returned by the filtered query
        Optional<User> result = userRepository.findByEmailAndDeletedAtIsNull("john@example.com");
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("findByUsernameAndNotDeleted — active user — returns user")
    void findByUsernameAndNotDeleted_activeUser_returnsUser() {
        Optional<User> result = userRepository.findByUsernameAndNotDeleted("johndoe");
        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("john@example.com");
    }
}
