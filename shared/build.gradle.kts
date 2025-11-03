import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidLibrary)
    alias(libs.plugins.kotlinSerialization)
    alias(libs.plugins.ksp)
    alias(libs.plugins.room)
}

kotlin {
    androidTarget {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_11)
        }
    }

    listOf(
        iosArm64(),
        iosSimulatorArm64()
    ).forEach { iosTarget ->
        iosTarget.binaries.framework {
            baseName = "shared"
            isStatic = true

            // Add bundle ID to suppress warning
            binaryOption("bundleId", "com.theauraflow.pos.shared")

            // Export Koin for iOS
            export(libs.koin.core)
        }
    }
    
    jvm()
    
    js {
        browser()
    }
    
    @OptIn(ExperimentalWasmDsl::class)
    wasmJs {
        browser()
    }

    // Create an intermediate source set for platforms that support Room
    // (Android, iOS, JVM) and exclude JS/Wasm
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    applyDefaultHierarchyTemplate {
        common {
            group("native") {
                withAndroidTarget()
                withJvm()
                group("ios") {
                    withIos()
                }
            }
        }
    }

    sourceSets {
        commonMain.dependencies {
            implementation(libs.kotlinx.coroutines.core)

            implementation(libs.kotlinx.serialization.json)
            implementation(libs.kotlinx.datetime)

            implementation(libs.ktor.client.core)
            implementation(libs.ktor.client.content.negotiation)
            implementation(libs.ktor.client.logging)
            implementation(libs.ktor.client.serialization)
            implementation(libs.ktor.client.websockets)
            implementation(libs.ktor.client.auth)
            implementation(libs.ktor.serialization.kotlinx.json)

            implementation(libs.koin.core)

            implementation(libs.kermit)

            // Okio for file-based persistence (cross-platform)
            implementation(libs.okio)
        }

        // Native source set: Android + iOS + JVM (platforms that support Room)
        val nativeMain by getting {
            dependencies {
                implementation(libs.room.runtime)
                implementation(libs.sqlite.bundled)
            }
        }

        androidMain.dependencies {
            implementation(libs.kotlinx.coroutines.android)
            implementation(libs.ktor.client.okhttp)
            implementation(libs.koin.android)
        }

        iosMain.dependencies {
            implementation(libs.ktor.client.darwin)
            api(libs.koin.core)
        }

        jvmMain.dependencies {
            implementation(libs.ktor.client.cio)
            implementation(libs.kotlinx.coroutines.swing)
        }

        jsMain.dependencies {
            implementation(libs.ktor.client.js)
            // JS uses IndexedDB (browser native) - no Room support yet
            implementation(libs.indexeddb)
        }

        wasmJsMain.dependencies {
            implementation(libs.ktor.client.js)
            // IndexedDB support (browser storage) - no Room support yet
            implementation(npm("idb", "8.0.0"))
        }

        commonTest.dependencies {
            implementation(libs.kotlin.test)
            implementation(libs.kotlinx.coroutines.test)
            implementation(libs.koin.test)
        }
    }
}

android {
    namespace = "com.theauraflow.pos.shared"
    compileSdk = libs.versions.android.compileSdk.get().toInt()
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    defaultConfig {
        minSdk = libs.versions.android.minSdk.get().toInt()
    }
}

// Room configuration
room {
    schemaDirectory("$projectDir/schemas")
}

// KSP configuration for Room code generation
dependencies {
    // Room compiler for all platforms that support Room
    add("kspAndroid", libs.room.compiler)
    add("kspIosSimulatorArm64", libs.room.compiler)
    add("kspIosArm64", libs.room.compiler)
    add("kspJvm", libs.room.compiler)
    // Note: JS/Wasm will be supported in future Room versions
}
