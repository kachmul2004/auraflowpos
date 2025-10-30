package com.theauraflow.pos.core.util

import kotlin.math.round

/**
 * Format a Double value as currency with 2 decimal places.
 * Works in Kotlin Multiplatform by manually formatting.
 */
fun Double.formatCurrency(): String {
    val rounded = round(this * 100) / 100
    val wholePart = rounded.toLong()
    val decimalPart = ((rounded - wholePart) * 100).toLong()
    return "${wholePart}.${decimalPart.toString().padStart(2, '0')}"
}

/**
 * Format a Double value with the specified number of decimal places.
 */
fun Double.formatDecimal(decimals: Int = 2): String {
    val multiplier = when (decimals) {
        0 -> 1.0
        1 -> 10.0
        2 -> 100.0
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
