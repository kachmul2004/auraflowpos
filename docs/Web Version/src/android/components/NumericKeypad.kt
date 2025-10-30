package com.auraflow.pos.components

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Backspace
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.auraflow.pos.theme.*
import com.auraflow.pos.ui.SecondaryButton

/**
 * Numeric keypad for quantity/price entry
 */

@Composable
fun NumericKeypad(
    onNumberClick: (String) -> Unit,
    onBackspace: () -> Unit,
    onClear: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Row 1: 7, 8, 9
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            NumericButton("7", onNumberClick, Modifier.weight(1f))
            NumericButton("8", onNumberClick, Modifier.weight(1f))
            NumericButton("9", onNumberClick, Modifier.weight(1f))
        }
        
        // Row 2: 4, 5, 6
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            NumericButton("4", onNumberClick, Modifier.weight(1f))
            NumericButton("5", onNumberClick, Modifier.weight(1f))
            NumericButton("6", onNumberClick, Modifier.weight(1f))
        }
        
        // Row 3: 1, 2, 3
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            NumericButton("1", onNumberClick, Modifier.weight(1f))
            NumericButton("2", onNumberClick, Modifier.weight(1f))
            NumericButton("3", onNumberClick, Modifier.weight(1f))
        }
        
        // Row 4: Clear, 0, Backspace
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(
                onClick = onClear,
                modifier = Modifier
                    .weight(1f)
                    .height(60.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Destructive,
                    contentColor = DestructiveForeground
                )
            ) {
                Text("C", fontSize = 20.sp, fontWeight = FontWeight.Bold)
            }
            
            NumericButton("0", onNumberClick, Modifier.weight(1f))
            
            Button(
                onClick = onBackspace,
                modifier = Modifier
                    .weight(1f)
                    .height(60.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Secondary,
                    contentColor = SecondaryForeground
                )
            ) {
                Icon(
                    imageVector = Icons.Default.Backspace,
                    contentDescription = "Backspace",
                    modifier = Modifier.size(24.dp)
                )
            }
        }
    }
}

@Composable
fun NumericButton(
    number: String,
    onClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = { onClick(number) },
        modifier = modifier.height(60.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Secondary,
            contentColor = SecondaryForeground
        )
    ) {
        Text(
            text = number,
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold
        )
    }
}
