package com.auraflow.pos.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.auraflow.pos.theme.*
import com.auraflow.pos.ui.PrimaryButton
import com.auraflow.pos.ui.SecondaryButton

/**
 * Payment method selection dialog
 */

enum class PaymentMethod(val displayName: String, val icon: ImageVector) {
    CASH("Cash", Icons.Default.Money),
    CARD("Card", Icons.Default.CreditCard),
    DIGITAL("Digital Wallet", Icons.Default.AccountBalanceWallet),
    OTHER("Other", Icons.Default.Payment)
}

@Composable
fun PaymentDialog(
    total: Double,
    onPaymentComplete: (PaymentMethod) -> Unit,
    onDismiss: () -> Unit
) {
    var selectedPaymentMethod by remember { mutableStateOf<PaymentMethod?>(null) }
    var amountReceived by remember { mutableStateOf("") }
    
    val change = if (selectedPaymentMethod == PaymentMethod.CASH && amountReceived.isNotEmpty()) {
        val received = amountReceived.toDoubleOrNull() ?: 0.0
        received - total
    } else {
        0.0
    }
    
    Dialog(onDismissRequest = onDismiss) {
        Surface(
            modifier = Modifier
                .width(500.dp)
                .clip(RoundedCornerShape(12.dp)),
            color = Card
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                // Header
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Payment",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = CardForeground
                    )
                    Text(
                        text = "Select payment method",
                        fontSize = 14.sp,
                        color = MutedForeground
                    )
                }
                
                // Total Amount
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = Background,
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = "Total Amount",
                            fontSize = 14.sp,
                            color = MutedForeground
                        )
                        Text(
                            text = formatCurrency(total),
                            fontSize = 32.sp,
                            fontWeight = FontWeight.Bold,
                            color = Primary
                        )
                    }
                }
                
                // Payment Methods
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Payment Method",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = Foreground
                    )
                    
                    PaymentMethod.values().forEach { method ->
                        PaymentMethodOption(
                            method = method,
                            selected = selectedPaymentMethod == method,
                            onClick = { selectedPaymentMethod = method }
                        )
                    }
                }
                
                // Cash Payment Fields
                if (selectedPaymentMethod == PaymentMethod.CASH) {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        OutlinedTextField(
                            value = amountReceived,
                            onValueChange = { amountReceived = it },
                            label = { Text("Amount Received") },
                            placeholder = { Text("0.00") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Primary,
                                unfocusedBorderColor = Border,
                                focusedLabelColor = Primary,
                                unfocusedLabelColor = MutedForeground
                            )
                        )
                        
                        if (change >= 0 && amountReceived.isNotEmpty()) {
                            Surface(
                                modifier = Modifier.fillMaxWidth(),
                                color = Success.copy(alpha = 0.1f),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(12.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = "Change",
                                        fontSize = 14.sp,
                                        color = Foreground
                                    )
                                    Text(
                                        text = formatCurrency(change),
                                        fontSize = 18.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = Success
                                    )
                                }
                            }
                        }
                    }
                }
                
                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    SecondaryButton(
                        text = "Cancel",
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f)
                    )
                    
                    PrimaryButton(
                        text = "Complete Payment",
                        onClick = {
                            selectedPaymentMethod?.let { onPaymentComplete(it) }
                        },
                        enabled = selectedPaymentMethod != null && 
                                 (selectedPaymentMethod != PaymentMethod.CASH || change >= 0),
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }
}

@Composable
fun PaymentMethodOption(
    method: PaymentMethod,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .border(
                width = 2.dp,
                color = if (selected) Primary else Border,
                shape = RoundedCornerShape(8.dp)
            )
            .clickable(onClick = onClick),
        color = if (selected) Primary.copy(alpha = 0.1f) else Background
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = method.icon,
                contentDescription = null,
                tint = if (selected) Primary else MutedForeground,
                modifier = Modifier.size(24.dp)
            )
            
            Text(
                text = method.displayName,
                fontSize = 16.sp,
                fontWeight = if (selected) FontWeight.Medium else FontWeight.Normal,
                color = if (selected) Primary else Foreground,
                modifier = Modifier.weight(1f)
            )
            
            if (selected) {
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = "Selected",
                    tint = Primary,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}
