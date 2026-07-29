package com.finflow.modules.transactions.repository;

import com.finflow.modules.transactions.domain.Transaction;
import com.finflow.modules.transactions.domain.TransactionStatus;
import com.finflow.modules.transactions.domain.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId " +
           "AND (:type IS NULL OR t.transactionType = :type) " +
           "AND (:status IS NULL OR t.transactionStatus = :status) " +
           "AND (:accountId IS NULL OR t.sourceAccountId = :accountId OR t.targetAccountId = :accountId) " +
           "AND (:fromDate IS NULL OR t.createdAt >= :fromDate) " +
           "AND (:toDate IS NULL OR t.createdAt <= :toDate) " +
           "ORDER BY t.createdAt DESC")
    Page<Transaction> findByFilters(
            @Param("userId") String userId,
            @Param("type") TransactionType type,
            @Param("status") TransactionStatus status,
            @Param("accountId") String accountId,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable);

    Optional<Transaction> findByIdempotencyKey(String idempotencyKey);

    @Query("SELECT t FROM Transaction t WHERE t.sourceAccountId = :accountId OR t.targetAccountId = :accountId ORDER BY t.createdAt DESC")
    Page<Transaction> findByAccountId(@Param("accountId") String accountId, Pageable pageable);
}
