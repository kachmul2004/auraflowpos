package com.theauraflow.pos

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.theauraflow.pos.ui.theme.AuraFlowTheme
import com.theauraflow.pos.ui.screen.LoginScreen
import com.theauraflow.pos.ui.screen.POSScreen
import com.theauraflow.pos.presentation.viewmodel.AuthViewModel
import com.theauraflow.pos.presentation.viewmodel.ProductViewModel
import com.theauraflow.pos.presentation.viewmodel.CartViewModel
import com.theauraflow.pos.core.di.appModule
import org.jetbrains.compose.ui.tooling.preview.Preview
import org.koin.compose.KoinApplication
import org.koin.compose.koinInject

/**
 * Main AuraFlow POS Application
 */
@Composable
fun App() {
    KoinApplication(application = {
        modules(appModule)
    }) {
        AuraFlowApp()
    }
}

@Composable
private fun AuraFlowApp() {
    // Get ViewModels from Koin DI
    val authViewModel: AuthViewModel = koinInject()
    val productViewModel: ProductViewModel = koinInject()
    val cartViewModel: CartViewModel = koinInject()

    val isLoggedIn by authViewModel.isLoggedIn.collectAsState()

    AuraFlowTheme {
        if (isLoggedIn) {
            POSScreen(
                productViewModel = productViewModel,
                cartViewModel = cartViewModel
            )
        } else {
            LoginScreen(
                authViewModel = authViewModel,
                onLoginSuccess = {
                    // Login successful, state will update automatically
                }
            )
        }
    }
}