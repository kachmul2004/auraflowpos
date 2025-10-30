package com.auraflow.pos

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.auraflow.pos.screens.POSScreen
import com.auraflow.pos.theme.AuraFlowPOSTheme
import com.auraflow.pos.ui.viewmodel.POSViewModel
import com.auraflow.pos.ui.viewmodel.POSViewModelFactory

/**
 * Main entry point for AuraFlow POS Android app
 */
class MainActivity : ComponentActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        
        setContent {
            AuraFlowPOSTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    // Get application instance
                    val app = application as POSApplication
                    
                    // Create ViewModel with factory
                    val viewModel: POSViewModel = viewModel(
                        factory = POSViewModelFactory(
                            repository = app.repository,
                            cartUseCases = app.cartUseCases,
                            orderUseCases = app.orderUseCases,
                            subscriptionManager = app.subscriptionManager
                        )
                    )
                    
                    // Main POS Screen
                    POSScreen(viewModel = viewModel)
                }
            }
        }
    }
}
