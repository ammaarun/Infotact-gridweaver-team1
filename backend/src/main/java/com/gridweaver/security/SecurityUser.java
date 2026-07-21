package com.gridweaver.security;

import com.gridweaver.entity.Role;
import com.gridweaver.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Spring Security {@link UserDetails} adapter that wraps the domain {@link User} entity.
 *
 * <p>Converts {@link Role roles} and their {@link com.gridweaver.entity.Permission permissions}
 * into Spring Security {@link GrantedAuthority} objects, enabling both:
 * <ul>
 *   <li>Role-based access ({@code hasRole("ADMIN")})</li>
 *   <li>Permission-based access ({@code hasAuthority("user:write")})</li>
 * </ul>
 *
 * <p>This class does NOT extend or store the JPA entity directly in the security context
 * to avoid serialization/detachment issues with Hibernate proxy objects.
 *
 * @author GridWeaver Team
 */
@Getter
public class SecurityUser implements UserDetails {

    /** The user's database UUID — safe to expose in the security context. */
    private final UUID   userId;

    /** Email address — used as the Spring Security principal name. */
    private final String email;

    /** Username for display purposes. */
    private final String username;

    /** BCrypt-hashed password (used internally by Spring Security). */
    private final String password;

    /** Whether the account is active. */
    private final boolean enabled;

    /** Whether the account is locked. */
    private final boolean accountNonLocked;

    /** Whether the credentials (password) have expired. */
    private final boolean credentialsNonExpired;

    /** Combined set of role + permission authorities. */
    private final Collection<? extends GrantedAuthority> authorities;

    /**
     * Constructs a {@link SecurityUser} from a domain {@link User}.
     * Eagerly builds all authority strings at construction time.
     *
     * @param user the domain user (must have roles eagerly loaded or be in a transaction)
     */
    public SecurityUser(User user) {
        this.userId               = user.getId();
        this.email                = user.getEmail();
        this.username             = user.getUsername();
        this.password             = user.getPassword();
        this.enabled              = user.isEnabled();
        this.accountNonLocked     = !user.isAccountLocked();
        this.credentialsNonExpired = !user.isCredentialsExpired();
        this.authorities          = buildAuthorities(user);
    }

    /**
     * Builds a combined set of {@link GrantedAuthority} from the user's roles
     * and each role's permissions.
     *
     * @param user the domain user
     * @return immutable set of authorities
     */
    private static Set<GrantedAuthority> buildAuthorities(User user) {
        Set<GrantedAuthority> authorities = new HashSet<>();

        for (Role role : user.getRoles()) {
            // Add role-level authority (e.g., ROLE_ADMIN)
            authorities.add(new SimpleGrantedAuthority(role.getName()));

            // Add each fine-grained permission (e.g., user:write)
            role.getPermissions().forEach(perm ->
                authorities.add(new SimpleGrantedAuthority(perm.getName()))
            );
        }

        return Set.copyOf(authorities);
    }

    // -------------------------------------------------------------------------
    // UserDetails contract — account state
    // -------------------------------------------------------------------------

    /** {@inheritDoc} */
    @Override
    public boolean isAccountNonExpired() {
        return true; // Account expiry not implemented — extend here if needed
    }

    /** {@inheritDoc} */
    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    /** {@inheritDoc} */
    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    /** {@inheritDoc} */
    @Override
    public boolean isEnabled() {
        return enabled;
    }

    /**
     * Returns the email as the username for all Spring Security operations.
     * {@inheritDoc}
     */
    @Override
    public String getUsername() {
        return email;
    }

    /** {@inheritDoc} */
    @Override
    public String getPassword() {
        return password;
    }

    /** {@inheritDoc} */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
}
