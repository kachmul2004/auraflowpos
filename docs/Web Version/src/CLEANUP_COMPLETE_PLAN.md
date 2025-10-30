# 🧹 Complete Cleanup Plan

## Phase 1: Move Documentation Files to Proper Locations ✅

### Files to Move from /docs to /docs/guides
- TESTING_GUIDE.md
- USER_GUIDE.md
- ADMIN_GUIDE.md
- USER_FLOWS.md
- IMPLEMENTATION_GUIDE.md (already moved by assistant)

### Files to Move from /docs to /docs/integrations
- API_WEBHOOKS.md
- INTEGRATIONS.md
- HARDWARE_PRINTER_MANAGEMENT.md

### Files to Move from /docs to /docs/planning
- OVERALL_ROADMAP.md

## Phase 2: Archive Outdated Root Documentation ✅

### Move to /docs/archive (Outdated Summaries)
- ARCHITECTURE_FIXED.md → Summary of fix (outdated)
- BAR_FIXES_SUMMARY.md → Old fix summary
- BAR_FRONTEND_COMPLETE.md → Old implementation summary
- BAR_SUBSCRIPTION_IMPLEMENTATION.md → Old implementation details
- DOCUMENTATION_CLEANUP_SUMMARY.md → Completed task
- MULTI_SUBSCRIPTION_ARCHITECTURE.md → Consolidated into main docs
- MULTI_SUBSCRIPTION_GUIDE.md → Consolidated into main docs
- SUBSCRIPTION_VISUAL_GUIDE.md → Consolidated into SUBSCRIPTIONS.md

### Move to /docs/archive (Completed Task Docs)
- FINAL_CLEANUP_STEPS.md → Task completed
- MOVE_DOCS_NOW.md → Task guide
- WHATS_NEXT.md → Outdated roadmap

## Phase 3: Keep Essential Root Documentation ✅

### Keep in Root (User-Facing Entry Points)
- README.md ✅
- QUICK_START.md ✅
- START_HERE.md ✅
- PROJECT_STATUS.md ✅
- CHANGELOG.md ✅
- CONTRIBUTING.md ✅
- Attributions.md ✅

### Keep in Root (Backend Migration Guides - NEW)
- AUTH_MIGRATION_GUIDE.md ✅
- BACKEND_COMPLETE_GUIDE.md ✅
- BACKEND_FAQ.md ✅
- SCHEMA_MIGRATION_GUIDE.md ✅
- USERS_VS_CUSTOMERS.md ✅
- SEEDING_GUIDE.md ✅
- SEED_QUICKSTART.md ✅
- DATABASE_SEEDING_SUMMARY.md ✅

### Keep in Root (Setup & Phase Planning)
- SETUP_INSTRUCTIONS.md ✅
- PHASE_3_PRODUCTION_PLAN.md ✅
- BACKEND_SETUP_CHECKLIST.md ✅

## Phase 4: Clean Up Code (Unused Imports, Comments) ✅

### Components to Check
- [ ] Remove unused imports from all components
- [ ] Remove commented-out code
- [ ] Remove duplicate components (if any)

### Specific Files Identified
- PaymentDialog.tsx vs PaymentDialogEnhanced.tsx (check which is used)

## Phase 5: Update Documentation Links ✅

### Update References in:
- [ ] README.md
- [ ] docs/README.md
- [ ] Other guides pointing to moved files

## Summary

**Total Files:**
- Move: 9 files from /docs to subdirectories
- Archive: 11 files from root to /docs/archive
- Keep in Root: 21 essential files
- Code Cleanup: Check all .tsx files
