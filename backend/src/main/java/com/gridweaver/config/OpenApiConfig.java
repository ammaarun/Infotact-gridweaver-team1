package com.gridweaver.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * SpringDoc OpenAPI 3 / Swagger UI configuration.
 *
 * <p>Configures:
 * <ul>
 *   <li>API metadata (title, version, description, contact, license)</li>
 *   <li>JWT Bearer authentication scheme for the Swagger UI "Authorize" button</li>
 *   <li>Server URLs per environment</li>
 * </ul>
 *
 * <p>Access the UI at: {@code /swagger-ui.html}
 *
 * @author GridWeaver Team
 */
@Configuration
public class OpenApiConfig {

    private static final String BEARER_SCHEME = "bearerAuth";

    @Value("${server.port:8080}")
    private String serverPort;

    /**
     * Builds the central {@link OpenAPI} bean with metadata and JWT security scheme.
     *
     * @return the configured OpenAPI definition
     */
    @Bean
    public OpenAPI gridWeaverOpenApi() {
        return new OpenAPI()
            .info(apiInfo())
            .servers(List.of(
                new Server().url("http://localhost:" + serverPort).description("Development"),
                new Server().url("https://api.gridweaver.com").description("Production")
            ))
            .components(new Components()
                .addSecuritySchemes(BEARER_SCHEME, jwtSecurityScheme()))
            .addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME));
    }

    /**
     * API metadata for the Swagger UI info panel.
     */
    private Info apiInfo() {
        return new Info()
            .title("GridWeaver API")
            .description("""
                Enterprise-grade REST API for the GridWeaver platform.
                
                **Authentication**: Use `POST /api/v1/auth/login` to obtain a Bearer token,
                then click the **Authorize** button above and paste the token.
                """)
            .version("1.0.0")
            .contact(new Contact()
                .name("GridWeaver Engineering")
                .email("engineering@gridweaver.com")
                .url("https://gridweaver.com"))
            .license(new License()
                .name("Proprietary")
                .url("https://gridweaver.com/license"));
    }

    /**
     * Defines the JWT Bearer security scheme used by all secured endpoints.
     */
    private SecurityScheme jwtSecurityScheme() {
        return new SecurityScheme()
            .name(BEARER_SCHEME)
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")
            .description("Provide the JWT access token from /api/v1/auth/login");
    }
}
