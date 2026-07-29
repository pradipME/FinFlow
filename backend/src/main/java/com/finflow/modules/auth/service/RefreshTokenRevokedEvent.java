package com.finflow.modules.auth.service;

import com.finflow.shared.domain.DomainEvent;

import java.time.LocalDateTime;

public class RefreshTokenRevokedEvent implements DomainEvent {

    private final String aggregateId;
    private final String userId;
    private final String sessionId;
    private final String ipAddress;
    private final String reason;
    private final LocalDateTime occurredOn;

    public RefreshTokenRevokedEvent(String aggregateId, String userId, String sessionId,
                                    String ipAddress, String reason, LocalDateTime occurredOn) {
        this.aggregateId = aggregateId;
        this.userId = userId;
        this.sessionId = sessionId;
        this.ipAddress = ipAddress;
        this.reason = reason;
        this.occurredOn = occurredOn;
    }

    @Override
    public String getAggregateId() {
        return aggregateId;
    }

    @Override
    public String getEventType() {
        return "REFRESH_TOKEN_REVOKED";
    }

    @Override
    public LocalDateTime getOccurredOn() {
        return occurredOn;
    }

    public String getUserId() {
        return userId;
    }

    public String getSessionId() {
        return sessionId;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public String getReason() {
        return reason;
    }
}
