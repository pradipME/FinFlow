package com.finflow.modules.transfers.validator;

import com.finflow.modules.transfers.domain.ScheduleType;
import com.finflow.modules.transfers.domain.TransferFrequency;
import com.finflow.shared.exception.ValidationException;
import org.springframework.stereotype.Component;

@Component
public class TransferValidator {

    public void validateScheduledTransfer(String sourceAccountId, Long amountCents, ScheduleType scheduleType,
                                          TransferFrequency frequency, String nextExecution, String endDate) {
        if (amountCents == null || amountCents <= 0)
            throw new ValidationException("Amount must be positive");
        if (sourceAccountId == null || sourceAccountId.isBlank())
            throw new ValidationException("Source account is required");
        if (scheduleType == null)
            throw new ValidationException("Schedule type is required");
        if (nextExecution == null || nextExecution.isBlank())
            throw new ValidationException("Next execution date is required");
        if (scheduleType == ScheduleType.RECURRING && (frequency == null))
            throw new ValidationException("Frequency is required for recurring transfers");
    }

    public void validateTemplate(String templateName, String sourceAccountId, Long amountCents) {
        if (templateName == null || templateName.isBlank())
            throw new ValidationException("Template name is required");
        if (sourceAccountId == null || sourceAccountId.isBlank())
            throw new ValidationException("Source account is required");
        if (amountCents == null || amountCents <= 0)
            throw new ValidationException("Amount must be positive");
    }
}
