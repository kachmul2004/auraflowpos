package com.theauraflow.pos.util

import kotlin.js.Date

actual fun currentTimeMillis(): Long = Date.now().toLong()
