package com.finflow.modules.requests.domain;

import com.finflow.shared.domain.BaseEntity;
import com.finflow.shared.domain.BaseEntityListener;
import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * A customer request in the bank-style ADMIN → CUSTOMER workflow.
 *
 * <p>Customers cannot directly create bank accounts or cards; they file a
 * {@code CustomerRequest}. An ADMIN reviews it and either approves
 * (platform creates the resource) or rejects it.</p>
 *
 * <p>Table: {@code finflow_admin.customer_requests}</p>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Entity
@Table(name = "customer_requests", schema = "finflow_admin")
@EntityListeners({BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class CustomerRequest extends BaseEntity {

    @Column(name = "customer_id", nullable = false, length = 36, columnDefinition = "CHAR(36)")
    private String customerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_type", nullable = false, length = 30)
    private CustomerRequestType requestType;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_status", nullable = false, length = 20)
    private CustomerRequestStatus requestStatus = CustomerRequestStatus.PENDING;

    @Column(name = "target_account_id", length = 36, columnDefinition = "CHAR(36)")
    private String targetAccountId;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "reviewed_by", length = 36, columnDefinition = "CHAR(36)")
    private String reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    protected CustomerRequest() {}

    public CustomerRequest(String customerId, CustomerRequestType requestType,
                           String targetAccountId, String details) {
        this.customerId = customerId;
        this.requestType = requestType;
        this.targetAccountId = targetAccountId;
        this.details = details;
        this.requestStatus = CustomerRequestStatus.PENDING;
    }

    public void approve(String reviewerUserId) {
        if (this.requestStatus != CustomerRequestStatus.PENDING) {
            throw new IllegalStateException("Only PENDING requests can be approved");
        }
        this.requestStatus = CustomerRequestStatus.APPROVED;
        this.reviewedBy = reviewerUserId;
        this.reviewedAt = LocalDateTime.now();
    }

    public void reject(String reviewerUserId, String reason) {
        if (this.requestStatus != CustomerRequestStatus.PENDING) {
            throw new IllegalStateException("Only PENDING requests can be rejected");
        }
        this.requestStatus = CustomerRequestStatus.REJECTED;
        this.reviewedBy = reviewerUserId;
        this.reviewedAt = LocalDateTime.now();
        this.rejectionReason = reason;
    }

    public String getCustomerId() { return customerId; }
    public CustomerRequestType getRequestType() { return requestType; }
    public CustomerRequestStatus getRequestStatus() { return requestStatus; }
    public String getTargetAccountId() { return targetAccountId; }
    public String getDetails() { return details; }
    public String getReviewedBy() { return reviewedBy; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public String getRejectionReason() { return rejectionReason; }
}