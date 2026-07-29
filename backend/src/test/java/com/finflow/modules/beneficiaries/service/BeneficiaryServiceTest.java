package com.finflow.modules.beneficiaries.service;

import com.finflow.modules.beneficiaries.domain.Beneficiary;
import com.finflow.modules.beneficiaries.domain.BeneficiaryStatus;
import com.finflow.modules.beneficiaries.dto.BeneficiaryResponse;
import com.finflow.modules.beneficiaries.dto.CreateBeneficiaryRequest;
import com.finflow.modules.beneficiaries.dto.UpdateBeneficiaryRequest;
import com.finflow.modules.beneficiaries.mapper.BeneficiaryMapper;
import com.finflow.modules.beneficiaries.repository.BeneficiaryRepository;
import com.finflow.modules.beneficiaries.validator.BeneficiaryValidator;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.exception.ValidationException;
import com.finflow.shared.util.SecurityUtil;
import org.junit.jupiter.api.AfterEach;
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
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BeneficiaryServiceTest {

    @Mock private BeneficiaryRepository beneficiaryRepository;
    @Mock private BeneficiaryMapper beneficiaryMapper;
    @Mock private BeneficiaryValidator beneficiaryValidator;

    @InjectMocks private BeneficiaryService beneficiaryService;

    private UUID testUserId;
    private UUID testBeneficiaryId;
    private Beneficiary testBeneficiary;
    private BeneficiaryResponse testResponse;

    @BeforeEach
    void setUp() {
        testUserId = UUID.randomUUID();
        testBeneficiaryId = UUID.randomUUID();

        testBeneficiary = new Beneficiary(testUserId.toString(), "John Doe", "1234567890");
        testBeneficiary.setBankName("Chase Bank");

        testResponse = new BeneficiaryResponse(
                testBeneficiaryId.toString(), "Friend", "John Doe", null, "Chase Bank",
                "1234567890", null, null, null, "USD", BeneficiaryStatus.ACTIVE,
                "2026-01-01T00:00:00", "2026-01-01T00:00:00");

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(testUserId.toString(), null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("Create Beneficiary")
    class CreateBeneficiary {

        @Test
        @DisplayName("Should create a beneficiary successfully")
        void createBeneficiary_success() {
            CreateBeneficiaryRequest request = new CreateBeneficiaryRequest(
                    "John Doe", "Friend", "john@example.com", "Chase Bank",
                    "1234567890", "021000021", null, null, "USD");

            when(beneficiaryMapper.toResponse(any(Beneficiary.class))).thenReturn(testResponse);
            when(beneficiaryRepository.save(any(Beneficiary.class))).thenAnswer(inv -> {
                Beneficiary b = inv.getArgument(0);
                return b;
            });

            BeneficiaryResponse result = beneficiaryService.createBeneficiary(request);

            assertThat(result).isNotNull();
            verify(beneficiaryValidator).validateNoDuplicateAccount(testUserId.toString(), "1234567890");
            verify(beneficiaryRepository).save(any(Beneficiary.class));
        }

        @Test
        @DisplayName("Should fail with duplicate account number")
        void createBeneficiary_duplicateAccount() {
            CreateBeneficiaryRequest request = new CreateBeneficiaryRequest(
                    "John Doe", null, null, null, "1234567890", null, null, null, null);

            doThrow(new ValidationException("A beneficiary with this account number already exists"))
                    .when(beneficiaryValidator).validateNoDuplicateAccount(testUserId.toString(), "1234567890");

            assertThatThrownBy(() -> beneficiaryService.createBeneficiary(request))
                    .isInstanceOf(ValidationException.class)
                    .hasMessageContaining("already exists");
        }
    }

    @Nested
    @DisplayName("Get Beneficiary")
    class GetBeneficiary {

        @Test
        @DisplayName("Should return beneficiary")
        void getBeneficiary_success() {
            when(beneficiaryValidator.getAndValidateBeneficiary(testBeneficiaryId, testUserId.toString()))
                    .thenReturn(testBeneficiary);
            when(beneficiaryMapper.toResponse(testBeneficiary)).thenReturn(testResponse);

            BeneficiaryResponse result = beneficiaryService.getBeneficiary(testBeneficiaryId);

            assertThat(result).isNotNull();
            assertThat(result.beneficiaryName()).isEqualTo("John Doe");
        }

        @Test
        @DisplayName("Should fail if not found")
        void getBeneficiary_notFound() {
            when(beneficiaryValidator.getAndValidateBeneficiary(testBeneficiaryId, testUserId.toString()))
                    .thenThrow(new ResourceNotFoundException("Beneficiary", testBeneficiaryId.toString()));

            assertThatThrownBy(() -> beneficiaryService.getBeneficiary(testBeneficiaryId))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("Update Beneficiary")
    class UpdateBeneficiary {

        @Test
        @DisplayName("Should update beneficiary")
        void updateBeneficiary_success() {
            UpdateBeneficiaryRequest request = new UpdateBeneficiaryRequest(
                    "Jane Doe", null, null, null, null, null, null, null, null);

            when(beneficiaryValidator.getAndValidateBeneficiary(testBeneficiaryId, testUserId.toString()))
                    .thenReturn(testBeneficiary);
            when(beneficiaryMapper.toResponse(any(Beneficiary.class))).thenReturn(testResponse);
            when(beneficiaryRepository.save(any(Beneficiary.class))).thenReturn(testBeneficiary);

            BeneficiaryResponse result = beneficiaryService.updateBeneficiary(testBeneficiaryId, request);

            assertThat(result).isNotNull();
            verify(beneficiaryRepository).save(any(Beneficiary.class));
        }
    }

    @Nested
    @DisplayName("Delete Beneficiary")
    class DeleteBeneficiary {

        @Test
        @DisplayName("Should soft delete beneficiary")
        void deleteBeneficiary_success() {
            when(beneficiaryValidator.getAndValidateBeneficiary(testBeneficiaryId, testUserId.toString()))
                    .thenReturn(testBeneficiary);
            when(beneficiaryRepository.save(any(Beneficiary.class))).thenReturn(testBeneficiary);

            beneficiaryService.deleteBeneficiary(testBeneficiaryId);

            verify(beneficiaryRepository).save(testBeneficiary);
        }
    }

    @Nested
    @DisplayName("Change Status")
    class ChangeStatus {

        @Test
        @DisplayName("Should change status to BLOCKED")
        void changeStatus_block() {
            when(beneficiaryValidator.getAndValidateBeneficiary(testBeneficiaryId, testUserId.toString()))
                    .thenReturn(testBeneficiary);
            when(beneficiaryMapper.toResponse(any(Beneficiary.class))).thenReturn(testResponse);
            when(beneficiaryRepository.save(any(Beneficiary.class))).thenReturn(testBeneficiary);

            beneficiaryService.changeStatus(testBeneficiaryId, BeneficiaryStatus.BLOCKED);

            assertThat(testBeneficiary.getBeneficiaryStatus()).isEqualTo(BeneficiaryStatus.BLOCKED);
        }
    }
}
