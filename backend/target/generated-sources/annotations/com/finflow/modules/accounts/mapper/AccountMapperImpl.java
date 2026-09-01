package com.finflow.modules.accounts.mapper;

import com.finflow.modules.accounts.domain.Account;
import com.finflow.modules.accounts.domain.AccountStatus;
import com.finflow.modules.accounts.domain.AccountStatusHistory;
import com.finflow.modules.accounts.domain.AccountType;
import com.finflow.modules.accounts.domain.Hold;
import com.finflow.modules.accounts.domain.HoldStatus;
import com.finflow.modules.accounts.dto.AccountDetailResponse;
import com.finflow.modules.accounts.dto.AccountSummaryResponse;
import com.finflow.modules.accounts.dto.HoldResponse;
import com.finflow.modules.accounts.dto.StatusHistoryResponse;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-01T21:33:40+0530",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class AccountMapperImpl implements AccountMapper {

    @Override
    public AccountSummaryResponse toSummaryResponse(Account account) {
        if ( account == null ) {
            return null;
        }

        String accountNumber = null;
        AccountType accountType = null;
        AccountStatus accountStatus = null;
        String nickname = null;
        String currency = null;
        Long availableBalanceCents = null;

        accountNumber = maskAccountNumber( account.getAccountNumber() );
        accountType = account.getAccountType();
        accountStatus = account.getAccountStatus();
        nickname = account.getNickname();
        currency = account.getCurrency();
        availableBalanceCents = account.getAvailableBalanceCents();

        String id = account.getId().toString();
        String createdAt = formatDateTime(account.getCreatedAt());

        AccountSummaryResponse accountSummaryResponse = new AccountSummaryResponse( id, accountNumber, accountType, accountStatus, nickname, currency, availableBalanceCents, createdAt );

        return accountSummaryResponse;
    }

    @Override
    public AccountDetailResponse toDetailResponse(Account account) {
        if ( account == null ) {
            return null;
        }

        String ownerId = null;
        String accountNumber = null;
        AccountType accountType = null;
        AccountStatus accountStatus = null;
        String nickname = null;
        String currency = null;
        Long ledgerBalanceCents = null;
        Long availableBalanceCents = null;

        ownerId = account.getOwnerId();
        accountNumber = maskAccountNumber( account.getAccountNumber() );
        accountType = account.getAccountType();
        accountStatus = account.getAccountStatus();
        nickname = account.getNickname();
        currency = account.getCurrency();
        ledgerBalanceCents = account.getLedgerBalanceCents();
        availableBalanceCents = account.getAvailableBalanceCents();

        String id = account.getId().toString();
        List<HoldResponse> activeHolds = toHoldResponseList(account.getHolds().stream().filter(h -> h.isActive()).collect(java.util.stream.Collectors.toList()));
        int activeHoldCount = (int) account.getHolds().stream().filter(h -> h.isActive()).count();
        String createdAt = formatDateTime(account.getCreatedAt());
        String updatedAt = formatDateTime(account.getUpdatedAt());

        AccountDetailResponse accountDetailResponse = new AccountDetailResponse( id, ownerId, accountNumber, accountType, accountStatus, nickname, currency, ledgerBalanceCents, availableBalanceCents, activeHoldCount, activeHolds, createdAt, updatedAt );

        return accountDetailResponse;
    }

    @Override
    public HoldResponse toHoldResponse(Hold hold) {
        if ( hold == null ) {
            return null;
        }

        Long amountCents = null;
        String reason = null;
        String sourceType = null;
        String sourceId = null;
        HoldStatus holdStatus = null;

        amountCents = hold.getAmountCents();
        reason = hold.getReason();
        sourceType = hold.getSourceType();
        sourceId = hold.getSourceId();
        holdStatus = hold.getHoldStatus();

        String id = hold.getId().toString();
        String releasedAt = formatDateTime(hold.getReleasedAt());
        String expiresAt = formatDateTime(hold.getExpiresAt());
        String createdAt = formatDateTime(hold.getCreatedAt());

        HoldResponse holdResponse = new HoldResponse( id, amountCents, reason, sourceType, sourceId, holdStatus, releasedAt, expiresAt, createdAt );

        return holdResponse;
    }

    @Override
    public StatusHistoryResponse toStatusHistoryResponse(AccountStatusHistory history) {
        if ( history == null ) {
            return null;
        }

        String previousStatus = null;
        String newStatus = null;
        String reason = null;
        String changedBy = null;

        previousStatus = history.getPreviousStatus();
        newStatus = history.getNewStatus();
        reason = history.getReason();
        changedBy = history.getChangedBy();

        Long id = history.getId();
        String changedAt = formatDateTime(history.getChangedAt());

        StatusHistoryResponse statusHistoryResponse = new StatusHistoryResponse( id, previousStatus, newStatus, reason, changedBy, changedAt );

        return statusHistoryResponse;
    }

    @Override
    public List<AccountSummaryResponse> toSummaryResponseList(List<Account> accounts) {
        if ( accounts == null ) {
            return null;
        }

        List<AccountSummaryResponse> list = new ArrayList<AccountSummaryResponse>( accounts.size() );
        for ( Account account : accounts ) {
            list.add( toSummaryResponse( account ) );
        }

        return list;
    }

    @Override
    public List<HoldResponse> toHoldResponseList(List<Hold> holds) {
        if ( holds == null ) {
            return null;
        }

        List<HoldResponse> list = new ArrayList<HoldResponse>( holds.size() );
        for ( Hold hold : holds ) {
            list.add( toHoldResponse( hold ) );
        }

        return list;
    }

    @Override
    public List<StatusHistoryResponse> toStatusHistoryResponseList(List<AccountStatusHistory> histories) {
        if ( histories == null ) {
            return null;
        }

        List<StatusHistoryResponse> list = new ArrayList<StatusHistoryResponse>( histories.size() );
        for ( AccountStatusHistory accountStatusHistory : histories ) {
            list.add( toStatusHistoryResponse( accountStatusHistory ) );
        }

        return list;
    }
}
