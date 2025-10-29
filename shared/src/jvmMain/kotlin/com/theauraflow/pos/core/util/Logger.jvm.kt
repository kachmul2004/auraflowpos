package com.theauraflow.pos.core.util

/**
 * JVM/Desktop implementation of Logger using println.
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
            System.err.println("[$tag] ERROR: $message - ${throwable.message}")
            throwable.printStackTrace()
        } else {
            System.err.println("[$tag] ERROR: $message")
        }
    }
}