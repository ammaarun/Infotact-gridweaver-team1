package com.gridweaver.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * JPA entity representing a fine-grained permission (e.g., {@code user:read}, {@code user:write}).
 *
 * <p>Permissions are associated with {@link Role roles} via the {@code role_permissions} join table,
 * enabling a two-level RBAC model:
 * <pre>
 *   User → has many Roles → each Role → has many Permissions
 * </pre>
 *
 * <p>Permission strings follow the {@code resource:action} convention
 * (e.g., {@code user:read}, {@code admin:all}).
 *
 * @author GridWeaver Team
 */
@Entity
@Table(
    name = "permissions",
    indexes = {
        @Index(name = "idx_permissions_name", columnList = "name", unique = true)
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Permission extends BaseEntity {

    /**
     * Unique permission string in {@code resource:action} format.
     * Examples: {@code user:read}, {@code user:write}, {@code admin:all}.
     */
    @NotBlank
    @Size(max = 100)
    @Column(name = "name", nullable = false, unique = true, length = 100)
    @EqualsAndHashCode.Include
    private String name;

    /**
     * Human-readable description of what this permission allows.
     */
    @Size(max = 255)
    @Column(name = "description", length = 255)
    private String description;

    /**
     * Predefined permission name constants.
     */
    public static final class Names {
        public static final String USER_READ    = "user:read";
        public static final String USER_WRITE   = "user:write";
        public static final String USER_DELETE  = "user:delete";
        public static final String ADMIN_ALL    = "admin:all";

        private Names() {
            // utility class — no instantiation
        }
    }
}
