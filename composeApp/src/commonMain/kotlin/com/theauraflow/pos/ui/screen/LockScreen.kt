package com.theauraflow.pos.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

/**
 * Lock screen overlay for POS system.
 *
 * Features:
 * - Full-screen lock overlay
 * - 6-digit PIN entry
 * - Visual PIN dots
 * - Number pad for input
 * - Auto-unlock on correct PIN
 * - Cannot be dismissed (prevents bypassing)
 */
@Composable
fun LockScreen(
    open: Boolean,
    userPin: String,
    userName: String,
    onUnlock: () -> Unit
) {
    var pin by remember { mutableStateOf("") }

    // Reset PIN when opened
    LaunchedEffect(open) {
        if (open) {
            pin = ""
        }
    }

    // Auto-check PIN when 6 digits entered
    LaunchedEffect(pin) {
        if (pin.length == 6) {
            if (pin == userPin) {
                onUnlock()
                pin = ""
            } else {
                // Incorrect PIN - clear after a moment
                kotlinx.coroutines.delay(500)
                pin = ""
            }
        }
    }

    if (open) {
        Dialog(
            onDismissRequest = { /* Prevent dismissal */ },
            properties = DialogProperties(
                dismissOnBackPress = false,
                dismissOnClickOutside = false,
                usePlatformDefaultWidth = false
            )
        ) {
            Surface(
                modifier = Modifier
                    .width(448.dp)
                    .wrapContentHeight(),
                shape = RoundedCornerShape(16.dp),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(24.dp)
                ) {
                    // Lock Icon
                    Box(
                        modifier = Modifier
                            .size(80.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Lock,
                            contentDescription = "Locked",
                            modifier = Modifier.size(40.dp),
                            tint = MaterialTheme.colorScheme.primary
                        )
                    }

                    // Title and User
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text(
                            text = "Screen Locked",
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "$userName, enter your PIN to unlock",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    // PIN Dots Display
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        repeat(6) { index ->
                            Box(
                                modifier = Modifier
                                    .size(12.dp)
                                    .clip(CircleShape)
                                    .background(
                                        if (index < pin.length) {
                                            MaterialTheme.colorScheme.primary
                                        } else {
                                            MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)
                                        }
                                    )
                            )
                        }
                    }

                    // Number Pad
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        // Rows 1-3
                        listOf(
                            listOf("1", "2", "3"),
                            listOf("4", "5", "6"),
                            listOf("7", "8", "9")
                        ).forEach { row ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                row.forEach { number ->
                                    OutlinedButton(
                                        onClick = {
                                            if (pin.length < 6) {
                                                pin += number
                                            }
                                        },
                                        modifier = Modifier
                                            .weight(1f)
                                            .height(64.dp),
                                        shape = RoundedCornerShape(8.dp)
                                    ) {
                                        Text(
                                            text = number,
                                            fontSize = 24.sp,
                                            fontWeight = FontWeight.Medium
                                        )
                                    }
                                }
                            }
                        }

                        // Bottom Row: Clear, 0, Backspace
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            // Clear Button
                            OutlinedButton(
                                onClick = { pin = "" },
                                modifier = Modifier
                                    .weight(1f)
                                    .height(64.dp),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text(
                                    text = "Clear",
                                    fontSize = 14.sp
                                )
                            }

                            // Zero Button
                            OutlinedButton(
                                onClick = {
                                    if (pin.length < 6) {
                                        pin += "0"
                                    }
                                },
                                modifier = Modifier
                                    .weight(1f)
                                    .height(64.dp),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text(
                                    text = "0",
                                    fontSize = 24.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }

                            // Backspace Button
                            OutlinedButton(
                                onClick = {
                                    if (pin.isNotEmpty()) {
                                        pin = pin.dropLast(1)
                                    }
                                },
                                modifier = Modifier
                                    .weight(1f)
                                    .height(64.dp),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text(
                                    text = "⌫",
                                    fontSize = 20.sp
                                )
                            }
                        }
                    }

                    // Help Text
                    Text(
                        text = "Your shift is still active. The POS will unlock once you enter your correct PIN.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(horizontal = 16.dp)
                    )
                }
            }
        }
    }
}
