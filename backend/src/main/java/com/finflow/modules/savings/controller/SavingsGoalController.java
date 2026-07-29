package com.finflow.modules.savings.controller;

import com.finflow.modules.savings.dto.*;
import com.finflow.modules.savings.service.SavingsGoalService;
import com.finflow.shared.dto.ApiResponse;
import com.finflow.shared.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/savings")
@Tag(name = "Savings", description = "Savings goal management")
@SecurityRequirement(name = "bearerAuth")
public class SavingsGoalController {

    private final SavingsGoalService service;

    public SavingsGoalController(SavingsGoalService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "List savings goals")
    public ResponseEntity<ApiResponse<Page<SavingsGoalResponse>>> getGoals(
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(service.getGoals(SecurityUtil.getCurrentUserId(), pageable)));
    }

    @GetMapping("/{goalId}")
    @Operation(summary = "Get savings goal details")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> getGoalById(@PathVariable UUID goalId) {
        return ResponseEntity.ok(ApiResponse.ok(service.getGoalById(SecurityUtil.getCurrentUserId(), goalId)));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a savings goal")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> createGoal(@Valid @RequestBody CreateSavingsGoalRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.createGoal(SecurityUtil.getCurrentUserId(), request)));
    }

    @PutMapping("/{goalId}")
    @Operation(summary = "Update a savings goal")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> updateGoal(@PathVariable UUID goalId,
                                                                        @RequestBody UpdateSavingsGoalRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(service.updateGoal(SecurityUtil.getCurrentUserId(), goalId, request)));
    }

    @PostMapping("/{goalId}/deposit")
    @Operation(summary = "Deposit to a savings goal")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> deposit(@PathVariable UUID goalId,
                                                                     @Valid @RequestBody DepositToSavingsGoalRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(service.deposit(SecurityUtil.getCurrentUserId(), goalId, request)));
    }

    @PutMapping("/{goalId}/pause")
    @Operation(summary = "Pause a savings goal")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> pauseGoal(@PathVariable UUID goalId) {
        return ResponseEntity.ok(ApiResponse.ok(service.pauseGoal(SecurityUtil.getCurrentUserId(), goalId)));
    }

    @PutMapping("/{goalId}/resume")
    @Operation(summary = "Resume a savings goal")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> resumeGoal(@PathVariable UUID goalId) {
        return ResponseEntity.ok(ApiResponse.ok(service.resumeGoal(SecurityUtil.getCurrentUserId(), goalId)));
    }

    @DeleteMapping("/{goalId}")
    @Operation(summary = "Cancel a savings goal")
    public ResponseEntity<ApiResponse<Void>> cancelGoal(@PathVariable UUID goalId) {
        service.cancelGoal(SecurityUtil.getCurrentUserId(), goalId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Savings goal cancelled successfully"));
    }
}
