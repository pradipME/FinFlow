package com.finflow.shared.util;

import java.util.regex.Pattern;

public final class MaskUtil {

    private MaskUtil() {}

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^(.{2})(.*?)(@.*)$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^(.{2})(.*)(.{2})$");

    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        var matcher = EMAIL_PATTERN.matcher(email);
        if (matcher.matches()) {
            String middle = matcher.group(2);
            String maskedMiddle = middle.length() > 2
                    ? middle.substring(0, 2) + "*".repeat(Math.max(0, middle.length() - 2))
                    : "***";
            return matcher.group(1) + maskedMiddle + matcher.group(3);
        }
        return "***";
    }

    public static String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return "***";
        var matcher = PHONE_PATTERN.matcher(phone);
        if (matcher.matches()) {
            return matcher.group(1) + "*".repeat(Math.max(0, matcher.group(2).length())) + matcher.group(3);
        }
        return phone.substring(0, 2) + "*".repeat(Math.max(0, phone.length() - 4)) + phone.substring(phone.length() - 2);
    }

    public static String maskAccountNumber(String accountNumber) {
        if (accountNumber == null || accountNumber.length() < 4) return "****";
        return "*".repeat(Math.max(0, accountNumber.length() - 4)) + accountNumber.substring(accountNumber.length() - 4);
    }

    public static String maskCardNumber(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) return "****";
        return "*".repeat(Math.max(0, cardNumber.length() - 4)) + cardNumber.substring(cardNumber.length() - 4);
    }
}
