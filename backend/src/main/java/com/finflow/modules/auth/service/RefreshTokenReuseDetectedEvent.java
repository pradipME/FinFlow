package com.finflow.modules.auth.service;

import com.finflow.shared.domain.DomainEvent;

import java.time.LocalDateTime;

public class RefreshTokenReuseDetectedEvent implements DomainEvent {

    private final String aggregateId;
    private final String userId;
    private final String familyId;
    private final String reusedSessionId;
    private final int tokensRevokedCount;
    private final String ipAddress;
    private final LocalDateTime occurredOn;

    public RefreshTokenReuseDetectedEvent(String aggregateId, String userId, String familyId,
                                          String reusedSessionId, int tokensRevokedCount,
                                          String ipAddress, LocalDateTime occurredOn) {
        this.aggregateId = aggregateId;
        this.userId = userId;
        this.familyId = familyId;
        this.reusedSessionId = reusedSessionId;
        this.tokensRevokedCount = tokensRevokedCount;
        this.ipAddress = ipAddress;
        this.occurredOn = occurredOn;
    }

    @Override
    public String getAggregateId() {
        return aggregateId;
    }

    @Override
    public String getEventType() {
        return "REFRESH_TOKEN_REUSE_DETECTED";
    }

    @Override
    public LocalDateTime getOccurredOn() {
        return occurredOn;
    }

    public String getUserId() {
        return userId;
    }

    public String getFamilyId() {
        return familyId;
    }

    public String getReusedSessionId() {
        return reusedSessionId;
    }

    public int getTokensRevokedCount() {
        return tokensRevokedCount;
    }

    public String getIpAddress() {
        return ipAddress;
    }
}
