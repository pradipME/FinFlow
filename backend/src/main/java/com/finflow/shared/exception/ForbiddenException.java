package com.finflow.shared.exception;

public class ForbiddenException extends FinFlowException {

    public ForbiddenException(String message) {
        super("FORBIDDEN", message, 403);
    }

    public static ForbiddenException insufficientPermissions() {
        return new ForbiddenException("You do not have permission to perform this action");
    }
}
