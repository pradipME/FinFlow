package com.finflow.shared.domain;

public interface DomainEvent {

    String getAggregateId();

    String getEventType();

    java.time.LocalDateTime getOccurredOn();
}
