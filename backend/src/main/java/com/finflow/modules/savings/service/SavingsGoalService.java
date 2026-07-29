package com.finflow.modules.savings.service;

import com.finflow.modules.savings.domain.SavingsGoal;
import com.finflow.modules.savings.dto.*;
import com.finflow.modules.savings.mapper.SavingsGoalMapper;
import com.finflow.modules.savings.repository.SavingsGoalRepository;
import com.finflow.shared.exception.BusinessRuleException;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.exception.ValidationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.UUID;

@Service
@Transactional
public class SavingsGoalService {

    private final SavingsGoalRepository repository;
    private final SavingsGoalMapper mapper;

    public SavingsGoalService(SavingsGoalRepository repository, SavingsGoalMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public Page<SavingsGoalResponse> getGoals(String ownerId, Pageable pageable) {
        return repository.findByOwnerId(ownerId, pageable).map(mapper::toResponse);
    }

    @Transactional(readOnly = true)
    public SavingsGoalResponse getGoalById(String ownerId, UUID goalId) {
        SavingsGoal goal = repository.findByIdAndOwnerId(goalId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("SavingsGoal", goalId.toString()));
        return mapper.toResponse(goal);
    }

    public SavingsGoalResponse createGoal(String ownerId, CreateSavingsGoalRequest req) {
        if (req.goalName() == null || req.goalName().isBlank())
            throw new ValidationException("Goal name is required");
        if (req.targetAmountCents() == null || req.targetAmountCents() <= 0)
            throw new ValidationException("Target amount must be positive");

        SavingsGoal goal = new SavingsGoal(ownerId, req.accountId(), req.goalName(),
            req.targetAmountCents(), req.currency() != null ? req.currency() : "USD");

        if (req.deadline() != null && !req.deadline().isBlank()) {
            try {
                goal.setDeadline(LocalDate.parse(req.deadline()));
            } catch (DateTimeParseException e) {
                throw new ValidationException("Invalid deadline format. Use ISO-8601 date.");
            }
        }
        goal.setDescription(req.description());
        return mapper.toResponse(repository.save(goal));
    }

    public SavingsGoalResponse updateGoal(String ownerId, UUID goalId, UpdateSavingsGoalRequest req) {
        SavingsGoal goal = repository.findByIdAndOwnerId(goalId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("SavingsGoal", goalId.toString()));
        if (req.goalName() != null) goal.setGoalName(req.goalName());
        if (req.targetAmountCents() != null) goal.setTargetAmountCents(req.targetAmountCents());
        if (req.description() != null) goal.setDescription(req.description());
        if (req.deadline() != null && !req.deadline().isBlank()) {
            try {
                goal.setDeadline(LocalDate.parse(req.deadline()));
            } catch (DateTimeParseException e) {
                throw new ValidationException("Invalid deadline format. Use ISO-8601 date.");
            }
        }
        return mapper.toResponse(repository.save(goal));
    }

    public SavingsGoalResponse deposit(String ownerId, UUID goalId, DepositToSavingsGoalRequest req) {
        if (req.amountCents() == null || req.amountCents() <= 0)
            throw new ValidationException("Deposit amount must be positive");
        SavingsGoal goal = repository.findByIdAndOwnerId(goalId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("SavingsGoal", goalId.toString()));
        goal.deposit(req.amountCents());
        return mapper.toResponse(repository.save(goal));
    }

    public SavingsGoalResponse pauseGoal(String ownerId, UUID goalId) {
        SavingsGoal goal = repository.findByIdAndOwnerId(goalId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("SavingsGoal", goalId.toString()));
        goal.pause();
        return mapper.toResponse(repository.save(goal));
    }

    public SavingsGoalResponse resumeGoal(String ownerId, UUID goalId) {
        SavingsGoal goal = repository.findByIdAndOwnerId(goalId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("SavingsGoal", goalId.toString()));
        goal.resume();
        return mapper.toResponse(repository.save(goal));
    }

    public void cancelGoal(String ownerId, UUID goalId) {
        SavingsGoal goal = repository.findByIdAndOwnerId(goalId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("SavingsGoal", goalId.toString()));
        goal.cancel();
        repository.save(goal);
    }
}
