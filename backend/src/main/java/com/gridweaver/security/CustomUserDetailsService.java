package com.gridweaver.security;

import com.gridweaver.entity.User;
import com.gridweaver.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Security {@link UserDetailsService} implementation that loads user
 * credentials from the database.
 *
 * <p>Called by the authentication manager during form-login and by
 * {@link JwtAuthenticationFilter} on every JWT-protected request.
 *
 * <p>Uses the email address as the username for Spring Security contracts.
 *
 * @author GridWeaver Team
 */
@Slf4j
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Constructor injection.
     *
     * @param userRepository the JPA repository for user lookups
     */
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Loads a {@link SecurityUser} by email address.
     *
     * <p>Only active (non-soft-deleted) users are returned.
     * Throws {@link UsernameNotFoundException} if the user does not exist or is deleted.
     *
     * @param email the login email (Spring Security calls this "username")
     * @return a populated {@link SecurityUser} wrapping the domain {@link User}
     * @throws UsernameNotFoundException if no active user with the email is found
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.debug("Loading user by email: {}", email);

        User user = userRepository.findByEmailAndDeletedAtIsNull(email)
            .orElseThrow(() -> {
                log.warn("User not found with email: {}", email);
                return new UsernameNotFoundException("User not found with email: " + email);
            });

        return new SecurityUser(user);
    }
}
