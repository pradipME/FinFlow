package com.finflow.modules.profiles.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User profile response DTO")
public record UserProfileResponse(
        @Schema(description = "Profile ID")
        String id,

        @Schema(description = "User ID")
        String userId,

        @Schema(description = "First name")
        String firstName,

        @Schema(description = "Last name")
        String lastName,

        @Schema(description = "Date of birth")
        String dateOfBirth,

        @Schema(description = "Address line 1")
        String addressLine1,

        @Schema(description = "Address line 2")
        String addressLine2,

        @Schema(description = "City")
        String city,

        @Schema(description = "State")
        String state,

        @Schema(description = "Postal code")
        String postalCode,

        @Schema(description = "Country code")
        String country,

        @Schema(description = "Avatar URL")
        String avatarUrl,

        @Schema(description = "Created at")
        String createdAt,

        @Schema(description = "Last updated timestamp")
        String updatedAt
) {}
