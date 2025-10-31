package com.theauraflow.pos.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

/**
 * Top application bar matching the AuraFlow POS web version.
 *
 * Features (matching web version exactly):
 * - App name "AuraFlow-POS"
 * - Training Mode badge indicator
 * - Subscription badges (Restaurant, Bar, Retail, etc.)
 * - Clocked in status badge
 * - Help button
 * - Training mode toggle switch
 * - Tables button (if feature enabled)
 * - Admin button
 * - Fullscreen toggle button
 * - Theme toggle button
 * - User profile dropdown
 *
 * @param userName Name of the current user
 * @param userRole Role of the current user
 * @param isTrainingMode Whether training mode is active
 * @param onToggleTrainingMode Callback to toggle training mode
 * @param isClockedIn Whether user has an active shift
 * @param terminalName Name of the current terminal
 * @param subscriptions List of active subscription presets
 * @param hasTableManagement Whether table management feature is enabled
 * @param onHelp Callback when help is clicked
 * @param onTables Callback when tables is clicked
 * @param onAdmin Callback when admin is clicked
 * @param onToggleFullscreen Callback to toggle fullscreen
 * @param isFullscreen Whether app is in fullscreen mode
 * @param onToggleTheme Callback to toggle dark/light theme
 * @param isDarkTheme Whether dark theme is active
 * @param onOpenShiftStatus Callback to open shift status
 * @param onOpenSettings Callback to open settings
 * @param onOpenKeyboardShortcuts Callback to open keyboard shortcuts
 * @param modifier Modifier for customization
 */
