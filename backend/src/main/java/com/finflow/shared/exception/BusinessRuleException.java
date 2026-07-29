package com.finflow.shared.exception;

public class BusinessRuleException extends FinFlowException {

    public BusinessRuleException(String code, String message) {
        super(code, message, 400);
    }

    public BusinessRuleException(String code, String message, String target) {
        super(code, message, 400, target);
    }

    public static BusinessRuleException insufficientBalance() {
        return new BusinessRuleException("INSUFFICIENT_BALANCE", "Available balance is insufficient for this operation");
    }

    public static BusinessRuleException accountFrozen() {
        return new BusinessRuleException("ACCOUNT_FROZEN", "Account is frozen");
    }

    public static BusinessRuleException accountClosed() {
        return new BusinessRuleException("ACCOUNT_CLOSED", "Account is closed");
    }

    public static BusinessRuleException transferLimitExceeded(String limitType) {
        return new BusinessRuleException("TRANSFER_LIMIT_EXCEEDED", "Transfer exceeds allowed " + limitType + " limit", limitType);
    }

    public static BusinessRuleException kycRequired() {
        return new BusinessRuleException("KYC_REQUIRED", "KYC verification is required for this operation");
    }

    public static BusinessRuleException cardFrozen() {
        return new BusinessRuleException("CARD_FROZEN", "Card is frozen");
    }
}
