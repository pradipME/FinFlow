package com.finflow.modules.cards.mapper;

import com.finflow.modules.cards.domain.Card;
import com.finflow.modules.cards.domain.CardTransaction;
import com.finflow.modules.cards.dto.CardResponse;
import com.finflow.modules.cards.dto.CardTransactionResponse;
import org.springframework.stereotype.Component;

@Component
public class CardMapper {

    public CardResponse toCardResponse(Card c) {
        return new CardResponse(
            c.getId() != null ? c.getId().toString() : null,
            c.getAccountId(),
            c.getCardLastFour(),
            c.getCardType(),
            c.getCardStatus(),
            c.getCardholderName(),
            c.getExpiryMonth(),
            c.getExpiryYear(),
            c.getCreditLimitCents(),
            c.getDailyLimitCents(),
            c.getMonthlyLimitCents(),
            c.getCurrency(),
            c.getPinSet(),
            c.getCreatedAt() != null ? c.getCreatedAt().toString() : null
        );
    }

    public CardTransactionResponse toTransactionResponse(CardTransaction ct) {
        return new CardTransactionResponse(
            ct.getId() != null ? ct.getId().toString() : null,
            ct.getCardId(),
            ct.getTransactionType(),
            ct.getAmountCents(),
            ct.getCurrency(),
            ct.getMerchantName(),
            ct.getMerchantCategory(),
            ct.getStatus(),
            ct.getAuthorizationCode(),
            ct.getCreatedAt() != null ? ct.getCreatedAt().toString() : null
        );
    }
}
