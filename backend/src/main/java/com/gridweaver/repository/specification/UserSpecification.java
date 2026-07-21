package com.gridweaver.repository.specification;

import com.gridweaver.entity.User;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Type-safe JPA {@link Specification} factory for {@link User} entities.
 *
 * <p>Enables dynamic, composable filtering via {@link org.springframework.data.jpa.domain.Specification}
 * chaining. All generated predicates automatically exclude soft-deleted records.
 *
 * <p>Usage example:
 * <pre>{@code
 * Specification<User> spec = UserSpecification.withFilters("john", null, true);
 * Page<User> users = userRepository.findAll(spec, pageable);
 * }</pre>
 *
 * @author GridWeaver Team
 */
public final class UserSpecification {

    private UserSpecification() {
        // utility class — no instantiation
    }

    /**
     * Builds a composite {@link Specification} based on the provided filter criteria.
     * All predicates are AND-ed together.
     *
     * @param search  partial match against username, email, firstName, or lastName
     * @param role    filter by role name (exact match)
     * @param enabled filter by account enabled/disabled state; {@code null} means no filter
     * @return a composed {@link Specification} ready for repository usage
     */
    public static Specification<User> withFilters(String search, String role, Boolean enabled) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always exclude soft-deleted records
            predicates.add(cb.isNull(root.get("deletedAt")));

            // Free-text search across multiple string fields
            if (StringUtils.hasText(search)) {
                String pattern = "%" + search.toLowerCase() + "%";
                Predicate searchPredicate = cb.or(
                    cb.like(cb.lower(root.get("username")),  pattern),
                    cb.like(cb.lower(root.get("email")),     pattern),
                    cb.like(cb.lower(root.get("firstName")), pattern),
                    cb.like(cb.lower(root.get("lastName")),  pattern)
                );
                predicates.add(searchPredicate);
            }

            // Role filter — join to the roles collection
            if (StringUtils.hasText(role)) {
                Join<Object, Object> roles = root.join("roles", JoinType.INNER);
                predicates.add(cb.equal(roles.get("name"), role));
                query.distinct(true); // Avoid duplicate users from multi-role join
            }

            // Account enabled/disabled filter
            if (enabled != null) {
                predicates.add(cb.equal(root.get("enabled"), enabled));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * Specification that filters for only enabled users.
     *
     * @return specification for active accounts
     */
    public static Specification<User> isEnabled() {
        return (root, query, cb) ->
            cb.and(
                cb.isNull(root.get("deletedAt")),
                cb.equal(root.get("enabled"), true)
            );
    }
}
