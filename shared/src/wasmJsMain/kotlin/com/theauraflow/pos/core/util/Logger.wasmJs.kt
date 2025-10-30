package com.theauraflow.pos.core.util

/**
 * Wasm/JS implementation of Logger using console.
 */
actual class Logger {
    actual fun debug(tag: String, message: String) {
        println("[$tag] DEBUG: $message")
    }

    actual fun info(tag: String, message: String) {
        println("[$tag] INFO: $message")
    }

    actual fun warning(tag: String, message: String) {
        println("[$tag] WARNING: $message")
    }

    actual fun error(tag: String, message: String, throwable: Throwable?) {
        if (throwable != null) {
            println("[$tag] ERROR: $message - ${throwable.message}")
        } else {
            println("[$tag] ERROR: $message")
        }
    }
}