@Composable
fun POSTopAppBar(
    userName: String = "John Cashier",
    userRole: String = "Cashier",
    isTrainingMode: Boolean = false,
    onToggleTrainingMode: (Boolean) -> Unit = {},
    isClockedIn: Boolean = false,
    terminalName: String = "Terminal 1",
    subscriptions: List<String> = emptyList(),
    hasTableManagement: Boolean = false,
    onHelp: () -> Unit = {},
    onTables: () -> Unit = {},
    onAdmin: () -> Unit = {},
    onToggleFullscreen: () -> Unit = {},
    isFullscreen: Boolean = false,
    onToggleTheme: () -> Unit = {},
    isDarkTheme: Boolean = true,
    onOpenShiftStatus: () -> Unit = {},
    onOpenSettings: () -> Unit = {},
    onOpenKeyboardShortcuts: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    var showUserMenu by remember { mutableStateOf(false) }

    Surface(
        modifier = modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surface,
        shadowElevation = 2.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // LEFT SECTION: App name + badges (constrained width)
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.weight(1f)
            ) {
                // App Name
                Text(
                    text = "AuraFlow-POS",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface
                )

                // Training Mode Badge
                if (isTrainingMode) {
                    Surface(
                        color = Color(0xFFF59E0B).copy(alpha = 0.2f),
                        shape = MaterialTheme.shapes.small,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            Color(0xFFF59E0B).copy(alpha = 0.5f)
                        )
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.School,
                                contentDescription = null,
                                tint = Color(0xFFF59E0B),
                                modifier = Modifier.size(12.dp)
                            )
                            Text(
                                text = "Training Mode",
                                fontSize = 11.sp,
                                color = Color(0xFFF59E0B),
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }

                // Subscription Badges
                if (subscriptions.isNotEmpty()) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        subscriptions.forEach { subscription ->
                            val emoji = when (subscription.lowercase()) {
                                "restaurant" -> "🍽️"
                                "bar" -> "🍺"
                                "retail" -> "🏪"
                                "cafe" -> "☕"
                                "pharmacy" -> "💊"
                                "salon" -> "💇"
                                else -> "📦"
                            }
                            Surface(
                                shape = MaterialTheme.shapes.small,
                                border = androidx.compose.foundation.BorderStroke(
                                    1.dp,
                                    MaterialTheme.colorScheme.outline
                                ),
                                color = MaterialTheme.colorScheme.surfaceVariant
                            ) {
                                Text(
                                    text = emoji,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                    fontSize = 11.sp
                                )
                            }
                        }
                    }
                }

                // Clocked In Badge
                if (isClockedIn) {
                    Surface(
                        shape = MaterialTheme.shapes.small,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            MaterialTheme.colorScheme.outline
                        ),
                        color = MaterialTheme.colorScheme.surfaceVariant
                    ) {
                        Text(
                            text = "Clocked In: $terminalName",
                            fontSize = 11.sp,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            // CENTER SECTION: Online Indicator (perfectly centered)
            Box(
                modifier = Modifier.weight(1f),
                contentAlignment = Alignment.Center
            ) {
                OnlineIndicator(
                    isOnline = true,
                    pendingCount = 0
                )
            }

            // RIGHT SECTION: Action buttons + user profile (constrained width)
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.weight(1f).wrapContentWidth(Alignment.End)
            ) {
                // Help Button
                TextButton(
                    onClick = onHelp,
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Help,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Help", fontSize = 12.sp)
                }

                // Training Mode Toggle
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Switch(
                        checked = isTrainingMode,
                        onCheckedChange = onToggleTrainingMode,
                        modifier = Modifier.height(20.dp)
                    )
                    Text(
                        text = "Training",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                // Tables Button
                OutlinedButton(
                    onClick = onTables,
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                    enabled = hasTableManagement
                ) {
                    Icon(
                        imageVector = Icons.Default.TableChart,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Tables", fontSize = 12.sp)
                }

                // Admin Button
                OutlinedButton(
                    onClick = onAdmin,
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.AdminPanelSettings,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Admin", fontSize = 12.sp)
                }

                // Fullscreen Toggle
                IconButton(
                    onClick = onToggleFullscreen,
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(
                        imageVector = if (isFullscreen) Icons.Default.FullscreenExit else Icons.Default.Fullscreen,
                        contentDescription = if (isFullscreen) "Exit Fullscreen" else "Enter Fullscreen",
                        modifier = Modifier.size(18.dp)
                    )
                }

                // Theme Toggle
                IconButton(
                    onClick = onToggleTheme,
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(
                        imageVector = if (isDarkTheme) Icons.Default.WbSunny else Icons.Default.Brightness3,
                        contentDescription = if (isDarkTheme) "Light Mode" else "Dark Mode",
                        modifier = Modifier.size(18.dp)
                    )
                }

                // User Profile Dropdown
                Box {
                    TextButton(
                        onClick = { showUserMenu = !showUserMenu },
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 6.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            // Avatar
                            Box(
                                modifier = Modifier
                                    .size(24.dp)
                                    .clip(CircleShape)
                                    .background(MaterialTheme.colorScheme.primary),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = userName.take(1).uppercase(),
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                            }
                            Text(
                                text = userName,
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }

                    // Dropdown Menu
                    DropdownMenu(
                        expanded = showUserMenu,
                        onDismissRequest = { showUserMenu = false }
                    ) {
                        // Header
                        DropdownMenuItem(
                            text = {
                                Text(
                                    "My Account",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            },
                            onClick = {},
                            enabled = false
                        )

                        HorizontalDivider()

                        // Edit Profile
                        DropdownMenuItem(
                            text = {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Icon(
                                        Icons.Default.Person,
                                        contentDescription = null,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Text("Edit Profile", fontSize = 13.sp)
                                }
                            },
                            onClick = {
                                showUserMenu = false
                                // TODO: Open edit profile dialog
                            }
                        )

                        HorizontalDivider()

                        // Shift Status
                        DropdownMenuItem(
                            text = {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Icon(
                                        Icons.Default.Schedule,
                                        contentDescription = null,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Text("Shift Status", fontSize = 13.sp)
                                }
                            },
                            onClick = {
                                showUserMenu = false
                                onOpenShiftStatus()
                            }
                        )

                        // Settings
                        DropdownMenuItem(
                            text = {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Icon(
                                        Icons.Default.Settings,
                                        contentDescription = null,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Text("Settings", fontSize = 13.sp)
                                }
                            },
                            onClick = {
                                showUserMenu = false
                                onOpenSettings()
                            }
                        )

                        // Keyboard Shortcuts
                        DropdownMenuItem(
                            text = {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Icon(
                                        Icons.Default.Keyboard,
                                        contentDescription = null,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Text("Keyboard Shortcuts", fontSize = 13.sp)
                                }
                            },
                            onClick = {
                                showUserMenu = false
                                onOpenKeyboardShortcuts()
                            }
                        )
                    }
                }
            }
        }
    }
}
