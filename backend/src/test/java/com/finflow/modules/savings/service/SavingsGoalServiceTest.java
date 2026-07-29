package com.finflow.modules.savings.service;

import com.finflow.modules.savings.domain.SavingsGoal;
import com.finflow.modules.savings.domain.SavingsGoalStatus;
import com.finflow.modules.savings.dto.*;
import com.finflow.modules.savings.mapper.SavingsGoalMapper;
import com.finflow.modules.savings.repository.SavingsGoalRepository;
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

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SavingsGoalService Unit Tests")
class SavingsGoalServiceTest {

    @Mock private SavingsGoalRepository repository;
    @Mock private SavingsGoalMapper mapper;

    @InjectMocks private SavingsGoalService service;

    private String ownerId;
    private UUID goalId;

    @BeforeEach
    void setUp() {
        ownerId = UUID.randomUUID().toString();
        goalId = UUID.randomUUID();
    }

    private SavingsGoal buildGoal() {
        SavingsGoal g = new SavingsGoal(ownerId, UUID.randomUUID().toString(), "Emergency Fund", 100000L, "USD");
        ReflectionTestUtils.setField(g, "id", goalId);
        return g;
    }

    @Nested
    @DisplayName("GET /savings")
    class GetGoals {

        @Test
        @DisplayName("returns paginated goals for owner")
        void returnsPage() {
            SavingsGoal g = buildGoal();
            SavingsGoalResponse resp = mock(SavingsGoalResponse.class);
            when(repository.findByOwnerId(eq(ownerId), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(g)));
            when(mapper.toResponse(g)).thenReturn(resp);

            Page<SavingsGoalResponse> result = service.getGoals(ownerId, Pageable.unpaged());

            assertThat(result.getContent()).hasSize(1);
        }
    }

    @Nested
    @DisplayName("GET /savings/{id}")
    class GetGoalById {

        @Test
        @DisplayName("returns goal when found")
        void returnsGoal() {
            SavingsGoal g = buildGoal();
            SavingsGoalResponse resp = mock(SavingsGoalResponse.class);
            when(repository.findByIdAndOwnerId(goalId, ownerId)).thenReturn(Optional.of(g));
            when(mapper.toResponse(g)).thenReturn(resp);

            assertThat(service.getGoalById(ownerId, goalId)).isEqualTo(resp);
        }

