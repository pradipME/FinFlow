package com.finflow.modules.beneficiaries.domain;

import com.finflow.shared.domain.BaseSoftDeletableEntity;
import com.finflow.shared.domain.BaseEntityListener;
import jakarta.persistence.*;

@Entity
@Table(name = "beneficiaries", catalog = "finflow_accounts",
       uniqueConstraints = @UniqueConstraint(name = "uk_beneficiary_account",
           columnNames = {"owner_id", "account_number"}))
@EntityListeners({BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class Beneficiary extends BaseSoftDeletableEntity {

    @Column(name = "owner_id", nullable = false, length = 36)
    private String ownerId;

    @Column(name = "nickname", length = 100)
    private String nickname;

    @Column(name = "beneficiary_name", nullable = false, length = 200)
    private String beneficiaryName;

    @Column(name = "email", length = 254)
    private String email;

    @Column(name = "bank_name", length = 200)
    private String bankName;

    @Column(name = "account_number", nullable = false, length = 50)
    private String accountNumber;

    @Column(name = "routing_number", length = 20)
    private String routingNumber;

    @Column(name = "iban", length = 50)
    private String iban;

    @Column(name = "swift_code", length = 20)
    private String swiftCode;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "USD";

    @Enumerated(EnumType.STRING)
    @Column(name = "beneficiary_status", nullable = false, length = 20)
    private BeneficiaryStatus beneficiaryStatus = BeneficiaryStatus.ACTIVE;

    protected Beneficiary() {}

    public Beneficiary(String ownerId, String beneficiaryName, String accountNumber) {
        this.ownerId = ownerId;
        this.beneficiaryName = beneficiaryName;
        this.accountNumber = accountNumber;
    }

    public void block() {
        this.beneficiaryStatus = BeneficiaryStatus.BLOCKED;
    }

    public void deactivate() {
        this.beneficiaryStatus = BeneficiaryStatus.INACTIVE;
    }

    public void activate() {
        this.beneficiaryStatus = BeneficiaryStatus.ACTIVE;
    }

    public boolean isActive() {
        return this.beneficiaryStatus == BeneficiaryStatus.ACTIVE;
    }

    public String getOwnerId() { return ownerId; }
    public String getNickname() { return nickname; }
    public String getBeneficiaryName() { return beneficiaryName; }
    public String getEmail() { return email; }
    public String getBankName() { return bankName; }
    public String getAccountNumber() { return accountNumber; }
    public String getRoutingNumber() { return routingNumber; }
    public String getIban() { return iban; }
    public String getSwiftCode() { return swiftCode; }
    public String getCurrency() { return currency; }
    public BeneficiaryStatus getBeneficiaryStatus() { return beneficiaryStatus; }

    public void setNickname(String nickname) { this.nickname = nickname; }
    public void setBeneficiaryName(String beneficiaryName) { this.beneficiaryName = beneficiaryName; }
    public void setEmail(String email) { this.email = email; }
    public void setBankName(String bankName) { this.bankName = bankName; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public void setRoutingNumber(String routingNumber) { this.routingNumber = routingNumber; }
    public void setIban(String iban) { this.iban = iban; }
    public void setSwiftCode(String swiftCode) { this.swiftCode = swiftCode; }
    public void setCurrency(String currency) { this.currency = currency; }
    public void setBeneficiaryStatus(BeneficiaryStatus beneficiaryStatus) { this.beneficiaryStatus = beneficiaryStatus; }
}
