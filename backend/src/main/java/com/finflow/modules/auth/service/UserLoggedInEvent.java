package com.finflow.modules.auth.service;

import com.finflow.shared.domain.DomainEvent;

import java.time.LocalDateTime;

/**
 * Domain event emitted when a user successfully authenticates.
 *
 * <p>Published to the Spring application event bus after a successful login.
 * Consumers (audit, notification, analytics modules) subscribe to this event
 * for asynchronous side-effect processing.</p>
 *
 * <h3>Event Payload</h3>
 * <ul>
 *   <li>{@code aggregateId} — the user's UUID</li>
 *   <li>{@code email} — for logging and correlation</li>
 *   <li>{@code username} — for logging and correlation</li>
 *   <li>{@code occurredOn} — authentication timestamp</li>
 *   <li>{@code ipAddress} — for security monitoring</li>
 * </ul>
 *
 * <h3>Consumers</h3>
 * <ul>
 *   <li>Audit module — write to {@code audit_log} table.</li>
 *   <li>Notification module — send login alert email if new device detected.</li>
 *   <li>Analytics module — track login frequency and patterns.</li>
 * </ul>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
public class UserLoggedInEvent implements DomainEvent {

    private final String aggregateId;
    private final String email;
    private final String username;
    private final LocalDateTime occurredOn;
    private final String ipAddress;

    public UserLoggedInEvent(String aggregateId, String email, String username,
                             LocalDateTime occurredOn, String ipAddress) {
        this.aggregateId = aggregateId;
        this.email = email;
        this.username = username;
        this.occurredOn = occurredOn;
        this.ipAddress = ipAddress;
    }

    @Override
    public String getAggregateId() {
        return aggregateId;
    }

    @Override
    public String getEventType() {
        return "USER_LOGGED_IN";
    }

    @Override
    public LocalDateTime getOccurredOn() {
        return occurredOn;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    @Override
    public String toString() {
        return "UserLoggedInEvent{aggregateId='" + aggregateId + "', email='" + email
                + "', occurredOn=" + occurredOn + "}";
    }
}
