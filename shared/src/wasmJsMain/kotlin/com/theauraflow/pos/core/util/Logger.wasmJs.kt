package com.theauraflow.pos.core.util

/**
 * Wasm/JS implementation of Logger using console.
 */
actual class Logger {
    actual fun debug(tag: String, message: String) {
        console.log("[$tag] DEBUG: $message")
    }

    actual fun info(tag: String, message: String) {
        console.info("[$tag] INFO: $message")
    }

    actual fun warning(tag: String, message: String) {
        console.warn("[$tag] WARNING: $message")
    }

    actual fun error(tag: String, message: String, throwable: Throwable?) {
        if (throwable != null) {
            console.error("[$tag] ERROR: $message", throwable)
        } else {
            console.error("[$tag] ERROR: $message")
        }
    }
}