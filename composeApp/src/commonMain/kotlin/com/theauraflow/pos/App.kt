package com.theauraflow.pos

import androidx.compose.runtime.*
import com.theauraflow.pos.ui.theme.AuraFlowTheme
import com.theauraflow.pos.ui.screen.LoginScreen
import com.theauraflow.pos.ui.screen.POSScreen
import com.theauraflow.pos.presentation.viewmodel.AuthViewModel
import com.theauraflow.pos.presentation.viewmodel.ProductViewModel
import com.theauraflow.pos.presentation.viewmodel.CartViewModel
import com.theauraflow.pos.presentation.viewmodel.OrderViewModel
import com.theauraflow.pos.presentation.viewmodel.CustomerViewModel
import com.theauraflow.pos.presentation.viewmodel.TableViewModel
import com.theauraflow.pos.presentation.viewmodel.SettingsViewModel
import org.koin.compose.koinInject

/**
 * Main AuraFlow POS Application
 */
@Composable
fun App() {
    // Koin is initialized in platform entry point (e.g., Android MainActivity)
    AuraFlowApp()
}

@Composable
private fun AuraFlowApp() {
    // Get ViewModels from Koin DI
    val authViewModel: AuthViewModel = koinInject()
    val productViewModel: ProductViewModel = koinInject()
    val cartViewModel: CartViewModel = koinInject()
    val orderViewModel: OrderViewModel = koinInject()
    val customerViewModel: CustomerViewModel = koinInject()
    val tableViewModel: TableViewModel = koinInject()
    val settingsViewModel: SettingsViewModel = koinInject()

    val isLoggedIn by authViewModel.isLoggedIn.collectAsState()
    val isDarkTheme by settingsViewModel.darkMode.collectAsState()

    AuraFlowTheme(darkTheme = isDarkTheme) {
        if (isLoggedIn) {
            POSScreen(
                productViewModel = productViewModel,
                cartViewModel = cartViewModel,
                orderViewModel = orderViewModel,
                customerViewModel = customerViewModel,
                tableViewModel = tableViewModel,
                settingsViewModel = settingsViewModel,
                isDarkTheme = isDarkTheme,
                onThemeToggle = { settingsViewModel.toggleDarkMode() },
                onLogout = {
                    authViewModel.logout()
                }
            )
        } else {
            LoginScreen(
                authViewModel = authViewModel,
                onLoginSuccess = {
                    // Login successful, state will update automatically
                },
                isDarkTheme = isDarkTheme
            )
        }
    }
}