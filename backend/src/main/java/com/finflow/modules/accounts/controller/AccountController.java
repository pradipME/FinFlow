package com.finflow.modules.accounts.controller;

import com.finflow.modules.accounts.domain.AccountStatus;
import com.finflow.modules.accounts.domain.AccountType;
import com.finflow.modules.accounts.dto.*;
import com.finflow.modules.accounts.service.AccountService;
import com.finflow.shared.constants.RequestHeaders;
import com.finflow.shared.dto.ApiResponse;
import com.finflow.shared.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounts")
@Tag(name = "Accounts", description = "Account management endpoints")
public class AccountController {

    private static final Logger log = LoggerFactory.getLogger(AccountController.class);

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/{accountId}")
    @Operation(summary = "Get account details", description = "Returns full account details for the authenticated user.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Account found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Account not found")
    })
    public ResponseEntity<ApiResponse<AccountDetailResponse>> getAccount(
            @PathVariable UUID accountId) {
        AccountDetailResponse response = accountService.getAccount(accountId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    @Operation(summary = "List my accounts", description = "Returns a paginated list of accounts for the authenticated user.")
    public ResponseEntity<ApiResponse<PageResponse<AccountSummaryResponse>>> getMyAccounts(
            @RequestParam(required = false) AccountType accountType,
            @RequestParam(required = false) AccountStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<AccountSummaryResponse> response = accountService.getMyAccounts(accountType, status, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PatchMapping("/{accountId}")
    @Operation(summary = "Update account", description = "Updates account nickname or type.")
    public ResponseEntity<ApiResponse<AccountDetailResponse>> updateAccount(
            @PathVariable UUID accountId,
            @Valid @RequestBody UpdateAccountRequest request) {
        AccountDetailResponse response = accountService.updateAccount(accountId, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Account updated successfully"));
    }

    @PostMapping("/{accountId}/status")
    @Operation(summary = "Change account status", description = "Changes the status of an account.")
    public ResponseEntity<ApiResponse<AccountDetailResponse>> changeStatus(
            @PathVariable UUID accountId,
            @Valid @RequestBody ChangeStatusRequest request) {
        AccountDetailResponse response = accountService.changeStatus(accountId, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Account status changed successfully"));
    }

    @PostMapping("/{accountId}/close")
    @Operation(summary = "Close account", description = "Closes an account. Account must have zero balance.")
    public ResponseEntity<ApiResponse<AccountDetailResponse>> closeAccount(
            @PathVariable UUID accountId) {
        AccountDetailResponse response = accountService.closeAccount(accountId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Account closed successfully"));
    }

    @GetMapping("/{accountId}/history")
    @Operation(summary = "Get status history", description = "Returns the status change history for an account.")
    public ResponseEntity<ApiResponse<List<StatusHistoryResponse>>> getStatusHistory(
            @PathVariable UUID accountId) {
        List<StatusHistoryResponse> response = accountService.getStatusHistory(accountId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{accountId}/holds")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Place a hold", description = "Places a hold on the specified account.")
    public ResponseEntity<ApiResponse<HoldResponse>> placeHold(
            @PathVariable UUID accountId,
            @Valid @RequestBody PlaceHoldRequest request) {
        HoldResponse response = accountService.placeHold(accountId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Hold placed successfully"));
    }

    @PostMapping("/{accountId}/holds/{holdId}/release")
    @Operation(summary = "Release a hold", description = "Releases an active hold on the specified account.")
    public ResponseEntity<ApiResponse<HoldResponse>> releaseHold(
            @PathVariable UUID accountId,
            @PathVariable UUID holdId) {
        HoldResponse response = accountService.releaseHold(accountId, holdId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Hold released successfully"));
    }

    @GetMapping("/{accountId}/holds")
    @Operation(summary = "List active holds", description = "Returns all active holds for the specified account.")
    public ResponseEntity<ApiResponse<List<HoldResponse>>> getActiveHolds(
            @PathVariable UUID accountId) {
        List<HoldResponse> response = accountService.getActiveHolds(accountId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
