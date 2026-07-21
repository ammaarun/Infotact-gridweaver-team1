package com.gridweaver.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

/**
 * Listener for WebSocket session lifecycle events.
 *
 * <p>Handles:
 * <ul>
 *   <li>{@link SessionConnectedEvent} — fires when a STOMP connection is fully established</li>
 *   <li>{@link SessionDisconnectEvent} — fires when a client disconnects (explicit or timeout)</li>
 * </ul>
 *
 * <p>Integrates with {@link WebSocketSessionRegistry} to track active sessions.
 *
 * @author GridWeaver Team
 */
@Slf4j
@Component
public class WebSocketEventListener {

    private final WebSocketSessionRegistry sessionRegistry;

    public WebSocketEventListener(WebSocketSessionRegistry sessionRegistry) {
        this.sessionRegistry = sessionRegistry;
    }

    /**
     * Handles successful STOMP session establishment.
     * Registers the session in {@link WebSocketSessionRegistry}.
     *
     * @param event the connection event
     */
    @EventListener
    public void onSessionConnected(SessionConnectedEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId  = accessor.getSessionId();
        String username   = event.getUser() != null ? event.getUser().getName() : "anonymous";

        if (sessionId != null && event.getUser() != null) {
            sessionRegistry.register(username, sessionId);
            log.info("WebSocket session CONNECTED: sessionId={}, user={}", sessionId, username);
        }
    }

    /**
     * Handles client disconnection.
     * Removes the session from {@link WebSocketSessionRegistry}.
     *
     * @param event the disconnection event
     */
    @EventListener
    public void onSessionDisconnected(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        String username  = event.getUser() != null ? event.getUser().getName() : "anonymous";

        if (sessionId != null) {
            sessionRegistry.unregister(sessionId);
            log.info("WebSocket session DISCONNECTED: sessionId={}, user={}", sessionId, username);
        }
    }
}
