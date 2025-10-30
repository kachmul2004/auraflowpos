package com.auraflow.pos.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.auraflow.pos.theme.*

/**
 * Dialog components matching the design system
 */

@Composable
fun AlertDialog(
    title: String,
    description: String? = null,
    confirmText: String = "Confirm",
    cancelText: String = "Cancel",
    onConfirm: () -> Unit,
    onDismiss: () -> Unit,
    destructive: Boolean = false
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold,
                color = Foreground
            )
        },
        text = description?.let {
            {
                Text(
                    text = it,
                    fontSize = 14.sp,
                    color = MutedForeground
                )
            }
        },
        confirmButton = {
            if (destructive) {
                DestructiveButton(
                    text = confirmText,
                    onClick = {
                        onConfirm()
                        onDismiss()
                    }
                )
            } else {
                PrimaryButton(
                    text = confirmText,
                    onClick = {
                        onConfirm()
                        onDismiss()
                    }
                )
            }
        },
        dismissButton = {
            SecondaryButton(
                text = cancelText,
                onClick = onDismiss
            )
        },
        containerColor = Card,
        titleContentColor = CardForeground,
        textContentColor = MutedForeground
    )
}

@Composable
fun CustomDialog(
    onDismiss: () -> Unit,
    content: @Composable ColumnScope.() -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .clip(RoundedCornerShape(12.dp)),
            color = Card
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                content = content
            )
        }
    }
}

@Composable
fun DialogHeader(
    title: String,
    description: String? = null,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(
            text = title,
            fontSize = 24.sp,
            fontWeight = FontWeight.SemiBold,
            color = CardForeground
        )
        description?.let {
            Text(
                text = it,
                fontSize = 14.sp,
                color = MutedForeground
            )
        }
    }
}

@Composable
fun DialogActions(
    onCancel: () -> Unit,
    onConfirm: () -> Unit,
    confirmText: String = "Confirm",
    cancelText: String = "Cancel",
    confirmEnabled: Boolean = true,
    destructive: Boolean = false,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        SecondaryButton(
            text = cancelText,
            onClick = onCancel,
            modifier = Modifier.weight(1f)
        )
        
        if (destructive) {
            DestructiveButton(
                text = confirmText,
                onClick = onConfirm,
                enabled = confirmEnabled,
                modifier = Modifier.weight(1f)
            )
        } else {
            PrimaryButton(
                text = confirmText,
                onClick = onConfirm,
                enabled = confirmEnabled,
                modifier = Modifier.weight(1f)
            )
        }
    }
}
