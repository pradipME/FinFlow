package com.finflow.modules.transfers.service;

import com.finflow.modules.transfers.domain.*;
import com.finflow.modules.transfers.dto.*;
import com.finflow.modules.transfers.mapper.TransferMapper;
import com.finflow.modules.transfers.repository.ScheduledTransferRepository;
import com.finflow.modules.transfers.repository.TransferTemplateRepository;
import com.finflow.modules.transfers.validator.TransferValidator;
import com.finflow.shared.exception.BusinessRuleException;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.exception.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TransferService Unit Tests")
class TransferServiceTest {

    @Mock private TransferTemplateRepository templateRepository;
    @Mock private ScheduledTransferRepository scheduledRepository;
    @Mock private TransferMapper mapper;
    @Mock private TransferValidator validator;

    @InjectMocks private TransferService service;

    private String ownerId;
    private UUID templateId;
    private UUID scheduledId;

    @BeforeEach
    void setUp() {
        ownerId = UUID.randomUUID().toString();
        templateId = UUID.randomUUID();
        scheduledId = UUID.randomUUID();
    }

    private TransferTemplate buildTemplate() {
        TransferTemplate t = new TransferTemplate(ownerId, "Monthly Rent", UUID.randomUUID().toString(), 150000L, "USD");
        ReflectionTestUtils.setField(t, "id", templateId);
        return t;
    }

    private ScheduledTransfer buildScheduled() {
        ScheduledTransfer s = new ScheduledTransfer(ownerId, UUID.randomUUID().toString(), 150000L, "USD",
            ScheduleType.ONE_TIME, LocalDateTime.now().plusDays(1));
        ReflectionTestUtils.setField(s, "id", scheduledId);
        return s;
    }

    @Nested
    @DisplayName("GET /templates")
    class GetTemplates {

