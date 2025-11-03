package com.theauraflow.pos.ui.dialog

import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

/**
 * Edit Profile Dialog with PIN authentication
 * Matches web: UserProfileDropdown.tsx
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditProfileDialog(
    open: Boolean,
    userFirstName: String = "John",
    userLastName: String = "Cashier",
    userEmail: String = "",
    userPin: String = "123456",
    onDismiss: () -> Unit,
    onSave: (firstName: String, lastName: String, email: String) -> Unit = { _, _, _ -> },
    onChangePin: (newPin: String) -> Unit = {}
) {
    var firstName by remember(open) { mutableStateOf(userFirstName) }
    var lastName by remember(open) { mutableStateOf(userLastName) }
    var email by remember(open) { mutableStateOf(userEmail) }

    var isPinVisible by remember { mutableStateOf(false) }
    var showPinAuthDialog by remember { mutableStateOf(false) }
    var showChangePinDialog by remember { mutableStateOf(false) }
    var pinAuthAction by remember { mutableStateOf("view") } // "view" or "change"
    val focusManager = LocalFocusManager.current

    // Reset visibility when dialog closes
    LaunchedEffect(open) {
        if (!open) {
            isPinVisible = false
        }
    }

    // Auto-hide PIN after 30 seconds
    LaunchedEffect(isPinVisible) {
        if (isPinVisible) {
            kotlinx.coroutines.delay(30000)
            isPinVisible = false
        }
    }

    if (!open) return

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(
            dismissOnBackPress = true,
            dismissOnClickOutside = false,
            usePlatformDefaultWidth = false
        )
    ) {
        Card(
            modifier = Modifier
                .widthIn(max = 500.dp)
                .padding(16.dp),
            shape = MaterialTheme.shapes.large,
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null
                    ) { focusManager.clearFocus() }
                    .padding(24.dp)
            ) {
                // Header
                Text(
                    text = "Edit Profile",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = "Update your personal information",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 4.dp)
                )

                Spacer(Modifier.height(24.dp))

                // Scrollable content
                Column(
                    modifier = Modifier
                        .weight(1f, fill = false)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Name fields
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        // First Name
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "First Name *",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium,
                                modifier = Modifier.padding(bottom = 8.dp)
                            )
                            OutlinedTextField(
                                value = firstName,
                                onValueChange = { firstName = it },
                                placeholder = { Text("John") },
                                modifier = Modifier.fillMaxWidth(),
                                singleLine = true
                            )
                        }

                        // Last Name
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Last Name *",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium,
                                modifier = Modifier.padding(bottom = 8.dp)
                            )
                            OutlinedTextField(
                                value = lastName,
                                onValueChange = { lastName = it },
                                placeholder = { Text("Doe") },
                                modifier = Modifier.fillMaxWidth(),
                                singleLine = true
                            )
                        }
                    }

                    // Email
                    Column {
                        Text(
                            text = "Email",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                        OutlinedTextField(
                            value = email,
                            onValueChange = { email = it },
                            placeholder = { Text("john@example.com") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true,
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
                        )
                    }

                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

                    // Security PIN Section
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Lock,
                                contentDescription = null,
                                modifier = Modifier.size(16.dp),
                                tint = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                text = "Security PIN",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }

                        // PIN Display + View Button
                        Surface(
                            modifier = Modifier.fillMaxWidth(),
                            shape = MaterialTheme.shapes.medium,
                            color = MaterialTheme.colorScheme.surfaceVariant,
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                MaterialTheme.colorScheme.outline
                            )
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = if (isPinVisible) userPin else "••••••",
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Medium,
                                    letterSpacing = 4.sp,
                                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                                )
                                OutlinedButton(
                                    onClick = {
                                        pinAuthAction = "view"
                                        showPinAuthDialog = true
                                    },
                                    contentPadding = PaddingValues(
                                        horizontal = 12.dp,
                                        vertical = 6.dp
                                    )
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Visibility,
                                        contentDescription = null,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(Modifier.width(6.dp))
                                    Text("View PIN", fontSize = 12.sp)
                                }
                            }
                        }

                        // Change PIN Button
                        OutlinedButton(
                            onClick = {
                                pinAuthAction = "change"
                                showPinAuthDialog = true
                            },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(
                                imageVector = Icons.Default.Lock,
                                contentDescription = null,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(Modifier.width(8.dp))
                            Text("Change PIN")
                        }

                        // Security Alert
                        Surface(
                            modifier = Modifier.fillMaxWidth(),
                            shape = MaterialTheme.shapes.medium,
                            color = MaterialTheme.colorScheme.surfaceVariant
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Info,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp),
                                    tint = MaterialTheme.colorScheme.primary
                                )
                                Text(
                                    text = "For security, you must enter your current PIN to view or change it. If you forgot your PIN, contact an administrator to reset it.",
                                    fontSize = 11.sp,
                                    lineHeight = 16.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }

                Spacer(Modifier.height(24.dp))

                // Action buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedButton(onClick = onDismiss) {
                        Text("Cancel")
                    }
                    Spacer(Modifier.width(8.dp))
                    Button(
                        onClick = {
                            if (firstName.isNotBlank() && lastName.isNotBlank()) {
                                onSave(firstName, lastName, email)
                                onDismiss()
                            }
                        },
                        enabled = firstName.isNotBlank() && lastName.isNotBlank()
                    ) {
                        Text("Save Changes")
                    }
                }
            }
        }
    }

    // PIN Authentication Dialog
    if (showPinAuthDialog) {
        PinAuthDialog(
            open = showPinAuthDialog,
            title = "Enter Your PIN",
            description = if (pinAuthAction == "view")
                "Enter your PIN to view it"
            else
                "Enter your current PIN to change it",
            correctPin = userPin,
            onDismiss = { showPinAuthDialog = false },
            onSuccess = {
                showPinAuthDialog = false
                if (pinAuthAction == "view") {
                    isPinVisible = true
                } else {
                    showChangePinDialog = true
                }
            }
        )
    }

    // Change PIN Dialog
    if (showChangePinDialog) {
        ChangePinDialog(
            open = showChangePinDialog,
            currentPin = userPin,
            onDismiss = { showChangePinDialog = false },
            onChangePin = { newPin ->
                onChangePin(newPin)
                showChangePinDialog = false
            }
        )
    }
}

/**
 * PIN Authentication Dialog
 */
