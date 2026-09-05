package com.finflow.modules.cards.repository;

import com.finflow.modules.cards.domain.Card;
import com.finflow.modules.cards.domain.CardStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CardRepository extends JpaRepository<Card, UUID> {

    @Query("SELECT c FROM Card c WHERE c.ownerId = :ownerId ORDER BY c.createdAt DESC")
    Page<Card> findByOwnerId(@Param("ownerId") String ownerId, Pageable pageable);

    @Query("SELECT c FROM Card c WHERE c.id = :id AND c.ownerId = :ownerId")
    Optional<Card> findByIdAndOwnerId(@Param("id") UUID id, @Param("ownerId") String ownerId);

    @Query("SELECT c FROM Card c WHERE c.accountId = :accountId ORDER BY c.createdAt DESC")
    List<Card> findByAccountId(@Param("accountId") String accountId);

    long countByOwnerId(String ownerId);

    long countByCardStatus(CardStatus status);
}
