# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.kts.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Keep Compose runtime classes
-keep class androidx.compose.** { *; }
-keep interface androidx.compose.** { *; }

# Keep data classes
-keep class com.auraflow.pos.data.models.** { *; }

# Keep Kotlin metadata
-keep class kotlin.Metadata { *; }

# Keep Coroutines
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}

# Keep image loading (Coil)
-keep class coil.** { *; }
