# Quick Start Guide - Print Backend

## 🚀 Get Printing in 60 Seconds

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

---

### Step 2: Start the Backend

Choose your operating system:

#### 🍎 macOS

```bash
sudo npm start
```

Or use the helper script:
```bash
chmod +x start-macos.sh
./start-macos.sh
```

> **Why sudo?** macOS restricts access to port 9100. [Read more →](MACOS_SETUP.md)

---

#### 🐧 Linux

```bash
npm start
```

---

#### 🪟 Windows

```bash
npm start
```

---

### Step 3: Verify It's Running

Open in browser: http://localhost:3001/api/health

You should see:
```json
{
  "status": "healthy",
  "service": "AuraFlow Print Service"
}
```

---

### Step 4: Add Printer in AuraFlow

1. Open AuraFlow POS
2. Go to **Admin → Plugins → Hardware & Printer Management**
3. Click **"Add Printer"**
4. Fill in details:
   - **Name:** Front Counter Receipt
   - **Type:** Receipt
   - **Connection:** Network
   - **IP Address:** Your printer's IP (e.g., 192.168.0.158)
   - **Port:** Leave empty (defaults to 9100)
5. Click **Save**

---

### Step 5: Test Print

Click the **"Test Print"** button next to your printer.

**✅ Success looks like:**
```
✅ Connected to printer
📤 Sending data...
✅ Data sent
✅ Print job completed successfully
```

Your printer should print a test receipt! 🎉

---

## Troubleshooting

### ❌ "EHOSTUNREACH" Error (macOS only)

**You see:**
```
❌ Socket error: connect EHOSTUNREACH 192.168.x.x:9100
```

**Solution:**
```bash
# Stop the server (Ctrl+C)
# Restart with sudo
sudo npm start
```

📖 [Why does this happen?](MACOS_SETUP.md)

---

### ❌ Can't Connect to Print Service

**You see:** "Cannot connect to print service at http://localhost:3001"

**Solution:**
1. Make sure backend is running
2. Check terminal for errors
3. Test: `curl http://localhost:3001/api/health`

---

### ❌ Printer Not Found

**You see:** "Failed to connect to printer"

**Solution:**
1. Verify printer IP: `ping 192.168.0.158`
2. Check port: `nc -zv 192.168.0.158 9100` (Mac/Linux)
3. Ensure printer is on same network
4. Check printer is powered on

---

## Development Workflow

### Keep Backend Running

Terminal 1:
```bash
cd backend
sudo npm start  # macOS
npm start       # Linux/Windows
```

Terminal 2:
```bash
# Your main dev server
npm run dev
```

---

### Stop Backend

Press `Ctrl+C` in the terminal

---

### Restart Backend

```bash
# Stop with Ctrl+C
# Then:
sudo npm start  # macOS
npm start       # Linux/Windows
```

---

## Production Deployment

### Keep Running 24/7

**Using PM2 (Recommended):**

```bash
# Install PM2
npm install -g pm2

# macOS
sudo pm2 start server.js --name auraflow-print
sudo pm2 save
sudo pm2 startup

# Linux/Windows
pm2 start server.js --name auraflow-print
pm2 save
pm2 startup
```

---

### Run as System Service

**macOS:** See [MACOS_SETUP.md - LaunchDaemon](MACOS_SETUP.md)

**Linux (systemd):**

Create `/etc/systemd/system/auraflow-print.service`:

```ini
[Unit]
Description=AuraFlow Print Service
After=network.target

[Service]
Type=simple
User=auraflow
WorkingDirectory=/opt/auraflow-pos/backend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable auraflow-print
sudo systemctl start auraflow-print
sudo systemctl status auraflow-print
```

**Windows (NSSM):**

```powershell
# Download NSSM from nssm.cc
nssm install AuraFlowPrint "C:\Program Files\nodejs\node.exe" "C:\auraflow-pos\backend\server.js"
nssm start AuraFlowPrint
```

---

## Next Steps

- ✅ Backend running
- ✅ Printer added
- ✅ Test print works

**Now you can:**
- Print receipts from transactions
- Print kitchen tickets
- Print reports
- Print labels

**Learn more:**
- [Full documentation](README.md)
- [macOS setup details](MACOS_SETUP.md)
- [Deployment guide](DEPLOYMENT.md)

---

## Need Help?

### Check Logs

Backend logs show everything:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖨️  PRINT JOB RECEIVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Printer ID: printer-abc123
Address: 192.168.0.158
Port: 9100
📡 Connecting to 192.168.0.158:9100...
✅ Connected to printer
📤 Sending data...
✅ Data sent
✅ Print job completed successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If something fails, the logs will tell you exactly what went wrong!

---

### Common Issues

| Issue | OS | Solution |
|-------|-----|----------|
| EHOSTUNREACH | macOS | Use `sudo npm start` |
| Port 3001 in use | All | Kill existing process |
| Can't find printer | All | Verify IP with `ping` |
| Permission denied | Linux | Use `sudo` or set capabilities |
| Backend crashes | All | Check Node.js version (need 14+) |

---

## Summary

**macOS:** `sudo npm start`  
**Linux/Windows:** `npm start`  
**Done!** ✅

Network printing is now active and ready to use! 🎉
