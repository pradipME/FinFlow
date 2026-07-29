package com.finflow.shared.exception;

public class ConflictException extends FinFlowException {

    public ConflictException(String code, String message) {
        super(code, message, 409);
    }

    public static ConflictException duplicateResource(String resourceType, String identifier) {
        return new ConflictException("DUPLICATE_VALUE",
                String.format("%s with value '%s' already exists", resourceType, identifier));
    }

    public static ConflictException idempotencyKeyReuse() {
        return new ConflictException("IDEMPOTENCY_KEY_REUSE", "Idempotency key used with different request body");
    }
}
