package com.finflow.modules.transactions.domain;

import com.finflow.shared.domain.BaseEntity;
import com.finflow.shared.domain.BaseEntityListener;
import jakarta.persistence.*;

@Entity
@Table(name = "transaction_entries", schema = "finflow_transactions")
@EntityListeners({BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class TransactionEntry extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "transaction_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_txn_entry_transaction"))
    private Transaction transaction;

    @Column(name = "account_id", nullable = false, length = 36)
    private String accountId;

    @Enumerated(EnumType.STRING)
    @Column(name = "entry_type", nullable = false, length = 10)
    private EntryType entryType;

    @Column(name = "amount_cents", nullable = false)
    private Long amountCents;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @Column(name = "balance_before_cents", nullable = false)
    private Long balanceBeforeCents;

    @Column(name = "balance_after_cents", nullable = false)
    private Long balanceAfterCents;

    @Column(name = "description", length = 255)
    private String description;

    protected TransactionEntry() {}

    public TransactionEntry(String accountId, EntryType entryType, Long amountCents,
                            String currency, Long balanceBeforeCents, Long balanceAfterCents,
                            String description) {
        this.accountId = accountId;
        this.entryType = entryType;
        this.amountCents = amountCents;
        this.currency = currency;
        this.balanceBeforeCents = balanceBeforeCents;
        this.balanceAfterCents = balanceAfterCents;
        this.description = description;
    }

    public void setTransaction(Transaction transaction) { this.transaction = transaction; }
    public void setAccountId(String accountId) { this.accountId = accountId; }
    public void setEntryType(EntryType entryType) { this.entryType = entryType; }
    public void setAmountCents(Long amountCents) { this.amountCents = amountCents; }
    public void setCurrency(String currency) { this.currency = currency; }
    public void setBalanceBeforeCents(Long balanceBeforeCents) { this.balanceBeforeCents = balanceBeforeCents; }
    public void setBalanceAfterCents(Long balanceAfterCents) { this.balanceAfterCents = balanceAfterCents; }
    public void setDescription(String description) { this.description = description; }

    public Transaction getTransaction() { return transaction; }
    public String getAccountId() { return accountId; }
    public EntryType getEntryType() { return entryType; }
    public Long getAmountCents() { return amountCents; }
    public String getCurrency() { return currency; }
    public Long getBalanceBeforeCents() { return balanceBeforeCents; }
    public Long getBalanceAfterCents() { return balanceAfterCents; }
    public String getDescription() { return description; }
}
