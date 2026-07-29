package com.finflow.shared.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class DateUtil {

    private DateUtil() {}

    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
    public static final String DISPLAY_DATE_FORMAT = "dd MMM yyyy";
    public static final String DISPLAY_DATE_TIME_FORMAT = "dd MMM yyyy, hh:mm a";

    public static String format(LocalDate date) {
        return date != null ? date.format(DateTimeFormatter.ofPattern(DATE_FORMAT)) : null;
    }

    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DateTimeFormatter.ofPattern(DATE_TIME_FORMAT)) : null;
    }

    public static String formatForDisplay(LocalDate date) {
        return date != null ? date.format(DateTimeFormatter.ofPattern(DISPLAY_DATE_FORMAT)) : null;
    }

    public static boolean isExpired(LocalDate expiryDate) {
        return expiryDate != null && expiryDate.isBefore(LocalDate.now());
    }

    public static boolean isWithinRange(LocalDate date, LocalDate start, LocalDate end) {
        return !date.isBefore(start) && !date.isAfter(end);
    }
}
