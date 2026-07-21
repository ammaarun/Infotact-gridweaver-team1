package com.gridweaver;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
@Slf4j
@SpringBootApplication
@EnableCaching
@EnableAsync
@EnableScheduling
public class GridWeaverApplication {

    /**
     * Application entry point.
     *
     * @param args command-line arguments (e.g., {@code --spring.profiles.active=prod})
     */
    public static void main(String[] args) {
        SpringApplication.run(GridWeaverApplication.class, args);
    }

    /**
     * Logs a startup banner after the application context is fully initialized
     * and all beans are ready to serve requests.
     *
     * @param event the {@link ApplicationReadyEvent} fired by Spring Boot
     */
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady(ApplicationReadyEvent event) {
        log.info("=======================================================");
        log.info("  GridWeaver Backend is UP and ready to serve requests");
        log.info("  Active profiles : {}",
                String.join(", ", event.getApplicationContext().getEnvironment().getActiveProfiles()));
        log.info("=======================================================");
    }
}
