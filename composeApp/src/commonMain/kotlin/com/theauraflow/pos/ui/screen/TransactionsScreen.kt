package com.theauraflow.pos.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.theauraflow.pos.core.util.formatCurrency
import com.theauraflow.pos.domain.model.Transaction
import com.theauraflow.pos.domain.model.TransactionType
import com.theauraflow.pos.domain.model.TransactionStatus
import kotlinx.datetime.Instant
import kotlinx.datetime.TimeZone
import kotlinx.datetime.number
import kotlinx.datetime.toLocalDateTime

/**
 * Transactions Screen - Enterprise financial transaction history.
 * Features:
 * - Table view of all transactions
 * - Transaction type filtering
 * - Status indicators
 * - Linked to orders where applicable
 * - No search (per requirements)
 * - Pagination for large datasets
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TransactionsScreen(
    transactions: List<Transaction>,
    onBack: () -> Unit,
    showBackButton: Boolean = true,
    modifier: Modifier = Modifier
) {
    var currentPage by remember { mutableStateOf(0) }
    val itemsPerPage = 25

    // Paginate transactions
    val totalPages = remember(transactions) {
        (transactions.size + itemsPerPage - 1) / itemsPerPage
    }

    val paginatedTransactions = remember(transactions, currentPage) {
        val startIndex = currentPage * itemsPerPage
        val endIndex = minOf(startIndex + itemsPerPage, transactions.size)
        if (startIndex < transactions.size) {
            transactions.subList(startIndex, endIndex)
        } else {
            emptyList()
        }
    }

    Scaffold(
        topBar = {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                tonalElevation = 1.dp,
                shadowElevation = 1.dp
            ) {
                Column {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        if (showBackButton) {
                            IconButton(onClick = onBack) {
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                                    contentDescription = "Back",
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Transaction History",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.SemiBold
                            )
                            Text(
                                text = "Complete financial transaction audit trail",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                    HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                }
            }
        }
    ) { paddingValues ->
        Box(
            modifier = modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(24.dp)
        ) {
            if (paginatedTransactions.isEmpty()) {
                // Empty state
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Receipt,
                        contentDescription = null,
                        modifier = Modifier.size(64.dp),
                        tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f)
                    )
                    Spacer(Modifier.height(16.dp))
                    Text(
                        text = "No transactions yet",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }
            } else {
                // Transactions table
                Card(
                    modifier = Modifier.fillMaxSize(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    ),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    Column(modifier = Modifier.fillMaxSize()) {
                        // Table header
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(MaterialTheme.colorScheme.surfaceVariant)
                                .padding(horizontal = 16.dp, vertical = 12.dp),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Text(
                                "Ref #",
                                modifier = Modifier.weight(0.15f),
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                "Date",
                                modifier = Modifier.weight(0.15f),
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                "Type",
                                modifier = Modifier.weight(0.12f),
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                "Amount",
                                modifier = Modifier.weight(0.13f),
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                "Payment Method",
                                modifier = Modifier.weight(0.15f),
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                "Order #",
                                modifier = Modifier.weight(0.15f),
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                "Status",
                                modifier = Modifier.weight(0.15f),
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        HorizontalDivider()

                        // Table rows
                        LazyColumn(
                            modifier = Modifier
                                .fillMaxSize()
                                .weight(1f),
                            contentPadding = PaddingValues(vertical = 8.dp)
                        ) {
                            items(
                                items = paginatedTransactions,
                                key = { it.id }
                            ) { transaction ->
                                TransactionTableRow(transaction = transaction)
                                HorizontalDivider(
                                    color = MaterialTheme.colorScheme.outlineVariant.copy(
                                        alpha = 0.3f
                                    )
                                )
                            }
                        }

                        // Pagination
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp, vertical = 12.dp),
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Button(
                                onClick = { if (currentPage > 0) currentPage-- },
                                enabled = currentPage > 0
                            ) {
                                Icon(Icons.Default.ChevronLeft, null, Modifier.size(18.dp))
                            }
                            Text(
                                text = "Page ${currentPage + 1} of $totalPages",
                                style = MaterialTheme.typography.bodyMedium
                            )
                            Button(
                                onClick = { if (currentPage < totalPages - 1) currentPage++ },
                                enabled = currentPage < totalPages - 1
                            ) {
                                Icon(Icons.Default.ChevronRight, null, Modifier.size(18.dp))
                            }
                            Spacer(Modifier.weight(1f))
                            Text(
                                text = "Total: ${transactions.size} transactions",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * Table row for a transaction.
 */
