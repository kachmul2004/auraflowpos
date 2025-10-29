# AuraFlowPOS - Quick Start Guide

**Get up and running in 10 minutes**

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **JDK 17** or higher
- ✅ **Android Studio Meerkat (2025.1.1)** or later
- ✅ **Kotlin Plugin** 2.1.0+
- ✅ **Xcode 15+** (for iOS development on macOS)
- ✅ **Git** installed

### Optional but Recommended

- **Kotlin Multiplatform Plugin** for Android Studio
- **Fleet** or **IntelliJ IDEA 2025.1+** for better KMP support

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/AuraFlowPOS.git
cd AuraFlowPOS
```

### 2. Open in Android Studio

1. Launch **Android Studio**
2. Select **Open**
3. Navigate to the `AuraFlowPOS` directory
4. Click **OK**
5. Wait for Gradle sync to complete

### 3. Run the Application

#### Android

```bash
./gradlew :composeApp:assembleDebug
# or in Android Studio: Run > Run 'composeApp'
```

#### Desktop (JVM)

```bash
./gradlew :composeApp:run
# or in Android Studio: Run > Run 'desktopApp'
```

#### iOS (macOS only)

```bash
cd iosApp
open iosApp.xcodeproj
# Then: Product > Run in Xcode
```

#### Web (WASM)

```bash
./gradlew :composeApp:wasmJsBrowserDevelopmentRun
# Opens at: http://localhost:8080
```

---

## 📁 Project Structure Overview

```
AuraFlowPOS/
├── composeApp/          # UI layer (all platforms)
│   └── src/
│       ├── commonMain/  # Shared UI code
│       ├── androidMain/ # Android entry
│       ├── iosMain/     # iOS entry
│       ├── jvmMain/     # Desktop entry
│       └── wasmJsMain/  # Web entry
│
├── shared/              # Business logic (all platforms)
│   └── src/
│       ├── commonMain/  # Shared logic
│       ├── androidMain/ # Android-specific
│       ├── iosMain/     # iOS-specific
│       └── jvmMain/     # Desktop-specific
│
└── iosApp/              # iOS native entry point
```

---

## 🛠️ Configuration

### Environment Variables

Create `.env` file in project root (optional for local development):

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
API_BASE_URL=https://api.auraflowpos.com
```

### Build Configuration

The project uses version catalogs. Check `gradle/libs.versions.toml` for dependencies.

---

## 🎯 Common Tasks

### Add a New Dependency

1. Open `gradle/libs.versions.toml`
2. Add version in `[versions]` section
3. Add library in `[libraries]` section
4. Add to `build.gradle.kts` in appropriate module

Example:

```toml
# libs.versions.toml
[versions]
coil = "3.0.4"

[libraries]
coil-compose = { module = "io.coil-kt.coil3:coil-compose", version.ref = "coil" }
```

```kotlin
// composeApp/build.gradle.kts
commonMain.dependencies {
    implementation(libs.coil.compose)
}
```

### Create a New Screen

1. Create in `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/screens/yourfeature/`
2. Files needed:
    - `YourFeatureScreen.kt` (Composable UI)
    - `YourFeatureViewModel.kt` (Logic)
    - `YourFeatureUiState.kt` (State)

### Add a Use Case

1. Create in `shared/src/commonMain/kotlin/com/theauraflow/pos/domain/usecase/yourfeature/`
2. Inject repository in constructor
3. Implement `operator fun invoke()` for clean syntax
4. Register in DI module

---

## 🧪 Testing

### Run Tests

```bash
# All tests
./gradlew test

# Specific module
./gradlew :shared:test
./gradlew :composeApp:test

# Android instrumented tests
./gradlew :composeApp:connectedAndroidTest
```

### Test Structure

```
module/src/
├── commonTest/     # Shared unit tests
├── androidTest/    # Android-specific tests
├── iosTest/        # iOS-specific tests
└── jvmTest/        # Desktop-specific tests
```

---

## 🐛 Troubleshooting

### Gradle Sync Failed

```bash
# Clean and rebuild
./gradlew clean
./gradlew build --refresh-dependencies
```

### iOS Build Issues

```bash
# Clean iOS build
cd iosApp
xcodebuild clean
pod install --repo-update
```

### Compose Resources Not Found

```bash
# Regenerate resources
./gradlew :composeApp:generateComposeResClass
```

### "Cannot find symbol: koinViewModel"

Ensure you have these imports:

```kotlin
import org.koin.compose.viewmodel.koinViewModel
import org.koin.core.annotation.KoinExperimentalAPI
```

---

## 📚 Next Steps

Once you're set up:

1. **Read the Architecture**: `docs/AURAFLOW_KMP_MIGRATION_GUIDE.md`
2. **Explore the Code**: Start with `composeApp/src/commonMain/kotlin/com/theauraflow/pos/App.kt`
3. **Check Examples**: Look at existing screens and ViewModels
4. **Join the Team**: Reach out on team channels

---

## 🔗 Useful Links

- **Project Documentation**: `/docs`
- **Migration Guide**: `/docs/AURAFLOW_KMP_MIGRATION_GUIDE.md`
- **Firebender Rules**: `/firebender.json`
- **Kotlin Multiplatform**: https://kotlinlang.org/docs/multiplatform.html
- **Compose Multiplatform**: https://www.jetbrains.com/lp/compose-mpp/
- **Koin DI**: https://insert-koin.io/

---

## 💡 Pro Tips

1. **Use firebender.json**: The project has AI rules configured for assisted development
2. **Hot Reload**: Compose supports hot reload - save to see changes instantly
3. **Shared First**: Put logic in `commonMain` unless platform-specific
4. **expect/actual**: Use for platform APIs (database, file I/O, logging)
5. **Koin Inspector**: Use Koin's debug features to inspect DI graph

---

## 🆘 Need Help?

- **Documentation**: Check `/docs` folder
- **Issues**: Search existing issues or create new one
- **Team Chat**: Reach out on project channels
- **Stack Overflow**: Tag with `kotlin-multiplatform`, `compose-multiplatform`

---

**Happy Coding! 🎉**

Last Updated: January 2025
