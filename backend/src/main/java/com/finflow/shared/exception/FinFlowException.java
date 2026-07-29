package com.finflow.shared.exception;

import java.time.LocalDateTime;

public abstract class FinFlowException extends RuntimeException {

    private final String code;
    private final int httpStatus;
    private final String target;
    private final LocalDateTime timestamp;

    protected FinFlowException(String code, String message, int httpStatus) {
        this(code, message, httpStatus, null);
    }

    protected FinFlowException(String code, String message, int httpStatus, String target) {
        this(code, message, httpStatus, target, null);
    }

    protected FinFlowException(String code, String message, int httpStatus, String target, Throwable cause) {
        super(message, cause);
        this.code = code;
        this.httpStatus = httpStatus;
        this.target = target;
        this.timestamp = LocalDateTime.now();
    }

    public String getCode() {
        return code;
    }

    public int getHttpStatus() {
        return httpStatus;
    }

    public String getTarget() {
        return target;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
