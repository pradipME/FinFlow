package com.finflow.modules.transfers.controller;

import com.finflow.modules.transfers.dto.*;
import com.finflow.modules.transfers.service.TransferService;
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
@RequestMapping("/api/v1/transfers")
@Tag(name = "Transfers", description = "Transfer templates and scheduled transfers")
@SecurityRequirement(name = "bearerAuth")
public class TransferController {

    private final TransferService transferService;

    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    // ── Templates ──────────────────────────────────────────────

    @GetMapping("/templates")
    @Operation(summary = "List transfer templates")
    public ResponseEntity<ApiResponse<Page<TemplateResponse>>> getTemplates(
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(transferService.getTemplates(SecurityUtil.getCurrentUserId(), pageable)));
    }

    @GetMapping("/templates/{templateId}")
    @Operation(summary = "Get a transfer template by ID")
    public ResponseEntity<ApiResponse<TemplateResponse>> getTemplateById(@PathVariable UUID templateId) {
        return ResponseEntity.ok(ApiResponse.ok(transferService.getTemplateById(SecurityUtil.getCurrentUserId(), templateId)));
    }

    @PostMapping("/templates")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a transfer template")
    public ResponseEntity<ApiResponse<TemplateResponse>> createTemplate(@Valid @RequestBody CreateTemplateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(transferService.createTemplate(SecurityUtil.getCurrentUserId(), request)));
    }

    @PutMapping("/templates/{templateId}")
    @Operation(summary = "Update a transfer template")
    public ResponseEntity<ApiResponse<TemplateResponse>> updateTemplate(@PathVariable UUID templateId,
                                                                        @RequestBody UpdateTemplateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(transferService.updateTemplate(SecurityUtil.getCurrentUserId(), templateId, request)));
    }

    @DeleteMapping("/templates/{templateId}")
    @Operation(summary = "Cancel a transfer template")
    public ResponseEntity<ApiResponse<Void>> deleteTemplate(@PathVariable UUID templateId) {
        transferService.deleteTemplate(SecurityUtil.getCurrentUserId(), templateId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Template cancelled successfully"));
    }

    // ── Scheduled Transfers ────────────────────────────────────

    @GetMapping("/scheduled")
    @Operation(summary = "List scheduled transfers")
    public ResponseEntity<ApiResponse<Page<ScheduledTransferResponse>>> getScheduledTransfers(
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(transferService.getScheduledTransfers(SecurityUtil.getCurrentUserId(), pageable)));
    }

    @GetMapping("/scheduled/{transferId}")
    @Operation(summary = "Get a scheduled transfer by ID")
    public ResponseEntity<ApiResponse<ScheduledTransferResponse>> getScheduledTransferById(@PathVariable UUID transferId) {
        return ResponseEntity.ok(ApiResponse.ok(transferService.getScheduledTransferById(SecurityUtil.getCurrentUserId(), transferId)));
    }

    @PostMapping("/scheduled")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a scheduled transfer")
    public ResponseEntity<ApiResponse<ScheduledTransferResponse>> createScheduledTransfer(
            @Valid @RequestBody CreateScheduledTransferRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(transferService.createScheduledTransfer(SecurityUtil.getCurrentUserId(), request)));
    }

    @PutMapping("/scheduled/{transferId}/pause")
    @Operation(summary = "Pause a scheduled transfer")
    public ResponseEntity<ApiResponse<ScheduledTransferResponse>> pauseScheduledTransfer(@PathVariable UUID transferId) {
        return ResponseEntity.ok(ApiResponse.ok(transferService.pauseScheduledTransfer(SecurityUtil.getCurrentUserId(), transferId)));
    }

    @PutMapping("/scheduled/{transferId}/resume")
    @Operation(summary = "Resume a paused scheduled transfer")
    public ResponseEntity<ApiResponse<ScheduledTransferResponse>> resumeScheduledTransfer(@PathVariable UUID transferId) {
        return ResponseEntity.ok(ApiResponse.ok(transferService.resumeScheduledTransfer(SecurityUtil.getCurrentUserId(), transferId)));
    }

    @DeleteMapping("/scheduled/{transferId}")
    @Operation(summary = "Cancel a scheduled transfer")
    public ResponseEntity<ApiResponse<Void>> cancelScheduledTransfer(@PathVariable UUID transferId) {
        transferService.cancelScheduledTransfer(SecurityUtil.getCurrentUserId(), transferId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Scheduled transfer cancelled successfully"));
    }
}
