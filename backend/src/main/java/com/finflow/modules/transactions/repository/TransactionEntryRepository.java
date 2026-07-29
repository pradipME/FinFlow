package com.finflow.modules.transactions.repository;

import com.finflow.modules.transactions.domain.TransactionEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionEntryRepository extends JpaRepository<TransactionEntry, UUID> {

    List<TransactionEntry> findByTransactionIdOrderByCreatedAtAsc(UUID transactionId);
}
