package com.finflow.modules.admin.events;

import java.util.Map;

public record AdminEvent(String type, Map<String, Object> data) {

    public static AdminEvent of(String type, Map<String, Object> data) {
        return new AdminEvent(type, data);
    }
}
