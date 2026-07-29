package com.finflow.shared.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        boolean success,
        T data,
        Meta meta,
        ErrorDetail error
) {

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, Meta.now(), null);
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(true, data, Meta.now(message), null);
    }

    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(false, null, Meta.now(), new ErrorDetail(code, message));
    }

    public static <T> ApiResponse<T> error(String code, String message, String target) {
        return new ApiResponse<>(false, null, Meta.now(), new ErrorDetail(code, message, target));
    }

    public record Meta(LocalDateTime timestamp, String requestId, String message) {
        public static Meta now() {
            return new Meta(LocalDateTime.now(), UUID.randomUUID().toString(), null);
        }
        public static Meta now(String message) {
            return new Meta(LocalDateTime.now(), UUID.randomUUID().toString(), message);
        }
    }

    public record ErrorDetail(String code, String message, String target) {
        public ErrorDetail(String code, String message) {
            this(code, message, null);
        }
    }
}
