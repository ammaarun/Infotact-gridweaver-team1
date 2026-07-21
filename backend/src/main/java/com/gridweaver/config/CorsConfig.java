package com.gridweaver.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CORS (Cross-Origin Resource Sharing) configuration.
 *
 * <p>Allows the frontend application to communicate with this API from a different origin.
 * Allowed origins, methods, and headers are all externalized via {@code application.yml}
 * and environment variables — never hardcoded here.
 *
 * <p>This bean is referenced by {@link SecurityConfig} via the Spring Security CORS integration.
 *
 * @author GridWeaver Team
 */
@Configuration
public class CorsConfig {

    @Value("${gridweaver.cors.allowed-origins}")
    private String allowedOrigins;

    @Value("${gridweaver.cors.allowed-methods}")
    private String allowedMethods;

    @Value("${gridweaver.cors.allowed-headers}")
    private String allowedHeaders;

    @Value("${gridweaver.cors.allow-credentials}")
    private boolean allowCredentials;

    @Value("${gridweaver.cors.max-age}")
    private long maxAge;

    /**
     * Builds and registers a global {@link CorsConfigurationSource} applied to all paths.
     *
     * @return the CORS configuration source bean
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Parse comma-separated allowed origins
        List<String> origins = Arrays.asList(allowedOrigins.split(","));
        config.setAllowedOrigins(origins.stream().map(String::trim).toList());

        // Parse comma-separated allowed HTTP methods
        List<String> methods = Arrays.asList(allowedMethods.split(","));
        config.setAllowedMethods(methods.stream().map(String::trim).toList());

        // Allow all headers or specific list
        if ("*".equals(allowedHeaders.trim())) {
            config.setAllowedHeaders(List.of("*"));
        } else {
            config.setAllowedHeaders(Arrays.asList(allowedHeaders.split(",")));
        }

        // Expose Authorization header so the browser can read it
        config.setExposedHeaders(List.of("Authorization", "X-Correlation-Id"));

        config.setAllowCredentials(allowCredentials);
        config.setMaxAge(maxAge);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
