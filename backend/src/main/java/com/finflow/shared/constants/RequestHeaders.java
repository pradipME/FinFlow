package com.finflow.shared.constants;

public final class RequestHeaders {

    private RequestHeaders() {}

    public static final String IDEMPOTENCY_KEY = "Idempotency-Key";
    public static final String REQUEST_ID = "X-Request-Id";
    public static final String DEVICE_FINGERPRINT = "X-Device-Fingerprint";
    public static final String DEVICE_IP = "X-Device-Ip";
    public static final String DEVICE_TYPE = "X-Device-Type";
    public static final String APP_VERSION = "X-App-Version";
    public static final String API_VERSION = "Api-Version";
    public static final String LOCALE = "Accept-Language";
}
