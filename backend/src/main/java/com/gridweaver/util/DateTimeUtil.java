package com.gridweaver.util;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Timezone-safe date/time formatting utilities.
 *
 * <p>All methods use UTC internally. Formatting for display purposes uses
 * ISO-8601 to ensure unambiguous representation.
 *
 * @author GridWeaver Team
 */
public final class DateTimeUtil {

    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
    private static final ZoneId            UTC           = ZoneId.of("UTC");

    private DateTimeUtil() {
        // Utility class — no instantiation
    }

    /**
     * Formats an {@link Instant} to an ISO-8601 string in UTC.
     *
     * @param instant the instant to format
     * @return formatted string (e.g., {@code "2026-07-18T14:00:00+00:00"})
     */
    public static String formatUtc(Instant instant) {
        if (instant == null) return null;
        return ZonedDateTime.ofInstant(instant, UTC).format(ISO_FORMATTER);
    }

    /**
     * Returns the current UTC instant.
     *
     * @return current time as {@link Instant}
     */
    public static Instant nowUtc() {
        return Instant.now();
    }

    /**
     * Checks whether an instant is in the past.
     *
     * @param instant the instant to check
     * @return {@code true} if the instant has already passed
     */
    public static boolean isPast(Instant instant) {
        return instant != null && instant.isBefore(Instant.now());
    }
}
