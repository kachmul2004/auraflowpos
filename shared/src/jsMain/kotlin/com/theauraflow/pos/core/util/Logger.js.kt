package com.theauraflow.pos.core.util

/**
 * JS/Web implementation of Logger using console API.
 */
actual class Logger actual constructor() {
    actual fun debug(tag: String, message: String) {
        console.log("[$tag] $message")
    }

    actual fun info(tag: String, message: String) {
        console.info("[$tag] $message")
    }

    actual fun warning(tag: String, message: String) {
        console.warn("[$tag] $message")
    }

    actual fun error(tag: String, message: String, throwable: Throwable?) {
        console.error("[$tag] $message", throwable)
    }
}
