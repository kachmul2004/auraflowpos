package com.auraflow.pos.utils

import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.*

/**
 * Utility extensions for common operations
 */

// Currency formatting
fun Double.toCurrency(locale: Locale = Locale.US): String {
    val formatter = NumberFormat.getCurrencyInstance(locale)
    return formatter.format(this)
}

fun String.parseCurrency(): Double? {
    return this.replace(Regex("[^0-9.]"), "").toDoubleOrNull()
}

// Date formatting
fun Date.toShortDate(): String {
    val format = SimpleDateFormat("MM/dd/yyyy", Locale.US)
    return format.format(this)
}

fun Date.toShortDateTime(): String {
    val format = SimpleDateFormat("MM/dd/yyyy hh:mm a", Locale.US)
    return format.format(this)
}

fun Date.toTime(): String {
    val format = SimpleDateFormat("hh:mm a", Locale.US)
    return format.format(this)
}

// String utilities
fun String.truncate(maxLength: Int, ellipsis: String = "..."): String {
    return if (this.length > maxLength) {
        this.substring(0, maxLength - ellipsis.length) + ellipsis
    } else {
        this
    }
}

// Number utilities
fun Double.roundToDecimals(decimals: Int): Double {
    var multiplier = 1.0
    repeat(decimals) { multiplier *= 10 }
    return kotlin.math.round(this * multiplier) / multiplier
}

fun Int.toOrdinal(): String {
    return when {
        this % 100 in 11..13 -> "${this}th"
        this % 10 == 1 -> "${this}st"
        this % 10 == 2 -> "${this}nd"
        this % 10 == 3 -> "${this}rd"
        else -> "${this}th"
    }
}

// Collection utilities
fun <T> List<T>.chunkedBy(size: Int): List<List<T>> {
    return this.chunked(size)
}

// Validation utilities
fun String.isValidEmail(): Boolean {
    val emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\$".toRegex()
    return this.matches(emailRegex)
}

fun String.isValidPhone(): Boolean {
    val phoneRegex = "^[0-9]{10,15}\$".toRegex()
    val digitsOnly = this.replace(Regex("[^0-9]"), "")
    return digitsOnly.matches(phoneRegex)
}

fun String.isValidZipCode(): Boolean {
    val zipRegex = "^[0-9]{5}(-[0-9]{4})?\$".toRegex()
    return this.matches(zipRegex)
}

// Tax calculation
fun Double.calculateTax(taxRate: Double): Double {
    return this * taxRate
}

fun Double.applyDiscount(discountPercent: Double): Double {
    return this * (1 - (discountPercent / 100))
}

// Percentage utilities
fun Double.toPercentage(): String {
    return "${(this * 100).roundToDecimals(2)}%"
}

fun calculatePercentageChange(oldValue: Double, newValue: Double): Double {
    if (oldValue == 0.0) return 0.0
    return ((newValue - oldValue) / oldValue) * 100
}
