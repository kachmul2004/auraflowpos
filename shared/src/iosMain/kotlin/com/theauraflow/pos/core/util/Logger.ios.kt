package com.theauraflow.pos.core.util

import platform.Foundation.NSLog

/**
 * iOS implementation of Logger using NSLog.
 */
actual class Logger {
    actual fun debug(tag: String, message: String) {
        NSLog("[$tag] DEBUG: $message")
    }

    actual fun info(tag: String, message: String) {
        NSLog("[$tag] INFO: $message")
    }

    actual fun warning(tag: String, message: String) {
        NSLog("[$tag] WARNING: $message")
    }

    actual fun error(tag: String, message: String, throwable: Throwable?) {
        if (throwable != null) {
            NSLog("[$tag] ERROR: $message - ${throwable.message}\n${throwable.stackTraceToString()}")
        } else {
            NSLog("[$tag] ERROR: $message")
        }
    }
}