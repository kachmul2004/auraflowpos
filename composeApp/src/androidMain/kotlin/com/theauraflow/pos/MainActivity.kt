package com.theauraflow.pos

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import coil3.ImageLoader
import coil3.SingletonImageLoader
import coil3.disk.DiskCache
import coil3.memory.MemoryCache
import com.theauraflow.pos.di.initializeKoin
import org.koin.android.ext.koin.androidContext
import okio.Path.Companion.toOkioPath
import java.io.File

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        // Configure Coil for optimal performance
        configureCoilImageLoader()

        // Initialize Koin using shared initializer with Android context
        initializeKoin {
            androidContext(this@MainActivity)
        }

        setContent {
            App()
        }
    }

    /**
     * Configure Coil ImageLoader with disk caching and memory limits
     * for optimal performance on older/budget hardware
     */
    private fun configureCoilImageLoader() {
        SingletonImageLoader.setSafe { context ->
            ImageLoader.Builder(context)
                // Memory cache: Limit to 25% of available memory (good for 2GB devices)
                .memoryCache {
                    MemoryCache.Builder()
                        .maxSizePercent(context, percent = 0.25)
                        .build()
                }
                // Disk cache: 100MB max (reasonable for POS product images)
                .diskCache {
                    val cacheDir = File(context.cacheDir, "image_cache").toOkioPath()
                    DiskCache.Builder()
                        .directory(cacheDir)
                        .maxSizeBytes(100L * 1024 * 1024) // 100MB
                        .build()
                }
                .build()
        }
    }
}

@Preview
@Composable
fun AppAndroidPreview() {
    App()
}