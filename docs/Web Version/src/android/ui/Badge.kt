package com.auraflow.pos.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.auraflow.pos.theme.*

enum class BadgeVariant {
    DEFAULT,
    SECONDARY,
    DESTRUCTIVE,
    OUTLINE,
    SUCCESS
}

@Composable
fun Badge(
    text: String,
    variant: BadgeVariant = BadgeVariant.DEFAULT,
    modifier: Modifier = Modifier
) {
    val backgroundColor = when (variant) {
        BadgeVariant.DEFAULT -> Primary
        BadgeVariant.SECONDARY -> Secondary
        BadgeVariant.DESTRUCTIVE -> Destructive
        BadgeVariant.OUTLINE -> Color.Transparent
        BadgeVariant.SUCCESS -> Success
    }
    
    val textColor = when (variant) {
        BadgeVariant.DEFAULT -> PrimaryForeground
        BadgeVariant.SECONDARY -> SecondaryForeground
        BadgeVariant.DESTRUCTIVE -> DestructiveForeground
        BadgeVariant.OUTLINE -> Foreground
        BadgeVariant.SUCCESS -> SuccessForeground
    }
    
    Box(
        modifier = modifier
            .height(20.dp)
            .clip(RoundedCornerShape(6.dp))
            .background(backgroundColor)
            .then(
                if (variant == BadgeVariant.OUTLINE) {
                    Modifier.border(1.dp, Border, RoundedCornerShape(6.dp))
                } else Modifier
            )
            .padding(horizontal = 6.dp, vertical = 2.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            color = textColor,
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium,
            lineHeight = 16.sp
        )
    }
}
