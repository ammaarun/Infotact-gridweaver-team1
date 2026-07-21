package com.gridweaver.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Global Jackson {@link ObjectMapper} configuration.
 *
 * <p>Provides a single, consistently configured {@link ObjectMapper} bean shared
 * across the entire application (REST serialization, Redis caching, etc.).
 *
 * <p>Key decisions:
 * <ul>
 *   <li>Dates serialized as ISO-8601 strings, not timestamps</li>
 *   <li>Null fields excluded from responses</li>
 *   <li>Unknown properties ignored during deserialization</li>
 *   <li>snake_case property naming for API consistency</li>
 * </ul>
 *
 * @author GridWeaver Team
 */
@Configuration
public class JacksonConfig {

    /**
     * Primary {@link ObjectMapper} bean used by Spring MVC, Redis serializers, and services.
     *
     * @return the configured mapper
     */
    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();

        // Register Java 8+ time types (Instant, LocalDate, etc.)
        mapper.registerModule(new JavaTimeModule());

        // Serialize dates as ISO-8601 strings, not numeric timestamps
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // Don't fail on unknown JSON properties — forward-compatible API
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

        // Exclude null fields from serialized output
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);

        // Use snake_case for all JSON property names
        mapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);

        // Prevent serialization failure on empty beans
        mapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);

        return mapper;
    }
}
