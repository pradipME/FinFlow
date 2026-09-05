package com.finflow.modules.admin.events;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Service
public class AdminEventService {

    private static final Logger log = LoggerFactory.getLogger(AdminEventService.class);

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public void register(String userId, SseEmitter emitter) {
        emitters.put(userId, emitter);
        emitter.onCompletion(() -> {
            emitters.remove(userId);
            log.debug("SSE completed for admin: {}", userId);
        });
        emitter.onTimeout(() -> {
            emitters.remove(userId);
            log.debug("SSE timed out for admin: {}", userId);
        });
        emitter.onError(e -> {
            emitters.remove(userId);
            log.debug("SSE error for admin {}: {}", userId, e.getMessage());
        });
        log.debug("SSE registered for admin: {}", userId);
    }

    public void unregister(String userId) {
        SseEmitter removed = emitters.remove(userId);
        if (removed != null) {
            removed.complete();
        }
    }

    public void sendToAdmins(String eventType, Object data) {
        Map<String, SseEmitter> snapshot = Map.copyOf(emitters);
        for (Map.Entry<String, SseEmitter> entry : snapshot.entrySet()) {
            try {
                entry.getValue().send(SseEmitter.event()
                        .name(eventType)
                        .data(data));
            } catch (IOException e) {
                log.debug("SSE send failed for admin {}: {}", entry.getKey(), e.getMessage());
                emitters.remove(entry.getKey());
            } catch (IllegalStateException e) {
                log.debug("SSE emitter already completed for admin: {}", entry.getKey());
                emitters.remove(entry.getKey());
            }
        }
    }
}
