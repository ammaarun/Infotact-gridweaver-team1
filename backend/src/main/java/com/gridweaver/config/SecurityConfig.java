package com.gridweaver.config;

import com.gridweaver.security.JwtAccessDeniedHandler;
import com.gridweaver.security.JwtAuthEntryPoint;
import com.gridweaver.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

/**
 * Master Spring Security configuration.
 *
 * <p>Configures:
 * <ul>
 *   <li>Stateless session management (JWT, no HTTP session)</li>
 *   <li>CSRF disabled (standard for stateless REST APIs)</li>
 *   <li>CORS via {@link CorsConfig}</li>
 *   <li>Public vs. protected endpoint mapping</li>
 *   <li>JWT filter insertion before UsernamePasswordAuthenticationFilter</li>
 *   <li>Security response headers (XSS, frame options, referrer policy)</li>
 *   <li>Method-level security ({@code @PreAuthorize}, {@code @Secured})</li>
 * </ul>
 *
 * @author GridWeaver Team
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService      userDetailsService;
    private final JwtAuthEntryPoint       authEntryPoint;
    private final JwtAccessDeniedHandler  accessDeniedHandler;

    /** Public URL patterns that bypass authentication entirely. */
    private static final String[] PUBLIC_URLS = {
        "/api/v1/auth/**",
        "/api/v1/health",
        "/actuator/health",
        "/actuator/info",
        "/swagger-ui/**",
        "/swagger-ui.html",
        "/v3/api-docs/**",
        "/ws/**",
        "/h2-console/**"
    };

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          UserDetailsService userDetailsService,
                          JwtAuthEntryPoint authEntryPoint,
                          JwtAccessDeniedHandler accessDeniedHandler) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService       = userDetailsService;
        this.authEntryPoint           = authEntryPoint;
        this.accessDeniedHandler      = accessDeniedHandler;
    }

    /**
     * Configures the main HTTP security filter chain.
     *
     * @param http the {@link HttpSecurity} builder
     * @return the assembled {@link SecurityFilterChain}
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            // Disable CSRF — REST APIs use JWT, not cookies
            .csrf(AbstractHttpConfigurer::disable)

            // CORS — delegates to CorsConfig bean
            .cors(cors -> {})

            // Stateless session — no HTTP session created or used
            .sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Security headers
            .headers(headers -> headers
                .frameOptions(fo -> fo.deny())
                .xssProtection(xss -> xss.disable()) // Modern browsers use CSP instead
                .contentSecurityPolicy(csp ->
                    csp.policyDirectives("default-src 'self'"))
                .referrerPolicy(rp ->
                    rp.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
            )

            // Authorization rules
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(PUBLIC_URLS).permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/actuator/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )

            // Custom 401 / 403 handlers
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(authEntryPoint)
                .accessDeniedHandler(accessDeniedHandler)
            )

            // Insert JWT filter before the standard username/password filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

            .build();
    }

    /**
     * DAO authentication provider — uses {@link UserDetailsService} + BCrypt.
     *
     * @return the configured {@link AuthenticationProvider}
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * Exposes the {@link AuthenticationManager} bean for use in {@link com.gridweaver.service.AuthService}.
     *
     * @param config Spring's authentication configuration
     * @return the application-wide authentication manager
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * BCrypt password encoder.
     * Strength is hardcoded to 12 here; override via {@code gridweaver.security.bcrypt-strength} if needed.
     *
     * @return the {@link PasswordEncoder} bean
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
