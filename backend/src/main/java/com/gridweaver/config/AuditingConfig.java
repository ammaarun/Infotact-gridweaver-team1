package com.gridweaver.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

/**
 * JPA Auditing configuration.
 *
 * <p>Provides an {@link AuditorAware} bean that supplies the currently authenticated
 * user's identifier to JPA's auditing mechanism. This populates the {@code createdBy}
 * and {@code lastModifiedBy} fields if they are added to {@link com.gridweaver.entity.BaseEntity}
 * in the future.
 *
 * <p>The auditor is resolved from the Spring Security context on every persist/merge operation.
 *
 * @author GridWeaver Team
 */
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class AuditingConfig {

    /**
     * {@link AuditorAware} bean that returns the authenticated user's email.
     * Falls back to {@code "system"} for unauthenticated operations (e.g., bootstrap).
     *
     * @return the auditor aware bean
     */
    @Bean(name = "auditorAware")
    public AuditorAware<String> auditorAware() {
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null
                    || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getPrincipal())) {
                return Optional.of("system");
            }

            return Optional.of(authentication.getName());
        };
    }
}
