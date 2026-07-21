package com.gridweaver.service.impl;

import com.gridweaver.dto.common.PagedResponse;
import com.gridweaver.dto.user.UserResponse;
import com.gridweaver.dto.user.UserSummaryResponse;
import com.gridweaver.dto.user.UserUpdateRequest;
import com.gridweaver.entity.User;
import com.gridweaver.exception.DuplicateResourceException;
import com.gridweaver.exception.ResourceNotFoundException;
import com.gridweaver.mapper.UserMapper;
import com.gridweaver.repository.UserRepository;
import com.gridweaver.repository.specification.UserSpecification;
import com.gridweaver.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.UUID;

/**
 * {@link UserService} implementation providing user CRUD, search, and account management.
 *
 * <p>Cache strategy:
 * <ul>
 *   <li>{@code users} cache — individual user responses cached by ID or email</li>
 *   <li>Cache is evicted on update and delete operations</li>
 * </ul>
 *
 * @author GridWeaver Team
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper     userMapper;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper     = userMapper;
    }

    // -------------------------------------------------------------------------
    // Reads
    // -------------------------------------------------------------------------

    /** {@inheritDoc} */
    @Override
    @Cacheable(value = "users", key = "#id")
    public UserResponse getUserById(UUID id) {
        log.debug("Fetching user by ID: {}", id);
        User user = findActiveById(id);
        return userMapper.toResponse(user);
    }

    /** {@inheritDoc} */
    @Override
    @Cacheable(value = "users", key = "#email")
    public UserResponse getUserByEmail(String email) {
        log.debug("Fetching user by email: {}", email);
        User user = userRepository.findByEmailAndDeletedAtIsNull(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return userMapper.toResponse(user);
    }

    /** {@inheritDoc} */
    @Override
    public PagedResponse<UserSummaryResponse> getAllUsers(String search, String role,
                                                          Boolean enabled, Pageable pageable) {
        log.debug("Fetching users — search={}, role={}, enabled={}", search, role, enabled);
        Specification<User> spec = UserSpecification.withFilters(search, role, enabled);
        Page<UserSummaryResponse> page = userRepository.findAll(spec, pageable)
            .map(userMapper::toSummaryResponse);
        return PagedResponse.of(page);
    }

    // -------------------------------------------------------------------------
    // Writes
    // -------------------------------------------------------------------------

    /** {@inheritDoc} */
    @Override
    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public UserResponse updateUser(UUID id, UserUpdateRequest request) {
        log.info("Updating user ID: {}", id);
        User user = findActiveById(id);

        // Apply only provided (non-null) fields
        if (StringUtils.hasText(request.firstName())) {
            user.setFirstName(request.firstName());
        }
        if (StringUtils.hasText(request.lastName())) {
            user.setLastName(request.lastName());
        }
        if (StringUtils.hasText(request.email()) && !request.email().equals(user.getEmail())) {
            if (userRepository.existsByEmailAndNotDeleted(request.email())) {
                throw new DuplicateResourceException("Email already in use: " + request.email());
            }
            user.setEmail(request.email());
        }
        if (StringUtils.hasText(request.username()) && !request.username().equals(user.getUsername())) {
            if (userRepository.existsByUsernameAndNotDeleted(request.username())) {
                throw new DuplicateResourceException("Username already taken: " + request.username());
            }
            user.setUsername(request.username());
        }

        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    /** {@inheritDoc} */
    @Override
    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public void deleteUser(UUID id) {
        log.info("Soft-deleting user ID: {}", id);
        User user = findActiveById(id);
        user.softDelete();
        userRepository.save(user);
    }

    /** {@inheritDoc} */
    @Override
    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public UserResponse setUserEnabled(UUID id, boolean enabled) {
        log.info("Setting enabled={} for user ID: {}", enabled, id);
        User user = findActiveById(id);
        user.setEnabled(enabled);
        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private User findActiveById(UUID id) {
        return userRepository.findById(id)
            .filter(u -> !u.isDeleted())
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }
}
