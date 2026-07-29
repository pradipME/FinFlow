package com.finflow.shared.exception;

public class UnauthorizedException extends FinFlowException {

    public UnauthorizedException(String message) {
        super("UNAUTHORIZED", message, 401);
    }

    public static UnauthorizedException authenticationRequired() {
        return new UnauthorizedException("Authentication is required");
    }

    public static UnauthorizedException tokenExpired() {
        return new UnauthorizedException("Authentication token has expired");
    }

    public static UnauthorizedException invalidCredentials() {
        return new UnauthorizedException("Email or password is incorrect");
    }
}
