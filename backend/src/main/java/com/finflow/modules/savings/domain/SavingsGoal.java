package com.finflow.modules.savings.domain;

import com.finflow.shared.domain.BaseEntity;
import com.finflow.shared.domain.BaseEntityListener;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "savings_goals", schema = "finflow_savings")
@EntityListeners({BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class SavingsGoal extends BaseEntity {

    @Column(name = "owner_id", nullable = false, length = 36, columnDefinition = "CHAR(36)")
    private String ownerId;

    @Column(name = "account_id", nullable = false, length = 36, columnDefinition = "CHAR(36)")
    private String accountId;

    @Column(name = "goal_name", nullable = false, length = 100)
    private String goalName;

    @Column(name = "target_amount_cents", nullable = false)
    private Long targetAmountCents;

    @Column(name = "current_amount_cents", nullable = false)
    private Long currentAmountCents = 0L;

    @Column(name = "currency", nullable = false, length = 3, columnDefinition = "CHAR(3)")
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(name = "goal_status", nullable = false, length = 20)
    private SavingsGoalStatus goalStatus = SavingsGoalStatus.ACTIVE;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Column(name = "description", length = 255)
    private String description;

    protected SavingsGoal() {}

    public SavingsGoal(String ownerId, String accountId, String goalName, Long targetAmountCents, String currency) {
        this.ownerId = ownerId;
        this.accountId = accountId;
        this.goalName = goalName;
        this.targetAmountCents = targetAmountCents;
        this.currency = currency;
    }

    public void deposit(Long amountCents) {
        if (amountCents <= 0) throw new IllegalArgumentException("Deposit amount must be positive");
        this.currentAmountCents += amountCents;
        if (this.currentAmountCents >= this.targetAmountCents && this.goalStatus == SavingsGoalStatus.ACTIVE) {
            this.goalStatus = SavingsGoalStatus.COMPLETED;
        }
    }

    public void withdraw(Long amountCents) {
        if (amountCents <= 0) throw new IllegalArgumentException("Withdrawal amount must be positive");
        if (amountCents > this.currentAmountCents)
            throw new IllegalStateException("Insufficient savings balance");
        this.currentAmountCents -= amountCents;
    }

    public void pause() {
        if (this.goalStatus != SavingsGoalStatus.ACTIVE)
            throw new IllegalStateException("Only ACTIVE goals can be paused");
        this.goalStatus = SavingsGoalStatus.PAUSED;
    }

    public void resume() {
        if (this.goalStatus != SavingsGoalStatus.PAUSED)
            throw new IllegalStateException("Only PAUSED goals can be resumed");
        this.goalStatus = SavingsGoalStatus.ACTIVE;
    }

    public void cancel() {
        if (this.goalStatus == SavingsGoalStatus.COMPLETED || this.goalStatus == SavingsGoalStatus.CANCELLED)
            throw new IllegalStateException("Cannot cancel a completed or already cancelled goal");
        this.goalStatus = SavingsGoalStatus.CANCELLED;
    }

    public double getProgressPercent() {
        if (targetAmountCents == 0) return 0;
        return Math.min(100.0, (currentAmountCents * 100.0) / targetAmountCents);
    }

    public String getOwnerId() { return ownerId; }
    public String getAccountId() { return accountId; }
    public String getGoalName() { return goalName; }
    public Long getTargetAmountCents() { return targetAmountCents; }
    public Long getCurrentAmountCents() { return currentAmountCents; }
    public String getCurrency() { return currency; }
    public SavingsGoalStatus getGoalStatus() { return goalStatus; }
    public LocalDate getDeadline() { return deadline; }
    public String getDescription() { return description; }

    public void setGoalName(String n) { this.goalName = n; }
    public void setTargetAmountCents(Long t) { this.targetAmountCents = t; }
    public void setDeadline(LocalDate d) { this.deadline = d; }
    public void setDescription(String d) { this.description = d; }
}
