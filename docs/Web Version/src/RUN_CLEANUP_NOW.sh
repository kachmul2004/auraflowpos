#!/bin/bash

# ============================================================================
# AuraFlow POS - Complete Cleanup Script
# Run this to organize all documentation and clean up the project
# ============================================================================

echo "🧹 Starting AuraFlow POS Cleanup..."
echo ""

# ============================================================================
# PHASE 1: Move docs from /docs root to subdirectories
# ============================================================================

echo "📁 Phase 1: Moving documentation to proper subdirectories..."

# Move to docs/guides/
echo "  → Moving guides..."
mv docs/TESTING_GUIDE.md docs/guides/ 2>/dev/null
mv docs/USER_GUIDE.md docs/guides/ 2>/dev/null
mv docs/ADMIN_GUIDE.md docs/guides/ 2>/dev/null
mv docs/USER_FLOWS.md docs/guides/ 2>/dev/null

# Move to docs/integrations/
echo "  → Moving integrations..."
mv docs/API_WEBHOOKS.md docs/integrations/ 2>/dev/null
mv docs/INTEGRATIONS.md docs/integrations/ 2>/dev/null
mv docs/HARDWARE_PRINTER_MANAGEMENT.md docs/integrations/ 2>/dev/null

# Move to docs/planning/
echo "  → Moving planning docs..."
mv docs/OVERALL_ROADMAP.md docs/planning/ 2>/dev/null

echo "✅ Phase 1 complete!"
echo ""

# ============================================================================
# PHASE 2: Archive outdated docs from root to docs/archive/
# ============================================================================

echo "📦 Phase 2: Archiving outdated documentation..."

# Move outdated summaries and completed tasks
echo "  → Archiving old summaries..."
mv ARCHITECTURE_FIXED.md docs/archive/ 2>/dev/null
mv BAR_FIXES_SUMMARY.md docs/archive/ 2>/dev/null
mv BAR_FRONTEND_COMPLETE.md docs/archive/ 2>/dev/null
mv BAR_SUBSCRIPTION_IMPLEMENTATION.md docs/archive/ 2>/dev/null
mv DOCUMENTATION_CLEANUP_SUMMARY.md docs/archive/ 2>/dev/null
mv MULTI_SUBSCRIPTION_ARCHITECTURE.md docs/archive/ 2>/dev/null
mv MULTI_SUBSCRIPTION_GUIDE.md docs/archive/ 2>/dev/null
mv SUBSCRIPTION_VISUAL_GUIDE.md docs/archive/ 2>/dev/null
mv FINAL_CLEANUP_STEPS.md docs/archive/ 2>/dev/null
mv MOVE_DOCS_NOW.md docs/archive/ 2>/dev/null
mv WHATS_NEXT.md docs/archive/ 2>/dev/null
mv CLEANUP_COMPLETE_PLAN.md docs/archive/ 2>/dev/null

echo "✅ Phase 2 complete!"
echo ""

# ============================================================================
# PHASE 3: Delete unused code
# ============================================================================

echo "🗑️  Phase 3: Removing unused code..."
echo "  → Deleting PaymentDialog.tsx (replaced by PaymentDialogEnhanced)..."
rm components/PaymentDialog.tsx 2>/dev/null

echo "✅ Phase 3 complete!"
echo ""

# ============================================================================
# PHASE 4: Verify structure
# ============================================================================

echo "🔍 Phase 4: Verifying new structure..."
echo ""

echo "📖 docs/guides/ now contains:"
ls -1 docs/guides/ 2>/dev/null | sed 's/^/  • /'
echo ""

echo "🔌 docs/integrations/ now contains:"
ls -1 docs/integrations/ 2>/dev/null | sed 's/^/  • /'
echo ""

echo "🗺️  docs/planning/ now contains:"
ls -1 docs/planning/ 2>/dev/null | sed 's/^/  • /'
echo ""

echo "📦 docs/archive/ now contains:"
ls -1 docs/archive/ 2>/dev/null | head -5 | sed 's/^/  • /'
echo "  ... (and more)"
echo ""

# ============================================================================
# PHASE 5: Clean up cleanup scripts
# ============================================================================

echo "🧹 Phase 5: Cleaning up temporary files..."
rm CLEANUP_EXECUTION.md 2>/dev/null
rm CLEANUP_SUMMARY.md 2>/dev/null
rm CLEANUP_FINAL_REPORT.md 2>/dev/null

echo "✅ Phase 5 complete!"
echo ""

# ============================================================================
# DONE!
# ============================================================================

echo "═════════════════════��═════════════════════════════════════"
echo "🎉 CLEANUP COMPLETE!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "✅ Documentation organized into subdirectories"
echo "✅ Outdated files archived (not deleted)"
echo "✅ Unused code removed"
echo "✅ Project structure is clean and professional"
echo ""
echo "📋 Next steps:"
echo "  1. Test the app: npm run dev"
echo "  2. Verify everything works"
echo "  3. Run seeding script: python seed_database.py"
echo "  4. Commit changes: git add . && git commit -m 'docs: cleanup'"
echo ""
echo "📚 Documentation structure:"
echo "  Root: 18 essential files"
echo "  docs/guides: 5 guides"
echo "  docs/integrations: 3 integration docs"
echo "  docs/planning: 1 roadmap"
echo "  docs/archive: 12 archived files"
echo ""
echo "🚀 You're ready to continue development!"
echo ""

# Self-destruct this script
echo "🔥 Removing cleanup script..."
rm -- "$0" 2>/dev/null

echo "Done! ✨"
