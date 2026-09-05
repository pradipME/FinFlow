package com.finflow.modules.admin.controller;

import com.finflow.modules.admin.events.AdminEventService;
import com.finflow.shared.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin Realtime", description = "Server-Sent Events for realtime admin console updates")
public class AdminEventController {

    private final AdminEventService adminEventService;

    public AdminEventController(AdminEventService adminEventService) {
        this.adminEventService = adminEventService;
    }

    @GetMapping(value = "/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Subscribe to realtime admin events",
            description = "Opens a Server-Sent Events channel. Only ADMIN/SUPER_ADMIN roles "
                    + "can connect (enforced by SecurityConfig URL rule).")
    public SseEmitter stream() {
        String userId = SecurityUtil.getCurrentUserId();
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        adminEventService.register(userId, emitter);
        return emitter;
    }
}
