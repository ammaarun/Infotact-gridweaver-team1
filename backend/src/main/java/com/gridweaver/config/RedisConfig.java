package com.gridweaver.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Redis infrastructure configuration.
 *
 * <p>Configures:
 * <ul>
 *   <li>{@link RedisTemplate} with String key + JSON value serialization</li>
 *   <li>{@link RedisCacheManager} with per-cache TTL overrides</li>
 * </ul>
 *
 * <p>The Lettuce connection factory is auto-configured by Spring Boot from
 * {@code spring.data.redis.*} properties. This class only customizes serialization
 * and cache behavior.
 *
 * @author GridWeaver Team
 */
@Configuration
public class RedisConfig {

    private final ObjectMapper objectMapper;

    public RedisConfig(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * General-purpose {@link RedisTemplate} using String keys and JSON-serialized values.
     * Used for programmatic cache operations (e.g., token blacklist, session data).
     *
     * @param factory the Lettuce connection factory (auto-configured)
     * @return the configured {@link RedisTemplate}
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        StringRedisSerializer            stringSerializer = new StringRedisSerializer();
        GenericJackson2JsonRedisSerializer jsonSerializer  = new GenericJackson2JsonRedisSerializer(objectMapper);

        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);
        template.afterPropertiesSet();

        return template;
    }

    /**
     * Configures {@link RedisCacheManager} with a global default TTL (10 minutes)
     * and per-cache TTL overrides for fine-grained control.
     *
     * @param factory the Redis connection factory
     * @return the cache manager
     */
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer(objectMapper);

        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .disableCachingNullValues()
            .serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(jsonSerializer));

        // Per-cache TTL overrides
        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();
        cacheConfigs.put("users",       defaultConfig.entryTtl(Duration.ofMinutes(5)));
        cacheConfigs.put("roles",       defaultConfig.entryTtl(Duration.ofHours(1)));
        cacheConfigs.put("permissions", defaultConfig.entryTtl(Duration.ofHours(2)));

        return RedisCacheManager.builder(factory)
            .cacheDefaults(defaultConfig)
            .withInitialCacheConfigurations(cacheConfigs)
            .transactionAware()
            .build();
    }
}
