package com.finflow.shared.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

public final class CurrencyConverterUtil {

    private CurrencyConverterUtil() {}

    private static final Map<String, Integer> CURRENCY_MINOR_UNITS = Map.of(
            "USD", 100, "EUR", 100, "GBP", 100, "INR", 100, "JPY", 100,
            "BDT", 100, "BRL", 100, "CAD", 100, "AUD", 100, "CHF", 100
    );

    public static BigDecimal toMinorUnits(BigDecimal amount, String currencyCode) {
        Integer minorUnits = CURRENCY_MINOR_UNITS.getOrDefault(currencyCode, 100);
        return amount.multiply(BigDecimal.valueOf(minorUnits))
                .setScale(0, RoundingMode.HALF_UP);
    }

    public static BigDecimal toMajorUnits(BigDecimal minorAmount, String currencyCode) {
        Integer minorUnits = CURRENCY_MINOR_UNITS.getOrDefault(currencyCode, 100);
        return minorAmount.divide(BigDecimal.valueOf(minorUnits), 2, RoundingMode.HALF_UP);
    }
}
