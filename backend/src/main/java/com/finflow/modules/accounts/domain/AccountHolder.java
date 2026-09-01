package com.finflow.modules.accounts.domain;

import com.finflow.shared.domain.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "account_holders", schema = "finflow_accounts",
       uniqueConstraints = @UniqueConstraint(columnNames = {"account_id", "user_id"}))
@EntityListeners({com.finflow.shared.domain.BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class AccountHolder extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_ah_account"))
    private Account account;

    @Column(name = "user_id", nullable = false, length = 36, columnDefinition = "CHAR(36)")
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "ownership_type", nullable = false, length = 20)
    private OwnershipType ownershipType = OwnershipType.PRIMARY;

    protected AccountHolder() {}

    public AccountHolder(Account account, String userId, OwnershipType ownershipType) {
        this.account = account;
        this.userId = userId;
        this.ownershipType = ownershipType != null ? ownershipType : OwnershipType.PRIMARY;
    }

    public Account getAccount() { return account; }
    public String getUserId() { return userId; }
    public OwnershipType getOwnershipType() { return ownershipType; }
}
