package com.finflow.shared.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        boolean success,
        String code,
        String message,
        String target,
        String requestId,
        String documentationUrl,
        LocalDateTime timestamp,
        List<FieldErrorDetail> details
) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String code;
        private String message;
        private String target;
        private String requestId;
        private String documentationUrl;
        private LocalDateTime timestamp;
        private List<FieldErrorDetail> details;

        public Builder code(String code) { this.code = code; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder target(String target) { this.target = target; return this; }
        public Builder requestId(String requestId) { this.requestId = requestId; return this; }
        public Builder documentationUrl(String url) { this.documentationUrl = url; return this; }
        public Builder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }
        public Builder details(List<FieldErrorDetail> details) { this.details = details; return this; }

        public ErrorResponse build() {
            return new ErrorResponse(false, code, message, target, requestId, documentationUrl, timestamp, details);
        }
    }

    public record FieldErrorDetail(String field, String code, String message) {}
}
