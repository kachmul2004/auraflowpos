package com.theauraflow.pos.core.util

import com.theauraflow.pos.util.MoneyUtils
import kotlin.math.round

/**
 * Format a Double value as currency with 2 decimal places.
 *
 * @deprecated Use MoneyUtils.format() instead for consistent rounding.
 * This function is kept for backward compatibility.
 */
fun Double.formatCurrency(): String {
    return MoneyUtils.format(this)
}

/**
 * Format a Double value with the specified number of decimal places.
 * For monetary values, prefer MoneyUtils.format() which always uses 2 decimals.
 */
fun Double.formatDecimal(decimals: Int = 2): String {
    if (decimals == 2) {
        // For 2 decimals (currency), use MoneyUtils for consistency
        return MoneyUtils.format(this)
    }

    // For other decimal places, use the original logic
    val multiplier = when (decimals) {
        0 -> 1.0
        1 -> 10.0
        3 -> 1000.0
        else -> 100.0
    }
    val rounded = round(this * multiplier) / multiplier

    if (decimals == 0) {
        return rounded.toLong().toString()
    }

    val wholePart = rounded.toLong()
    val decimalPart = ((rounded - wholePart) * multiplier).toLong()
    return "${wholePart}.${decimalPart.toString().padStart(decimals, '0')}"
}
