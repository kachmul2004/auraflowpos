package com.theauraflow.pos.util

import kotlin.math.round

/**
 * Money utility for handling currency calculations with proper precision.
 *
 * Enterprise POS systems must:
 * 1. Store amounts in cents (integers) internally to avoid floating-point errors
 * 2. Round at every calculation step, not just at display
 * 3. Use banker's rounding (round half to even) for tax compliance
 * 4. Maintain audit trails for all rounding operations
 * 5. Never use Double for final amounts - only for intermediate calculations with immediate rounding
 *
 * This utility provides functions that:
 * - Round to exactly 2 decimal places at every step
 * - Use consistent rounding rules across the entire system
 * - Prevent floating-point precision errors (like 19.490000002)
 * - Ensure compliance with tax authorities and accounting standards
 */
object MoneyUtils {

    /**
     * Round a dollar amount to exactly 2 decimal places.
     * Uses banker's rounding (round half to even) for tax compliance.
     *
     * Examples:
     * - 19.4900000002 → 19.49
     * - 19.485 → 19.48 (banker's rounding: round to even)
     * - 19.495 → 19.50 (banker's rounding: round to even)
     *
     * @param amount The amount to round
     * @return Amount rounded to 2 decimal places
     */
    fun roundToTwoDecimals(amount: Double): Double {
        // Convert to cents, round, convert back to dollars
        val cents = round(amount * 100.0)
        return cents / 100.0
    }

    /**
     * Add two monetary amounts with proper rounding.
     *
     * @param a First amount
     * @param b Second amount
     * @return Sum rounded to 2 decimal places
     */
    fun add(a: Double, b: Double): Double {
        return roundToTwoDecimals(a + b)
    }

    /**
     * Subtract two monetary amounts with proper rounding.
     *
     * @param a Amount to subtract from
     * @param b Amount to subtract
     * @return Difference rounded to 2 decimal places
     */
    fun subtract(a: Double, b: Double): Double {
        return roundToTwoDecimals(a - b)
    }

    /**
     * Multiply an amount by a quantity with proper rounding.
     * Used for: price × quantity, modifier × quantity, etc.
     *
     * @param amount The unit amount
     * @param quantity The quantity (can be int or double for percentages)
     * @return Product rounded to 2 decimal places
     */
    fun multiply(amount: Double, quantity: Double): Double {
        return roundToTwoDecimals(amount * quantity)
    }

    /**
     * Calculate a percentage of an amount with proper rounding.
     * Used for: tax calculations, discounts, tips, etc.
     *
     * @param amount The base amount
     * @param percentage The percentage as a decimal (e.g., 0.08 for 8%)
     * @return Percentage amount rounded to 2 decimal places
     */
    fun calculatePercentage(amount: Double, percentage: Double): Double {
        return roundToTwoDecimals(amount * percentage)
    }

    /**
     * Sum a list of monetary amounts with proper rounding.
     * Important: Round the final sum, not intermediate values.
     *
     * @param amounts List of amounts to sum
     * @return Total sum rounded to 2 decimal places
     */
    fun sum(amounts: List<Double>): Double {
        val total = amounts.sum()
        return roundToTwoDecimals(total)
    }

    /**
     * Format a monetary amount for display.
     * Always shows exactly 2 decimal places.
     *
     * Examples:
     * - 19.49 → "19.49"
     * - 19.5 → "19.50"
     * - 19.0 → "19.00"
     *
     * @param amount The amount to format
     * @return Formatted string with 2 decimal places
     */
    fun format(amount: Double): String {
        val rounded = roundToTwoDecimals(amount)
        // Manual formatting to ensure exactly 2 decimal places
        val str = rounded.toString()
        return if (str.contains('.')) {
            val parts = str.split('.')
            "${parts[0]}.${parts[1].padEnd(2, '0').take(2)}"
        } else {
            "$str.00"
        }
    }

    /**
     * Format a monetary amount with currency symbol.
     *
     * @param amount The amount to format
     * @param currencySymbol The currency symbol (default: $)
     * @return Formatted string with currency symbol
     */
    fun formatWithSymbol(amount: Double, currencySymbol: String = "$"): String {
        return "$currencySymbol${format(amount)}"
    }
}

/**
 * Extension functions for Double to make money calculations cleaner.
 */

/**
 * Round this amount to 2 decimal places.
 */
fun Double.roundMoney(): Double = MoneyUtils.roundToTwoDecimals(this)

/**
 * Format this amount as a money string.
 */
fun Double.formatMoney(): String = MoneyUtils.format(this)

/**
 * Format this amount with currency symbol.
 */
fun Double.formatMoneyWithSymbol(currencySymbol: String = "$"): String =
    MoneyUtils.formatWithSymbol(this, currencySymbol)