        @Test
        @DisplayName("throws ResourceNotFoundException when not found")
        void throwsNotFound() {
            when(repository.findByIdAndOwnerId(goalId, ownerId)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.getGoalById(ownerId, goalId))
                .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("POST /savings")
    class CreateGoal {

        @Test
        @DisplayName("creates a new savings goal")
        void creates() {
            CreateSavingsGoalRequest req = new CreateSavingsGoalRequest(UUID.randomUUID().toString(),
                "Emergency Fund", 100000L, "USD", null, "Save for emergencies");
            SavingsGoal saved = buildGoal();
            SavingsGoalResponse resp = mock(SavingsGoalResponse.class);
            when(repository.save(any(SavingsGoal.class))).thenReturn(saved);
            when(mapper.toResponse(saved)).thenReturn(resp);

            SavingsGoalResponse result = service.createGoal(ownerId, req);

            assertThat(result).isEqualTo(resp);
            verify(repository).save(any(SavingsGoal.class));
        }

        @Test
        @DisplayName("creates a goal with deadline")
        void createsWithDeadline() {
            CreateSavingsGoalRequest req = new CreateSavingsGoalRequest(UUID.randomUUID().toString(),
                "Vacation", 50000L, "USD", "2026-12-31", "Trip fund");
            SavingsGoal saved = buildGoal();
            SavingsGoalResponse resp = mock(SavingsGoalResponse.class);
            when(repository.save(any(SavingsGoal.class))).thenReturn(saved);
            when(mapper.toResponse(saved)).thenReturn(resp);

            service.createGoal(ownerId, req);

            verify(repository).save(any(SavingsGoal.class));
        }

        @Test
        @DisplayName("throws ValidationException for missing name")
        void throwsOnMissingName() {
            CreateSavingsGoalRequest req = new CreateSavingsGoalRequest(UUID.randomUUID().toString(),
                "", 100000L, "USD", null, null);

            assertThatThrownBy(() -> service.createGoal(ownerId, req))
                .isInstanceOf(ValidationException.class);
        }

        @Test
        @DisplayName("throws ValidationException for zero target")
        void throwsOnZeroTarget() {
            CreateSavingsGoalRequest req = new CreateSavingsGoalRequest(UUID.randomUUID().toString(),
                "Fund", 0L, "USD", null, null);

            assertThatThrownBy(() -> service.createGoal(ownerId, req))
                .isInstanceOf(ValidationException.class);
        }
    }

    @Nested
    @DisplayName("POST /savings/{id}/deposit")
    class Deposit {

        @Test
        @DisplayName("deposits to a savings goal")
        void deposits() {
            SavingsGoal g = buildGoal();
            DepositToSavingsGoalRequest req = new DepositToSavingsGoalRequest(50000L);
            SavingsGoalResponse resp = mock(SavingsGoalResponse.class);
            when(repository.findByIdAndOwnerId(goalId, ownerId)).thenReturn(Optional.of(g));
            when(repository.save(g)).thenReturn(g);
            when(mapper.toResponse(g)).thenReturn(resp);

            service.deposit(ownerId, goalId, req);

            assertThat(g.getCurrentAmountCents()).isEqualTo(50000L);
            verify(repository).save(g);
        }

        @Test
        @DisplayName("completes goal when target reached")
        void completesOnTargetReached() {
            SavingsGoal g = buildGoal();
            DepositToSavingsGoalRequest req = new DepositToSavingsGoalRequest(100000L);
            SavingsGoalResponse resp = mock(SavingsGoalResponse.class);
            when(repository.findByIdAndOwnerId(goalId, ownerId)).thenReturn(Optional.of(g));
            when(repository.save(g)).thenReturn(g);
            when(mapper.toResponse(g)).thenReturn(resp);

            service.deposit(ownerId, goalId, req);

            assertThat(g.getGoalStatus()).isEqualTo(SavingsGoalStatus.COMPLETED);
        }

        @Test
        @DisplayName("throws ValidationException for negative deposit")
        void throwsOnNegativeDeposit() {
            DepositToSavingsGoalRequest req = new DepositToSavingsGoalRequest(-100L);

            assertThatThrownBy(() -> service.deposit(ownerId, goalId, req))
                .isInstanceOf(ValidationException.class);
        }
    }

    @Nested
    @DisplayName("PUT /savings/{id}/pause")
    class PauseGoal {

        @Test
        @DisplayName("pauses an active goal")
        void pauses() {
            SavingsGoal g = buildGoal();
            SavingsGoalResponse resp = mock(SavingsGoalResponse.class);
            when(repository.findByIdAndOwnerId(goalId, ownerId)).thenReturn(Optional.of(g));
            when(repository.save(g)).thenReturn(g);
            when(mapper.toResponse(g)).thenReturn(resp);

            service.pauseGoal(ownerId, goalId);

            assertThat(g.getGoalStatus()).isEqualTo(SavingsGoalStatus.PAUSED);
        }

        @Test
        @DisplayName("throws when trying to pause a PAUSED goal")
        void throwsWhenAlreadyPaused() {
            SavingsGoal g = buildGoal();
            g.pause();
            when(repository.findByIdAndOwnerId(goalId, ownerId)).thenReturn(Optional.of(g));

            assertThatThrownBy(() -> service.pauseGoal(ownerId, goalId))
                .isInstanceOf(IllegalStateException.class);
        }
    }

    @Nested
    @DisplayName("PUT /savings/{id}/resume")
    class ResumeGoal {

        @Test
        @DisplayName("resumes a paused goal")
        void resumes() {
            SavingsGoal g = buildGoal();
            g.pause();
            SavingsGoalResponse resp = mock(SavingsGoalResponse.class);
            when(repository.findByIdAndOwnerId(goalId, ownerId)).thenReturn(Optional.of(g));
            when(repository.save(g)).thenReturn(g);
            when(mapper.toResponse(g)).thenReturn(resp);

            service.resumeGoal(ownerId, goalId);

            assertThat(g.getGoalStatus()).isEqualTo(SavingsGoalStatus.ACTIVE);
        }
    }

    @Nested
    @DisplayName("DELETE /savings/{id}")
    class CancelGoal {

        @Test
        @DisplayName("cancels an active goal")
        void cancels() {
            SavingsGoal g = buildGoal();
            when(repository.findByIdAndOwnerId(goalId, ownerId)).thenReturn(Optional.of(g));

            service.cancelGoal(ownerId, goalId);

            assertThat(g.getGoalStatus()).isEqualTo(SavingsGoalStatus.CANCELLED);
            verify(repository).save(g);
        }

        @Test
        @DisplayName("throws when trying to cancel a completed goal")
        void throwsOnCompleted() {
            SavingsGoal g = buildGoal();
            g.deposit(100000L);
            when(repository.findByIdAndOwnerId(goalId, ownerId)).thenReturn(Optional.of(g));

            assertThatThrownBy(() -> service.cancelGoal(ownerId, goalId))
                .isInstanceOf(IllegalStateException.class);
        }
    }

    @Nested
    @DisplayName("SavingsGoal domain methods")
    class SavingsGoalDomain {

        @Test
        @DisplayName("getProgressPercent returns correct percentage")
        void progressPercent() {
            SavingsGoal g = new SavingsGoal(ownerId, UUID.randomUUID().toString(), "Fund", 100000L, "USD");
            g.deposit(25000L);
            assertThat(g.getProgressPercent()).isCloseTo(25.0, org.assertj.core.data.Offset.offset(0.1));
        }

        @Test
        @DisplayName("withdraw reduces current amount")
        void withdraw() {
            SavingsGoal g = new SavingsGoal(ownerId, UUID.randomUUID().toString(), "Fund", 100000L, "USD");
            g.deposit(50000L);
            g.withdraw(10000L);
            assertThat(g.getCurrentAmountCents()).isEqualTo(40000L);
        }

        @Test
        @DisplayName("withdraw throws on insufficient balance")
        void withdrawInsufficient() {
            SavingsGoal g = new SavingsGoal(ownerId, UUID.randomUUID().toString(), "Fund", 100000L, "USD");
            assertThatThrownBy(() -> g.withdraw(1000L))
                .isInstanceOf(IllegalStateException.class);
        }
    }
}
