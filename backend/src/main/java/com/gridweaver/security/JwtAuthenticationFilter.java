package com.gridweaver.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT authentication filter that runs once per HTTP request.
 *
 * <p>Lifecycle for every request:
 * <ol>
 *   <li>Extract {@code Authorization: Bearer &lt;token&gt;} header</li>
 *   <li>Validate the token via {@link JwtTokenProvider}</li>
 *   <li>Load {@link UserDetails} from {@link CustomUserDetailsService}</li>
 *   <li>Set {@link UsernamePasswordAuthenticationToken} in the {@link SecurityContextHolder}</li>
 *   <li>Continue the filter chain</li>
 * </ol>
 *
 * <p>If any step fails, the filter logs the reason and proceeds without setting
 * authentication — Spring Security then returns 401 for protected resources.
 *
 * @author GridWeaver Team
 */
@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX         = "Bearer ";

    private final JwtTokenProvider       jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    /**
     * Constructor injection (no field injection).
     *
     * @param jwtTokenProvider   token validation and claims extraction
     * @param userDetailsService loads UserDetails by email from the database
     */
    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider,
                                   CustomUserDetailsService userDetailsService) {
        this.jwtTokenProvider  = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Core filter logic executed once per request.
     *
     * @param request     the incoming HTTP request
     * @param response    the outgoing HTTP response
     * @param filterChain the remaining filter chain
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String token = extractBearerToken(request);

            if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
                authenticateRequest(token, request);
            }
        } catch (Exception ex) {
            log.error("Could not set user authentication in security context: {}", ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Extracts the raw JWT string from the {@code Authorization} header.
     *
     * @param request the HTTP request
     * @return the JWT string, or {@code null} if not present / not a Bearer token
     */
    private String extractBearerToken(HttpServletRequest request) {
        String headerValue = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(headerValue) && headerValue.startsWith(BEARER_PREFIX)) {
            return headerValue.substring(BEARER_PREFIX.length());
        }
        return null;
    }

    /**
     * Loads user details, builds an {@link UsernamePasswordAuthenticationToken}, and
     * sets it into the {@link SecurityContextHolder}.
     *
     * @param token   the validated JWT string
     * @param request the current HTTP request (used for web authentication details)
     */
    private void authenticateRequest(String token, HttpServletRequest request) {
        String email       = jwtTokenProvider.getEmailFromToken(token);
        UserDetails details = userDetailsService.loadUserByUsername(email);

        UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(details, null, details.getAuthorities());

        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        log.debug("Authenticated user '{}' via JWT", email);
    }
}
