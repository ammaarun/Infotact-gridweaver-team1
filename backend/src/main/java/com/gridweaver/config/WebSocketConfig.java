package com.gridweaver.config;

import com.gridweaver.websocket.WebSocketAuthInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket + STOMP broker configuration.
 *
 * <p>Architecture:
 * <ul>
 *   <li>STOMP endpoint: {@code /ws} (with SockJS fallback)</li>
 *   <li>Application destination prefix: {@code /app} (routes to {@code @MessageMapping})</li>
 *   <li>Broker prefix: {@code /topic} (broadcast), {@code /user} (per-user queue)</li>
 *   <li>JWT validation on CONNECT frame via {@link WebSocketAuthInterceptor}</li>
 *   <li>Heartbeat: 10s — requires a {@link TaskScheduler} bean</li>
 * </ul>
 *
 * <p>For multi-node deployments, replace the in-memory broker with a full STOMP broker
 * relay backed by RabbitMQ or ActiveMQ (add the relay dependency and configure here).
 *
 * @author GridWeaver Team
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    public WebSocketConfig(WebSocketAuthInterceptor webSocketAuthInterceptor) {
        this.webSocketAuthInterceptor = webSocketAuthInterceptor;
    }

    /**
     * Dedicated {@link TaskScheduler} for WebSocket heartbeat management.
     * Spring requires this when heartbeat values are configured on the simple broker.
     *
     * @return the task scheduler bean
     */
    @Bean
    public TaskScheduler webSocketHeartbeatScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(2);
        scheduler.setThreadNamePrefix("ws-heartbeat-");
        scheduler.initialize();
        return scheduler;
    }

    /**
     * Registers the STOMP endpoint and enables SockJS fallback for environments
     * that do not support native WebSocket (e.g., some corporate proxies).
     *
     * @param registry the endpoint registry
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
            .setAllowedOriginPatterns("*")
            .withSockJS()
                .setHeartbeatTime(10_000)
                .setDisconnectDelay(5_000);
    }

    /**
     * Configures the message broker:
     * <ul>
     *   <li>{@code /topic/**} — broadcast topics (subscribe for group updates)</li>
     *   <li>{@code /user/**} — per-user private queues</li>
     *   <li>{@code /app/**} — routed to {@code @MessageMapping} handler methods</li>
     * </ul>
     *
     * @param registry the broker registry
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/user")
            .setHeartbeatValue(new long[]{10_000, 10_000})
            .setTaskScheduler(webSocketHeartbeatScheduler());
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }

    /**
     * Registers the JWT authentication interceptor on the inbound STOMP channel.
     * This fires on every STOMP frame, validating tokens on CONNECT.
     *
     * @param registration the channel registration
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(webSocketAuthInterceptor);
    }
}
