# Android Studio Setup Guide

## 🚀 Quick Start

### 1. Open in Android Studio

1. **Launch Android Studio**
2. **File → Open** 
3. Navigate to and select the `/android` folder
4. Click **OK**

Android Studio will automatically:
- Detect the Gradle project
- Download dependencies
- Index files
- Configure the project

### 2. Wait for Gradle Sync

First time setup will take 5-10 minutes to:
- Download Gradle wrapper
- Download all dependencies (Compose, Material3, Coil, etc.)
- Build project index

**Look for**: "Gradle sync finished" in the bottom status bar

### 3. Project Structure

Once opened, you'll see this structure in Android Studio:

```
AuraFlowPOS/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/auraflow/pos/
│   │       │   ├── POSApplication.kt       # App entry point
│   │       │   ├── MainActivity.kt         # Main activity
│   │       │   ├── core/                   # Utilities
│   │       │   ├── data/                   # Data layer
│   │       │   ├── domain/                 # Business logic
│   │       │   ├── ui/                     # UI components
│   │       │   ├── components/             # Complex components
│   │       │   ├── screens/                # Screens
│   │       │   ├── theme/                  # Theme/styling
│   │       │   └── utils/                  # Extensions
│   │       ├── res/                        # Resources
│   │       │   ├── values/
│   │       │   │   ├── strings.xml
│   │       │   │   └── themes.xml
│   │       │   └── xml/
│   │       └── AndroidManifest.xml
│   └── build.gradle.kts                    # App dependencies
├── build.gradle.kts                        # Project config
├── settings.gradle.kts                     # Gradle settings
└── gradle.properties                       # Gradle properties
```

## 📱 Running the App

### Option 1: Physical Device (Recommended for POS)

1. **Enable Developer Options** on your Android device:
   - Settings → About Phone
   - Tap "Build Number" 7 times
   
2. **Enable USB Debugging**:
   - Settings → Developer Options
   - Turn on "USB Debugging"
   
3. **Connect device** via USB

4. **Select device** in Android Studio toolbar

5. **Click Run** (green play button) or press **Shift+F10**

### Option 2: Emulator (For Testing)

1. **Tools → Device Manager**

2. **Create Device**:
   - Select: "Pixel Tablet" (for POS-like experience)
   - API Level: 34 (Android 14)
   - Orientation: Landscape

3. **Launch emulator**

4. **Click Run** in Android Studio

## 🔧 Configuration

### Minimum Requirements

- **Android Studio**: Hedgehog (2023.1.1) or newer
- **JDK**: 17 or higher
- **Gradle**: 8.1+
- **Kotlin**: 1.9.20

### SDK Requirements

The project requires:
- **Compile SDK**: 34 (Android 14)
- **Target SDK**: 34
- **Min SDK**: 26 (Android 8.0)

Android Studio will prompt you to install these if missing.

### Recommended Device Specs

For best POS experience:
- **Screen Size**: 10"+ tablet or landscape phone
- **RAM**: 2GB+
- **Android Version**: 8.0+ (API 26+)

## 🎨 Code Organization

### Package Structure

```kotlin
com.auraflow.pos/
├── POSApplication.kt           // App initialization
├── MainActivity.kt             // Entry activity
│
├── core/                       // Core utilities
│   ├── Constants.kt           // App constants
│   └── Utils.kt               // Helper functions
│
├── data/                       // Data layer
│   ├── models/                // Data models
│   │   └── Models.kt
│   ├── repository/            // Repositories
│   │   └── POSRepository.kt
│   └── SampleData.kt          // Mock data
│
├── domain/                     // Business logic
│   ├── plugins/               // Plugin system
│   ├── subscription/          // Subscription management
│   └── usecase/               // Use cases
│
├── ui/                         // UI layer
│   ├── viewmodel/             // ViewModels
│   ├── Badge.kt               // UI components
│   ├── Button.kt
│   └── ...
│
├── components/                 // Complex components
│   ├── ProductCard.kt
│   ├── ShoppingCart.kt
│   └── ...
│
├── screens/                    // Full screens
│   └── POSScreen.kt
│
├── theme/                      // Design system
│   ├── Color.kt
│   ├── Type.kt
│   └── Theme.kt
│
└── utils/                      // Extensions
    └── Extensions.kt
```

## 🛠️ Development Workflow

### 1. Making Changes

Edit any Kotlin file in Android Studio. The IDE provides:
- Auto-completion
- Error detection
- Quick fixes
- Refactoring tools

### 2. Building

**Build → Make Project** (Ctrl+F9 / Cmd+F9)

### 3. Running

**Run → Run 'app'** (Shift+F10)

### 4. Debugging

- Set breakpoints by clicking line numbers
- **Run → Debug 'app'** (Shift+F9)
- Use debug console and variable inspector

### 5. Previews (Compose)

Add `@Preview` to any Composable:

```kotlin
@Preview(showBackground = true)
@Composable
fun ProductCardPreview() {
    AuraFlowPOSTheme {
        ProductCard(
            product = SampleData.products[0],
            onClick = {}
        )
    }
}
```

Click the **Split/Design** button in the editor to see live preview.

## 📦 Adding Dependencies

Edit `/android/app/build.gradle.kts`:

