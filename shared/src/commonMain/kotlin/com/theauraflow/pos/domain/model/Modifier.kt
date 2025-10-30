package com.theauraflow.pos.domain.model

import kotlinx.serialization.Serializable

/**
 * Domain model representing a product modifier.
 *
 * Modifiers are add-ons or customizations to products (e.g., "Extra Shot", "Soy Milk").
 */
@Serializable
data class Modifier(
    val id: String,
    val name: String,
    val price: Double,
    val groupId: String? = null,
    val groupName: String? = null,
    val isRequired: Boolean = false
) {
    /**
     * Check if modifier has additional cost.
     */
    val hasCost: Boolean
        get() = price > 0.0

    /**
     * Check if modifier is free.
     */
    val isFree: Boolean
        get() = price == 0.0
}

/**
 * Domain model representing a group of modifiers.
 *
 * Modifier groups organize related modifiers (e.g., "Milk Options", "Size").
 */
@Serializable
data class ModifierGroup(
    val id: String,
    val name: String,
    val minSelections: Int = 0,
    val maxSelections: Int = 1,
    val modifiers: List<Modifier> = emptyList()
) {
    /**
     * Check if multiple selections are allowed.
     */
    val allowsMultipleSelections: Boolean
        get() = maxSelections > 1

    /**
     * Check if at least one selection is required.
     */
    val requiresSelection: Boolean
        get() = minSelections > 0

    /**
     * Validate if the selected modifiers meet the requirements.
     */
    fun isValidSelection(selectedModifiers: List<Modifier>): Boolean {
        val count = selectedModifiers.count { it.groupId == id }
        return count in minSelections..maxSelections
    }
}
