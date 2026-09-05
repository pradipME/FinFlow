package com.finflow.modules.admin.controller;

import com.finflow.modules.admin.dto.AdminCreateAccountRequest;
import com.finflow.modules.admin.dto.AdminCreateCustomerRequest;
import com.finflow.modules.admin.dto.AdminDashboardResponse;
import com.finflow.modules.admin.dto.AuditLogResponse;
import com.finflow.modules.admin.dto.CustomerDetailResponse;
import com.finflow.modules.admin.dto.FundAccountRequest;
import com.finflow.modules.admin.dto.UserManagementResponse;
import com.finflow.modules.admin.service.AdminService;
import com.finflow.modules.accounts.dto.AccountDetailResponse;
import com.finflow.modules.cards.dto.CardResponse;
import com.finflow.modules.requests.domain.CustomerRequestStatus;
import com.finflow.modules.requests.dto.CustomerRequestResponse;
import com.finflow.modules.requests.dto.ReviewRequestRequest;
import com.finflow.modules.requests.service.RequestService;
import com.finflow.modules.transactions.dto.TransactionDetailResponse;
import com.finflow.modules.transactions.dto.TransactionSummaryResponse;
import com.finflow.shared.dto.ApiResponse;
import com.finflow.shared.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin", description = "Platform administration endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;
    private final RequestService requestService;

    public AdminController(AdminService adminService, RequestService requestService) {
        this.adminService = adminService;
        this.requestService = requestService;
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "List all audit logs")
    public ResponseEntity<ApiResponse<PageResponse<AuditLogResponse>>> getAuditLogs(
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAuditLogs(pageable)));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard statistics")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    @Operation(summary = "List users for management")
    public ResponseEntity<ApiResponse<PageResponse<UserManagementResponse>>> getUsers(
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getUserList(pageable)));
    }

    // ---------------- Customers ----------------

    @PostMapping("/customers")
    @Operation(summary = "Provision a new customer as an administrator")
    public ResponseEntity<ApiResponse<UserManagementResponse>> createCustomer(
            @Valid @RequestBody AdminCreateCustomerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(adminService.createCustomer(request), "Customer created"));
    }

    @GetMapping("/users/{userId}")
    @Operation(summary = "Get detailed customer view for management")
    public ResponseEntity<ApiResponse<CustomerDetailResponse>> getUserDetails(
            @PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getUserDetails(userId)));
    }

    @GetMapping("/users/{userId}/cards")
    @Operation(summary = "List all cards held by a customer")
    public ResponseEntity<ApiResponse<PageResponse<CardResponse>>> getCardsByUser(
            @PathVariable String userId,
            @PageableDefault(page = 0, size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getCardsByUser(userId, pageable)));
    }

    // ---------------- Accounts ----------------

    @GetMapping("/accounts")
    @Operation(summary = "List all accounts")
    public ResponseEntity<ApiResponse<PageResponse<AccountDetailResponse>>> getAccounts(
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAccounts(pageable)));
    }

    @GetMapping("/accounts/{accountId}")
    @Operation(summary = "Get a single account")
    public ResponseEntity<ApiResponse<AccountDetailResponse>> getAccount(
            @PathVariable UUID accountId) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAccount(accountId)));
    }

    @PostMapping("/accounts")
    @Operation(summary = "Create an account for a customer")
    public ResponseEntity<ApiResponse<AccountDetailResponse>> createAccount(
            @Valid @RequestBody AdminCreateAccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(adminService.createAccountForCustomer(request), "Account created"));
    }

    @PostMapping("/accounts/{accountId}/fund")
    @Operation(summary = "Fund (credit) a customer account")
    public ResponseEntity<ApiResponse<TransactionDetailResponse>> fundAccount(
            @PathVariable UUID accountId, @Valid @RequestBody FundAccountRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.fundAccount(accountId, request), "Account funded"));
    }

    @GetMapping("/users/{userId}/accounts")
    @Operation(summary = "List accounts for a customer")
    public ResponseEntity<ApiResponse<PageResponse<AccountDetailResponse>>> getAccountsByUser(
            @PathVariable String userId,
            @PageableDefault(page = 0, size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAccountsByUser(userId, pageable)));
    }

    // ---------------- Cards ----------------

    @GetMapping("/cards")
    @Operation(summary = "List all cards")
    public ResponseEntity<ApiResponse<PageResponse<CardResponse>>> getCards(
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getCards(pageable)));
    }

    @GetMapping("/cards/{cardId}")
    @Operation(summary = "Get a single card")
    public ResponseEntity<ApiResponse<CardResponse>> getCard(
            @PathVariable UUID cardId) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getCard(cardId)));
    }

    @GetMapping("/accounts/{accountId}/cards")
    @Operation(summary = "List cards linked to an account")
    public ResponseEntity<ApiResponse<PageResponse<CardResponse>>> getCardsByAccount(
            @PathVariable String accountId) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getCardsByAccount(accountId)));
    }

    // ---------------- Transactions ----------------

    @GetMapping("/transactions")
    @Operation(summary = "List all transactions")
    public ResponseEntity<ApiResponse<PageResponse<TransactionSummaryResponse>>> getTransactions(
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getTransactions(pageable)));
    }

    @GetMapping("/transactions/{transactionId}")
    @Operation(summary = "Get a single transaction")
    public ResponseEntity<ApiResponse<TransactionDetailResponse>> getTransaction(
            @PathVariable UUID transactionId) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getTransaction(transactionId)));
    }

    // ---------------- Customer requests ----------------

    @GetMapping("/requests")
    @Operation(summary = "List all customer requests (optionally by status)")
    public ResponseEntity<ApiResponse<PageResponse<CustomerRequestResponse>>> getRequests(
            @RequestParam(required = false) CustomerRequestStatus status,
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(requestService.getAllRequests(status, pageable)));
    }

    @PostMapping("/requests/{requestId}/approve")
    @Operation(summary = "Approve a customer request (creates the underlying resource)")
    public ResponseEntity<ApiResponse<CustomerRequestResponse>> approveRequest(
            @PathVariable UUID requestId) {
        return ResponseEntity.ok(ApiResponse.ok(requestService.approve(requestId), "Request approved"));
    }

    @PostMapping("/requests/{requestId}/reject")
    @Operation(summary = "Reject a customer request")
    public ResponseEntity<ApiResponse<CustomerRequestResponse>> rejectRequest(
            @PathVariable UUID requestId,
            @Valid @RequestBody(required = false) ReviewRequestRequest body) {
        String reason = body != null ? body.rejectionReason() : null;
        return ResponseEntity.ok(ApiResponse.ok(requestService.reject(requestId, reason), "Request rejected"));
    }
}