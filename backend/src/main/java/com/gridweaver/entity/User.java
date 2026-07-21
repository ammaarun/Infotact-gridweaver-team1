package com.gridweaver.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

/**
 * JPA entity representing an authenticated user in the GridWeaver platform.
 *
 * <p>Users can hold multiple {@link Role roles} (RBAC). Passwords are stored
 * as BCrypt hashes — never in plain text.
 *
 * <p>Soft-delete is inherited from {@link BaseEntity}. Hard-delete is never
 * used to preserve audit integrity.
 *
 * @author GridWeaver Team
 */
@Entity
@Table(
    name = "users",
    indexes = {
        @Index(name = "idx_users_email",    columnList = "email",    unique = true),
        @Index(name = "idx_users_username", columnList = "username", unique = true),
        @Index(name = "idx_users_deleted",  columnList = "deleted_at")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"password", "roles"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class User extends BaseEntity {

    // -------------------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------------------

    /**
     * Unique, human-readable username (3–50 characters, lowercase preferred).
     */
    @NotBlank
    @Size(min = 3, max = 50)
    @Column(name = "username", nullable = false, unique = true, length = 50)
    @EqualsAndHashCode.Include
    private String username;

    /**
     * Unique email address. Used as the primary login credential.
     */
    @NotBlank
    @Email
    @Size(max = 255)
    @Column(name = "email", nullable = false, unique = true, length = 255)
    @EqualsAndHashCode.Include
    private String email;

    /**
     * BCrypt-hashed password. Raw passwords are never stored.
     */
    @NotBlank
    @Column(name = "password", nullable = false)
    private String password;

    // -------------------------------------------------------------------------
    // Profile
    // -------------------------------------------------------------------------

    /**
     * User's first name. Optional for display purposes.
     */
    @Size(max = 100)
    @Column(name = "first_name", length = 100)
    private String firstName;

    /**
     * User's last name. Optional for display purposes.
     */
    @Size(max = 100)
    @Column(name = "last_name", length = 100)
    private String lastName;

    // -------------------------------------------------------------------------
    // Account State
    // -------------------------------------------------------------------------

    /**
     * Whether the user account is active. Disabled accounts cannot authenticate.
     */
    @Column(name = "enabled", nullable = false)
    @Builder.Default
    private boolean enabled = true;

    /**
     * Whether the account is locked (e.g., after brute-force attempts).
     * Locked accounts cannot authenticate even if enabled.
     */
    @Column(name = "account_locked", nullable = false)
    @Builder.Default
    private boolean accountLocked = false;

    /**
     * Whether the account credentials (password) have expired.
     */
    @Column(name = "credentials_expired", nullable = false)
    @Builder.Default
    private boolean credentialsExpired = false;

    // -------------------------------------------------------------------------
    // Roles (Many-to-Many)
    // -------------------------------------------------------------------------

    /**
     * The set of roles assigned to this user.
     * Loaded lazily to avoid unnecessary joins on every user query.
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_roles",
        joinColumns        = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Returns the user's full name, falling back to username if names are absent.
     *
     * @return display-friendly name
     */
    public String getFullName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        } else if (firstName != null) {
            return firstName;
        } else if (lastName != null) {
            return lastName;
        }
        return username;
    }

    /**
     * Convenience method for adding a role to this user.
     *
     * @param role the role to add
     */
    public void addRole(Role role) {
        this.roles.add(role);
    }
}
