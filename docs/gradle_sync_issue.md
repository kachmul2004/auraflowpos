### Gradle Sync – Known Issues, Fixes, and Playbook (2025‑10‑30)

This document captures how we verified and fixed Gradle Sync issues for AuraFlow POS. It’s intended for future developers and AI agents to quickly diagnose and resolve IDE sync/build problems.

---

#### Current working baseline (verified)
We validated a clean build from the command line. If Android Studio reports sync issues, first confirm the baseline builds in CLI.

- Gradle Wrapper: `8.14.3` (see `gradle/wrapper/gradle-wrapper.properties`)
- AGP (Android Gradle Plugin): `8.13.0` (via version catalog)
- Kotlin: `2.2.21` (via version catalog)
- Compose Multiplatform plugin: `1.9.2`
- Compose Compiler plugin: Kotlin Compose plugin matching `2.2.21`
- Toolchains Resolver: `org.gradle.toolchains.foojay-resolver-convention:1.0.0` (in `settings.gradle.kts`)
- Java target for Android source: `11` (compileOptions), Gradle JDK should be 17+ (see below)

Command that succeeded:
```
./gradlew build
```
If this command passes but Android Studio sync fails, the issue is most likely IDE configuration rather than the project.

---

#### Quick triage checklist
Go through these in order. Most IDE sync problems are resolved by steps 1–4.

1) Ensure Gradle JDK is 17 or 21 in Android Studio
- Android Studio > Settings > Build, Execution, Deployment > Gradle > Gradle JDK.
- Set to Embedded JDK (17+) or a locally installed JDK 17/21.
- Rationale: AGP 8.x requires JDK 17+. Our source/target compatibility remains Java 11, which is fine.

2) Force a clean sync
- File > Invalidate Caches / Restart… > Invalidate and Restart.
- Then: “Sync Project with Gradle Files”.

3) Confirm plugin repos are reachable
- Corporate proxies/VPNs can block or slow down mavenCentral/google. Ensure network access to:
  - https://repo.maven.apache.org/maven2/
  - https://dl.google.com/dl/android/maven2/
  - https://plugins.gradle.org/

4) Regenerate Typesafe project accessors (projects.shared)
- We use `enableFeaturePreview("TYPESAFE_PROJECT_ACCESSORS")` and reference `projects.shared` in `composeApp/build.gradle.kts`.
- If Android Studio shows unresolved reference for `projects.shared`, perform a Gradle sync (the accessors are generated during sync) or temporarily replace with classic notation:
  ```kotlin
  // Temporarily, if IDE cannot resolve during sync:
  implementation(project(":shared"))
  // After successful sync, revert to:
  implementation(projects.shared)
  ```

5) Kotlin/Compose mismatch
- If you see messages like “Compose compiler incompatible with Kotlin version”:
  - Make sure the Kotlin plugin in Android Studio matches the project Kotlin version `2.2.21`.
  - Confirm version catalog pins (in `gradle/libs.versions.toml`):
    - `composeMultiplatform = "1.9.2"`
    - `kotlin = "2.2.21"`
  - Then sync again.

6) Gradle Wrapper alignment
- Ensure wrapper is `8.14.3`. If local is older/newer, re-run:
  ```
  ./gradlew wrapper --gradle-version 8.14.3
  ```

7) Foojay resolver plugin
- We use `id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"`.
- If toolchain auto‑resolution errors occur, try switching Gradle JDK (Step 1). As a fallback, you can pin an alternate plugin version (e.g., `0.9.0`) and re-sync.

8) Clear Gradle caches (last resort)
- Stop all IDEs, then remove the project’s `.gradle/` and your `~/.gradle/caches/` folders, and sync again. This is slow but fixes corrupted caches.

---

#### What we changed in this fix
No build script changes were required. We verified the project builds end‑to‑end via CLI and documented the IDE alignment steps above. Typical root causes were IDE Gradle JDK set to Java 11 and accessors not generated yet.

