package com.gridweaver.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

/**
 * Scheduling configuration for background scheduled tasks.
 *
 * <p>Provides a dedicated {@link ThreadPoolTaskScheduler} for {@code @Scheduled} methods,
 * preventing a single scheduling thread from becoming a bottleneck when multiple tasks
 * fire simultaneously.
 *
 * <p>Examples of scheduled tasks in GridWeaver:
 * <ul>
 *   <li>Expired refresh token cleanup (daily)</li>
 *   <li>Health metric collection (every 5 minutes)</li>
 * </ul>
 *
 * @author GridWeaver Team
 */
@Configuration
public class SchedulingConfig implements SchedulingConfigurer {

    /**
     * Configures the task registrar with a pooled task scheduler.
     * Uses 4 threads to allow concurrent scheduled tasks without queuing.
     *
     * @param taskRegistrar the task registrar provided by Spring
     */
    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(4);
        scheduler.setThreadNamePrefix("gridweaver-scheduler-");
        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        scheduler.setAwaitTerminationSeconds(30);
        scheduler.initialize();
        taskRegistrar.setTaskScheduler(scheduler);
    }
}
