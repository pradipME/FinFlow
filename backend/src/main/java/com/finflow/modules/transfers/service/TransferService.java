package com.finflow.modules.transfers.service;

import com.finflow.modules.transfers.domain.ScheduledTransfer;
import com.finflow.modules.transfers.domain.ScheduleStatus;
import com.finflow.modules.transfers.domain.ScheduleType;
import com.finflow.modules.transfers.domain.TransferFrequency;
import com.finflow.modules.transfers.domain.TransferTemplate;
import com.finflow.modules.transfers.dto.*;
import com.finflow.modules.transfers.mapper.TransferMapper;
import com.finflow.modules.transfers.repository.ScheduledTransferRepository;
import com.finflow.modules.transfers.repository.TransferTemplateRepository;
import com.finflow.modules.transfers.validator.TransferValidator;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.exception.BusinessRuleException;
import com.finflow.shared.exception.ValidationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.UUID;

@Service
@Transactional
public class TransferService {

    private final TransferTemplateRepository templateRepository;
    private final ScheduledTransferRepository scheduledRepository;
    private final TransferMapper mapper;
    private final TransferValidator validator;

    public TransferService(TransferTemplateRepository templateRepository,
                           ScheduledTransferRepository scheduledRepository,
                           TransferMapper mapper, TransferValidator validator) {
        this.templateRepository = templateRepository;
        this.scheduledRepository = scheduledRepository;
        this.mapper = mapper;
        this.validator = validator;
    }

    // ── Template CRUD ──────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<TemplateResponse> getTemplates(String ownerId, Pageable pageable) {
        return templateRepository.findByOwnerId(ownerId, pageable).map(mapper::toTemplateResponse);
    }

    @Transactional(readOnly = true)
    public TemplateResponse getTemplateById(String ownerId, UUID templateId) {
        TransferTemplate t = templateRepository.findByIdAndOwnerId(templateId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("TransferTemplate", templateId.toString()));
        return mapper.toTemplateResponse(t);
    }

    public TemplateResponse createTemplate(String ownerId, CreateTemplateRequest req) {
        validator.validateTemplate(req.templateName(), req.sourceAccountId(), req.amountCents());
        TransferTemplate t = new TransferTemplate(ownerId, req.templateName(), req.sourceAccountId(),
            req.amountCents(), req.currency() != null ? req.currency() : "USD");
        t.setTargetAccountId(req.targetAccountId());
        t.setTargetBeneficiaryId(req.targetBeneficiaryId());
        t.setDescription(req.description());
        return mapper.toTemplateResponse(templateRepository.save(t));
    }

    public TemplateResponse updateTemplate(String ownerId, UUID templateId, UpdateTemplateRequest req) {
        TransferTemplate t = templateRepository.findByIdAndOwnerId(templateId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("TransferTemplate", templateId.toString()));
        if (t.getTemplateStatus() == ScheduleStatus.CANCELLED)
            throw new BusinessRuleException("TEMPLATE_CANCELLED", "Cannot modify a cancelled template");
        if (req.templateName() != null) t.setTemplateName(req.templateName());
        if (req.sourceAccountId() != null) t.setSourceAccountId(req.sourceAccountId());
        if (req.targetAccountId() != null) t.setTargetAccountId(req.targetAccountId());
        if (req.targetBeneficiaryId() != null) t.setTargetBeneficiaryId(req.targetBeneficiaryId());
        if (req.amountCents() != null) t.setAmountCents(req.amountCents());
        if (req.currency() != null) t.setCurrency(req.currency());
        if (req.description() != null) t.setDescription(req.description());
        return mapper.toTemplateResponse(templateRepository.save(t));
    }

    public void deleteTemplate(String ownerId, UUID templateId) {
        TransferTemplate t = templateRepository.findByIdAndOwnerId(templateId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("TransferTemplate", templateId.toString()));
        if (t.getTemplateStatus() == ScheduleStatus.CANCELLED)
            throw new BusinessRuleException("TEMPLATE_ALREADY_CANCELLED", "Template is already cancelled");
        t.deactivate();
        templateRepository.save(t);
    }

    // ── Scheduled Transfer CRUD ────────────────────────────────

    @Transactional(readOnly = true)
    public Page<ScheduledTransferResponse> getScheduledTransfers(String ownerId, Pageable pageable) {
        return scheduledRepository.findByOwnerId(ownerId, pageable).map(mapper::toScheduledResponse);
    }

    @Transactional(readOnly = true)
    public ScheduledTransferResponse getScheduledTransferById(String ownerId, UUID transferId) {
        ScheduledTransfer s = scheduledRepository.findByIdAndOwnerId(transferId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("ScheduledTransfer", transferId.toString()));
        return mapper.toScheduledResponse(s);
    }

    public ScheduledTransferResponse createScheduledTransfer(String ownerId, CreateScheduledTransferRequest req) {
        validator.validateScheduledTransfer(req.sourceAccountId(), req.amountCents(), req.scheduleType(),
            req.frequency(), req.nextExecution(), req.endDate());

        LocalDateTime nextExec;
        try {
            nextExec = LocalDateTime.parse(req.nextExecution());
        } catch (DateTimeParseException e) {
            throw new ValidationException("Invalid nextExecution date format. Use ISO-8601.");
        }

        ScheduledTransfer s = new ScheduledTransfer(ownerId, req.sourceAccountId(), req.amountCents(),
            req.currency() != null ? req.currency() : "USD", req.scheduleType(), nextExec);
        s.setTemplateId(req.templateId());
        s.setTargetAccountId(req.targetAccountId());
        s.setTargetBeneficiaryId(req.targetBeneficiaryId());
        s.setDescription(req.description());
        s.setFrequency(req.frequency());
        s.setMaxExecutions(req.maxExecutions());
        if (req.endDate() != null) {
            try {
                s.setEndDate(LocalDateTime.parse(req.endDate()));
            } catch (DateTimeParseException e) {
                throw new ValidationException("Invalid endDate date format. Use ISO-8601.");
            }
        }
        return mapper.toScheduledResponse(scheduledRepository.save(s));
    }

    public ScheduledTransferResponse pauseScheduledTransfer(String ownerId, UUID transferId) {
        ScheduledTransfer s = scheduledRepository.findByIdAndOwnerId(transferId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("ScheduledTransfer", transferId.toString()));
        s.pause();
        return mapper.toScheduledResponse(scheduledRepository.save(s));
    }

    public ScheduledTransferResponse resumeScheduledTransfer(String ownerId, UUID transferId) {
        ScheduledTransfer s = scheduledRepository.findByIdAndOwnerId(transferId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("ScheduledTransfer", transferId.toString()));
        s.resume();
        return mapper.toScheduledResponse(scheduledRepository.save(s));
    }

    public void cancelScheduledTransfer(String ownerId, UUID transferId) {
        ScheduledTransfer s = scheduledRepository.findByIdAndOwnerId(transferId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("ScheduledTransfer", transferId.toString()));
        s.cancel();
        scheduledRepository.save(s);
    }
}
