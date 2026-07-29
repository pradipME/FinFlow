package com.finflow.modules.savings.mapper;

import com.finflow.modules.savings.domain.SavingsGoal;
import com.finflow.modules.savings.dto.SavingsGoalResponse;
import org.springframework.stereotype.Component;

@Component
public class SavingsGoalMapper {

    public SavingsGoalResponse toResponse(SavingsGoal s) {
        return new SavingsGoalResponse(
            s.getId() != null ? s.getId().toString() : null,
            s.getAccountId(),
            s.getGoalName(),
            s.getTargetAmountCents(),
            s.getCurrentAmountCents(),
            s.getCurrency(),
            s.getGoalStatus(),
            s.getDeadline() != null ? s.getDeadline().toString() : null,
            s.getDescription(),
            s.getProgressPercent(),
            s.getCreatedAt() != null ? s.getCreatedAt().toString() : null
        );
    }
}
