# AuraFlow POS – Project Guidelines for Junie and Future AI Agents

Last updated: 2025-10-10 20:37

These guidelines provide an actionable overview of the project, how to build/run/test it across platforms, coding conventions, and how AI agents (Junie) should operate within this repository. Keep changes minimal and reversible; prefer small, focused commits.

---

Project overview
- Goal: Cross-platform (Android, iOS, Desktop) Kotlin Multiplatform implementation of Pronto POS that combines Cashier (POS) and Admin features.
- UI: Compose Multiplatform.
- Architecture: MVVM with StateFlow; global app state via a repository singletons (e.g., AppRepository) with DI.
- DI: Koin.
- Async: Kotlin Coroutines + Flow.
- Navigation: Voyager (or any Compose Multiplatform friendly navigator – ensure DI wiring).
- Persistence: SQLDelight (planned/placeholder); interim local JSON db.json used for seed/mock data.
- Platforms: androidMain, iosMain, jvmMain share commonMain logic.
- Reference: See composeApp/src/commonMain/kotlin/com/theauraflow/pos/ANDROID_APP_BRIEF.md for detailed blueprint including themes, features, and models.

Repository structure (essentials)
- composeApp/src/commonMain/...: Shared Kotlin code (UI, ViewModels, repositories, models, theme, resources, db.json).
- composeApp/src/androidMain/...: Android-specific code (Activity, platform DI, JSON provider, manifest and resources).
- composeApp/src/iosMain/...: iOS-specific code and KMP integration stubs.
- composeApp/src/jvmMain/...: Desktop-specific entry point and platform DI/JSON provider.
- composeApp/src/commonTest/...: Common unit tests.
- .junie/guidelines.md: This file. Keep it up to date when major process changes occur.

Build and run
Android
- Preferred: Open the project in Android Studio (latest stable with KMP/Compose Multiplatform support).
- Run target: composeApp – MainActivity.
- CLI: ./gradlew :composeApp:assembleDebug (build) and use device/emulator from Android Studio to run.

iOS
- Open iosApp/iosApp.xcodeproj in Xcode for simulator/device runs.
- KMP code is in composeApp; ensure Gradle sync completed in Android Studio at least once.
- If needed: ./gradlew :composeApp:packForXcode (varies with setup) or use the IDE integration.

Desktop (JVM)
- Entry point: composeApp/src/jvmMain/kotlin/com/theauraflow/pos/main.kt
- Run from IDE or CLI: ./gradlew :composeApp:run (if configured) or run the main.kt directly in IntelliJ IDEA.

Tests
- Location: composeApp/src/commonTest/kotlin/...
- Run all tests: ./gradlew :composeApp:allTests or ./gradlew test if configured by the template.
- When using Junie’s test tool, prefer path-based invocation to specific tests.

Dependency Injection (Koin)
- Shared DI: composeApp/src/commonMain/kotlin/com/theauraflow/pos/di/AppModule.kt sets up Json, repositories, and viewmodels.
- Platform DI modules must provide expect/actual bindings for platformModule (e.g., file I/O providers).
- Start Koin in each platform entry point and load appModule + platformModule.

State management
- ViewModels expose immutable StateFlow for UI state; update via coroutines.
- App-level state (session, shift, parked sales) lives in a singleton repository injected by Koin.

Data and resources
- db.json in commonMain acts as seed/mock database for users/products.
- JsonProvider abstracts resource access per platform.
- If/when introducing SQLDelight, preserve API contracts and migrate seed loading into DB init.

Theming
- Color palette and light/dark themes are defined in the brief; implement in ui/theme/Color.kt and Theme.kt.

Coding standards
- Kotlin style: Follow Kotlin official coding conventions. Keep functions small and composable.
- Compose best practices: Stateless composables where possible; hoist state to ViewModels; remember only for ephemeral UI state.
- Serialization: Ignore unknown keys (already enabled) and avoid throwing exceptions for optional JSON fields.
- Error handling: Prefer graceful fallbacks and user-friendly messages; never crash due to missing optional JSON keys.
- Null-safety: Avoid !! operators; prefer safe access with defaults. Log or return safe fallbacks.
- Immutability: Prefer val and immutable data classes for UI state.
- Testing: Add tests under commonTest; name tests clearly.

Branching and reviews
- Keep PRs small and focused; include a short description and testing notes.
- Ensure CI (if present) is green before merge.

Junie/AI agent workflow
- Always read ANDROID_APP_BRIEF.md before implementing feature-level changes.
- Use minimal edits to satisfy the issue; avoid broad refactors.
- Prefer repository/search tools to locate code; only open files needed for the fix.
- When handling JSON reads, avoid using !!; return sensible defaults instead.
- Keep platform differences in mind; edit expect/actual pairs carefully.
- Before submitting: run related tests; if unavailable, at least ensure code compiles on commonMain and platform-specific modules impacted.
- Update this guidelines file if your changes impact build/run/test procedures or conventions.

How to add a new feature
- Define models in commonMain (data classes) and, when DB exists, update SQLDelight .sq schema accordingly.
- Add ViewModel with StateFlow, repository calls via DI.
- Create composables for UI; wire navigation via chosen navigator.
- Add DI bindings to AppModule and platform-specific modules as needed.

Known constraints and tips
- types.ts exists for parity with existing web app types; replicate in Kotlin data models.
- The app currently uses JSON seed data; treat it as the source of truth until SQLDelight is introduced.
- Use Koin factory for ViewModels unless a shared scope is required.

Contact/Ownership
- Primary namespace: com.theauraflow.pos
- App name: AuraFlow POS

Changelog for this update
- Replaced placeholder guidelines with full project overview and actionable guidance.
- Noted best practices for JSON/serialization and DI usage.
- Reinforced minimal-change policy for AI agents.
