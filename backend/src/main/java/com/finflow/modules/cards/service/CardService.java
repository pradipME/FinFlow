package com.finflow.modules.cards.service;

import com.finflow.modules.cards.domain.Card;
import com.finflow.modules.cards.domain.CardStatus;
import com.finflow.modules.cards.domain.CardType;
import com.finflow.modules.cards.dto.*;
import com.finflow.modules.cards.mapper.CardMapper;
import com.finflow.modules.cards.repository.CardRepository;
import com.finflow.modules.accounts.domain.Account;
import com.finflow.modules.accounts.repository.AccountRepository;
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
    private final AccountRepository accountRepository;

    public CardService(CardRepository cardRepository, CardMapper mapper, AccountRepository accountRepository) {
        this.cardRepository = cardRepository;
        this.mapper = mapper;
        this.accountRepository = accountRepository;
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

        validateAccountOwnership(req.accountId(), ownerId);

        CardType cardType = parseCardType(req.cardType());
        return createAndSave(ownerId, req.accountId(), cardType, req.cardholderName(),
                req.creditLimitCents(), req.dailyLimitCents(), req.monthlyLimitCents(), req.currency());
    }

    /**
     * Creates a card for a customer as part of the bank-style workflow
     * (invoked by an ADMIN approving a CARD_REQUEST).
     *
     * <p>Server-side ownership is enforced: {@code accountId} must belong to
     * {@code customerId} before a card is issued, preventing cross-customer
     * card creation (IDOR).</p>
     *
     * @param customerId the customer who will own the card
     * @param accountId the account the card is linked to (must belong to the customer)
     * @param cardType the card type
     * @param cardholderName the cardholder name
     * @param creditLimitCents optional credit limit
     * @param dailyLimitCents optional daily limit
     * @param monthlyLimitCents optional monthly limit
     * @param currency optional currency
     * @return the created (ACTIVE) card
     */
    @Transactional
    public CardResponse createCardForCustomer(String customerId, String accountId, CardType cardType,
                                              String cardholderName, Long creditLimitCents,
                                              Long dailyLimitCents, Long monthlyLimitCents, String currency) {
        validateAccountOwnership(accountId, customerId);
        return createAndSave(customerId, accountId, cardType, cardholderName,
                creditLimitCents, dailyLimitCents, monthlyLimitCents, currency);
    }

    private CardResponse createAndSave(String ownerId, String accountId, CardType cardType,
                                       String cardholderName, Long creditLimitCents,
                                       Long dailyLimitCents, Long monthlyLimitCents, String currency) {
        String hash = UUID.randomUUID().toString().replace("-", "");
        String lastFour = hash.substring(hash.length() - 4);
        String curr = currency != null ? currency : "USD";

        Card card = new Card(ownerId, accountId, hash, lastFour, cardType,
            cardholderName, 12, 2028, curr);
        card.setCreditLimitCents(creditLimitCents);
        card.setDailyLimitCents(dailyLimitCents);
        card.setMonthlyLimitCents(monthlyLimitCents);

        card.activate();
        return mapper.toCardResponse(cardRepository.save(card));
    }

    private CardType parseCardType(String raw) {
        try {
            return CardType.valueOf(raw);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new ValidationException("Invalid card type: " + raw);
        }
    }

    private void validateAccountOwnership(String accountId, String ownerId) {
        UUID accountUuid;
        try {
            accountUuid = UUID.fromString(accountId);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new ValidationException("Invalid account id");
        }
        Account account = accountRepository.findByIdAndIsDeletedFalse(accountUuid)
            .orElseThrow(() -> new ResourceNotFoundException("Account", accountId));
        if (!account.getOwnerId().equals(ownerId)) {
            throw new ValidationException("Account does not belong to the card owner");
        }
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
