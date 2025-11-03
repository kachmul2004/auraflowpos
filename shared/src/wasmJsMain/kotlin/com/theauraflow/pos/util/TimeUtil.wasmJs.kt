package com.theauraflow.pos.util

// WasmJS doesn't have direct access to Date.now() yet
// Use a simple counter-based timestamp as fallback
private var wasmTimeCounter = 0L

actual fun currentTimeMillis(): Long {
    // Start from a base timestamp (Jan 1, 2024) and increment
    // This is a limitation of WasmJS until proper time APIs are available
    return 1704067200000L + (wasmTimeCounter++ * 1000L)
}
