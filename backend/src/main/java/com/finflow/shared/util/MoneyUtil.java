package com.finflow.shared.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Currency;

public final class MoneyUtil {

    private MoneyUtil() {}

    public static final int DEFAULT_SCALE = 2;

    public static BigDecimal validateAmount(BigDecimal amount) {
        if (amount == null) {
            throw new IllegalArgumentException("Amount cannot be null");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        return amount.setScale(DEFAULT_SCALE, RoundingMode.HALF_UP);
    }

    public static BigDecimal add(BigDecimal a, BigDecimal b) {
        return a.add(b).setScale(DEFAULT_SCALE, RoundingMode.HALF_UP);
    }

    public static BigDecimal subtract(BigDecimal a, BigDecimal b) {
        return a.subtract(b).setScale(DEFAULT_SCALE, RoundingMode.HALF_UP);
    }

    public static boolean isPositive(BigDecimal amount) {
        return amount != null && amount.compareTo(BigDecimal.ZERO) > 0;
    }

    public static boolean isGreaterThan(BigDecimal a, BigDecimal b) {
        return a.compareTo(b) > 0;
    }

    public static boolean isGreaterThanOrEqual(BigDecimal a, BigDecimal b) {
        return a.compareTo(b) >= 0;
    }

    public static boolean isValidCurrency(String currencyCode) {
        if (currencyCode == null || currencyCode.length() != 3) return false;
        try {
            Currency.getInstance(currencyCode);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public static int getCurrencyScale(String currencyCode) {
        try {
            Currency currency = Currency.getInstance(currencyCode);
            return currency.getDefaultFractionDigits() == 0 ? 0 : DEFAULT_SCALE;
        } catch (IllegalArgumentException e) {
            return DEFAULT_SCALE;
        }
    }
}
