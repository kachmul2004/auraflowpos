package com.auraflow.pos.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.auraflow.pos.theme.*

/**
 * Card components matching the design system
 */

@Composable
fun Card(
    modifier: Modifier = Modifier,
    elevation: Boolean = true,
    content: @Composable ColumnScope.() -> Unit
) {
    Surface(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .then(
                if (elevation) Modifier.shadow(1.dp, RoundedCornerShape(8.dp))
                else Modifier
            )
            .border(1.dp, Border, RoundedCornerShape(8.dp))
            .background(Card),
        color = com.auraflow.pos.theme.Card,
        content = { Column(content = content) }
    )
}

@Composable
fun CardHeader(
    title: String,
    modifier: Modifier = Modifier,
    description: String? = null
) {
    Column(
        modifier = modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Text(
            text = title,
            fontSize = 20.sp,
            fontWeight = FontWeight.SemiBold,
            lineHeight = 28.sp,
            color = CardForeground
        )
        description?.let {
            Text(
                text = it,
                fontSize = 14.sp,
                lineHeight = 20.sp,
                color = MutedForeground
            )
        }
    }
}

@Composable
fun CardContent(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    Column(
        modifier = modifier.padding(16.dp),
        content = content
    )
}

@Composable
fun CardFooter(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        content = content
    )
}
