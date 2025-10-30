package com.auraflow.pos.core

import java.text.NumberFormat
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

/**
 * Utility functions used throughout the app
 */
object Utils {
    
    // ============================================================================
    // FORMATTING
    // ============================================================================
    
    /**
     * Format currency amount
     */
    fun formatCurrency(amount: Double, currencyCode: String = "USD"): String {
        val format = NumberFormat.getCurrencyInstance(Locale.US)
        format.currency = java.util.Currency.getInstance(currencyCode)
        return format.format(amount)
    }
    
    /**
     * Format percentage
     */
    fun formatPercentage(value: Double): String {
        return "${"%.1f".format(value)}%"
    }
    
    /**
     * Format date/time
     */
    fun formatDateTime(
        dateTime: LocalDateTime,
        pattern: String = "MMM dd, yyyy hh:mm a"
    ): String {
        val formatter = DateTimeFormatter.ofPattern(pattern)
        return dateTime.format(formatter)
    }
    
    /**
     * Format date only
     */
    fun formatDate(
        dateTime: LocalDateTime,
        pattern: String = "MMM dd, yyyy"
    ): String {
        val formatter = DateTimeFormatter.ofPattern(pattern)
        return dateTime.format(formatter)
    }
    
    /**
     * Format time only
     */
    fun formatTime(
        dateTime: LocalDateTime,
        pattern: String = "hh:mm a"
    ): String {
        val formatter = DateTimeFormatter.ofPattern(pattern)
        return dateTime.format(formatter)
    }
    
    /**
     * Format phone number
     */
    fun formatPhoneNumber(phone: String): String {
        val cleaned = phone.replace(Regex("[^0-9]"), "")
        return when {
            cleaned.length == 10 -> 
                "(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}"
            cleaned.length == 11 && cleaned.startsWith("1") -> 
                "+1 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7)}"
            else -> phone
        }
    }
    
    // ============================================================================
    // VALIDATION
    // ============================================================================
    
    /**
     * Validate email format
     */
    fun isValidEmail(email: String): Boolean {
        return android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }
    
    /**
     * Validate phone format
     */
    fun isValidPhone(phone: String): Boolean {
        val cleaned = phone.replace(Regex("[^0-9]"), "")
        return cleaned.length in 10..11
    }
    
    /**
     * Validate PIN
     */
    fun isValidPin(pin: String): Boolean {
        return pin.length in Constants.MIN_PIN_LENGTH..Constants.MAX_PIN_LENGTH &&
               pin.all { it.isDigit() }
    }
    
    /**
     * Validate price
     */
    fun isValidPrice(price: Double): Boolean {
        return price >= Constants.MIN_PRICE && price <= Constants.MAX_PRICE
    }
    
    /**
     * Validate discount percentage
     */
    fun isValidDiscountPercentage(percentage: Double): Boolean {
        return percentage >= 0.0 && percentage <= Constants.MAX_DISCOUNT_PERCENTAGE
    }
    
    // ============================================================================
    // CALCULATION
    // ============================================================================
    
    /**
     * Calculate tax amount
     */
    fun calculateTax(amount: Double, taxRate: Double): Double {
        return amount * taxRate
    }
    
    /**
     * Calculate discount amount
     */
    fun calculatePercentageDiscount(amount: Double, percentage: Double): Double {
        return amount * (percentage / 100.0)
    }
    
    /**
     * Calculate tip from percentage
     */
    fun calculateTipFromPercentage(amount: Double, percentage: Double): Double {
        return amount * (percentage / 100.0)
    }
    
    /**
     * Calculate change
     */
    fun calculateChange(total: Double, tendered: Double): Double {
        return maxOf(0.0, tendered - total)
    }
    
    /**
     * Round to 2 decimal places
     */
    fun roundToTwoDecimals(value: Double): Double {
        return Math.round(value * 100.0) / 100.0
    }
    
    // ============================================================================
    // STRING MANIPULATION
    // ============================================================================
    
    /**
     * Capitalize first letter of each word
     */
    fun capitalizeWords(text: String): String {
        return text.split(" ")
            .joinToString(" ") { word ->
                word.lowercase().replaceFirstChar { 
                    if (it.isLowerCase()) it.titlecase() else it.toString()
                }
            }
    }
    
    /**
     * Truncate text with ellipsis
     */
    fun truncate(text: String, maxLength: Int): String {
        return if (text.length <= maxLength) {
            text
        } else {
            "${text.substring(0, maxLength - 3)}..."
        }
    }
    
    /**
     * Generate random alphanumeric string
     */
    fun randomAlphanumeric(length: Int): String {
        val chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        return (1..length)
            .map { chars.random() }
            .joinToString("")
    }
    
    // ============================================================================
    // BARCODE
    // ============================================================================
    
    /**
     * Validate barcode format
     */
    fun isValidBarcode(barcode: String): Boolean {
        return barcode.length in Constants.BARCODE_MIN_LENGTH..Constants.BARCODE_MAX_LENGTH &&
               barcode.all { it.isDigit() }
    }
    
    /**
     * Format barcode for display
     */
    fun formatBarcode(barcode: String): String {
        return when (barcode.length) {
            12 -> "${barcode.substring(0, 1)} ${barcode.substring(1, 6)} ${barcode.substring(6, 11)} ${barcode.substring(11)}"
            13 -> "${barcode.substring(0, 1)} ${barcode.substring(1, 7)} ${barcode.substring(7, 12)} ${barcode.substring(12)}"
            else -> barcode
        }
    }
    
    // ============================================================================
    // RECEIPT FORMATTING
    // ============================================================================
    
    /**
     * Center text for receipt
     */
    fun centerText(text: String, width: Int = Constants.RECEIPT_WIDTH): String {
        if (text.length >= width) return text
        val padding = (width - text.length) / 2
        return " ".repeat(padding) + text
    }
    
    /**
     * Right align text for receipt
     */
    fun rightAlignText(text: String, width: Int = Constants.RECEIPT_WIDTH): String {
        if (text.length >= width) return text
        return " ".repeat(width - text.length) + text
    }
    
    /**
     * Create receipt line with left and right text
     */
    fun receiptLine(
        left: String, 
        right: String, 
        width: Int = Constants.RECEIPT_WIDTH
    ): String {
        val available = width - left.length - right.length
        return if (available >= 0) {
            left + " ".repeat(available) + right
        } else {
            left + right
        }
    }
    
    /**
     * Create receipt separator line
     */
    fun receiptSeparator(width: Int = Constants.RECEIPT_WIDTH): String {
        return "-".repeat(width)
    }
}
