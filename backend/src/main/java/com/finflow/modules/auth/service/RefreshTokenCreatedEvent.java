package com.finflow.modules.auth.service;

import com.finflow.shared.domain.DomainEvent;

import java.time.LocalDateTime;

public class RefreshTokenCreatedEvent implements DomainEvent {

    private final String aggregateId;
    private final String userId;
    private final String sessionId;
    private final String familyId;
    private final String ipAddress;
    private final LocalDateTime occurredOn;

    public RefreshTokenCreatedEvent(String aggregateId, String userId, String sessionId,
                                    String familyId, String ipAddress, LocalDateTime occurredOn) {
        this.aggregateId = aggregateId;
        this.userId = userId;
        this.sessionId = sessionId;
        this.familyId = familyId;
        this.ipAddress = ipAddress;
        this.occurredOn = occurredOn;
    }

    @Override
    public String getAggregateId() {
        return aggregateId;
    }

    @Override
    public String getEventType() {
        return "REFRESH_TOKEN_CREATED";
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

    public String getFamilyId() {
        return familyId;
    }

    public String getIpAddress() {
        return ipAddress;
    }
}
