package com.finflow.modules.profiles.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request body for updating user profile")
public record UpdateProfileRequest(
        @Schema(description = "First name", example = "John")
        String firstName,

        @Schema(description = "Last name", example = "Doe")
        String lastName,

        @Schema(description = "Date of birth (YYYY-MM-DD)", example = "1990-01-15")
        String dateOfBirth,

        @Schema(description = "Address line 1", example = "123 Main St")
        String addressLine1,

        @Schema(description = "Address line 2", example = "Apt 4B")
        String addressLine2,

        @Schema(description = "City", example = "New York")
        String city,

        @Schema(description = "State", example = "NY")
        String state,

        @Schema(description = "Postal code", example = "10001")
        String postalCode,

        @Schema(description = "Country code (ISO 3166-1 alpha-2)", example = "US")
        String country,

        @Schema(description = "Avatar URL")
        String avatarUrl
) {}
