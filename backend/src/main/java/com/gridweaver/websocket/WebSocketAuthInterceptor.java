package com.gridweaver.websocket;

import com.gridweaver.security.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * STOMP channel interceptor that validates JWT tokens on WebSocket CONNECT frames.
 *
 * <p>Fires on every inbound STOMP frame. Only the {@code CONNECT} command triggers
 * token validation — subsequent frames (SUBSCRIBE, SEND) are passed through
 * once the principal is established in the session.
 *
 * <p>On a valid token, the authenticated {@link UsernamePasswordAuthenticationToken}
 * is set as the session user, enabling:
 * <ul>
 *   <li>{@code @AuthenticationPrincipal} in message handlers</li>
 *   <li>{@code SimpMessagingTemplate.convertAndSendToUser()} routing</li>
 * </ul>
 *
 * @author GridWeaver Team
 */
@Slf4j
@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider    jwtTokenProvider;
    private final UserDetailsService  userDetailsService;

    public WebSocketAuthInterceptor(JwtTokenProvider jwtTokenProvider,
                                    UserDetailsService userDetailsService) {
        this.jwtTokenProvider  = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Intercepts inbound messages before they are forwarded to the message broker.
     * Validates JWT on CONNECT frames only.
     *
     * @param message the inbound STOMP message
     * @param channel the inbound channel
     * @return the (possibly modified) message, or {@code null} to suppress it
     */
    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
        StompHeaderAccessor accessor =
            MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String token = extractToken(accessor);

            if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
                String email = jwtTokenProvider.getEmailFromToken(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                accessor.setUser(authentication);
                log.debug("WebSocket CONNECT authenticated for user: {}", email);
            } else {
                log.warn("WebSocket CONNECT rejected — invalid or missing JWT");
                // Return null to reject the connection
                return null;
            }
        }

        return message;
    }

    /**
     * Extracts the JWT token from the {@code Authorization} STOMP header.
     *
     * @param accessor the STOMP header accessor
     * @return the raw JWT string, or {@code null} if not found
     */
    private String extractToken(StompHeaderAccessor accessor) {
        String authHeader = accessor.getFirstNativeHeader("Authorization");
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
