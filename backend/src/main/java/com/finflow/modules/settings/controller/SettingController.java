package com.finflow.modules.settings.controller;

import com.finflow.modules.settings.dto.BulkUpdateSettingsRequest;
import com.finflow.modules.settings.dto.SettingResponse;
import com.finflow.modules.settings.dto.UpdateSettingRequest;
import com.finflow.modules.settings.service.SettingService;
import com.finflow.shared.dto.ApiResponse;
import com.finflow.shared.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/settings")
@Tag(name = "Settings", description = "User settings management endpoints")
public class SettingController {

    private static final Logger log = LoggerFactory.getLogger(SettingController.class);

    private final SettingService settingService;

    public SettingController(SettingService settingService) {
        this.settingService = settingService;
    }

    @GetMapping
    @Operation(summary = "Get all user settings")
    public ResponseEntity<ApiResponse<List<SettingResponse>>> getSettings() {
        String userId = SecurityUtil.getCurrentUserId();
        List<SettingResponse> settings = settingService.getSettings(userId);
        return ResponseEntity.ok(ApiResponse.ok(settings));
    }

    @GetMapping("/{key}")
    @Operation(summary = "Get a specific setting by key")
    public ResponseEntity<ApiResponse<SettingResponse>> getSetting(@PathVariable String key) {
        String userId = SecurityUtil.getCurrentUserId();
        SettingResponse setting = settingService.getSetting(userId, key);
        return ResponseEntity.ok(ApiResponse.ok(setting));
    }

    @PatchMapping("/{key}")
    @Operation(summary = "Update a specific setting")
    public ResponseEntity<ApiResponse<SettingResponse>> updateSetting(
            @PathVariable String key,
            @Valid @RequestBody UpdateSettingRequest request) {
        String userId = SecurityUtil.getCurrentUserId();
        SettingResponse setting = settingService.updateSetting(userId, key, request);
        return ResponseEntity.ok(ApiResponse.ok(setting, "Setting updated successfully"));
    }

    @PutMapping("/bulk")
    @Operation(summary = "Bulk update settings")
    public ResponseEntity<ApiResponse<List<SettingResponse>>> bulkUpdateSettings(
            @Valid @RequestBody BulkUpdateSettingsRequest request) {
        String userId = SecurityUtil.getCurrentUserId();
        List<SettingResponse> settings = settingService.bulkUpdate(userId, request);
        return ResponseEntity.ok(ApiResponse.ok(settings, "Settings updated successfully"));
    }

    @DeleteMapping("/{key}")
    @Operation(summary = "Delete a specific setting")
    public ResponseEntity<ApiResponse<Void>> deleteSetting(@PathVariable String key) {
        String userId = SecurityUtil.getCurrentUserId();
        settingService.deleteSetting(userId, key);
        return ResponseEntity.ok(ApiResponse.ok(null, "Setting deleted successfully"));
    }
}
