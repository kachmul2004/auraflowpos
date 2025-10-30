# 🧪 Testing Guide - AuraFlow POS

**Version:** 2.1.0  
**Phase:** Phase 1 - Production Polish  
**Purpose:** Comprehensive testing before beta launch

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Testing Strategy](#testing-strategy)
3. [Test Scenarios](#test-scenarios)
4. [Browser Testing](#browser-testing)
5. [Performance Testing](#performance-testing)
6. [Bug Reporting](#bug-reporting)
7. [Acceptance Criteria](#acceptance-criteria)

---

## Overview

### Purpose

Before launching AuraFlow POS to beta users, we need to ensure:
- ✅ All features work correctly
- ✅ No critical bugs
- ✅ Performance is acceptable
- ✅ UI/UX is polished
- ✅ Error handling works

### Testing Timeline

**Day 1 (Oct 28):** Core POS + Admin  
**Day 2 (Oct 29):** Plugins + Restaurant Features  
**Day 3 (Oct 30):** Edge Cases + Performance

### Who Should Test

- **Developers:** Technical testing, edge cases
- **Users:** Real-world workflows, usability
- **QA:** Systematic checklist completion

---

## Testing Strategy

### 1. Functional Testing

Test all features work as designed:
- Core POS operations
- Admin dashboard
- Plugin system
- Restaurant features
- Data persistence

### 2. Integration Testing

Test components work together:
- Cart → Checkout → Receipt
- Admin → Database (localStorage)
- Plugins → Settings → UI
- Network Printing → Backend

### 3. Usability Testing

Test user experience:
- Intuitive navigation
- Clear error messages
- Smooth workflows
- Mobile friendly

### 4. Performance Testing

Test speed and efficiency:
- Load times
- Interaction responsiveness
- Large data sets
- Memory usage

### 5. Regression Testing

Ensure fixes don't break existing features:
- Re-test after fixes
- Test related features
- Verify no side effects

---

## Test Scenarios

### Scenario 1: First Sale (Happy Path)

**Goal:** Complete first sale from start to finish

**Steps:**
1. Login as cashier (001 / 123456)
2. Select Terminal 1
3. Clock in
4. Add "Coffee" to cart
5. Add "Croissant" to cart
6. Click Checkout
7. Select Cash payment
8. Enter $20
9. Complete payment
10. Print receipt
11. Close

**Expected Result:**
- ✅ Transaction completes successfully
- ✅ Receipt shows all items
- ✅ Receipt shows correct total
- ✅ Receipt shows change
- ✅ Order appears in history

**Pass/Fail:** ______

---

### Scenario 2: Complex Order (Restaurant)

**Goal:** Test restaurant features end-to-end

**Steps:**
1. Enable Restaurant profile in Admin
2. Login as cashier
3. Select table from floor plan
4. Add appetizers (mark as Course 1)
5. Add main courses (mark as Course 2)
6. Add desserts (mark as Course 3)
7. Fire Course 1 to kitchen
8. Check Kitchen Display
9. Mark appetizers as prepared
10. Fire Course 2
11. Customer wants to split check
12. Split by seat
13. Process payment for each split
14. Print receipts

**Expected Result:**
- ✅ Courses tracked correctly
- ✅ Kitchen display updates
- ✅ Check splits correctly
- ✅ All payments total to original amount
- ✅ Each receipt accurate

**Pass/Fail:** ______

---

### Scenario 3: Return & Refund

**Goal:** Process a return

**Steps:**
1. Complete a sale (any items)
2. Note the order number
3. Go to Returns page
4. Search for order by number
5. Select order
6. Choose "Full Return"
7. Select refund method (cash)
8. Complete return
9. Print return receipt
10. Verify original order status

**Expected Result:**
- ✅ Order found successfully
- ✅ Return processed
- ✅ Refund amount correct
- ✅ Receipt prints
- ✅ Order marked as returned
- ✅ Transaction logged

**Pass/Fail:** ______

---

### Scenario 4: Network Printing

**Goal:** Print to physical thermal printer

**Prerequisites:**
- Backend server running
- Printer configured in Admin

**Steps:**
1. Start backend: `cd backend && npm start`
2. Login as Admin
3. Go to Admin → Hardware Management
4. Add printer (IP: [your printer IP])
5. Click Test Print
6. Verify test receipt prints
7. Login as cashier
8. Complete a sale
9. Click Print
10. Select Thermal Printer tab
11. Click Print
12. Verify receipt prints

**Expected Result:**
- ✅ Test print works
- ✅ Sale receipt prints
- ✅ All details legible
- ✅ Formatting correct
- ✅ No truncation

**Pass/Fail:** ______

---

### Scenario 5: Multi-Plugin Workflow

**Goal:** Test plugin activation/deactivation

**Steps:**
1. Login as Admin
2. Go to Admin → Settings
3. Select "Retail" profile
4. Note which plugins activate
5. Go to Cashier view
6. Verify barcode scanner available
7. Test barcode scanning
8. Go back to Admin → Settings
9. Select "Restaurant" profile
10. Go to Cashier view
11. Verify table management available
12. Verify barcode scanner not available

**Expected Result:**
- ✅ Retail plugins activate for Retail profile
- ✅ Restaurant plugins activate for Restaurant profile
- ✅ UI updates correctly
- ✅ Features appear/disappear as expected

**Pass/Fail:** ______

---

### Scenario 6: Error Handling

**Goal:** Test system handles errors gracefully

**Steps:**
1. Try to checkout with empty cart
2. Try to apply 150% discount
3. Try to enter negative quantity
4. Try to login with wrong credentials
5. Try to delete a product in use
6. Try to clock in twice
7. Try to print without printer configured

**Expected Result:**
- ✅ All invalid actions prevented
- ✅ Clear error messages shown
- ✅ No system crashes
- ✅ User can recover from errors

**Pass/Fail:** ______

---

### Scenario 7: Data Persistence

**Goal:** Verify data persists correctly

**Steps:**
1. Add items to cart
2. Park the sale
3. Refresh the page
4. Verify parked sale still there
5. Retrieve parked sale
6. Complete checkout
7. Refresh page
8. Go to Admin → Orders
9. Verify order appears
10. Logout
11. Login again
12. Verify settings preserved

**Expected Result:**
- ✅ Parked sale persists
- ✅ Order history persists
- ✅ Settings persist
- ✅ No data loss on refresh

**Pass/Fail:** ______

---

### Scenario 8: Mobile Experience

**Goal:** Test on mobile device

**Device:** [Phone/Tablet Model]  
**Browser:** [Browser Name]

**Steps:**
1. Open on mobile device
2. Login
3. Add items to cart using touch
4. Checkout
5. Test all buttons reachable
6. Test navigation
7. Test admin on mobile
8. Test landscape orientation

**Expected Result:**
- ✅ Layout responsive
- ✅ Touch targets adequate (44x44px min)
- ✅ All features accessible
- ✅ Smooth scrolling
- ✅ No layout issues

**Pass/Fail:** ______

---

### Scenario 9: Performance Under Load

**Goal:** Test with large datasets

**Steps:**
1. Note page load time (empty cache)
2. Add 100+ items to cart one by one
3. Note responsiveness
4. Go to Admin → Orders (with 1000+ orders)
5. Scroll through orders
6. Search for order
7. Filter orders
8. Note performance

**Expected Result:**
- ✅ Initial load < 3 seconds
- ✅ Adding to cart instant
- ✅ Large lists scroll smoothly
- ✅ Search is fast
- ✅ No freezing or lag

**Pass/Fail:** ______

---

### Scenario 10: Shift Management Full Cycle

**Goal:** Complete shift from start to end

**Steps:**
1. Login and clock in
2. Record starting cash ($200)
3. Make 5+ sales
4. Do a cash in (+$100)
5. Do a cash out (-$50)
6. Make 5+ more sales
7. Clock out
8. Generate Z-Report
9. Verify all transactions listed
10. Verify cash calculations correct

**Expected Result:**
- ✅ Shift time tracked
- ✅ All transactions in report
- ✅ Cash calculations accurate
- ✅ Report can be printed
- ✅ Report can be exported

**Pass/Fail:** ______

---

## Browser Testing

### Desktop Browsers

Test on these browsers at minimum:

**Google Chrome (Latest)**
- Version: ______
- Status: [ ] Pass [ ] Fail
- Issues: ______

**Mozilla Firefox (Latest)**
- Version: ______
- Status: [ ] Pass [ ] Fail
- Issues: ______

**Safari (Latest)**
- Version: ______
- Status: [ ] Pass [ ] Fail
- Issues: ______

**Microsoft Edge (Latest)**
- Version: ______
- Status: [ ] Pass [ ] Fail
- Issues: ______

### Mobile Browsers

**Mobile Safari (iOS)**
- Device: ______
- Version: ______
- Status: [ ] Pass [ ] Fail
- Issues: ______

**Chrome Mobile (Android)**
- Device: ______
- Version: ______
- Status: [ ] Pass [ ] Fail
- Issues: ______

---

## Performance Testing

### Load Time Testing

**Tools:** Chrome DevTools, Lighthouse

**Metrics to Measure:**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)

**Targets:**
- FCP: < 1.8s
- LCP: < 2.5s
- TTI: < 3.8s
- TBT: < 200ms

**Results:**
- FCP: ______ ✅/❌
- LCP: ______ ✅/❌
- TTI: ______ ✅/❌
- TBT: ______ ✅/❌

### Bundle Size

```bash
npm run build
```

Check `dist/` folder size:
- Total bundle: ______ KB
- JS bundle: ______ KB
- CSS bundle: ______ KB

**Target:** < 1MB total

### Memory Usage

**Test:** Leave app open for 30 minutes, perform operations

**Results:**
- Starting memory: ______ MB
- After 30 min: ______ MB
- Memory leak: [ ] Yes [ ] No

---

## Bug Reporting

### How to Report Bugs

1. Check if already reported in [BUGS.md](../BUGS.md)
2. Determine severity:
   - 🔴 **Critical:** Blocks core functionality
   - 🟠 **Major:** Important feature broken, has workaround
   - 🟡 **Minor:** Cosmetic or minor inconvenience

3. Add to BUGS.md with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshot (if applicable)
   - Browser/device info

4. Tag appropriately
5. Notify team

### Example Bug Report

```markdown
**BUG-001: Checkout fails with multiple modifiers**
- **Severity:** Critical 🔴
- **Component:** Checkout
- **Found by:** John Doe
- **Date:** 2025-10-28
- **Browser:** Chrome 119

**Description:**
Checkout button becomes unresponsive when cart contains items with more than 3 modifiers.

**Steps to Reproduce:**
1. Add "Pizza" to cart
2. Select 4 toppings (pepperoni, mushrooms, olives, peppers)
3. Click Checkout
4. Click Complete Payment

**Expected:** Payment processes
**Actual:** Button does nothing, no error shown

**Impact:** Cannot complete sales with multiple modifiers

**Workaround:** Remove one modifier

**Status:** 🔴 Open
```

---

## Acceptance Criteria

### For Beta Launch

Must have:
- ✅ Zero critical bugs
- ✅ < 3 major bugs (with workarounds)
- ✅ All core features working
- ✅ Receipt printing working
- ✅ Mobile responsive
- ✅ Performance acceptable

Nice to have:
- ✅ Zero major bugs
- ✅ All minor bugs fixed
- ✅ Perfect performance scores
- ✅ All browsers tested

### Sign-Off Checklist

- [ ] All test scenarios passed
- [ ] All browsers tested
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Documentation complete
- [ ] Known issues documented

**Approved for Beta:** [ ] Yes [ ] No

**Approver:** __________________  
**Date:** __________________

---

## 📚 Related Documents

- [TESTING_CHECKLIST.md](../TESTING_CHECKLIST.md) - Detailed checklist
- [BUGS.md](../BUGS.md) - Bug tracking
- [PROJECT_STATUS.md](../PROJECT_STATUS.md) - Overall status
- [CONTRIBUTING.md](../CONTRIBUTING.md) - How to contribute

---

## 💡 Testing Tips

1. **Test like a user:** Don't just click through, try to break it
2. **Document everything:** Even small issues matter
3. **Test edge cases:** Empty inputs, max values, special characters
4. **Test different paths:** Not just happy path
5. **Test on real devices:** Emulators aren't enough
6. **Clear cache between tests:** Ensure fresh state
7. **Use different data:** Don't just test with "Test Product"

---

**Happy Testing!** 🧪

If you find issues, you're helping make AuraFlow better! 🚀
