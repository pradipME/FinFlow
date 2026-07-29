package com.finflow.modules.cards.service;

import com.finflow.modules.cards.domain.*;
import com.finflow.modules.cards.dto.*;
import com.finflow.modules.cards.mapper.CardMapper;
import com.finflow.modules.cards.repository.CardRepository;
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

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CardService Unit Tests")
class CardServiceTest {

    @Mock private CardRepository cardRepository;
    @Mock private CardMapper mapper;

    @InjectMocks private CardService service;

    private String ownerId;
    private UUID cardId;

    @BeforeEach
    void setUp() {
        ownerId = UUID.randomUUID().toString();
        cardId = UUID.randomUUID();
    }

    private Card buildCard() {
        Card c = new Card(ownerId, UUID.randomUUID().toString(), "abc123", "1234",
            CardType.DEBIT, "John Doe", 12, 2028, "USD");
        ReflectionTestUtils.setField(c, "id", cardId);
        c.activate();
        return c;
    }

    @Nested
    @DisplayName("GET /cards")
    class GetCards {

        @Test
        @DisplayName("returns paginated cards for owner")
        void returnsPage() {
            Card c = buildCard();
            CardResponse resp = mock(CardResponse.class);
            when(cardRepository.findByOwnerId(eq(ownerId), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(c)));
            when(mapper.toCardResponse(c)).thenReturn(resp);

            Page<CardResponse> result = service.getCards(ownerId, Pageable.unpaged());

            assertThat(result.getContent()).hasSize(1);
            verify(cardRepository).findByOwnerId(eq(ownerId), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /cards/{id}")
    class GetCardById {

        @Test
        @DisplayName("returns card when found")
        void returnsCard() {
            Card c = buildCard();
            CardResponse resp = mock(CardResponse.class);
            when(cardRepository.findByIdAndOwnerId(cardId, ownerId)).thenReturn(Optional.of(c));
            when(mapper.toCardResponse(c)).thenReturn(resp);

            assertThat(service.getCardById(ownerId, cardId)).isEqualTo(resp);
        }

        @Test
        @DisplayName("throws ResourceNotFoundException when not found")
        void throwsNotFound() {
            when(cardRepository.findByIdAndOwnerId(cardId, ownerId)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.getCardById(ownerId, cardId))
                .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("POST /cards")
    class CreateCard {

        @Test
        @DisplayName("creates and activates a debit card")
        void createsDebitCard() {
            CreateCardRequest req = new CreateCardRequest(UUID.randomUUID().toString(), "DEBIT",
                "John Doe", null, 50000L, 500000L, "USD");
            Card saved = buildCard();
            CardResponse resp = mock(CardResponse.class);
            when(cardRepository.save(any(Card.class))).thenReturn(saved);
            when(mapper.toCardResponse(saved)).thenReturn(resp);

            CardResponse result = service.createCard(ownerId, req);

            assertThat(result).isEqualTo(resp);
            verify(cardRepository).save(any(Card.class));
        }

        @Test
        @DisplayName("throws ValidationException for missing cardholder name")
        void throwsOnMissingName() {
            CreateCardRequest req = new CreateCardRequest(UUID.randomUUID().toString(), "DEBIT",
                "", null, null, null, "USD");

            assertThatThrownBy(() -> service.createCard(ownerId, req))
                .isInstanceOf(ValidationException.class);
        }
    }

    @Nested
    @DisplayName("PUT /cards/{id}/freeze")
    class FreezeCard {

        @Test
        @DisplayName("freezes an active card")
        void freezes() {
            Card c = buildCard();
            CardResponse resp = mock(CardResponse.class);
            when(cardRepository.findByIdAndOwnerId(cardId, ownerId)).thenReturn(Optional.of(c));
            when(cardRepository.save(c)).thenReturn(c);
            when(mapper.toCardResponse(c)).thenReturn(resp);

            CardResponse result = service.freezeCard(ownerId, cardId);

            assertThat(result).isEqualTo(resp);
            assertThat(c.getCardStatus()).isEqualTo(CardStatus.FROZEN);
        }

        @Test
        @DisplayName("throws when trying to freeze a FROZEN card")
        void throwsWhenAlreadyFrozen() {
            Card c = buildCard();
            c.freeze();
            when(cardRepository.findByIdAndOwnerId(cardId, ownerId)).thenReturn(Optional.of(c));

            assertThatThrownBy(() -> service.freezeCard(ownerId, cardId))
                .isInstanceOf(IllegalStateException.class);
        }
    }

    @Nested
    @DisplayName("PUT /cards/{id}/unfreeze")
    class UnfreezeCard {

        @Test
        @DisplayName("unfreezes a frozen card")
        void unfreezes() {
            Card c = buildCard();
            c.freeze();
            CardResponse resp = mock(CardResponse.class);
            when(cardRepository.findByIdAndOwnerId(cardId, ownerId)).thenReturn(Optional.of(c));
            when(cardRepository.save(c)).thenReturn(c);
            when(mapper.toCardResponse(c)).thenReturn(resp);

            service.unfreezeCard(ownerId, cardId);

            assertThat(c.getCardStatus()).isEqualTo(CardStatus.ACTIVE);
        }
    }

    @Nested
    @DisplayName("PUT /cards/{id}/block")
    class BlockCard {

        @Test
        @DisplayName("blocks an active card")
        void blocks() {
            Card c = buildCard();
            when(cardRepository.findByIdAndOwnerId(cardId, ownerId)).thenReturn(Optional.of(c));

            service.blockCard(ownerId, cardId);

            assertThat(c.getCardStatus()).isEqualTo(CardStatus.BLOCKED);
        }
    }

    @Nested
    @DisplayName("DELETE /cards/{id}")
    class CancelCard {

        @Test
        @DisplayName("cancels an active card")
        void cancels() {
            Card c = buildCard();
            when(cardRepository.findByIdAndOwnerId(cardId, ownerId)).thenReturn(Optional.of(c));

            service.cancelCard(ownerId, cardId);

            assertThat(c.getCardStatus()).isEqualTo(CardStatus.CANCELLED);
            verify(cardRepository).save(c);
        }

        @Test
        @DisplayName("throws when trying to cancel an already cancelled card")
        void throwsOnCancelled() {
            Card c = buildCard();
            c.cancel();
            when(cardRepository.findByIdAndOwnerId(cardId, ownerId)).thenReturn(Optional.of(c));

            assertThatThrownBy(() -> service.cancelCard(ownerId, cardId))
                .isInstanceOf(IllegalStateException.class);
        }
    }

    @Nested
    @DisplayName("Card domain methods")
    class CardDomain {

        @Test
        @DisplayName("isOperational returns true when ACTIVE")
        void isOperational() {
            Card c = new Card(ownerId, UUID.randomUUID().toString(), "hash", "1234",
                CardType.DEBIT, "Test", 12, 2028, "USD");
            c.activate();
            assertThat(c.isOperational()).isTrue();
        }

        @Test
        @DisplayName("isOperational returns false when FROZEN")
        void isNotOperationalWhenFrozen() {
            Card c = new Card(ownerId, UUID.randomUUID().toString(), "hash", "1234",
                CardType.DEBIT, "Test", 12, 2028, "USD");
            c.activate();
            c.freeze();
            assertThat(c.isOperational()).isFalse();
        }
    }
}