        @Test
        @DisplayName("returns paginated templates for owner")
        void returnsPage() {
            TransferTemplate t = buildTemplate();
            TemplateResponse resp = mock(TemplateResponse.class);
            when(templateRepository.findByOwnerId(eq(ownerId), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(t)));
            when(mapper.toTemplateResponse(t)).thenReturn(resp);

            Page<TemplateResponse> result = service.getTemplates(ownerId, Pageable.unpaged());

            assertThat(result.getContent()).hasSize(1);
            verify(templateRepository).findByOwnerId(eq(ownerId), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /templates/{id}")
    class GetTemplateById {

        @Test
        @DisplayName("returns template when found")
        void returnsTemplate() {
            TransferTemplate t = buildTemplate();
            TemplateResponse resp = mock(TemplateResponse.class);
            when(templateRepository.findByIdAndOwnerId(templateId, ownerId)).thenReturn(Optional.of(t));
            when(mapper.toTemplateResponse(t)).thenReturn(resp);

            assertThat(service.getTemplateById(ownerId, templateId)).isEqualTo(resp);
        }

        @Test
        @DisplayName("throws ResourceNotFoundException when not found")
        void throwsNotFound() {
            when(templateRepository.findByIdAndOwnerId(templateId, ownerId)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.getTemplateById(ownerId, templateId))
                .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("POST /templates")
    class CreateTemplate {

        @Test
        @DisplayName("creates a new template")
        void creates() {
            CreateTemplateRequest req = new CreateTemplateRequest("Rent", UUID.randomUUID().toString(),
                UUID.randomUUID().toString(), null, 150000L, "USD", null);
            TransferTemplate saved = buildTemplate();
            TemplateResponse resp = mock(TemplateResponse.class);
            when(templateRepository.save(any(TransferTemplate.class))).thenReturn(saved);
            when(mapper.toTemplateResponse(saved)).thenReturn(resp);

            TemplateResponse result = service.createTemplate(ownerId, req);

            assertThat(result).isEqualTo(resp);
            verify(validator).validateTemplate("Rent", req.sourceAccountId(), 150000L);
            verify(templateRepository).save(any(TransferTemplate.class));
        }
    }

    @Nested
    @DisplayName("PUT /templates/{id}")
    class UpdateTemplate {

        @Test
        @DisplayName("updates an active template")
        void updates() {
            TransferTemplate t = buildTemplate();
            UpdateTemplateRequest req = new UpdateTemplateRequest("New Name", null, null, null, 200000L, null, null);
            TemplateResponse resp = mock(TemplateResponse.class);
            when(templateRepository.findByIdAndOwnerId(templateId, ownerId)).thenReturn(Optional.of(t));
            when(templateRepository.save(t)).thenReturn(t);
            when(mapper.toTemplateResponse(t)).thenReturn(resp);

            TemplateResponse result = service.updateTemplate(ownerId, templateId, req);

            assertThat(result).isEqualTo(resp);
            assertThat(t.getTemplateName()).isEqualTo("New Name");
            assertThat(t.getAmountCents()).isEqualTo(200000L);
        }

        @Test
        @DisplayName("throws BusinessRuleException when template is cancelled")
        void throwsOnCancelled() {
            TransferTemplate t = buildTemplate();
            t.deactivate();
            when(templateRepository.findByIdAndOwnerId(templateId, ownerId)).thenReturn(Optional.of(t));

            assertThatThrownBy(() -> service.updateTemplate(ownerId, templateId,
                new UpdateTemplateRequest("x", null, null, null, 100L, null, null)))
                .isInstanceOf(BusinessRuleException.class);
        }
    }

    @Nested
    @DisplayName("DELETE /templates/{id}")
    class DeleteTemplate {

        @Test
        @DisplayName("soft-deletes an active template")
        void softDeletes() {
            TransferTemplate t = buildTemplate();
            when(templateRepository.findByIdAndOwnerId(templateId, ownerId)).thenReturn(Optional.of(t));

            service.deleteTemplate(ownerId, templateId);

            assertThat(t.getTemplateStatus()).isEqualTo(ScheduleStatus.CANCELLED);
            verify(templateRepository).save(t);
        }

        @Test
        @DisplayName("throws BusinessRuleException when already cancelled")
        void throwsOnCancelled() {
            TransferTemplate t = buildTemplate();
            t.deactivate();
            when(templateRepository.findByIdAndOwnerId(templateId, ownerId)).thenReturn(Optional.of(t));

            assertThatThrownBy(() -> service.deleteTemplate(ownerId, templateId))
                .isInstanceOf(BusinessRuleException.class);
        }
    }

    @Nested
    @DisplayName("GET /scheduled")
    class GetScheduledTransfers {

        @Test
        @DisplayName("returns paginated scheduled transfers")
        void returnsPage() {
            ScheduledTransfer s = buildScheduled();
            ScheduledTransferResponse resp = mock(ScheduledTransferResponse.class);
            when(scheduledRepository.findByOwnerId(eq(ownerId), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(s)));
            when(mapper.toScheduledResponse(s)).thenReturn(resp);

            Page<ScheduledTransferResponse> result = service.getScheduledTransfers(ownerId, Pageable.unpaged());

            assertThat(result.getContent()).hasSize(1);
        }
    }

    @Nested
    @DisplayName("POST /scheduled")
    class CreateScheduledTransfer {

        @Test
        @DisplayName("creates a one-time scheduled transfer")
        void createsOneTime() {
            LocalDateTime futureDate = LocalDateTime.now().plusDays(7);
            CreateScheduledTransferRequest req = new CreateScheduledTransferRequest(
                null, UUID.randomUUID().toString(), UUID.randomUUID().toString(), null,
                150000L, "USD", "Rent", ScheduleType.ONE_TIME, null,
                futureDate.toString(), null, null);
            ScheduledTransfer saved = buildScheduled();
            ScheduledTransferResponse resp = mock(ScheduledTransferResponse.class);
            when(scheduledRepository.save(any(ScheduledTransfer.class))).thenReturn(saved);
            when(mapper.toScheduledResponse(saved)).thenReturn(resp);

            ScheduledTransferResponse result = service.createScheduledTransfer(ownerId, req);

            assertThat(result).isEqualTo(resp);
            verify(scheduledRepository).save(any(ScheduledTransfer.class));
        }

        @Test
        @DisplayName("creates a recurring scheduled transfer")
        void createsRecurring() {
            LocalDateTime futureDate = LocalDateTime.now().plusDays(1);
            CreateScheduledTransferRequest req = new CreateScheduledTransferRequest(
                null, UUID.randomUUID().toString(), UUID.randomUUID().toString(), null,
                50000L, "USD", "Salary", ScheduleType.RECURRING, TransferFrequency.MONTHLY,
                futureDate.toString(), null, 12);
            ScheduledTransfer saved = buildScheduled();
            ScheduledTransferResponse resp = mock(ScheduledTransferResponse.class);
            when(scheduledRepository.save(any(ScheduledTransfer.class))).thenReturn(saved);
            when(mapper.toScheduledResponse(saved)).thenReturn(resp);

            service.createScheduledTransfer(ownerId, req);

            verify(scheduledRepository).save(any(ScheduledTransfer.class));
        }

        @Test
        @DisplayName("throws ValidationException for missing source account")
        void throwsOnMissingSource() {
            doThrow(new ValidationException("Source account is required"))
                .when(validator).validateScheduledTransfer(eq(""), any(), any(), any(), any(), any());
            CreateScheduledTransferRequest req = new CreateScheduledTransferRequest(
                null, "", UUID.randomUUID().toString(), null,
                150000L, "USD", "x", ScheduleType.ONE_TIME, null,
                LocalDateTime.now().plusDays(1).toString(), null, null);

            assertThatThrownBy(() -> service.createScheduledTransfer(ownerId, req))
                .isInstanceOf(ValidationException.class);
        }
    }

    @Nested
    @DisplayName("PUT /scheduled/{id}/pause")
    class PauseScheduledTransfer {

        @Test
        @DisplayName("pauses an active scheduled transfer")
        void pauses() {
            ScheduledTransfer s = buildScheduled();
            ScheduledTransferResponse resp = mock(ScheduledTransferResponse.class);
            when(scheduledRepository.findByIdAndOwnerId(scheduledId, ownerId)).thenReturn(Optional.of(s));
            when(scheduledRepository.save(s)).thenReturn(s);
            when(mapper.toScheduledResponse(s)).thenReturn(resp);

            ScheduledTransferResponse result = service.pauseScheduledTransfer(ownerId, scheduledId);

            assertThat(result).isEqualTo(resp);
            assertThat(s.getScheduleStatus()).isEqualTo(ScheduleStatus.PAUSED);
        }

        @Test
        @DisplayName("throws when trying to pause a PAUSED transfer")
        void throwsWhenAlreadyPaused() {
            ScheduledTransfer s = buildScheduled();
            s.pause();
            when(scheduledRepository.findByIdAndOwnerId(scheduledId, ownerId)).thenReturn(Optional.of(s));

            assertThatThrownBy(() -> service.pauseScheduledTransfer(ownerId, scheduledId))
                .isInstanceOf(IllegalStateException.class);
        }
    }

    @Nested
    @DisplayName("PUT /scheduled/{id}/resume")
    class ResumeScheduledTransfer {

        @Test
        @DisplayName("resumes a paused scheduled transfer")
        void resumes() {
            ScheduledTransfer s = buildScheduled();
            s.pause();
            ScheduledTransferResponse resp = mock(ScheduledTransferResponse.class);
            when(scheduledRepository.findByIdAndOwnerId(scheduledId, ownerId)).thenReturn(Optional.of(s));
            when(scheduledRepository.save(s)).thenReturn(s);
            when(mapper.toScheduledResponse(s)).thenReturn(resp);

            service.resumeScheduledTransfer(ownerId, scheduledId);

            assertThat(s.getScheduleStatus()).isEqualTo(ScheduleStatus.ACTIVE);
        }
    }

    @Nested
    @DisplayName("DELETE /scheduled/{id}")
    class CancelScheduledTransfer {

        @Test
        @DisplayName("cancels an active scheduled transfer")
        void cancels() {
            ScheduledTransfer s = buildScheduled();
            when(scheduledRepository.findByIdAndOwnerId(scheduledId, ownerId)).thenReturn(Optional.of(s));

            service.cancelScheduledTransfer(ownerId, scheduledId);

            assertThat(s.getScheduleStatus()).isEqualTo(ScheduleStatus.CANCELLED);
            verify(scheduledRepository).save(s);
        }

        @Test
        @DisplayName("throws when trying to cancel a completed transfer")
        void throwsOnCompleted() {
            ScheduledTransfer s = buildScheduled();
            s.markCompleted();
            when(scheduledRepository.findByIdAndOwnerId(scheduledId, ownerId)).thenReturn(Optional.of(s));

            assertThatThrownBy(() -> service.cancelScheduledTransfer(ownerId, scheduledId))
                .isInstanceOf(IllegalStateException.class);
        }
    }

    @Nested
    @DisplayName("ScheduledTransfer domain methods")
    class ScheduledTransferDomain {

        @Test
        @DisplayName("isDue returns true when ACTIVE and nextExecution in past")
        void isDue() {
            ScheduledTransfer s = new ScheduledTransfer(ownerId, UUID.randomUUID().toString(),
                10000L, "USD", ScheduleType.ONE_TIME, LocalDateTime.now().minusHours(1));
            assertThat(s.isDue()).isTrue();
        }

        @Test
        @DisplayName("isDue returns false when PAUSED")
        void isNotDueWhenPaused() {
            ScheduledTransfer s = new ScheduledTransfer(ownerId, UUID.randomUUID().toString(),
                10000L, "USD", ScheduleType.ONE_TIME, LocalDateTime.now().minusHours(1));
            s.pause();
            assertThat(s.isDue()).isFalse();
        }

        @Test
        @DisplayName("markCompleted completes one-time transfer")
        void markCompletedOneTime() {
            ScheduledTransfer s = new ScheduledTransfer(ownerId, UUID.randomUUID().toString(),
                10000L, "USD", ScheduleType.ONE_TIME, LocalDateTime.now().plusDays(1));
            s.markCompleted();
            assertThat(s.getScheduleStatus()).isEqualTo(ScheduleStatus.COMPLETED);
            assertThat(s.getExecutionCount()).isEqualTo(1);
        }

        @Test
        @DisplayName("markCompleted does not complete recurring if max not reached")
        void markCompletedRecurring() {
            ScheduledTransfer s = new ScheduledTransfer(ownerId, UUID.randomUUID().toString(),
                10000L, "USD", ScheduleType.RECURRING, LocalDateTime.now().plusDays(1));
            s.setFrequency(TransferFrequency.MONTHLY);
            s.setMaxExecutions(12);
            s.markCompleted();
            assertThat(s.getScheduleStatus()).isEqualTo(ScheduleStatus.ACTIVE);
            assertThat(s.getExecutionCount()).isEqualTo(1);
        }

        @Test
        @DisplayName("markCompleted completes recurring when max reached")
        void markCompletedRecurringMaxReached() {
            ScheduledTransfer s = new ScheduledTransfer(ownerId, UUID.randomUUID().toString(),
                10000L, "USD", ScheduleType.RECURRING, LocalDateTime.now().plusDays(1));
            s.setMaxExecutions(2);
            s.markCompleted();
            s.markCompleted();
            assertThat(s.getScheduleStatus()).isEqualTo(ScheduleStatus.COMPLETED);
        }
    }
}
