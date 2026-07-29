package com.finflow.modules.auth.service;

import com.finflow.shared.domain.DomainEvent;

import java.time.LocalDateTime;

public class RefreshTokenRotatedEvent implements DomainEvent {

    private final String aggregateId;
    private final String userId;
    private final String oldSessionId;
    private final String newSessionId;
    private final String familyId;
    private final String ipAddress;
    private final LocalDateTime occurredOn;

    public RefreshTokenRotatedEvent(String aggregateId, String userId, String oldSessionId,
                                    String newSessionId, String familyId, String ipAddress,
                                    LocalDateTime occurredOn) {
        this.aggregateId = aggregateId;
        this.userId = userId;
        this.oldSessionId = oldSessionId;
        this.newSessionId = newSessionId;
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
        return "REFRESH_TOKEN_ROTATED";
    }

    @Override
    public LocalDateTime getOccurredOn() {
        return occurredOn;
    }

    public String getUserId() {
        return userId;
    }

    public String getOldSessionId() {
        return oldSessionId;
    }

    public String getNewSessionId() {
        return newSessionId;
    }

    public String getFamilyId() {
        return familyId;
    }

    public String getIpAddress() {
        return ipAddress;
    }
}
