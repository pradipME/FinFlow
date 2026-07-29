package com.finflow.shared.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI finFlowOpenAPI() {
        final String securitySchemeName = "Bearer Authentication";

        return new OpenAPI()
                .info(new Info()
                        .title("FinFlow API")
                        .description("FinFlow Digital Banking Platform — REST API")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("FinFlow Engineering")
                                .email("engineering@finflow.com"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://finflow.com/license")))
                .servers(List.of(
                        new Server().url("http://localhost:8080/api/v1").description("Development"),
                        new Server().url("https://api-staging.finflow.com/api/v1").description("Staging"),
                        new Server().url("https://api.finflow.com/api/v1").description("Production")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT token obtained from /auth/login")));
    }
}
