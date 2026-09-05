package com.finflow.modules.cards.controller;

import com.finflow.modules.cards.dto.*;
import com.finflow.modules.cards.service.CardService;
import com.finflow.shared.dto.ApiResponse;
import com.finflow.shared.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cards")
@Tag(name = "Cards", description = "Card management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping
    @Operation(summary = "List my cards")
    public ResponseEntity<ApiResponse<Page<CardResponse>>> getCards(
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(cardService.getCards(SecurityUtil.getCurrentUserId(), pageable)));
    }

    @GetMapping("/{cardId}")
    @Operation(summary = "Get card details")
    public ResponseEntity<ApiResponse<CardResponse>> getCardById(@PathVariable UUID cardId) {
        return ResponseEntity.ok(ApiResponse.ok(cardService.getCardById(SecurityUtil.getCurrentUserId(), cardId)));
    }

    @PutMapping("/{cardId}")
    @Operation(summary = "Update card details")
    public ResponseEntity<ApiResponse<CardResponse>> updateCard(@PathVariable UUID cardId,
                                                                @RequestBody UpdateCardRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(cardService.updateCard(SecurityUtil.getCurrentUserId(), cardId, request)));
    }

    @PutMapping("/{cardId}/freeze")
    @Operation(summary = "Freeze a card")
    public ResponseEntity<ApiResponse<CardResponse>> freezeCard(@PathVariable UUID cardId) {
        return ResponseEntity.ok(ApiResponse.ok(cardService.freezeCard(SecurityUtil.getCurrentUserId(), cardId)));
    }

    @PutMapping("/{cardId}/unfreeze")
    @Operation(summary = "Unfreeze a card")
    public ResponseEntity<ApiResponse<CardResponse>> unfreezeCard(@PathVariable UUID cardId) {
        return ResponseEntity.ok(ApiResponse.ok(cardService.unfreezeCard(SecurityUtil.getCurrentUserId(), cardId)));
    }

    @PutMapping("/{cardId}/block")
    @Operation(summary = "Block a card")
    public ResponseEntity<ApiResponse<CardResponse>> blockCard(@PathVariable UUID cardId) {
        return ResponseEntity.ok(ApiResponse.ok(cardService.blockCard(SecurityUtil.getCurrentUserId(), cardId)));
    }

    @DeleteMapping("/{cardId}")
    @Operation(summary = "Cancel a card")
    public ResponseEntity<ApiResponse<Void>> cancelCard(@PathVariable UUID cardId) {
        cardService.cancelCard(SecurityUtil.getCurrentUserId(), cardId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Card cancelled successfully"));
    }
}
