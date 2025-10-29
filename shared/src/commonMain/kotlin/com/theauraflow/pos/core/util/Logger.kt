package com.theauraflow.pos.core.util

/**
 * Multiplatform logger interface.
 * Provides platform-specific logging implementations.
 */
expect class Logger() {
    /**
     * Log a debug message.
     * @param tag Optional tag for filtering logs
     * @param message The message to log
     */
    fun debug(tag: String = "AuraFlow", message: String)

    /**
     * Log an info message.
     * @param tag Optional tag for filtering logs
     * @param message The message to log
     */
    fun info(tag: String = "AuraFlow", message: String)

    /**
     * Log a warning message.
     * @param tag Optional tag for filtering logs
     * @param message The message to log
     */
    fun warning(tag: String = "AuraFlow", message: String)

    /**
     * Log an error message.
     * @param tag Optional tag for filtering logs
     * @param message The message to log
     * @param throwable Optional exception to log
     */
    fun error(tag: String = "AuraFlow", message: String, throwable: Throwable? = null)
}

/**
 * Global logger instance.
 * Use this for logging throughout the application.
 */
object AppLogger {
    private val logger = Logger()

    fun d(tag: String = "AuraFlow", message: String) = logger.debug(tag, message)
    fun i(tag: String = "AuraFlow", message: String) = logger.info(tag, message)
    fun w(tag: String = "AuraFlow", message: String) = logger.warning(tag, message)
    fun e(tag: String = "AuraFlow", message: String, throwable: Throwable? = null) =
        logger.error(tag, message, throwable)
}