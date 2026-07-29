package com.finflow.modules.cards.domain;

import com.finflow.shared.domain.BaseEntity;
import com.finflow.shared.domain.BaseEntityListener;
import jakarta.persistence.*;

@Entity
@Table(name = "cards", catalog = "finflow_accounts")
@EntityListeners({BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class Card extends BaseEntity {

    @Column(name = "owner_id", nullable = false, length = 36)
    private String ownerId;

    @Column(name = "account_id", nullable = false, length = 36)
    private String accountId;

    @Column(name = "card_number_hash", nullable = false)
    private String cardNumberHash;

    @Column(name = "card_last_four", nullable = false, length = 4)
    private String cardLastFour;

    @Enumerated(EnumType.STRING)
    @Column(name = "card_type", nullable = false, length = 20)
    private CardType cardType;

    @Enumerated(EnumType.STRING)
    @Column(name = "card_status", nullable = false, length = 20)
    private CardStatus cardStatus = CardStatus.PENDING;

    @Column(name = "cardholder_name", nullable = false, length = 200)
    private String cardholderName;

    @Column(name = "expiry_month", nullable = false)
    private Integer expiryMonth;

    @Column(name = "expiry_year", nullable = false)
    private Integer expiryYear;

    @Column(name = "credit_limit_cents")
    private Long creditLimitCents;

    @Column(name = "daily_limit_cents")
    private Long dailyLimitCents;

    @Column(name = "monthly_limit_cents")
    private Long monthlyLimitCents;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @Column(name = "pin_set", nullable = false)
    private Boolean pinSet = false;

    protected Card() {}

    public Card(String ownerId, String accountId, String cardNumberHash, String cardLastFour,
                CardType cardType, String cardholderName, Integer expiryMonth, Integer expiryYear, String currency) {
        this.ownerId = ownerId;
        this.accountId = accountId;
        this.cardNumberHash = cardNumberHash;
        this.cardLastFour = cardLastFour;
        this.cardType = cardType;
        this.cardholderName = cardholderName;
        this.expiryMonth = expiryMonth;
        this.expiryYear = expiryYear;
        this.currency = currency;
    }

    public void activate() {
        if (this.cardStatus != CardStatus.PENDING)
            throw new IllegalStateException("Only PENDING cards can be activated");
        this.cardStatus = CardStatus.ACTIVE;
    }

    public void freeze() {
        if (this.cardStatus != CardStatus.ACTIVE)
            throw new IllegalStateException("Only ACTIVE cards can be frozen");
        this.cardStatus = CardStatus.FROZEN;
    }

    public void unfreeze() {
        if (this.cardStatus != CardStatus.FROZEN)
            throw new IllegalStateException("Only FROZEN cards can be unfrozen");
        this.cardStatus = CardStatus.ACTIVE;
    }

    public void block() {
        if (this.cardStatus == CardStatus.CANCELLED || this.cardStatus == CardStatus.BLOCKED)
            throw new IllegalStateException("Card is already blocked or cancelled");
        this.cardStatus = CardStatus.BLOCKED;
    }

    public void cancel() {
        if (this.cardStatus == CardStatus.CANCELLED)
            throw new IllegalStateException("Card is already cancelled");
        this.cardStatus = CardStatus.CANCELLED;
    }

    public boolean isOperational() {
        return this.cardStatus == CardStatus.ACTIVE;
    }

    public String getOwnerId() { return ownerId; }
    public String getAccountId() { return accountId; }
    public String getCardNumberHash() { return cardNumberHash; }
    public String getCardLastFour() { return cardLastFour; }
    public CardType getCardType() { return cardType; }
    public CardStatus getCardStatus() { return cardStatus; }
    public String getCardholderName() { return cardholderName; }
    public Integer getExpiryMonth() { return expiryMonth; }
    public Integer getExpiryYear() { return expiryYear; }
    public Long getCreditLimitCents() { return creditLimitCents; }
    public Long getDailyLimitCents() { return dailyLimitCents; }
    public Long getMonthlyLimitCents() { return monthlyLimitCents; }
    public String getCurrency() { return currency; }
    public Boolean getPinSet() { return pinSet; }

    public void setCardholderName(String n) { this.cardholderName = n; }
    public void setCardStatus(CardStatus s) { this.cardStatus = s; }
    public void setCreditLimitCents(Long l) { this.creditLimitCents = l; }
    public void setDailyLimitCents(Long l) { this.dailyLimitCents = l; }
    public void setMonthlyLimitCents(Long l) { this.monthlyLimitCents = l; }
    public void setPinSet(Boolean p) { this.pinSet = p; }
}
