package com.finflow.modules.cards.repository;

import com.finflow.modules.cards.domain.CardTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CardTransactionRepository extends JpaRepository<CardTransaction, UUID> {

    @Query("SELECT ct FROM CardTransaction ct WHERE ct.cardId = :cardId ORDER BY ct.createdAt DESC")
    Page<CardTransaction> findByCardId(@Param("cardId") String cardId, Pageable pageable);

    @Query("SELECT ct FROM CardTransaction ct WHERE ct.id = :id")
    Optional<CardTransaction> findById(@Param("id") UUID id);

    long countByCardId(String cardId);
}
