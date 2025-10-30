# ⚡ Quick Start Guide

Get AuraFlow POS running in 5 minutes!

---

## Step 1: Install (1 minute)

```bash
# Clone repository
git clone <repository-url>
cd auraflow-pos

# Install dependencies
npm install
```

---

## Step 2: Start Application (30 seconds)

```bash
npm run dev
```

**Open:** http://localhost:5173

---

## Step 3: Login (30 seconds)

### Cashier View
1. Enter User ID: `001`
2. Enter PIN: `123456`
3. Select Terminal: `Terminal 1`
4. Click **Clock In**

### Admin Dashboard
1. Click **Admin** in the top right
2. Username: `admin`
3. Password: `admin123`
4. Click **Login**

---

## Step 4: Make Your First Sale (2 minutes)

### As Cashier:

1. **Add Products:**
   - Click product buttons to add to cart
   - Or use search bar to find products

2. **Checkout:**
   - Click **Checkout** button
   - Select payment method (Cash/Card/Check)
   - For cash: Enter amount received
   - Click **Complete Payment**

3. **View Receipt:**
   - Receipt dialog shows automatically
   - Print or email receipt
   - Click **Close** to finish

**Congratulations!** You just completed your first sale! 🎉

---

## Optional: Network Printing (3 minutes)

To print to a physical thermal printer:

### 1. Start Print Backend

```bash
cd backend

# macOS
npm run start:macos

# Linux/Windows  
npm start
```

### 2. Configure Printer

1. Login as Admin
2. Go to **Admin → Hardware Management**
3. Click **Add Printer**
4. Fill in:
   - Name: `Front Counter Printer`
   - Type: `Receipt`
   - Connection: `Network`
   - IP Address: [Your printer IP]
   - Port: `9100` (or leave empty)
5. Click **Save**
6. Click **Test Print**

### 3. Test from Cashier

1. Make a sale
2. Click **Print** on receipt
3. Select **Thermal Printer** tab
4. Click **Print**
5. Receipt prints! 🎉

**Full Setup Guide:** [backend/QUICK_START.md](backend/QUICK_START.md)

---

## What's Next?

### Explore Features

**Cashier View:**
- Returns & exchanges
- Customer management
- Parked sales
- Cash drawer operations
- Shift management

**Admin Dashboard:**
- View sales reports
- Manage products & customers
- Configure settings
- View analytics
- Export data

### Configure Your Business

1. **Admin → Settings → Business Profile**
   - Choose your industry (Restaurant, Retail, etc.)
   - Relevant plugins activate automatically

2. **Admin → Products**
   - Add your products
   - Set up categories
   - Configure pricing

3. **Admin → Customers**
   - Import customer list
   - Or add as you go

4. **Admin → Users**
   - Add your team
   - Assign roles & permissions
   - Set up PIN codes

### Learn More

- **[User Guide](docs/USER_GUIDE.md)** - Complete manual
- **[Admin Guide](docs/ADMIN_GUIDE.md)** - Admin features
- **[Restaurant Features](docs/RESTAURANT_FEATURES.md)** - For restaurants
- **[Documentation Index](docs/README.md)** - All docs

---

## Keyboard Shortcuts

**Cashier:**
- `Ctrl/Cmd + K` - Product search
- `Ctrl/Cmd + P` - Checkout
- `Ctrl/Cmd + H` - Hold sale
- `Ctrl/Cmd + D` - Cash drawer

**Global:**
- `F1` - Help
- `Ctrl/Cmd + ?` - Keyboard shortcuts

---

## Default Login Credentials

### Cashiers

| Name | User ID | PIN | Permissions |
|------|---------|-----|-------------|
| John Smith | 001 | 123456 | Sales, Returns |
| Sarah Johnson | 002 | 234567 | Sales, Returns |
| Mike Davis | 003 | 345678 | Sales Only |

### Managers

| Name | Username | Password | Role |
|------|----------|----------|------|
| Admin | admin | admin123 | Super Admin |
| Jane Manager | manager | manager123 | Store Manager |

**⚠️ Important:** Change these passwords before going to production!

---

## Troubleshooting

### Can't start dev server?

```bash
# Make sure Node.js is installed
node --version  # Should be 18+

# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Can't login?

- **Cashier:** Make sure you select a terminal
- **Admin:** Username is `admin`, not `Admin` (case-sensitive)

### Network printing not working?

1. **Backend not started:** Run `cd backend && npm start`
2. **macOS:** Use `npm run start:macos` (requires sudo)
3. **Wrong IP:** Check printer's IP address on the printer
4. **Port blocked:** Ensure port 9100 is accessible
5. **Test connection:** `nc -zv [PRINTER_IP] 9100`

**Full Troubleshooting:** [backend/README.md](backend/README.md#troubleshooting)

---

## Quick Reference

### File Locations

- **Products:** `lib/mockData.ts` (hardcoded for now)
- **Settings:** Stored in browser localStorage
- **Orders:** Stored in browser localStorage
- **Printer Config:** Admin → Hardware Management

### Important URLs

- **Frontend:** http://localhost:5173
- **Print Backend:** http://localhost:3001
- **Backend Health:** http://localhost:3001/api/health

### Ports Used

- `5173` - Frontend dev server (Vite)
- `3001` - Print backend server
- `9100` - Thermal printer (ESC/POS standard)

---

## Need Help?

- 📖 **[Full Documentation](docs/README.md)**
- 📖 **[User Guide](docs/USER_GUIDE.md)**
- 📖 **[Admin Guide](docs/ADMIN_GUIDE.md)**
- 💬 **GitHub Discussions**
- 🐛 **GitHub Issues**

---

## Ready for More?

**Next Steps:**
1. Read the [User Guide](docs/USER_GUIDE.md)
2. Configure your business profile
3. Add your products
4. Test all features
5. Invite your team

**Going to Production:**
1. Build: `npm run build`
2. Deploy frontend
3. Deploy print backend (if using network printing)
4. Change default passwords
5. Configure real payment processing (coming in Phase 3)

---

<div align="center">

**You're all set!** 🎉

Return to [README](README.md) • [Documentation](docs/README.md)

</div>
