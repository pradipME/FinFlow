package com.finflow.modules.transactions.controller;

import com.finflow.modules.transactions.domain.TransactionStatus;
import com.finflow.modules.transactions.domain.TransactionType;
import com.finflow.modules.transactions.dto.*;
import com.finflow.modules.transactions.service.TransactionService;
import com.finflow.shared.constants.RequestHeaders;
import com.finflow.shared.dto.ApiResponse;
import com.finflow.shared.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transactions")
@Tag(name = "Transactions", description = "Transaction management endpoints")
public class TransactionController {

    private static final Logger log = LoggerFactory.getLogger(TransactionController.class);

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/deposit")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a deposit", description = "Deposits funds into an account.")
    public ResponseEntity<ApiResponse<TransactionDetailResponse>> createDeposit(
            @Valid @RequestBody DepositRequest request,
            @RequestHeader(value = RequestHeaders.IDEMPOTENCY_KEY, required = false) String idempotencyKey) {
        if (idempotencyKey != null) {
            request = new DepositRequest(request.accountId(), request.amountCents(),
                    request.currency(), request.description(), idempotencyKey);
        }
        log.info("Deposit request: accountId={}, amountCents={}", request.accountId(), request.amountCents());
        TransactionDetailResponse response = transactionService.createDeposit(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Deposit completed successfully"));
    }

    @PostMapping("/withdrawal")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a withdrawal", description = "Withdraws funds from an account.")
    public ResponseEntity<ApiResponse<TransactionDetailResponse>> createWithdrawal(
            @Valid @RequestBody WithdrawalRequest request,
            @RequestHeader(value = RequestHeaders.IDEMPOTENCY_KEY, required = false) String idempotencyKey) {
        if (idempotencyKey != null) {
            request = new WithdrawalRequest(request.accountId(), request.amountCents(),
                    request.currency(), request.description(), idempotencyKey);
        }
        log.info("Withdrawal request: accountId={}, amountCents={}", request.accountId(), request.amountCents());
        TransactionDetailResponse response = transactionService.createWithdrawal(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Withdrawal completed successfully"));
    }

    @PostMapping("/transfer")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a transfer", description = "Transfers funds between two accounts.")
    public ResponseEntity<ApiResponse<TransactionDetailResponse>> createTransfer(
            @Valid @RequestBody TransferRequest request,
            @RequestHeader(value = RequestHeaders.IDEMPOTENCY_KEY, required = false) String idempotencyKey) {
        if (idempotencyKey != null) {
            request = new TransferRequest(request.sourceAccountId(), request.targetAccountId(),
                    request.amountCents(), request.currency(), request.description(), idempotencyKey);
        }
        log.info("Transfer request: source={}, target={}, amountCents={}",
                request.sourceAccountId(), request.targetAccountId(), request.amountCents());
        TransactionDetailResponse response = transactionService.createTransfer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Transfer completed successfully"));
    }

    @GetMapping("/{transactionId}")
    @Operation(summary = "Get transaction details", description = "Returns full details for a transaction.")
    public ResponseEntity<ApiResponse<TransactionDetailResponse>> getTransaction(
            @PathVariable UUID transactionId) {
        TransactionDetailResponse response = transactionService.getTransaction(transactionId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    @Operation(summary = "List my transactions", description = "Returns a paginated, filtered list of transactions.")
    public ResponseEntity<ApiResponse<PageResponse<TransactionSummaryResponse>>> getMyTransactions(
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) TransactionStatus status,
            @RequestParam(required = false) String accountId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<TransactionSummaryResponse> response = transactionService.getMyTransactions(
                type, status, accountId, fromDate, toDate, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{transactionId}/cancel")
    @Operation(summary = "Cancel a pending transaction", description = "Cancels a pending transaction.")
    public ResponseEntity<ApiResponse<TransactionDetailResponse>> cancelTransaction(
            @PathVariable UUID transactionId) {
        log.info("Cancel request: transactionId={}", transactionId);
        TransactionDetailResponse response = transactionService.cancelTransaction(transactionId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Transaction cancelled successfully"));
    }
}
