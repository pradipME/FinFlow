package com.finflow.modules.cards.service;

import com.finflow.modules.cards.domain.Card;
import com.finflow.modules.cards.domain.CardStatus;
import com.finflow.modules.cards.domain.CardType;
import com.finflow.modules.cards.dto.*;
import com.finflow.modules.cards.mapper.CardMapper;
import com.finflow.modules.cards.repository.CardRepository;
import com.finflow.shared.exception.BusinessRuleException;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.exception.ValidationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class CardService {

    private final CardRepository cardRepository;
    private final CardMapper mapper;

    public CardService(CardRepository cardRepository, CardMapper mapper) {
        this.cardRepository = cardRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public Page<CardResponse> getCards(String ownerId, Pageable pageable) {
        return cardRepository.findByOwnerId(ownerId, pageable).map(mapper::toCardResponse);
    }

    @Transactional(readOnly = true)
    public CardResponse getCardById(String ownerId, UUID cardId) {
        Card card = cardRepository.findByIdAndOwnerId(cardId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("Card", cardId.toString()));
        return mapper.toCardResponse(card);
    }

    public CardResponse createCard(String ownerId, CreateCardRequest req) {
        if (req.cardType() == null || req.cardholderName() == null || req.cardholderName().isBlank())
            throw new ValidationException("Cardholder name and card type are required");

        CardType cardType;
        try {
            cardType = CardType.valueOf(req.cardType());
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid card type: " + req.cardType());
        }

        String hash = UUID.randomUUID().toString().replace("-", "");
        String lastFour = hash.substring(hash.length() - 4);
        String currency = req.currency() != null ? req.currency() : "USD";

        Card card = new Card(ownerId, req.accountId(), hash, lastFour, cardType,
            req.cardholderName(), 12, 2028, currency);
        card.setCreditLimitCents(req.creditLimitCents());
        card.setDailyLimitCents(req.dailyLimitCents());
        card.setMonthlyLimitCents(req.monthlyLimitCents());

        card.activate();
        return mapper.toCardResponse(cardRepository.save(card));
    }

    public CardResponse updateCard(String ownerId, UUID cardId, UpdateCardRequest req) {
        Card card = cardRepository.findByIdAndOwnerId(cardId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("Card", cardId.toString()));
        if (req.cardholderName() != null) card.setCardholderName(req.cardholderName());
        if (req.dailyLimitCents() != null) card.setDailyLimitCents(req.dailyLimitCents());
        if (req.monthlyLimitCents() != null) card.setMonthlyLimitCents(req.monthlyLimitCents());
        return mapper.toCardResponse(cardRepository.save(card));
    }

    public CardResponse freezeCard(String ownerId, UUID cardId) {
        Card card = cardRepository.findByIdAndOwnerId(cardId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("Card", cardId.toString()));
        card.freeze();
        return mapper.toCardResponse(cardRepository.save(card));
    }

    public CardResponse unfreezeCard(String ownerId, UUID cardId) {
        Card card = cardRepository.findByIdAndOwnerId(cardId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("Card", cardId.toString()));
        card.unfreeze();
        return mapper.toCardResponse(cardRepository.save(card));
    }

    public CardResponse blockCard(String ownerId, UUID cardId) {
        Card card = cardRepository.findByIdAndOwnerId(cardId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("Card", cardId.toString()));
        card.block();
        return mapper.toCardResponse(cardRepository.save(card));
    }

    public void cancelCard(String ownerId, UUID cardId) {
        Card card = cardRepository.findByIdAndOwnerId(cardId, ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("Card", cardId.toString()));
        card.cancel();
        cardRepository.save(card);
    }
}