```kotlin
dependencies {
    // Add your dependency
    implementation("com.example:library:1.0.0")
}
```

Click **Sync Now** when prompted.

## 🧪 Testing

### Unit Tests

Located in: `app/src/test/java/`

Run with: **Run → Run Tests**

### Instrumented Tests

Located in: `app/src/androidTest/java/`

Require device/emulator to run.

## 🔍 Code Navigation

### Useful Shortcuts

- **Cmd+O** (Mac) / **Ctrl+N** (Win): Find class
- **Cmd+Shift+O** / **Ctrl+Shift+N**: Find file
- **Cmd+B** / **Ctrl+B**: Go to declaration
- **Cmd+E** / **Ctrl+E**: Recent files
- **Cmd+F12** / **Ctrl+F12**: File structure
- **Alt+Enter**: Show quick fixes

### Project View

- **Android**: Shows logical Android structure
- **Project**: Shows actual file structure
- **Packages**: Shows flattened package structure

## 🎯 Key Files to Know

### Entry Points

1. **POSApplication.kt**: App initialization, dependency setup
2. **MainActivity.kt**: Activity that hosts Compose UI
3. **POSScreen.kt**: Main screen layout

### Data & Logic

1. **Models.kt**: All data models
2. **SampleData.kt**: Mock data for testing
3. **POSRepository.kt**: Data operations
4. **POSViewModel.kt**: UI state management

### UI

1. **Theme.kt**: Material3 theme configuration
2. **Color.kt**: Color definitions
3. **Components**: Reusable UI elements

## 🚨 Troubleshooting

### "Gradle sync failed"

1. **File → Invalidate Caches → Invalidate and Restart**
2. Delete `.gradle` folder
3. **Build → Clean Project**
4. **Build → Rebuild Project**

### "SDK not found"

1. **Tools → SDK Manager**
2. Install Android 14.0 (API 34)
3. Sync Gradle again

### "Unresolved reference"

1. **File → Sync Project with Gradle Files**
2. **Build → Clean Project**
3. Restart Android Studio

### Emulator is slow

1. Enable hardware acceleration (HAXM/KVM)
2. Allocate more RAM in AVD settings
3. Use physical device instead

### App crashes on start

1. Check Logcat (bottom panel) for errors
2. Verify all dependencies synced
3. Clean and rebuild project

## 📖 Learning Resources

### Jetpack Compose

- [Official Compose Documentation](https://developer.android.com/jetpack/compose)
- [Compose Pathway](https://developer.android.com/courses/pathways/compose)
- [Compose Samples](https://github.com/android/compose-samples)

### Material Design 3

- [Material 3 for Compose](https://developer.android.com/jetpack/compose/designsystems/material3)
- [Material Design Guidelines](https://m3.material.io/)

### Kotlin

- [Kotlin Documentation](https://kotlinlang.org/docs/home.html)
- [Kotlin Koans](https://play.kotlinlang.org/koans)

### Android Development

- [Android Developers](https://developer.android.com/)
- [Android Basics with Compose](https://developer.android.com/courses/android-basics-compose/course)

## 🔄 Git Integration

Android Studio has built-in Git support:

1. **VCS → Enable Version Control Integration**
2. Select "Git"
3. Use **VCS** menu for commits, pulls, pushes

Recommended `.gitignore` already included.

## 📝 Code Style

The project follows:
- **Official Kotlin style guide**
- **Material Design principles**
- **Clean Architecture patterns**

Android Studio will auto-format with:
- **Code → Reformat Code** (Cmd+Alt+L / Ctrl+Alt+L)

## 🎨 Theme Customization

Edit colors in `/android/theme/Color.kt`:

```kotlin
val Primary = Color(0xFF3B82F6)  // Change this
val Background = Color(0xFF0A0A0A)
```

Changes apply app-wide immediately.

## 📱 Building APK

### Debug APK (for testing)

**Build → Build Bundle(s) / APK(s) → Build APK(s)**

APK location: `app/build/outputs/apk/debug/`

### Release APK (for distribution)

1. **Build → Generate Signed Bundle / APK**
2. Create/select keystore
3. Choose "APK"
4. Select "release" build variant

## 🚀 Next Steps

1. ✅ Open project in Android Studio
2. ✅ Wait for Gradle sync
3. ✅ Run on device/emulator
4. 📝 Explore the code
5. 🎨 Customize theme if needed
6. 🔧 Add features as needed
7. 🧪 Write tests
8. 📦 Build APK

## 💡 Pro Tips

1. **Use Live Templates**: Type `fun` and press Tab for function template
2. **Extract to Function**: Select code → Right-click → Refactor → Extract Function
3. **Compose Preview**: Use `@Preview` to see UI without running app
4. **Layout Inspector**: Debug UI hierarchy (Tools → Layout Inspector)
5. **Profiler**: Monitor performance (View → Tool Windows → Profiler)
6. **Database Inspector**: View app database in real-time
7. **Network Inspector**: Monitor network calls

## 📞 Need Help?

- Check **COMPLETE_GUIDE.md** for comprehensive documentation
- Review **README.md** for quick reference
- See **REACT_TO_ANDROID.md** if coming from React
- Check **INDEX.md** for file directory

---

**Ready to build!** 🎉

Start with opening the project in Android Studio and running it on a device.