---

#### Common error messages and remedies
- Unresolved reference: `projects.shared`
  - Cause: Typesafe accessors not generated yet.
  - Fix: Trigger Gradle sync, or temporarily use `project(":shared")` until the next successful sync.

- AGP requires Java 17 to run. You are currently using Java 11.
  - Cause: Gradle JDK in IDE set to 11.
  - Fix: Switch Gradle JDK to 17 or 21 in Android Studio settings.

- Incompatible Kotlin/Compose Compiler
  - Cause: IDE Kotlin plugin or Compose versions don’t match catalog.
  - Fix: Update IDE Kotlin plugin to match `2.2.21`; keep Compose Multiplatform at `1.9.2`.

- Could not resolve plugin portal artifacts
  - Cause: Network/proxy issues.
  - Fix: Verify access to plugin repositories; configure proxy if needed.

---

#### Verification steps
- Run `./gradlew build` — should complete successfully.
- Android: Build `assembleDebug` — `./gradlew :composeApp:assembleDebug`.
- Desktop (JVM): Run from IDE or configure `:composeApp:run` if needed.

---

#### Notes for future changes
- If upgrading Kotlin/Compose/AGP, consult compatibility matrices and bump together.
- Keep Gradle Wrapper and AGP aligned (AGP 8.3+ ⇒ JDK 17+).
- Prefer `projects.<module>` accessors once sync succeeds; they improve refactor safety.

---

Maintainer: Junie (AI)
Timestamp: 2025‑10‑30 13:10 local

---

#### Execution history lock / daemon OOM loop (resolved on 2025-10-30)

Symptoms
- Gradle failed to start the build with an initialization error referencing `ReservedFileSystemLocationRegistry` and `ExecutionHistoryStore`.
- Key message:
  - `Timeout waiting to lock execution history cache (.../.gradle/8.14.3/executionHistory). It is currently in use by another Gradle instance.`
  - Lock file path: `.gradle/8.14.3/executionHistory/executionHistory.lock`
- `./gradlew --info` also showed past daemons that had stopped "after running out of JVM heap space" (OOM), leaving behind a stale lock.

Likely cause
- One or more previous Gradle daemons crashed with OOM or did not shut down cleanly while the project lived on an external/slow disk (`/Volumes/Storage/...`). This left a stale lock on the local project execution history cache, blocking subsequent builds.

How we fixed it (safe, reproducible)
1) Stop all daemons:
```
./gradlew --stop
```
2) Remove the project-local Gradle caches that hold the lock (Gradle will recreate them):
```
rm -rf .gradle/8.14.3/executionHistory .gradle/8.14.3/fileHashes
```
3) Do a one-time clean build without the daemon and without the build cache to reset state:
```
./gradlew clean build --no-daemon --no-build-cache --info
```
4) After success, normal builds and IDE Gradle Sync worked again.

Prevention tips
- Ensure only one IDE window uses this project at a time to avoid competing daemons.
- Prefer JDK 17 or 21 for Gradle (Android Studio > Settings > Gradle > Gradle JDK).
- Consider increasing Gradle memory in `gradle.properties` (tune to your machine):
```
org.gradle.jvmargs=-Xms1g -Xmx4g -XX:MaxMetaspaceSize=512m -Dfile.encoding=UTF-8
# Optional on low-RAM systems:
# org.gradle.workers.max=4
```
- If working from a slow/external disk and you observe frequent file watcher hiccups, you can trial disabling VFS watching (only if needed):
```
# org.gradle.vfs.watch=false
```

Verification
- CLI: `./gradlew build` completes.
- IDE: Android Studio Gradle Sync succeeds without the lock/timeout error.

Notes
- If the problem ever recurs, repeat steps 1–3. As an absolute last resort, stop daemons and delete the entire project `.gradle/` folder and `~/.gradle/caches/` (this forces full re-download of caches).
