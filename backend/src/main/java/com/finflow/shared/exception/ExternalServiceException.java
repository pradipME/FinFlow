package com.finflow.shared.exception;

public class ExternalServiceException extends FinFlowException {

    public ExternalServiceException(String serviceName, String message) {
        this(serviceName, message, null);
    }

    public ExternalServiceException(String serviceName, String message, Throwable cause) {
        super("PARTNER_UNAVAILABLE",
                String.format("%s service temporarily unavailable: %s", serviceName, message),
                502,
                serviceName,
                cause);
    }

    public static ExternalServiceException partnerBankDown(Throwable cause) {
        return new ExternalServiceException("PartnerBank", "Connection refused", cause);
    }

    public static ExternalServiceException paymentProcessorDown(Throwable cause) {
        return new ExternalServiceException("PaymentProcessor", "Connection refused", cause);
    }

    public static ExternalServiceException smsProviderDown(Throwable cause) {
        return new ExternalServiceException("SmsProvider", "Connection refused", cause);
    }
}
