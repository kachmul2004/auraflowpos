package com.theauraflow.pos

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.core.di.appModule
import com.theauraflow.pos.core.di.mockDataModule
import org.koin.android.ext.koin.androidContext
import org.koin.core.context.startKoin

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        // Initialize Koin for Android with Mock overrides
        // IMPORTANT: mockDataModule MUST come AFTER appModule to override real repos
        startKoin {
            androidContext(this@MainActivity)
            allowOverride(true)
            modules(
                appModule,      // Contains real repos and use cases
                mockDataModule  // Overrides with mock repos for dev/testing
            )
        }

        setContent {
            App()
        }
    }
}

@Preview
@Composable
fun AppAndroidPreview() {
    App()
}