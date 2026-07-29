package com.finflow.modules.transfers.domain;

import com.finflow.shared.domain.BaseEntity;
import com.finflow.shared.domain.BaseEntityListener;
import jakarta.persistence.*;

@Entity
@Table(name = "transfer_templates", catalog = "finflow_transfers")
@EntityListeners({BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class TransferTemplate extends BaseEntity {

    @Column(name = "owner_id", nullable = false, length = 36)
    private String ownerId;

    @Column(name = "template_name", nullable = false, length = 100)
    private String templateName;

    @Column(name = "source_account_id", nullable = false, length = 36)
    private String sourceAccountId;

    @Column(name = "target_account_id", length = 36)
    private String targetAccountId;

    @Column(name = "target_beneficiary_id", length = 36)
    private String targetBeneficiaryId;

    @Column(name = "amount_cents", nullable = false)
    private Long amountCents;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @Column(name = "description", length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "template_status", nullable = false, length = 20)
    private ScheduleStatus templateStatus = ScheduleStatus.ACTIVE;

    protected TransferTemplate() {}

    public TransferTemplate(String ownerId, String templateName, String sourceAccountId,
                            Long amountCents, String currency) {
        this.ownerId = ownerId;
        this.templateName = templateName;
        this.sourceAccountId = sourceAccountId;
        this.amountCents = amountCents;
        this.currency = currency;
    }

    public void deactivate() { this.templateStatus = ScheduleStatus.CANCELLED; }
    public void activate() { this.templateStatus = ScheduleStatus.ACTIVE; }

    public String getOwnerId() { return ownerId; }
    public String getTemplateName() { return templateName; }
    public String getSourceAccountId() { return sourceAccountId; }
    public String getTargetAccountId() { return targetAccountId; }
    public String getTargetBeneficiaryId() { return targetBeneficiaryId; }
    public Long getAmountCents() { return amountCents; }
    public String getCurrency() { return currency; }
    public String getDescription() { return description; }
    public ScheduleStatus getTemplateStatus() { return templateStatus; }

    public void setTemplateName(String n) { this.templateName = n; }
    public void setSourceAccountId(String s) { this.sourceAccountId = s; }
    public void setTargetAccountId(String t) { this.targetAccountId = t; }
    public void setTargetBeneficiaryId(String b) { this.targetBeneficiaryId = b; }
    public void setAmountCents(Long a) { this.amountCents = a; }
    public void setCurrency(String c) { this.currency = c; }
    public void setDescription(String d) { this.description = d; }
    public void setTemplateStatus(ScheduleStatus s) { this.templateStatus = s; }
}
