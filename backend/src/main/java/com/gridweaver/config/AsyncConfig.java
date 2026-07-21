package com.gridweaver.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Async task execution configuration.
 *
 * <p>Provides a named {@link ThreadPoolTaskExecutor} for {@code @Async} methods
 * throughout the application. Separates async task threads from the main request
 * threads to prevent resource contention.
 *
 * <p>With Java 21 Virtual Threads enabled globally, this executor primarily governs
 * task naming and rejection handling for observability purposes.
 *
 * @author GridWeaver Team
 */
@Configuration
public class AsyncConfig implements AsyncConfigurer {

    /**
     * Configures the default executor for all {@code @Async} methods.
     *
     * <p>Thread pool sizing:
     * <ul>
     *   <li>Core pool: 4 — always-running threads for immediate task pickup</li>
     *   <li>Max pool: 20 — burst capacity</li>
     *   <li>Queue capacity: 200 — task backlog before rejection</li>
     * </ul>
     *
     * @return the configured {@link Executor}
     */
    @Bean(name = "taskExecutor")
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(200);
        executor.setThreadNamePrefix("gridweaver-async-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);
        executor.initialize();
        return executor;
    }
}
