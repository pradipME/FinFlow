package com.finflow.modules.beneficiaries.controller;

import com.finflow.modules.beneficiaries.domain.BeneficiaryStatus;
import com.finflow.modules.beneficiaries.dto.BeneficiaryResponse;
import com.finflow.modules.beneficiaries.dto.CreateBeneficiaryRequest;
import com.finflow.modules.beneficiaries.dto.UpdateBeneficiaryRequest;
import com.finflow.modules.beneficiaries.service.BeneficiaryService;
import com.finflow.shared.dto.ApiResponse;
import com.finflow.shared.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/beneficiaries")
@Tag(name = "Beneficiaries", description = "Beneficiary management endpoints")
public class BeneficiaryController {

    private static final Logger log = LoggerFactory.getLogger(BeneficiaryController.class);

    private final BeneficiaryService beneficiaryService;

    public BeneficiaryController(BeneficiaryService beneficiaryService) {
        this.beneficiaryService = beneficiaryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a beneficiary")
    public ResponseEntity<ApiResponse<BeneficiaryResponse>> createBeneficiary(
            @Valid @RequestBody CreateBeneficiaryRequest request) {
        log.info("Create beneficiary request: name={}", request.beneficiaryName());
        BeneficiaryResponse response = beneficiaryService.createBeneficiary(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Beneficiary created successfully"));
    }

    @GetMapping("/{beneficiaryId}")
    @Operation(summary = "Get beneficiary details")
    public ResponseEntity<ApiResponse<BeneficiaryResponse>> getBeneficiary(
            @PathVariable UUID beneficiaryId) {
        BeneficiaryResponse response = beneficiaryService.getBeneficiary(beneficiaryId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    @Operation(summary = "List my beneficiaries")
    public ResponseEntity<ApiResponse<PageResponse<BeneficiaryResponse>>> getMyBeneficiaries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<BeneficiaryResponse> response = beneficiaryService.getMyBeneficiaries(pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PatchMapping("/{beneficiaryId}")
    @Operation(summary = "Update beneficiary")
    public ResponseEntity<ApiResponse<BeneficiaryResponse>> updateBeneficiary(
            @PathVariable UUID beneficiaryId,
            @Valid @RequestBody UpdateBeneficiaryRequest request) {
        BeneficiaryResponse response = beneficiaryService.updateBeneficiary(beneficiaryId, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Beneficiary updated successfully"));
    }

    @DeleteMapping("/{beneficiaryId}")
    @Operation(summary = "Delete beneficiary")
    public ResponseEntity<ApiResponse<Void>> deleteBeneficiary(
            @PathVariable UUID beneficiaryId) {
        beneficiaryService.deleteBeneficiary(beneficiaryId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Beneficiary deleted successfully"));
    }

    @PostMapping("/{beneficiaryId}/status")
    @Operation(summary = "Change beneficiary status")
    public ResponseEntity<ApiResponse<BeneficiaryResponse>> changeStatus(
            @PathVariable UUID beneficiaryId,
            @RequestParam BeneficiaryStatus status) {
        BeneficiaryResponse response = beneficiaryService.changeStatus(beneficiaryId, status);
        return ResponseEntity.ok(ApiResponse.ok(response, "Status changed successfully"));
    }
}
