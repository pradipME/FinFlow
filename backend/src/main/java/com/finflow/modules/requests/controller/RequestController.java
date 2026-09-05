package com.finflow.modules.requests.controller;

import com.finflow.modules.requests.dto.CustomerRequestResponse;
import com.finflow.modules.requests.dto.CreateRequestRequest;
import com.finflow.modules.requests.service.RequestService;
import com.finflow.shared.dto.ApiResponse;
import com.finflow.shared.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/requests")
@Tag(name = "Requests", description = "Customer request endpoints (account / card)")
@SecurityRequirement(name = "bearerAuth")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a customer request (account or card)")
    public ResponseEntity<ApiResponse<CustomerRequestResponse>> createRequest(
            @Valid @RequestBody CreateRequestRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(requestService.createRequest(request), "Request submitted"));
    }

    @GetMapping
    @Operation(summary = "List my requests")
    public ResponseEntity<ApiResponse<PageResponse<CustomerRequestResponse>>> getMyRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.ok(requestService.getMyRequests(pageable)));
    }
}