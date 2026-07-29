package com.finflow.modules.transactions.mapper;

import com.finflow.modules.transactions.domain.Transaction;
import com.finflow.modules.transactions.domain.TransactionEntry;
import com.finflow.modules.transactions.dto.TransactionDetailResponse;
import com.finflow.modules.transactions.dto.TransactionEntryResponse;
import com.finflow.modules.transactions.dto.TransactionSummaryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Mapping(source = "id", target = "id")
    TransactionSummaryResponse toSummaryResponse(Transaction transaction);

    @Mapping(source = "id", target = "id")
    TransactionDetailResponse toDetailResponse(Transaction transaction);

    List<TransactionSummaryResponse> toSummaryResponseList(List<Transaction> transactions);

    TransactionEntryResponse toEntryResponse(TransactionEntry entry);

    List<TransactionEntryResponse> toEntryResponseList(List<TransactionEntry> entries);

    default String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.format(FORMATTER);
    }
}
