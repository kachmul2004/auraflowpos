package com.theauraflow.pos.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.theauraflow.pos.core.util.asString
import com.theauraflow.pos.presentation.viewmodel.AuthViewModel

/**
 * Login screen matching web version design.
 * Shows email and password inputs with demo credentials.
 * After successful authentication, navigates to POS screen.
 *
 * Web reference: docs/Web Version/src/components/LoginScreen.tsx
 */
@Composable
fun LoginScreen(
    authViewModel: AuthViewModel,
    onLoginSuccess: () -> Unit,
    isDarkTheme: Boolean,
    modifier: Modifier = Modifier
) {
    // Pre-filled for faster testing
    var email by remember { mutableStateOf("admin@example.com") }
    var password by remember { mutableStateOf("password123") }

    val authState by authViewModel.authState.collectAsState()
    val currentUser by authViewModel.currentUser.collectAsState()

    // Navigate to POS screen after successful authentication
    LaunchedEffect(currentUser) {
        if (currentUser != null) {
            onLoginSuccess()
        }
    }

    // Clear any previous errors when screen loads
    LaunchedEffect(Unit) {
        authViewModel.clearError()
    }

    // Handle login button click
    val handleLogin = {
        authViewModel.login(email, password)
    }

    // Centered layout with background matching web version
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background) // Proper background color
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        // Card matching web version max-w-md (448px = 448dp)
        Card(
            modifier = Modifier.width(448.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Header - "AuraFlow POS Login" (CardTitle in web)
                Text(
                    text = "AuraFlow POS Login",
                    style = MaterialTheme.typography.headlineSmall.copy(
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.padding(bottom = 8.dp)
                )

                // Email field (space-y-2 in web = 8dp spacing)
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "Email",
                        style = MaterialTheme.typography.bodyMedium.copy(
                            fontWeight = FontWeight.Medium
                        ),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("Enter email") },
                        singleLine = true,
                        enabled = authState !is com.theauraflow.pos.presentation.base.UiState.Loading,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = if (isDarkTheme) {
                                MaterialTheme.colorScheme.surfaceVariant
                            } else {
                                MaterialTheme.colorScheme.surface
                            },
                            unfocusedContainerColor = if (isDarkTheme) {
                                MaterialTheme.colorScheme.surfaceVariant
                            } else {
                                MaterialTheme.colorScheme.surface
                            }
                        )
                    )
                }

                // Password field
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "Password",
                        style = MaterialTheme.typography.bodyMedium.copy(
                            fontWeight = FontWeight.Medium
                        ),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("Enter password") },
                        singleLine = true,
                        visualTransformation = PasswordVisualTransformation(),
                        enabled = authState !is com.theauraflow.pos.presentation.base.UiState.Loading,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = if (isDarkTheme) {
                                MaterialTheme.colorScheme.surfaceVariant
                            } else {
                                MaterialTheme.colorScheme.surface
                            },
                            unfocusedContainerColor = if (isDarkTheme) {
                                MaterialTheme.colorScheme.surfaceVariant
                            } else {
                                MaterialTheme.colorScheme.surface
                            }
                        )
                    )
                }

                // Error message
                if (authState is com.theauraflow.pos.presentation.base.UiState.Error) {
                    Text(
                        text = (authState as com.theauraflow.pos.presentation.base.UiState.Error)
                            .message.asString(),
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall
                    )
                }

                // Login button - full width
                Button(
                    onClick = handleLogin,
                    modifier = Modifier.fillMaxWidth(),
                    enabled = email.isNotBlank() && password.isNotBlank() &&
                            authState !is com.theauraflow.pos.presentation.base.UiState.Loading
                ) {
                    if (authState is com.theauraflow.pos.presentation.base.UiState.Loading) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(20.dp),
                            color = MaterialTheme.colorScheme.onPrimary
                        )
                    } else {
                        Text("Login")
                    }
                }

                // Divider with "Or" text (matching web version)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    HorizontalDivider(modifier = Modifier.weight(1f))
                    Text(
                        text = "OR",
                        modifier = Modifier.padding(horizontal = 8.dp),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    HorizontalDivider(modifier = Modifier.weight(1f))
                }

                // Admin Login button (outline variant)
                OutlinedButton(
                    onClick = { /* TODO: Navigate to Admin login */ },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Admin Login")
                }

                // Demo credentials (text-sm text-muted-foreground mt-4 in web)
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text(
                        text = "Demo credentials:",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "Email: admin@example.com",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "Password: password123",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}

/**
 * Clock In Dialog matching web version ShiftDialog.
 * Allows entering opening cash balance.
 * Terminal selection removed - app runs on single terminal.
 *
 * Web reference: docs/Web Version/src/components/LoginScreen.tsx (Dialog)
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ClockInDialog(
    onDismiss: () -> Unit,
    onClockIn: (openingBalance: Double) -> Unit
) {
    var openingBalance by remember { mutableStateOf("100.00") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Column {
                Text(
                    "Clock In",
                    style = MaterialTheme.typography.titleLarge
                )
                Text(
                    "Enter the opening cash balance to clock in.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }
        },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Opening balance input
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "Opening Cash Balance ($)",
                        style = MaterialTheme.typography.bodyMedium.copy(
                            fontWeight = FontWeight.Medium
                        )
                    )
                    OutlinedTextField(
                        value = openingBalance,
                        onValueChange = { openingBalance = it },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("0.00") },
                        singleLine = true
                    )
                    Text(
                        text = "Count the cash in the drawer and enter the total amount.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val balance = openingBalance.toDoubleOrNull() ?: 0.0
                    onClockIn(balance)
                },
                enabled = openingBalance.isNotBlank()
            ) {
                Text("Clock In")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
