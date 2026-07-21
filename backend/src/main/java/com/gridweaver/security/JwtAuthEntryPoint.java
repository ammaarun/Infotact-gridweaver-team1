package com.gridweaver.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Handles authentication failures by returning a structured JSON 401 response.
 *
 * <p>Invoked by Spring Security when an unauthenticated user attempts to access
 * a protected resource. Instead of the default HTML error page, this entry point
 * returns a machine-readable JSON body consistent with the application's error contract.
 *
 * @author GridWeaver Team
 */
@Slf4j
@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    /**
     * Constructor injection.
     *
     * @param objectMapper Jackson mapper for JSON serialization
     */
    public JwtAuthEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Writes a 401 Unauthorized JSON error response.
     *
     * @param request       the HTTP request that triggered the failure
     * @param response      the response to write the error body into
     * @param authException the authentication exception
     */
    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        log.warn("Unauthorized access attempt to [{}] — {}", request.getRequestURI(), authException.getMessage());

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success",   false);
        body.put("status",    401);
        body.put("message",   "Authentication required. Please provide a valid Bearer token.");
        body.put("path",      request.getRequestURI());
        body.put("timestamp", Instant.now().toString());

        objectMapper.writeValue(response.getOutputStream(), body);
    }
}
