package com.finflow.modules.transactions.mapper;

import com.finflow.modules.transactions.domain.EntryType;
import com.finflow.modules.transactions.domain.Transaction;
import com.finflow.modules.transactions.domain.TransactionEntry;
import com.finflow.modules.transactions.domain.TransactionStatus;
import com.finflow.modules.transactions.domain.TransactionType;
import com.finflow.modules.transactions.dto.TransactionDetailResponse;
import com.finflow.modules.transactions.dto.TransactionEntryResponse;
import com.finflow.modules.transactions.dto.TransactionSummaryResponse;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-01T18:57:51+0530",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class TransactionMapperImpl implements TransactionMapper {

    @Override
    public TransactionSummaryResponse toSummaryResponse(Transaction transaction) {
        if ( transaction == null ) {
            return null;
        }

        String id = null;
        TransactionType transactionType = null;
        TransactionStatus transactionStatus = null;
        String description = null;
        String referenceNumber = null;
        Long amountCents = null;
        String currency = null;
        String sourceAccountId = null;
        String targetAccountId = null;
        Long feeAmountCents = null;
        String createdAt = null;

        if ( transaction.getId() != null ) {
            id = transaction.getId().toString();
        }
        transactionType = transaction.getTransactionType();
        transactionStatus = transaction.getTransactionStatus();
        description = transaction.getDescription();
        referenceNumber = transaction.getReferenceNumber();
        amountCents = transaction.getAmountCents();
        currency = transaction.getCurrency();
        sourceAccountId = transaction.getSourceAccountId();
        targetAccountId = transaction.getTargetAccountId();
        feeAmountCents = transaction.getFeeAmountCents();
        createdAt = formatDateTime( transaction.getCreatedAt() );

        TransactionSummaryResponse transactionSummaryResponse = new TransactionSummaryResponse( id, transactionType, transactionStatus, description, referenceNumber, amountCents, currency, sourceAccountId, targetAccountId, feeAmountCents, createdAt );

        return transactionSummaryResponse;
    }

    @Override
    public TransactionDetailResponse toDetailResponse(Transaction transaction) {
        if ( transaction == null ) {
            return null;
        }

        String id = null;
        TransactionType transactionType = null;
        TransactionStatus transactionStatus = null;
        String description = null;
        String referenceNumber = null;
        Long amountCents = null;
        String currency = null;
        String sourceAccountId = null;
        String targetAccountId = null;
        Long feeAmountCents = null;
        String userId = null;
        String completedAt = null;
        String failedReason = null;
        List<TransactionEntryResponse> entries = null;
        String createdAt = null;
        String updatedAt = null;

        if ( transaction.getId() != null ) {
            id = transaction.getId().toString();
        }
        transactionType = transaction.getTransactionType();
        transactionStatus = transaction.getTransactionStatus();
        description = transaction.getDescription();
        referenceNumber = transaction.getReferenceNumber();
        amountCents = transaction.getAmountCents();
        currency = transaction.getCurrency();
        sourceAccountId = transaction.getSourceAccountId();
        targetAccountId = transaction.getTargetAccountId();
        feeAmountCents = transaction.getFeeAmountCents();
        userId = transaction.getUserId();
        completedAt = formatDateTime( transaction.getCompletedAt() );
        failedReason = transaction.getFailedReason();
        entries = toEntryResponseList( transaction.getEntries() );
        createdAt = formatDateTime( transaction.getCreatedAt() );
        updatedAt = formatDateTime( transaction.getUpdatedAt() );

        TransactionDetailResponse transactionDetailResponse = new TransactionDetailResponse( id, transactionType, transactionStatus, description, referenceNumber, amountCents, currency, sourceAccountId, targetAccountId, feeAmountCents, userId, completedAt, failedReason, entries, createdAt, updatedAt );

        return transactionDetailResponse;
    }

    @Override
    public List<TransactionSummaryResponse> toSummaryResponseList(List<Transaction> transactions) {
        if ( transactions == null ) {
            return null;
        }

        List<TransactionSummaryResponse> list = new ArrayList<TransactionSummaryResponse>( transactions.size() );
        for ( Transaction transaction : transactions ) {
            list.add( toSummaryResponse( transaction ) );
        }

        return list;
    }

    @Override
    public TransactionEntryResponse toEntryResponse(TransactionEntry entry) {
        if ( entry == null ) {
            return null;
        }

        String id = null;
        String accountId = null;
        EntryType entryType = null;
        Long amountCents = null;
        String currency = null;
        Long balanceBeforeCents = null;
        Long balanceAfterCents = null;
        String description = null;
        String createdAt = null;

        if ( entry.getId() != null ) {
            id = entry.getId().toString();
        }
        accountId = entry.getAccountId();
        entryType = entry.getEntryType();
        amountCents = entry.getAmountCents();
        currency = entry.getCurrency();
        balanceBeforeCents = entry.getBalanceBeforeCents();
        balanceAfterCents = entry.getBalanceAfterCents();
        description = entry.getDescription();
        createdAt = formatDateTime( entry.getCreatedAt() );

        TransactionEntryResponse transactionEntryResponse = new TransactionEntryResponse( id, accountId, entryType, amountCents, currency, balanceBeforeCents, balanceAfterCents, description, createdAt );

        return transactionEntryResponse;
    }

    @Override
    public List<TransactionEntryResponse> toEntryResponseList(List<TransactionEntry> entries) {
        if ( entries == null ) {
            return null;
        }

        List<TransactionEntryResponse> list = new ArrayList<TransactionEntryResponse>( entries.size() );
        for ( TransactionEntry transactionEntry : entries ) {
            list.add( toEntryResponse( transactionEntry ) );
        }

        return list;
    }
}
