package com.theauraflow.pos.core.util

/**
 * Sealed interface for representing text that can be displayed in the UI.
 * This allows for both hardcoded strings and localized string resources.
 */
sealed interface UiText {
    /**
     * Represents a dynamic string that doesn't need localization.
     * Use this for user-generated content or API responses.
     */
    data class DynamicString(val value: String) : UiText

    /**
     * Represents a string resource that should be localized.
     * @param id The resource identifier (key)
     * @param args Optional formatting arguments for string interpolation
     */
    data class StringResource(
        val id: String,
        val args: List<Any> = emptyList()
    ) : UiText

    companion object {
        /**
         * Creates a UiText from a nullable string, defaulting to empty string.
         */
        fun from(value: String?): UiText {
            return DynamicString(value ?: "")
        }
    }
}

/**
 * Extension function to convert UiText to a plain string.
 * Note: This is a simplified version. In actual usage, use platform-specific
 * resource resolution in Composables.
 */
fun UiText.asString(): String {
    return when (this) {
        is UiText.DynamicString -> value
        is UiText.StringResource -> {
            // This is a fallback. In real app, use stringResource() in Composables
            id
        }
    }
}