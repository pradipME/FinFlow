package com.finflow.shared.exception;

import java.util.List;

public class ValidationException extends FinFlowException {

    private final List<FieldError> fieldErrors;

    public ValidationException(List<FieldError> fieldErrors) {
        super("VALIDATION_ERROR", "Request validation failed", 400);
        this.fieldErrors = fieldErrors;
    }

    public ValidationException(String message) {
        super("VALIDATION_ERROR", message, 400);
        this.fieldErrors = List.of();
    }

    public List<FieldError> getFieldErrors() {
        return fieldErrors;
    }

    public record FieldError(String field, String code, String message) {}
}
