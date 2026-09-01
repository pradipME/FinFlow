package com.finflow.modules.transactions.domain;

import com.finflow.shared.domain.BaseEntity;
import com.finflow.shared.domain.BaseEntityListener;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "transactions", schema = "finflow_transactions")
@EntityListeners({BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class Transaction extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 25)
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_status", nullable = false, length = 20)
    private TransactionStatus transactionStatus;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "reference_number", unique = true, length = 50)
    private String referenceNumber;

    @Column(name = "idempotency_key", unique = true, length = 100)
    private String idempotencyKey;

    @Column(name = "amount_cents", nullable = false)
    private Long amountCents;

    @Column(name = "currency", nullable = false, length = 3, columnDefinition = "CHAR(3)")
    private String currency;

    @Column(name = "source_account_id", length = 36, columnDefinition = "CHAR(36)")
    private String sourceAccountId;

    @Column(name = "target_account_id", length = 36, columnDefinition = "CHAR(36)")
    private String targetAccountId;

    @Column(name = "fee_amount_cents", nullable = false)
    private Long feeAmountCents;

    @Column(name = "user_id", nullable = false, length = 36, columnDefinition = "CHAR(36)")
    private String userId;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "failed_reason", length = 500)
    private String failedReason;

    @Column(name = "metadata_json", columnDefinition = "TEXT")
    private String metadataJson;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TransactionEntry> entries = new ArrayList<>();

    protected Transaction() {}

    public Transaction(TransactionType type, Long amountCents, String currency,
                       String userId) {
        this.transactionType = type;
        this.amountCents = amountCents;
        this.currency = currency;
        this.userId = userId;
        this.transactionStatus = TransactionStatus.PENDING;
        this.feeAmountCents = 0L;
    }

    public void addEntry(TransactionEntry entry) {
        entries.add(entry);
        entry.setTransaction(this);
    }

    public void markCompleted() {
        if (this.transactionStatus != TransactionStatus.PENDING) {
            throw new IllegalStateException("Only PENDING transactions can be completed");
        }
        this.transactionStatus = TransactionStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }

    public void markFailed(String reason) {
        if (this.transactionStatus != TransactionStatus.PENDING) {
            throw new IllegalStateException("Only PENDING transactions can be failed");
        }
        this.transactionStatus = TransactionStatus.FAILED;
        this.failedReason = reason;
    }

    public void cancel() {
        if (this.transactionStatus != TransactionStatus.PENDING) {
            throw new IllegalStateException("Only PENDING transactions can be cancelled");
        }
        this.transactionStatus = TransactionStatus.CANCELLED;
    }

    public boolean isIdempotent(String key) {
        return this.idempotencyKey != null && this.idempotencyKey.equals(key);
    }

    public boolean canDebit() {
        return transactionStatus == TransactionStatus.PENDING
            || transactionStatus == TransactionStatus.COMPLETED;
    }

    public boolean canReverse() {
        return transactionStatus == TransactionStatus.COMPLETED
            && transactionType != TransactionType.REVERSAL;
    }

    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }
    public void setTransactionStatus(TransactionStatus transactionStatus) { this.transactionStatus = transactionStatus; }
    public void setDescription(String description) { this.description = description; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
    public void setAmountCents(Long amountCents) { this.amountCents = amountCents; }
    public void setCurrency(String currency) { this.currency = currency; }
    public void setSourceAccountId(String sourceAccountId) { this.sourceAccountId = sourceAccountId; }
    public void setTargetAccountId(String targetAccountId) { this.targetAccountId = targetAccountId; }
    public void setFeeAmountCents(Long feeAmountCents) { this.feeAmountCents = feeAmountCents; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public void setFailedReason(String failedReason) { this.failedReason = failedReason; }
    public void setMetadataJson(String metadataJson) { this.metadataJson = metadataJson; }

    public TransactionType getTransactionType() { return transactionType; }
    public TransactionStatus getTransactionStatus() { return transactionStatus; }
    public String getDescription() { return description; }
    public String getReferenceNumber() { return referenceNumber; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public Long getAmountCents() { return amountCents; }
    public String getCurrency() { return currency; }
    public String getSourceAccountId() { return sourceAccountId; }
    public String getTargetAccountId() { return targetAccountId; }
    public Long getFeeAmountCents() { return feeAmountCents; }
    public String getUserId() { return userId; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public String getFailedReason() { return failedReason; }
    public String getMetadataJson() { return metadataJson; }
    public List<TransactionEntry> getEntries() { return entries; }
}
