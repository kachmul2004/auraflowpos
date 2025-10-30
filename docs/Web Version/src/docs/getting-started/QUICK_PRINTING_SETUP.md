# Quick Printing Setup Guide

Get cashier receipt printing working in 3 minutes! ⚡

---

## Step 1: Start Backend (1 minute)

### macOS:
```bash
cd backend
npm run start:macos
```

### Linux/Windows:
```bash
cd backend
npm start
```

**Wait for:**
```
✅ Server running on http://localhost:3001
🔌 Ready to receive print jobs...
```

---

## Step 2: Configure Printer (1 minute)

1. Open AuraFlow POS
2. Login as Admin (username: `admin`, password: `admin123`)
3. Go to **Admin → Hardware Management**
4. Click **"Add Printer"**
5. Fill in:
   - **Name:** Front Counter Printer
   - **Type:** Receipt
   - **Connection:** Network
   - **IP Address:** [Your printer's IP, e.g., 192.168.0.158]
   - **Port:** Leave empty (uses 9100)
   - **Enabled:** ✅ Check
6. Click **Save**

---

## Step 3: Test It (1 minute)

### Test from Admin:
1. Click **"Test Print"** next to your printer
2. Receipt should print!

### Test from Cashier:
1. Go to cashier view
2. Add items to cart
3. Click **Checkout**
4. Select payment method
5. Complete payment
6. Receipt dialog opens
7. Click **"Print"**
8. Select **"Thermal Printer"** tab
9. Click **"Print"**
10. Receipt prints! 🎉

---

## Troubleshooting

### Backend won't start on macOS:
```bash
# Make sure you're using sudo
sudo npm start
```

### Can't find printer IP:
```bash
# Check printer's network settings on the printer itself
# Or check your router's connected devices list
```

### Test print fails:
```bash
# Verify printer is reachable
ping 192.168.0.158

# Verify port 9100 is open
nc -zv 192.168.0.158 9100
```

### Receipt doesn't print from cashier:
1. Check backend is still running
2. Check printer is enabled in Hardware Management
3. Check browser console (F12) for errors
4. Check backend terminal for errors

---

## Quick Commands

### Start Everything:

**Terminal 1 (Backend):**
```bash
cd backend
npm run start:macos  # or just `npm start` on Linux/Windows
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### Stop Everything:
Press `Ctrl+C` in both terminals

---

## Configuration Checklist

- ✅ Backend installed: `cd backend && npm install`
- ✅ Backend running: `http://localhost:3001/api/health` returns healthy
- ✅ Printer added in Hardware Management
- ✅ Printer type set to "Receipt"
- ✅ Connection set to "Network"
- ✅ IP address entered correctly
- ✅ Printer enabled (checkbox checked)
- ✅ Test print works

---

## Default Settings

| Setting | Value |
|---------|-------|
| Backend URL | http://localhost:3001 |
| Printer Port | 9100 |
| Print Format | ESC/POS |
| Paper Size | 80mm |

---

## Success Indicators

### Backend Running:
```
✅ Server running on http://localhost:3001
🔌 Ready to receive print jobs...
```

### Print Job Success:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖨️  PRINT JOB RECEIVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Connected to printer
✅ Data sent
✅ Print job completed successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Frontend Success:
```
✅ Print job sent successfully
Job ID: job-1698765432123-abc
```

---

## That's It!

If you see the success indicators above, everything is working! 🎉

**Need more help?**
- 📖 [Backend Documentation](../../backend/README.md)
- 📖 [macOS Setup Guide](../../backend/MACOS_SETUP.md)
- 📖 [Hardware Printer Management](../integrations/HARDWARE_PRINTER_MANAGEMENT.md)

---

**Last Updated:** October 28, 2025
