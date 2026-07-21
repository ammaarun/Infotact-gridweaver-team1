package com.gridweaver.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory registry tracking active WebSocket session IDs per user.
 *
 * <p>Enables:
 * <ul>
 *   <li>Per-user session count queries</li>
 *   <li>Presence detection (is a user currently connected?)</li>
 *   <li>Targeted session disconnection (e.g., on role change)</li>
 * </ul>
 *
 * <p><b>Scalability note</b>: This implementation is in-memory and node-local.
 * For multi-node deployments, replace with a Redis-backed registry using
 * {@code SADD}/{@code SREM} operations on a per-user session set.
 *
 * @author GridWeaver Team
 */
@Slf4j
@Component
public class WebSocketSessionRegistry {

    /**
     * Maps username → set of active session IDs.
     * Uses {@link ConcurrentHashMap} for thread safety under concurrent connect/disconnect.
     */
    private final Map<String, Set<String>> userSessions = new ConcurrentHashMap<>();

    /**
     * Registers a new session for a user.
     *
     * @param username  the user's identifier (email)
     * @param sessionId the WebSocket session ID
     */
    public void register(String username, String sessionId) {
        userSessions.computeIfAbsent(username, k -> ConcurrentHashMap.newKeySet()).add(sessionId);
        log.debug("Registered session {} for user {}", sessionId, username);
    }

    /**
     * Removes a session from the registry (on disconnect).
     *
     * @param sessionId the session ID to remove
     */
    public void unregister(String sessionId) {
        userSessions.forEach((username, sessions) -> {
            if (sessions.remove(sessionId)) {
                log.debug("Unregistered session {} for user {}", sessionId, username);
                if (sessions.isEmpty()) {
                    userSessions.remove(username);
                }
            }
        });
    }

    /**
     * Returns all active session IDs for the given user.
     *
     * @param username the user's identifier
     * @return unmodifiable set of session IDs (empty if user has no active sessions)
     */
    public Set<String> getSessionsForUser(String username) {
        return Collections.unmodifiableSet(
            userSessions.getOrDefault(username, Collections.emptySet()));
    }

    /**
     * Checks whether a user has at least one active WebSocket session.
     *
     * @param username the user's identifier
     * @return {@code true} if the user is currently connected
     */
    public boolean isConnected(String username) {
        Set<String> sessions = userSessions.get(username);
        return sessions != null && !sessions.isEmpty();
    }

    /**
     * Returns the total number of active WebSocket sessions across all users.
     *
     * @return total active session count
     */
    public int getTotalSessionCount() {
        return userSessions.values().stream().mapToInt(Set::size).sum();
    }
}
