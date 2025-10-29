package com.theauraflow.pos

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform