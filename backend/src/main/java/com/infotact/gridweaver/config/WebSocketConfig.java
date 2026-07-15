package com.infotact.gridweaver.config;

import com.infotact.gridweaver.websocket.TelemetryWebSocketHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final TelemetryWebSocketHandler telemetryWebSocketHandler;

    public WebSocketConfig(TelemetryWebSocketHandler telemetryWebSocketHandler) {
        this.telemetryWebSocketHandler = telemetryWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Every IoT node (real or simulated) connects here.
        registry.addHandler(telemetryWebSocketHandler, "/ws/ingest")
                .setAllowedOrigins("*"); // tighten in Week 4 (Security & Deployment)
    }
}