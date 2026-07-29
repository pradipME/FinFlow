package com.finflow.modules.accounts.domain;

import com.finflow.shared.domain.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "holds", catalog = "finflow_accounts")
@EntityListeners({com.finflow.shared.domain.BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class Hold extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_holds_account"))
    private Account account;

    @Column(name = "amount_cents", nullable = false)
    private Long amountCents;

    @Column(name = "reason", nullable = false, length = 500)
    private String reason;

    @Column(name = "source_type", length = 50)
    private String sourceType;

    @Column(name = "source_id", length = 36)
    private String sourceId;

    @Enumerated(EnumType.STRING)
    @Column(name = "hold_status", nullable = false, length = 20)
    private HoldStatus holdStatus = HoldStatus.ACTIVE;

    @Column(name = "released_at")
    private LocalDateTime releasedAt;

    @Column(name = "released_by", length = 36)
    private String releasedBy;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    protected Hold() {}

    public Hold(Account account, long amountCents, String reason,
                String sourceType, String sourceId, LocalDateTime expiresAt) {
        this.account = account;
        this.amountCents = amountCents;
        this.reason = reason;
        this.sourceType = sourceType;
        this.sourceId = sourceId;
        this.holdStatus = HoldStatus.ACTIVE;
        this.expiresAt = expiresAt;
    }

    public void release(String releasedBy) {
        if (this.holdStatus != HoldStatus.ACTIVE) {
            throw new IllegalStateException("Only ACTIVE holds can be released");
        }
        this.holdStatus = HoldStatus.RELEASED;
        this.releasedAt = LocalDateTime.now();
        this.releasedBy = releasedBy;
    }

    public void expire() {
        if (this.holdStatus != HoldStatus.ACTIVE) {
            throw new IllegalStateException("Only ACTIVE holds can be expired");
        }
        this.holdStatus = HoldStatus.EXPIRED;
        this.releasedAt = LocalDateTime.now();
    }

    public boolean isActive() {
        return this.holdStatus == HoldStatus.ACTIVE;
    }

    public boolean isExpired() {
        return this.expiresAt != null && LocalDateTime.now().isAfter(this.expiresAt);
    }

    public Account getAccount() { return account; }
    public Long getAmountCents() { return amountCents; }
    public String getReason() { return reason; }
    public String getSourceType() { return sourceType; }
    public String getSourceId() { return sourceId; }
    public HoldStatus getHoldStatus() { return holdStatus; }
    public LocalDateTime getReleasedAt() { return releasedAt; }
    public String getReleasedBy() { return releasedBy; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
}
