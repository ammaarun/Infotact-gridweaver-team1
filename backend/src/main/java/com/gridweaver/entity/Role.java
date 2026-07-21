package com.gridweaver.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

/**
 * JPA entity representing a security role (e.g., ROLE_ADMIN, ROLE_USER).
 *
 * <p>Roles are assigned to {@link User users} via the {@code user_roles} join table.
 * Each role can hold multiple fine-grained {@link Permission permissions}.
 *
 * @author GridWeaver Team
 */
@Entity
@Table(
    name = "roles",
    indexes = {
        @Index(name = "idx_roles_name", columnList = "name", unique = true)
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "permissions")
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Role extends BaseEntity {

    /**
     * Unique role identifier string (e.g., {@code ROLE_ADMIN}).
     * Spring Security requires the {@code ROLE_} prefix for role-based checks.
     */
    @NotBlank
    @Size(max = 50)
    @Column(name = "name", nullable = false, unique = true, length = 50)
    @EqualsAndHashCode.Include
    private String name;

    /**
     * Human-readable description of this role's purpose.
     */
    @Size(max = 255)
    @Column(name = "description", length = 255)
    private String description;

    /**
     * The set of permissions associated with this role.
     * Loaded lazily and fetched explicitly when needed.
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "role_permissions",
        joinColumns        = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    @Builder.Default
    private Set<Permission> permissions = new HashSet<>();

    /**
     * Predefined role constants to avoid magic strings.
     */
    public static final class Names {
        public static final String ADMIN     = "ROLE_ADMIN";
        public static final String USER      = "ROLE_USER";
        public static final String MODERATOR = "ROLE_MODERATOR";

        private Names() {
            // utility class — no instantiation
        }
    }
}
