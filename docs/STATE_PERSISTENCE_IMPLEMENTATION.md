# State Persistence Implementation Plan

**Date:** November 2, 2024  
**Status:** 🚧 **IN PROGRESS**

---

## 🎯 **Goal**

Persist user preferences and app state across app restarts:

- Theme (dark/light mode)
- Sound effects enabled/disabled
- Auto-print receipts enabled/disabled
- Last selected category
- Quick settings preferences

---

## 📦 **Solution: Multiplatform Settings**

Use `multiplatform-settings` library which provides:

- ✅ Works on Android, iOS, Desktop, Web
- ✅ Simple key-value storage
- ✅ No boilerplate
- ✅ Native implementations (SharedPreferences on Android, UserDefaults on iOS, etc.)

**Library:** `com.russhwolf:multiplatform-settings:1.1.1`

---

## 🔧 **Implementation Steps**

### 1. Add Dependency ✅

```kotlin
// shared/build.gradle.kts
commonMain {
    implementation("com.russhwolf:multiplatform-settings:1.1.1")
}
```

### 2. Create SettingsRepository ✅

```kotlin
interface SettingsRepository {
    fun getDarkMode(): Boolean
    fun setDarkMode(enabled: Boolean)
    
    fun getSoundEnabled(): Boolean
    fun setSoundEnabled(enabled: Boolean)
    
    fun getAutoPrintReceipts(): Boolean
    fun setAutoPrintReceipts(enabled: Boolean)
    
    fun getLastCategory(): String?
    fun setLastCategory(category: String)
}

class SettingsRepositoryImpl(
    private val settings: Settings
) : SettingsRepository {
    override fun getDarkMode() = settings.getBoolean("dark_mode", true)
    override fun setDarkMode(enabled: Boolean) = settings.putBoolean("dark_mode", enabled)
    
    override fun getSoundEnabled() = settings.getBoolean("sound_enabled", true)
    override fun setSoundEnabled(enabled: Boolean) = settings.putBoolean("sound_enabled", enabled)
    
    override fun getAutoPrintReceipts() = settings.getBoolean("auto_print", false)
    override fun setAutoPrintReceipts(enabled: Boolean) = settings.putBoolean("auto_print", enabled)
    
    override fun getLastCategory() = settings.getStringOrNull("last_category")
    override fun setLastCategory(category: String) = settings.putString("last_category", category)
}
```

### 3. Create SettingsViewModel ✅

```kotlin
class SettingsViewModel(
    private val settingsRepository: SettingsRepository,
    scope: CoroutineScope
) {
    private val _darkMode = MutableStateFlow(settingsRepository.getDarkMode())
    val darkMode: StateFlow<Boolean> = _darkMode.asStateFlow()
    
    private val _soundEnabled = MutableStateFlow(settingsRepository.getSoundEnabled())
    val soundEnabled: StateFlow<Boolean> = _soundEnabled.asStateFlow()
    
    private val _autoPrintReceipts = MutableStateFlow(settingsRepository.getAutoPrintReceipts())
    val autoPrintReceipts: StateFlow<Boolean> = _autoPrintReceipts.asStateFlow()
    
    fun toggleDarkMode() {
        val newValue = !_darkMode.value
        _darkMode.value = newValue
        settingsRepository.setDarkMode(newValue)
    }
    
    fun toggleSound() {
        val newValue = !_soundEnabled.value
        _soundEnabled.value = newValue
        settingsRepository.setSoundEnabled(newValue)
    }
    
    fun toggleAutoPrint() {
        val newValue = !_autoPrintReceipts.value
        _autoPrintReceipts.value = newValue
        settingsRepository.setAutoPrintReceipts(newValue)
    }
}
```

### 4. Platform-Specific Settings Factory ✅

**Android:**

```kotlin
// androidMain
actual fun createSettings(): Settings {
    val context = TODO("Get context")
    return SharedPreferencesSettings(
        delegate = context.getSharedPreferences("auraflow_pos", Context.MODE_PRIVATE)
    )
}
```

**iOS:**

```kotlin
// iosMain
actual fun createSettings(): Settings {
    return NSUserDefaultsSettings(
        delegate = NSUserDefaults.standardUserDefaults
    )
}
```

**Desktop:**

```kotlin
// jvmMain
actual fun createSettings(): Settings {
    return PreferencesSettings(
        delegate = Preferences.userRoot().node("auraflow_pos")
    )
}
```

### 5. Wire into Koin DI ✅

```kotlin
// DataModule.kt
single { createSettings() }
single<SettingsRepository> { SettingsRepositoryImpl(get()) }

// DomainModule.kt
single {
    SettingsViewModel(
        settingsRepository = get(),
        scope = get()
    )
}
```

### 6. Update QuickSettingsDialog ✅

```kotlin
// POSScreen.kt
val settingsViewModel: SettingsViewModel = koinInject()
val darkMode by settingsViewModel.darkMode.collectAsState()
val soundEnabled by settingsViewModel.soundEnabled.collectAsState()
val autoPrint by settingsViewModel.autoPrintReceipts.collectAsState()

QuickSettingsDialog(
    open = showSettingsDialog,
    autoPrintReceipts = autoPrint,
    soundEnabled = soundEnabled,
    darkMode = darkMode,
    onDismiss = { showSettingsDialog = false },
    onToggleAutoPrint = { settingsViewModel.toggleAutoPrint() },
    onToggleSoundEnabled = { settingsViewModel.toggleSound() },
    onToggleDarkMode = { settingsViewModel.toggleDarkMode() }
)
```

---

## 📊 **What Gets Persisted**

| Setting | Key | Default | Type |
|---------|-----|---------|------|
| Dark Mode | `dark_mode` | `true` | Boolean |
| Sound Effects | `sound_enabled` | `true` | Boolean |
| Auto-Print Receipts | `auto_print` | `false` | Boolean |
| Last Category | `last_category` | `null` | String? |

---

## 🚀 **Expected Behavior**

### Before:

- ❌ Settings reset on app restart
- ❌ Theme always defaults to dark
- ❌ Category selection lost

### After:

- ✅ Settings preserved across restarts
- ✅ Theme restored on launch
- ✅ Last category remembered
- ✅ All preferences persistent

---

## 📝 **Files to Create/Modify**

### New Files:

1. ✅ `shared/.../data/repository/SettingsRepository.kt`
2. ✅ `shared/.../data/repository/SettingsRepositoryImpl.kt`
3. ✅ `shared/.../presentation/viewmodel/SettingsViewModel.kt`
4. ✅ `shared/.../data/local/SettingsFactory.kt` (expect/actual)

### Modified Files:

1. ✅ `shared/build.gradle.kts` - Add dependency
2. ✅ `shared/.../core/di/DataModule.kt` - Register repository
3. ✅ `shared/.../core/di/DomainModule.kt` - Register ViewModel
4. ✅ `composeApp/.../ui/screen/POSScreen.kt` - Wire settings
5. ✅ `composeApp/.../App.kt` - Apply theme from settings

---

## ⏱️ **Time Estimate**

- Add dependency: 5 min
- Create repositories: 15 min
- Create ViewModel: 15 min
- Platform factories: 20 min
- Wire DI: 10 min
- Update UI: 25 min
- Test: 30 min

**Total:** ~2 hours ✅

---

## 🎯 **Testing Plan**

1. Open app → Toggle dark mode → Restart → Should remember
2. Disable sound → Restart → Should stay disabled
3. Enable auto-print → Restart → Should stay enabled
4. Select category → Restart → Should remember last category
