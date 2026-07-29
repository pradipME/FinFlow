package com.finflow.modules.accounts.mapper;

import com.finflow.modules.accounts.domain.Account;
import com.finflow.modules.accounts.domain.Hold;
import com.finflow.modules.accounts.domain.AccountStatusHistory;
import com.finflow.modules.accounts.dto.*;
import com.finflow.shared.util.MaskUtil;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface AccountMapper {

    @Mapping(target = "id", expression = "java(account.getId().toString())")
    @Mapping(target = "accountNumber", source = "accountNumber", qualifiedByName = "maskAccountNumber")
    @Mapping(target = "createdAt", expression = "java(formatDateTime(account.getCreatedAt()))")
    AccountSummaryResponse toSummaryResponse(Account account);

    @Mapping(target = "id", expression = "java(account.getId().toString())")
    @Mapping(target = "ownerId", source = "ownerId")
    @Mapping(target = "accountNumber", source = "accountNumber", qualifiedByName = "maskAccountNumber")
    @Mapping(target = "activeHolds", expression = "java(toHoldResponseList(account.getHolds().stream().filter(h -> h.isActive()).collect(java.util.stream.Collectors.toList())))")
    @Mapping(target = "activeHoldCount", expression = "java((int) account.getHolds().stream().filter(h -> h.isActive()).count())")
    @Mapping(target = "createdAt", expression = "java(formatDateTime(account.getCreatedAt()))")
    @Mapping(target = "updatedAt", expression = "java(formatDateTime(account.getUpdatedAt()))")
    AccountDetailResponse toDetailResponse(Account account);

    @Mapping(target = "id", expression = "java(hold.getId().toString())")
    @Mapping(target = "releasedAt", expression = "java(formatDateTime(hold.getReleasedAt()))")
    @Mapping(target = "expiresAt", expression = "java(formatDateTime(hold.getExpiresAt()))")
    @Mapping(target = "createdAt", expression = "java(formatDateTime(hold.getCreatedAt()))")
    HoldResponse toHoldResponse(Hold hold);

    @Mapping(target = "id", expression = "java(history.getId())")
    @Mapping(target = "changedAt", expression = "java(formatDateTime(history.getChangedAt()))")
    StatusHistoryResponse toStatusHistoryResponse(AccountStatusHistory history);

    List<AccountSummaryResponse> toSummaryResponseList(List<Account> accounts);

    List<HoldResponse> toHoldResponseList(List<Hold> holds);

    List<StatusHistoryResponse> toStatusHistoryResponseList(List<AccountStatusHistory> histories);

    @Named("maskAccountNumber")
    default String maskAccountNumber(String accountNumber) {
        return MaskUtil.maskAccountNumber(accountNumber);
    }

    default String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
}
