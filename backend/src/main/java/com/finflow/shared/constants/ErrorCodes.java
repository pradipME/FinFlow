package com.finflow.shared.constants;

import java.util.Map;

public final class ErrorCodes {

    private ErrorCodes() {}

    public static final String RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND";
    public static final String VALIDATION_ERROR = "VALIDATION_ERROR";
    public static final String UNAUTHORIZED = "UNAUTHORIZED";
    public static final String FORBIDDEN = "FORBIDDEN";
    public static final String CONFLICT = "CONFLICT";
    public static final String RATE_LIMITED = "RATE_LIMITED";
    public static final String INTERNAL_ERROR = "INTERNAL_ERROR";

    public static final String INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE";
    public static final String ACCOUNT_FROZEN = "ACCOUNT_FROZEN";
    public static final String ACCOUNT_CLOSED = "ACCOUNT_CLOSED";
    public static final String TRANSFER_LIMIT_EXCEEDED = "TRANSFER_LIMIT_EXCEEDED";
    public static final String KYC_REQUIRED = "KYC_REQUIRED";
    public static final String CARD_FROZEN = "CARD_FROZEN";

    public static final String KYC_NOT_SUBMITTED = "KYC_NOT_SUBMITTED";
    public static final String KYC_UNDER_REVIEW = "KYC_UNDER_REVIEW";
    public static final String KYC_REJECTED = "KYC_REJECTED";
    public static final String KYC_EXPIRED = "KYC_EXPIRED";

    public static final String REQUIRED_FIELD = "REQUIRED_FIELD";
    public static final String INVALID_FORMAT = "INVALID_FORMAT";
    public static final String DUPLICATE_RESOURCE = "DUPLICATE_RESOURCE";
    public static final String ACCOUNT_LOCKED = "ACCOUNT_LOCKED";
    public static final String INVALID_CREDENTIALS = "INVALID_CREDENTIALS";
}
