package com.gridweaver.websocket;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.Instant;
import java.util.Map;

/**
 * WebSocket message handler for real-time notifications.
 *
 * <p>Handles STOMP messages routed via {@code /app/**} destinations.
 * Responses are published to either:
 * <ul>
 *   <li>{@code /topic/notifications} — broadcast to all subscribers</li>
 *   <li>{@code /user/{userId}/queue/private} — targeted delivery to a specific user</li>
 * </ul>
 *
 * @author GridWeaver Team
 */
@Slf4j
@Controller
@Tag(name = "WebSocket", description = "Real-time notification endpoints via STOMP")
public class NotificationController {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Receives a ping from the client and echoes back a pong to the sender.
     * Useful for connection health monitoring.
     *
     * @param principal the authenticated user principal
     */
    @MessageMapping("/ping")
    @SendToUser("/queue/private")
    public Map<String, Object> ping(Principal principal) {
        log.debug("WebSocket ping received from: {}", principal.getName());
        return Map.of(
            "type",      "pong",
            "timestamp", Instant.now().toString(),
            "user",      principal.getName()
        );
    }

    /**
     * Broadcasts a notification to all connected clients on the global topic.
     * Intended for server-initiated broadcasts (called programmatically from services).
     *
     * @param payload the notification payload
     */
    public void broadcastNotification(Map<String, Object> payload) {
        log.debug("Broadcasting notification to all connected clients");
        messagingTemplate.convertAndSend("/topic/notifications", payload);
    }

    /**
     * Sends a private notification to a specific user.
     * The user must be subscribed to {@code /user/queue/private}.
     *
     * @param username the target user's email (principal name)
     * @param payload  the notification payload
     */
    public void sendToUser(String username, Map<String, Object> payload) {
        log.debug("Sending private notification to user: {}", username);
        messagingTemplate.convertAndSendToUser(username, "/queue/private", payload);
    }
}