@OptIn(kotlin.time.ExperimentalTime::class)
@Composable
private fun TransactionTableRow(
    transaction: Transaction
) {
    // Format date from timestamp
    val formattedDate = remember(transaction.createdAt) {
        val instant = Instant.fromEpochMilliseconds(transaction.createdAt)
        val dateTime = instant.toLocalDateTime(TimeZone.currentSystemDefault())
        val month = when (dateTime.month.number) {
            1 -> "Jan"
            2 -> "Feb"
            3 -> "Mar"
            4 -> "Apr"
            5 -> "May"
            6 -> "Jun"
            7 -> "Jul"
            8 -> "Aug"
            9 -> "Sep"
            10 -> "Oct"
            11 -> "Nov"
            12 -> "Dec"
            else -> ""
        }
        val hour = dateTime.hour.toString().padStart(2, '0')
        val minute = dateTime.minute.toString().padStart(2, '0')
        "$month ${dateTime.dayOfMonth} $hour:$minute"
    }

    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = Color.Transparent
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Reference number
            Text(
                text = transaction.referenceNumber,
                modifier = Modifier.weight(0.15f),
                style = MaterialTheme.typography.bodySmall,
                fontWeight = FontWeight.SemiBold
            )

            // Date
            Text(
                text = formattedDate,
                modifier = Modifier.weight(0.15f),
                style = MaterialTheme.typography.bodySmall
            )

            // Type with icon
            Row(
                modifier = Modifier.weight(0.12f),
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                val (icon, color) = when (transaction.type) {
                    TransactionType.SALE -> Icons.Default.ShoppingCart to MaterialTheme.colorScheme.primary
                    TransactionType.REFUND -> Icons.Default.Undo to MaterialTheme.colorScheme.error
                    TransactionType.CASH_IN -> Icons.Default.ArrowDownward to MaterialTheme.colorScheme.tertiary
                    TransactionType.CASH_OUT -> Icons.Default.ArrowUpward to MaterialTheme.colorScheme.secondary
                    TransactionType.VOID -> Icons.Default.Cancel to MaterialTheme.colorScheme.error
                    TransactionType.ADJUSTMENT -> Icons.Default.Edit to MaterialTheme.colorScheme.onSurfaceVariant
                }
                Icon(
                    icon,
                    contentDescription = null,
                    modifier = Modifier.size(14.dp),
                    tint = color
                )
                Text(
                    text = transaction.type.name,
                    style = MaterialTheme.typography.bodySmall,
                    fontSize = 11.sp,
                    color = color
                )
            }

            // Amount (negative for refunds and cash out)
            val displayAmount = when (transaction.type) {
                TransactionType.REFUND, TransactionType.CASH_OUT -> -transaction.amount
                else -> transaction.amount
            }
            Text(
                text = "$${displayAmount.formatCurrency()}",
                modifier = Modifier.weight(0.13f),
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold,
                color = when (transaction.type) {
                    TransactionType.REFUND, TransactionType.CASH_OUT -> MaterialTheme.colorScheme.error
                    TransactionType.SALE, TransactionType.CASH_IN -> MaterialTheme.colorScheme.primary
                    else -> MaterialTheme.colorScheme.onSurface
                }
            )

            // Payment method
            Text(
                text = transaction.paymentMethod.name,
                modifier = Modifier.weight(0.15f),
                style = MaterialTheme.typography.bodySmall
            )

            // Order number (if linked)
            Text(
                text = transaction.orderNumber ?: "—",
                modifier = Modifier.weight(0.15f),
                style = MaterialTheme.typography.bodySmall,
                color = if (transaction.orderNumber != null)
                    MaterialTheme.colorScheme.primary
                else
                    MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
            )

            // Status badge
            Surface(
                modifier = Modifier.weight(0.15f),
                shape = RoundedCornerShape(4.dp),
                color = when (transaction.status) {
                    TransactionStatus.COMPLETED -> MaterialTheme.colorScheme.primaryContainer
                    TransactionStatus.PENDING -> MaterialTheme.colorScheme.secondaryContainer
                    TransactionStatus.FAILED -> MaterialTheme.colorScheme.errorContainer
                    TransactionStatus.REVERSED -> MaterialTheme.colorScheme.tertiaryContainer
                }
            ) {
                Text(
                    text = transaction.status.name,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium,
                    color = when (transaction.status) {
                        TransactionStatus.COMPLETED -> MaterialTheme.colorScheme.onPrimaryContainer
                        TransactionStatus.PENDING -> MaterialTheme.colorScheme.onSecondaryContainer
                        TransactionStatus.FAILED -> MaterialTheme.colorScheme.onErrorContainer
                        TransactionStatus.REVERSED -> MaterialTheme.colorScheme.onTertiaryContainer
                    }
                )
            }
        }
    }
}
