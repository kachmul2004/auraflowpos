package com.auraflow.pos.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import com.auraflow.pos.theme.*

/**
 * Text field components matching the design system
 */

@Composable
fun PrimaryTextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    placeholder: String? = null,
    leadingIcon: ImageVector? = null,
    trailingIcon: @Composable (() -> Unit)? = null,
    isError: Boolean = false,
    errorMessage: String? = null,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    singleLine: Boolean = true,
    maxLines: Int = 1,
    keyboardType: KeyboardType = KeyboardType.Text,
    imeAction: ImeAction = ImeAction.Done,
    onImeAction: (() -> Unit)? = null
) {
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth(),
            label = label?.let { { Text(it) } },
            placeholder = placeholder?.let { { Text(it) } },
            leadingIcon = leadingIcon?.let {
                {
                    Icon(
                        imageVector = it,
                        contentDescription = null,
                        tint = if (isError) Destructive else MutedForeground
                    )
                }
            },
            trailingIcon = trailingIcon,
            isError = isError,
            enabled = enabled,
            readOnly = readOnly,
            singleLine = singleLine,
            maxLines = maxLines,
            keyboardOptions = KeyboardOptions(
                keyboardType = keyboardType,
                imeAction = imeAction
            ),
            keyboardActions = KeyboardActions(
                onDone = { onImeAction?.invoke() },
                onNext = { onImeAction?.invoke() },
                onSearch = { onImeAction?.invoke() }
            ),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = if (isError) Destructive else Primary,
                unfocusedBorderColor = if (isError) Destructive else Border,
                focusedLabelColor = if (isError) Destructive else Primary,
                unfocusedLabelColor = if (isError) Destructive else MutedForeground,
                errorBorderColor = Destructive,
                errorLabelColor = Destructive,
                cursorColor = Primary,
                focusedTextColor = Foreground,
                unfocusedTextColor = Foreground,
                disabledTextColor = MutedForeground
            )
        )
        
        if (isError && errorMessage != null) {
            Text(
                text = errorMessage,
                color = Destructive,
                style = MaterialTheme.typography.bodySmall
            )
        }
    }
}

@Composable
fun SearchTextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Search...",
    onSearch: (() -> Unit)? = null
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier.fillMaxWidth(),
        placeholder = { Text(placeholder) },
        leadingIcon = {
            Icon(
                imageVector = androidx.compose.material.icons.Icons.Default.Search,
                contentDescription = "Search",
                tint = MutedForeground
            )
        },
        singleLine = true,
        keyboardOptions = KeyboardOptions(
            imeAction = ImeAction.Search
        ),
        keyboardActions = KeyboardActions(
            onSearch = { onSearch?.invoke() }
        ),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = Primary,
            unfocusedBorderColor = Border,
            cursorColor = Primary,
            focusedTextColor = Foreground,
            unfocusedTextColor = Foreground
        )
    )
}

@Composable
fun PasswordTextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String = "Password",
    isError: Boolean = false,
    errorMessage: String? = null,
    visible: Boolean = false,
    onVisibilityToggle: (() -> Unit)? = null
) {
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth(),
            label = { Text(label) },
            leadingIcon = {
                Icon(
                    imageVector = androidx.compose.material.icons.Icons.Default.Lock,
                    contentDescription = null,
                    tint = if (isError) Destructive else MutedForeground
                )
            },
            trailingIcon = onVisibilityToggle?.let {
                {
                    IconButton(onClick = it) {
                        Icon(
                            imageVector = if (visible)
                                androidx.compose.material.icons.Icons.Default.Visibility
                            else
                                androidx.compose.material.icons.Icons.Default.VisibilityOff,
                            contentDescription = if (visible) "Hide password" else "Show password",
                            tint = MutedForeground
                        )
                    }
                }
            },
            visualTransformation = if (visible)
                VisualTransformation.None
            else
                PasswordVisualTransformation(),
            isError = isError,
            singleLine = true,
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Password,
                imeAction = ImeAction.Done
            ),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = if (isError) Destructive else Primary,
                unfocusedBorderColor = if (isError) Destructive else Border,
                focusedLabelColor = if (isError) Destructive else Primary,
                unfocusedLabelColor = if (isError) Destructive else MutedForeground,
                errorBorderColor = Destructive,
                errorLabelColor = Destructive,
                cursorColor = Primary,
                focusedTextColor = Foreground,
                unfocusedTextColor = Foreground
            )
        )
        
        if (isError && errorMessage != null) {
            Text(
                text = errorMessage,
                color = Destructive,
                style = MaterialTheme.typography.bodySmall
            )
        }
    }
}
