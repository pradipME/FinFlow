package com.finflow.modules.accounts.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "account_status_history", catalog = "finflow_accounts")
@EntityListeners({com.finflow.shared.domain.BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class AccountStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_ash_account"))
    private Account account;

    @Column(name = "previous_status", length = 25)
    private String previousStatus;

    @Column(name = "new_status", nullable = false, length = 25)
    private String newStatus;

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "changed_by", nullable = false, length = 36)
    private String changedBy;

    @Column(name = "changed_at", nullable = false, updatable = false)
    private LocalDateTime changedAt;

    protected AccountStatusHistory() {}

    public AccountStatusHistory(Account account, String previousStatus,
                                 String newStatus, String reason, String changedBy) {
        this.account = account;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.reason = reason;
        this.changedBy = changedBy;
        this.changedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Account getAccount() { return account; }
    public String getPreviousStatus() { return previousStatus; }
    public String getNewStatus() { return newStatus; }
    public String getReason() { return reason; }
    public String getChangedBy() { return changedBy; }
    public LocalDateTime getChangedAt() { return changedAt; }
}
