package com.finflow.modules.profiles.controller;

import com.finflow.modules.profiles.dto.UpdateProfileRequest;
import com.finflow.modules.profiles.dto.UserProfileResponse;
import com.finflow.modules.profiles.service.UserProfileService;
import com.finflow.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@Tag(name = "Profile", description = "User profile management endpoints")
public class UserProfileController {

    private static final Logger log = LoggerFactory.getLogger(UserProfileController.class);

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping
    @Operation(summary = "Get current user profile", description = "Returns the profile for the authenticated user. Creates a default profile if none exists.")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile() {
        UserProfileResponse response = userProfileService.getProfile();
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PatchMapping
    @Operation(summary = "Update current user profile", description = "Updates the profile for the authenticated user. Only provided fields are updated.")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        log.info("Update profile request");
        UserProfileResponse response = userProfileService.updateProfile(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Profile updated successfully"));
    }
}
