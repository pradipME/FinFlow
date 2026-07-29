package com.finflow.modules.transfers.mapper;

import com.finflow.modules.transfers.domain.ScheduledTransfer;
import com.finflow.modules.transfers.domain.TransferTemplate;
import com.finflow.modules.transfers.dto.ScheduledTransferResponse;
import com.finflow.modules.transfers.dto.TemplateResponse;
import org.springframework.stereotype.Component;

@Component
public class TransferMapper {

    public TemplateResponse toTemplateResponse(TransferTemplate t) {
        return new TemplateResponse(
            t.getId() != null ? t.getId().toString() : null,
            t.getTemplateName(),
            t.getSourceAccountId(),
            t.getTargetAccountId(),
            t.getTargetBeneficiaryId(),
            t.getAmountCents(),
            t.getCurrency(),
            t.getDescription(),
            t.getTemplateStatus(),
            t.getCreatedAt() != null ? t.getCreatedAt().toString() : null
        );
    }

    public ScheduledTransferResponse toScheduledResponse(ScheduledTransfer s) {
        return new ScheduledTransferResponse(
            s.getId() != null ? s.getId().toString() : null,
            s.getTemplateId(),
            s.getSourceAccountId(),
            s.getTargetAccountId(),
            s.getTargetBeneficiaryId(),
            s.getAmountCents(),
            s.getCurrency(),
            s.getDescription(),
            s.getScheduleType(),
            s.getFrequency(),
            s.getNextExecution() != null ? s.getNextExecution().toString() : null,
            s.getLastExecution() != null ? s.getLastExecution().toString() : null,
            s.getEndDate() != null ? s.getEndDate().toString() : null,
            s.getExecutionCount(),
            s.getMaxExecutions(),
            s.getScheduleStatus(),
            s.getCreatedAt() != null ? s.getCreatedAt().toString() : null
        );
    }
}
