package com.finflow.modules.accounts.domain;

import com.finflow.shared.domain.BaseSoftDeletableEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "accounts", catalog = "finflow_accounts")
@EntityListeners({com.finflow.shared.domain.BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class Account extends BaseSoftDeletableEntity {

    @Column(name = "owner_id", nullable = false, length = 36)
    private String ownerId;

    @Column(name = "account_number", nullable = false, unique = true, length = 20)
    private String accountNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false, length = 20)
    private AccountType accountType;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false, length = 25)
    private AccountStatus accountStatus = AccountStatus.PENDING;

    @Column(name = "nickname", length = 100)
    private String nickname;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "USD";

    @Column(name = "ledger_balance_cents", nullable = false)
    private Long ledgerBalanceCents = 0L;

    @Column(name = "available_balance_cents", nullable = false)
    private Long availableBalanceCents = 0L;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.Set<AccountStatusHistory> statusHistory = new java.util.HashSet<>();

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.Set<Hold> holds = new java.util.HashSet<>();

    protected Account() {}

    public Account(String ownerId, String accountNumber, AccountType accountType, String currency) {
        this.ownerId = ownerId;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.currency = currency != null ? currency : "USD";
        this.accountStatus = AccountStatus.PENDING;
        this.ledgerBalanceCents = 0L;
        this.availableBalanceCents = 0L;
    }

    public void activate() {
        if (this.accountStatus != AccountStatus.PENDING) {
            throw new IllegalStateException("Only PENDING accounts can be activated");
        }
        this.accountStatus = AccountStatus.ACTIVE;
    }

    public void restrict(String reason) {
        if (this.accountStatus == AccountStatus.CLOSED) {
            throw new IllegalStateException("Cannot restrict a closed account");
        }
        this.accountStatus = AccountStatus.RESTRICTED;
    }

    public void suspend() {
        if (this.accountStatus == AccountStatus.CLOSED) {
            throw new IllegalStateException("Cannot suspend a closed account");
        }
        this.accountStatus = AccountStatus.SUSPENDED;
    }

    public void close() {
        if (this.accountStatus == AccountStatus.CLOSED) {
            throw new IllegalStateException("Account is already closed");
        }
        if (this.ledgerBalanceCents != 0L) {
            throw new IllegalStateException("Cannot close account with non-zero balance");
        }
        this.accountStatus = AccountStatus.CLOSED;
    }

    public void reactivate() {
        if (this.accountStatus != AccountStatus.RESTRICTED && this.accountStatus != AccountStatus.SUSPENDED) {
            throw new IllegalStateException("Only RESTRICTED or SUSPENDED accounts can be reactivated");
        }
        this.accountStatus = AccountStatus.ACTIVE;
    }

    public boolean isOperational() {
        return this.accountStatus == AccountStatus.ACTIVE;
    }

    public void debit(long amountCents) {
        if (amountCents <= 0) {
            throw new IllegalArgumentException("Debit amount must be positive");
        }
        if (this.availableBalanceCents < amountCents) {
            throw new IllegalStateException("Insufficient available balance");
        }
        this.ledgerBalanceCents -= amountCents;
        this.availableBalanceCents -= amountCents;
    }

    public void credit(long amountCents) {
        if (amountCents <= 0) {
            throw new IllegalArgumentException("Credit amount must be positive");
        }
        this.ledgerBalanceCents += amountCents;
        this.availableBalanceCents += amountCents;
    }

    public void placeHold(long amountCents) {
        if (amountCents <= 0) {
            throw new IllegalArgumentException("Hold amount must be positive");
        }
        if (this.availableBalanceCents < amountCents) {
            throw new IllegalStateException("Insufficient available balance for hold");
        }
        this.availableBalanceCents -= amountCents;
    }

    public void releaseHold(long amountCents) {
        if (amountCents <= 0) {
            throw new IllegalArgumentException("Release amount must be positive");
        }
        this.availableBalanceCents += amountCents;
    }

    public String getOwnerId() { return ownerId; }
    public String getAccountNumber() { return accountNumber; }
    public AccountType getAccountType() { return accountType; }
    public AccountStatus getAccountStatus() { return accountStatus; }
    public String getNickname() { return nickname; }
    public String getCurrency() { return currency; }
    public Long getLedgerBalanceCents() { return ledgerBalanceCents; }
    public Long getAvailableBalanceCents() { return availableBalanceCents; }
    public java.util.Set<AccountStatusHistory> getStatusHistory() { return statusHistory; }
    public java.util.Set<Hold> getHolds() { return holds; }

    public void setNickname(String nickname) { this.nickname = nickname; }
    public void setAccountStatus(AccountStatus accountStatus) { this.accountStatus = accountStatus; }
    public void setLedgerBalanceCents(Long ledgerBalanceCents) { this.ledgerBalanceCents = ledgerBalanceCents; }
    public void setAvailableBalanceCents(Long availableBalanceCents) { this.availableBalanceCents = availableBalanceCents; }
}
