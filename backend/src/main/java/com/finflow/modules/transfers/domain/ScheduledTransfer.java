package com.finflow.modules.transfers.domain;

import com.finflow.shared.domain.BaseEntity;
import com.finflow.shared.domain.BaseEntityListener;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "scheduled_transfers", schema = "finflow_transfers")
@EntityListeners({BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class ScheduledTransfer extends BaseEntity {

    @Column(name = "owner_id", nullable = false, length = 36)
    private String ownerId;

    @Column(name = "template_id", length = 36)
    private String templateId;

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
    @Column(name = "schedule_type", nullable = false, length = 20)
    private ScheduleType scheduleType;

    @Enumerated(EnumType.STRING)
    @Column(name = "frequency", length = 20)
    private TransferFrequency frequency;

    @Column(name = "next_execution", nullable = false)
    private LocalDateTime nextExecution;

    @Column(name = "last_execution")
    private LocalDateTime lastExecution;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "execution_count", nullable = false)
    private Integer executionCount = 0;

    @Column(name = "max_executions")
    private Integer maxExecutions;

    @Enumerated(EnumType.STRING)
    @Column(name = "schedule_status", nullable = false, length = 20)
    private ScheduleStatus scheduleStatus = ScheduleStatus.ACTIVE;

    protected ScheduledTransfer() {}

    public ScheduledTransfer(String ownerId, String sourceAccountId, Long amountCents,
                             String currency, ScheduleType scheduleType, LocalDateTime nextExecution) {
        this.ownerId = ownerId;
        this.sourceAccountId = sourceAccountId;
        this.amountCents = amountCents;
        this.currency = currency;
        this.scheduleType = scheduleType;
        this.nextExecution = nextExecution;
    }

    public void pause() {
        if (this.scheduleStatus != ScheduleStatus.ACTIVE)
            throw new IllegalStateException("Only ACTIVE transfers can be paused");
        this.scheduleStatus = ScheduleStatus.PAUSED;
    }

    public void resume() {
        if (this.scheduleStatus != ScheduleStatus.PAUSED)
            throw new IllegalStateException("Only PAUSED transfers can be resumed");
        this.scheduleStatus = ScheduleStatus.ACTIVE;
    }

    public void cancel() {
        if (this.scheduleStatus == ScheduleStatus.COMPLETED || this.scheduleStatus == ScheduleStatus.CANCELLED)
            throw new IllegalStateException("Cannot cancel a completed or already cancelled transfer");
        this.scheduleStatus = ScheduleStatus.CANCELLED;
    }

    public void markCompleted() {
        this.executionCount++;
        this.lastExecution = LocalDateTime.now();
        if (this.scheduleType == ScheduleType.ONE_TIME) {
            this.scheduleStatus = ScheduleStatus.COMPLETED;
        } else if (this.maxExecutions != null && this.executionCount >= this.maxExecutions) {
            this.scheduleStatus = ScheduleStatus.COMPLETED;
        }
    }

    public boolean isDue() {
        return this.scheduleStatus == ScheduleStatus.ACTIVE
            && this.nextExecution != null
            && !this.nextExecution.isAfter(LocalDateTime.now());
    }

    public String getOwnerId() { return ownerId; }
    public String getTemplateId() { return templateId; }
    public String getSourceAccountId() { return sourceAccountId; }
    public String getTargetAccountId() { return targetAccountId; }
    public String getTargetBeneficiaryId() { return targetBeneficiaryId; }
    public Long getAmountCents() { return amountCents; }
    public String getCurrency() { return currency; }
    public String getDescription() { return description; }
    public ScheduleType getScheduleType() { return scheduleType; }
    public TransferFrequency getFrequency() { return frequency; }
    public LocalDateTime getNextExecution() { return nextExecution; }
    public LocalDateTime getLastExecution() { return lastExecution; }
    public LocalDateTime getEndDate() { return endDate; }
    public Integer getExecutionCount() { return executionCount; }
    public Integer getMaxExecutions() { return maxExecutions; }
    public ScheduleStatus getScheduleStatus() { return scheduleStatus; }

    public void setTemplateId(String t) { this.templateId = t; }
    public void setTargetAccountId(String t) { this.targetAccountId = t; }
    public void setTargetBeneficiaryId(String b) { this.targetBeneficiaryId = b; }
    public void setAmountCents(Long a) { this.amountCents = a; }
    public void setCurrency(String c) { this.currency = c; }
    public void setDescription(String d) { this.description = d; }
    public void setFrequency(TransferFrequency f) { this.frequency = f; }
    public void setNextExecution(LocalDateTime n) { this.nextExecution = n; }
    public void setEndDate(LocalDateTime e) { this.endDate = e; }
    public void setMaxExecutions(Integer m) { this.maxExecutions = m; }
    public void setScheduleStatus(ScheduleStatus s) { this.scheduleStatus = s; }
}
