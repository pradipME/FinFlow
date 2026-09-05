package com.finflow.modules.admin.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

/**
 * Incoming payload for an administrator creating a new customer record.
 *
 * <p>The admin provisions a full customer identity (email, username, phone) plus
 * an initial password. The CUSTOMER role is assigned automatically. Terms are
 * accepted on behalf of the customer at the point of provisioning.</p>
 */
@Schema(description = "Request payload to create a customer as an administrator")
public record AdminCreateCustomerRequest(

        @Schema(description = "Customer email address", example = "customer@finflow.com", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank
        @Size(min = 5, max = 254)
        @Email
        String email,

        @Schema(description = "Desired username (3-30 chars)", example = "customer_01", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank
        @Size(min = 3, max = 30)
        @Pattern(regexp = "^[a-zA-Z0-9_]+$")
        String username,

        @Schema(description = "Phone number in E.164 format", example = "+2348012345678", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank
        @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$")
        String phoneNumber,

        @Schema(description = "Initial password meeting security policy", example = "Str0ng!Pass#2026", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank
        @Size(min = 8, max = 128)
        @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$")
        String password
) {}