# AuraFlowPOS Documentation

This directory contains comprehensive documentation for the AuraFlowPOS Kotlin Multiplatform
project.

---

## 📚 Documentation Structure

### **Project Guides**

- [`AURAFLOW_KMP_MIGRATION_GUIDE.md`](AURAFLOW_KMP_MIGRATION_GUIDE.md) - Complete migration guide
  from React to KMP
- [`FULL_STACK_ARCHITECTURE.md`](FULL_STACK_ARCHITECTURE.md) - Full-stack architecture overview (
  Client + Server)
- [`QUICK_START.md`](QUICK_START.md) - Quick start guide for developers
- [`SERVER_SETUP_COMPLETE.md`](SERVER_SETUP_COMPLETE.md) - Server infrastructure completion guide

### **Implementation Tracking**

- [`IMPLEMENTATION_TRACKER.md`](IMPLEMENTATION_TRACKER.md) - Feature tracking (114+ features across
  11 phases)
- [`PHASE_0_AND_1_PROGRESS.md`](PHASE_0_AND_1_PROGRESS.md) - Phase 0 & 1 detailed progress
- [`PHASE_1_PROGRESS.md`](PHASE_1_PROGRESS.md) - Phase 1 specific progress

### **Coding Rules** (`coding-rules/`)

External markdown files referenced by `firebender.json` for AI-assisted development:

- **[`KMP_ARCHITECTURE.md`](coding-rules/KMP_ARCHITECTURE.md)** - Clean Architecture guidelines for
  KMP
    - Domain, Data, Presentation, Core layers
    - Dependency flow rules
    - File organization patterns
    - Use Cases, ViewModels, Repositories best practices

- **[`KTOR_CLIENT_SERVER.md`](coding-rules/KTOR_CLIENT_SERVER.md)** - Ktor 3.3.1 Client & Server
  patterns
    - HTTP Client configuration (ContentNegotiation, Auth, Logging)
    - WebSocket client/server implementation
    - Server plugins (CORS, StatusPages, JWT)
    - API route patterns
    - Environment configuration

- **[`DATABASE_PATTERNS.md`](coding-rules/DATABASE_PATTERNS.md)** - Database best practices
    - Exposed ORM (Server-side PostgreSQL)
    - Room (Client-side offline storage)
    - Transaction management
    - Offline-first patterns
    - Expect/actual for multiplatform databases

---

## 🤖 Firebender Integration

The `firebender.json` file at the project root references these external markdown files for AI
coding assistance:

```json
{
  "rules": [
    {
      "filePattern": "**/*.kt",
      "rulesPaths": ["docs/coding-rules/KMP_ARCHITECTURE.md"]
    },
    {
      "filePattern": "**/network/**/*.kt",
      "rulesPaths": ["docs/coding-rules/KTOR_CLIENT_SERVER.md"]
    },
    {
      "filePattern": "**/database/**/*.kt",
      "rulesPaths": ["docs/coding-rules/DATABASE_PATTERNS.md"]
    }
  ]
}
```

### **Why External Files?**

- ✅ **Better Organization** - Easier to maintain than embedded JSON
- ✅ **No JSON Limitations** - No escaping, multiline handling issues
- ✅ **Reusable** - Can be referenced by other tools (IDEs, CI/CD)
- ✅ **Version Control** - Better diffs in git
- ✅ **Readable** - Markdown formatting with code highlighting

---

## 📖 How to Use

### **For Developers**

1. **Start Here**: [`QUICK_START.md`](QUICK_START.md)
2. **Architecture**: [`FULL_STACK_ARCHITECTURE.md`](FULL_STACK_ARCHITECTURE.md)
3. **Coding Patterns**: Browse `coding-rules/` directory
4. **Track Progress**: [`IMPLEMENTATION_TRACKER.md`](IMPLEMENTATION_TRACKER.md)

### **For AI Assistants**

Firebender automatically applies rules from `coding-rules/` based on file patterns:

- Editing `ProductRepository.kt` → applies `KMP_ARCHITECTURE.md`
- Editing `ProductApi.kt` → applies `KTOR_CLIENT_SERVER.md`
- Editing `ProductDao.kt` → applies `DATABASE_PATTERNS.md`

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT APPLICATIONS                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Android  │ │   iOS    │ │ Desktop  │ │   Web    │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         Shared KMP Client Code                      │    │
│  │  • UI (Compose Multiplatform)                       │    │
│  │  • ViewModels (MVVM)                                │    │
│  │  • Use Cases (Business Logic)                       │    │
│  │  • Repositories (Data Layer)                        │    │
│  │  • Ktor Client (API Communication)                  │    │
│  │  • Room Database (Local Cache)                      │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                    KTOR SERVER (Kotlin)                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  • REST API Endpoints                                │    │
│  │  • WebSocket (Real-time sync)                        │    │
│  │  • JWT Authentication                                │    │
│  │  • Business Logic & Validation                       │    │
│  │  • Exposed ORM + PostgreSQL                          │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack (2025)

### **Client (Multiplatform)**

- **Kotlin**: 2.2.21
- **Compose Multiplatform**: 1.9.2
- **Ktor Client**: 3.3.1
- **Room**: 2.7.0-alpha10
- **Koin**: 4.1.0
- **Coroutines**: 1.10.2
- **Serialization**: 1.7.3
- **Coil3**: 3.0.4
- **Voyager**: 1.1.0

### **Server (JVM)**

- **Ktor Server**: 3.3.1
- **Exposed ORM**: 0.58.0
- **PostgreSQL**: 42.7.4
- **JWT**: 4.4.0
- **BCrypt**: 0.10.2
- **HikariCP**: 6.2.1

---

## 📈 Project Status

- **Phase 0 (Server)**: 95% Complete ✅
- **Phase 1 (Client Core)**: 60% Complete 🚧
- **Total Features**: 114+ tracked
- **Files Created**: 32+ implementation files
- **Documentation**: 2,000+ lines

See [`IMPLEMENTATION_TRACKER.md`](IMPLEMENTATION_TRACKER.md) for detailed progress.

---

## 🤝 Contributing

When adding new patterns or architectural decisions:

1. **Update relevant markdown** in `coding-rules/`
2. **Add to `firebender.json`** if needed
3. **Update progress** in `IMPLEMENTATION_TRACKER.md`
4. **Keep documentation in sync** with implementation

---

## 📝 Notes

- All documentation uses **GitHub-flavored Markdown**
- Code examples are **production-ready** and follow latest best practices
- Guides are **version-specific** (2025) to avoid outdated patterns
- Rules are **opinionated** but based on official recommendations

---

**Last Updated**: 2025
**Maintained By**: AuraFlow Development Team
