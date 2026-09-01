package com.finflow.modules.cards.domain;

import com.finflow.shared.domain.BaseEntity;
import com.finflow.shared.domain.BaseEntityListener;
import jakarta.persistence.*;

@Entity
@Table(name = "card_transactions", schema = "finflow_accounts")
@EntityListeners({BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class CardTransaction extends BaseEntity {

    @Column(name = "card_id", nullable = false, length = 36, columnDefinition = "CHAR(36)")
    private String cardId;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 20)
    private CardTransactionType transactionType;

    @Column(name = "amount_cents", nullable = false)
    private Long amountCents;

    @Column(name = "currency", nullable = false, length = 3, columnDefinition = "CHAR(3)")
    private String currency;

    @Column(name = "merchant_name", length = 200)
    private String merchantName;

    @Column(name = "merchant_category", length = 50)
    private String merchantCategory;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private CardTransactionStatus status;

    @Column(name = "authorization_code", length = 20)
    private String authorizationCode;

    protected CardTransaction() {}

    public CardTransaction(String cardId, CardTransactionType transactionType, Long amountCents,
                           String currency, CardTransactionStatus status) {
        this.cardId = cardId;
        this.transactionType = transactionType;
        this.amountCents = amountCents;
        this.currency = currency;
        this.status = status;
    }

    public String getCardId() { return cardId; }
    public CardTransactionType getTransactionType() { return transactionType; }
    public Long getAmountCents() { return amountCents; }
    public String getCurrency() { return currency; }
    public String getMerchantName() { return merchantName; }
    public String getMerchantCategory() { return merchantCategory; }
    public CardTransactionStatus getStatus() { return status; }
    public String getAuthorizationCode() { return authorizationCode; }

    public void setMerchantName(String m) { this.merchantName = m; }
    public void setMerchantCategory(String m) { this.merchantCategory = m; }
    public void setStatus(CardTransactionStatus s) { this.status = s; }
    public void setAuthorizationCode(String a) { this.authorizationCode = a; }
}