@Composable
private fun PinAuthDialog(
    open: Boolean,
    title: String,
    description: String,
    correctPin: String,
    onDismiss: () -> Unit,
    onSuccess: () -> Unit
) {
    var enteredPin by remember(open) { mutableStateOf("") }
    var showError by remember { mutableStateOf(false) }

    if (!open) return

    AlertDialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(
            dismissOnBackPress = true,
            dismissOnClickOutside = false
        ),
        title = { Text(title) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Text(
                    text = description,
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Current PIN",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium
                    )
                    OutlinedTextField(
                        value = enteredPin,
                        onValueChange = {
                            if (it.length <= 6 && it.all { char -> char.isDigit() }) {
                                enteredPin = it
                                showError = false
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("••••••", textAlign = TextAlign.Center) },
                        textStyle = LocalTextStyle.current.copy(
                            textAlign = TextAlign.Center,
                            fontSize = 18.sp,
                            letterSpacing = 8.sp,
                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                        ),
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.NumberPassword,
                            imeAction = ImeAction.Done
                        ),
                        keyboardActions = KeyboardActions(
                            onDone = {
                                if (enteredPin == correctPin) {
                                    onSuccess()
                                } else {
                                    showError = true
                                    enteredPin = ""
                                }
                            }
                        ),
                        isError = showError,
                        singleLine = true
                    )
                    if (showError) {
                        Text(
                            text = "Incorrect PIN",
                            color = MaterialTheme.colorScheme.error,
                            fontSize = 12.sp
                        )
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (enteredPin == correctPin) {
                        onSuccess()
                    } else {
                        showError = true
                        enteredPin = ""
                    }
                },
                enabled = enteredPin.length == 6
            ) {
                Text("Verify")
            }
        },
        dismissButton = {
            OutlinedButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}

/**
 * Change PIN Dialog
 */
@Composable
private fun ChangePinDialog(
    open: Boolean,
    currentPin: String,
    onDismiss: () -> Unit,
    onChangePin: (String) -> Unit
) {
    var newPin by remember(open) { mutableStateOf("") }
    var confirmPin by remember(open) { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf("") }

    val pinsMatch = newPin.isNotEmpty() && confirmPin.isNotEmpty() && newPin == confirmPin
    val showMismatchError = newPin.length == 6 && confirmPin.length == 6 && newPin != confirmPin

    if (!open) return

    AlertDialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(
            dismissOnBackPress = true,
            dismissOnClickOutside = false
        ),
        title = { Text("Change PIN") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Text(
                    text = "Enter and confirm your new 6-digit PIN",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                // New PIN
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "New PIN",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium
                    )
                    OutlinedTextField(
                        value = newPin,
                        onValueChange = {
                            if (it.length <= 6 && it.all { char -> char.isDigit() }) {
                                newPin = it
                                errorMessage = ""
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("••••••", textAlign = TextAlign.Center) },
                        textStyle = LocalTextStyle.current.copy(
                            textAlign = TextAlign.Center,
                            fontSize = 18.sp,
                            letterSpacing = 8.sp,
                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                        ),
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.NumberPassword,
                            imeAction = ImeAction.Next
                        ),
                        singleLine = true
                    )
                }

                // Confirm PIN
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Confirm New PIN",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium
                    )
                    OutlinedTextField(
                        value = confirmPin,
                        onValueChange = {
                            if (it.length <= 6 && it.all { char -> char.isDigit() }) {
                                confirmPin = it
                                errorMessage = ""
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("••••••", textAlign = TextAlign.Center) },
                        textStyle = LocalTextStyle.current.copy(
                            textAlign = TextAlign.Center,
                            fontSize = 18.sp,
                            letterSpacing = 8.sp,
                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                        ),
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.NumberPassword,
                            imeAction = ImeAction.Done
                        ),
                        keyboardActions = KeyboardActions(
                            onDone = {
                                if (newPin.length == 6 && confirmPin.length == 6) {
                                    when {
                                        newPin != confirmPin -> errorMessage = "PINs do not match"
                                        newPin == currentPin -> errorMessage =
                                            "New PIN must be different from current PIN"

                                        else -> onChangePin(newPin)
                                    }
                                }
                            }
                        ),
                        isError = showMismatchError || errorMessage.isNotEmpty(),
                        singleLine = true
                    )
                }

                // Error message
                if (showMismatchError || errorMessage.isNotEmpty()) {
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        shape = MaterialTheme.shapes.small,
                        color = MaterialTheme.colorScheme.errorContainer
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Error,
                                contentDescription = null,
                                modifier = Modifier.size(16.dp),
                                tint = MaterialTheme.colorScheme.error
                            )
                            Text(
                                text = errorMessage.ifEmpty { "PINs do not match" },
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onErrorContainer
                            )
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    when {
                        newPin != confirmPin -> errorMessage = "PINs do not match"
                        newPin == currentPin -> errorMessage =
                            "New PIN must be different from current PIN"

                        else -> onChangePin(newPin)
                    }
                },
                enabled = newPin.length == 6 && confirmPin.length == 6
            ) {
                Text("Change PIN")
            }
        },
        dismissButton = {
            OutlinedButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
