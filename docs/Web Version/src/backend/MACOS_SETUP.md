# macOS Network Printing Setup Guide

## The Issue

When running the AuraFlow POS print backend on **macOS**, you may encounter this error:

```
❌ Socket error: connect EHOSTUNREACH 192.168.x.x:9100
```

This happens even when:
- ✅ You can ping the printer: `ping 192.168.x.x`
- ✅ Port 9100 is accessible: `nc -zv 192.168.x.x 9100`
- ✅ The printer is working fine

---

## Why This Happens

macOS has **process-level network security restrictions** that prevent regular user applications from connecting to certain network ports, including **port 9100** (the standard RAW printing port).

**System tools work, Node.js doesn't:**
- `nc`, `telnet`, `curl` → Have special system permissions ✅
- Node.js scripts → Blocked by macOS security ❌

This is a macOS-specific security feature to protect against malicious network access.

---

## Solution: Run with sudo

The simplest solution is to run the backend with elevated permissions:

```bash
cd backend
sudo npm start
```

### Why sudo?

- Grants Node.js temporary elevated network permissions
- Allows connection to port 9100 on network devices
- Only needed for the backend server, not the frontend
- Safe for development and production use

---

## Alternative: Grant Permanent Permissions

If you don't want to use `sudo` every time, you can grant Node.js permanent network capabilities:

### Option 1: Using `setcap` (if available)

```bash
# Grant Node.js network capabilities
sudo setcap 'cap_net_bind_service=+ep' $(which node)

# Now run without sudo
cd backend
npm start
```

**Note:** `setcap` may not be available on all macOS versions. If it fails, use sudo instead.

---

### Option 2: Disable Firewall (Not Recommended)

```bash
# Temporarily disable macOS firewall (for testing only)
sudo pfctl -d

# Run backend
npm start

# Re-enable firewall
sudo pfctl -e
```

⚠️ **Warning:** This disables your entire firewall. Only use for testing!

---

## Verification Steps

### 1. Test Your Printer Connection

Before running the backend, verify the printer is reachable:

```bash
# Test 1: Ping the printer
ping 192.168.x.x

# Expected: Reply from 192.168.x.x
```

```bash
# Test 2: Check port 9100
nc -zv 192.168.x.x 9100

# Expected: Connection to 192.168.x.x port 9100 [tcp/hp-pdl-datastr] succeeded!
```

---

### 2. Run the Backend Test Script

```bash
cd backend
sudo node test-connection.js
```

This will run 4 connection tests and show you exactly where the issue is.

---

### 3. Start the Backend Server

```bash
cd backend
sudo npm start
```

You should see:
```
╔════════════════════════════════════��═══════════╗
║     🖨️  AuraFlow POS - Print Service 🖨️       ║
╚════════════════════════════════════════════════╝

✅ Server running on http://localhost:3001

🔌 Ready to receive print jobs...
```

---

### 4. Test Print from Frontend

1. Open AuraFlow POS in your browser
2. Go to **Admin → Hardware Management**
3. Add your network printer
4. Click **Test Print**

You should see in the backend terminal:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖨️  PRINT JOB RECEIVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Address: 192.168.x.x
Port: 9100
📡 Connecting to 192.168.x.x:9100...
✅ Connected to printer
📤 Sending data...
✅ Data sent
✅ Print job completed successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

And your printer should print! 🎉

---

## Production Deployment on macOS

### Option 1: Run as System Service with sudo

Create a LaunchDaemon that runs with elevated permissions:

```bash
# Create service file
sudo nano /Library/LaunchDaemons/com.auraflow.print.plist
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.auraflow.print</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/path/to/auraflow-pos/backend/server.js</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>WorkingDirectory</key>
    <string>/path/to/auraflow-pos/backend</string>
    <key>StandardOutPath</key>
    <string>/var/log/auraflow-print.log</string>
    <key>StandardErrorPath</key>
    <string>/var/log/auraflow-print-error.log</string>
</dict>
</plist>
```

```bash
# Load the service
sudo launchctl load /Library/LaunchDaemons/com.auraflow.print.plist

# Check status
sudo launchctl list | grep auraflow
```

---

### Option 2: Use PM2 with sudo

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start with PM2
cd backend
sudo pm2 start server.js --name auraflow-print

# Save PM2 config
sudo pm2 save

# Set PM2 to start on boot
sudo pm2 startup
```

---

## Common Questions

### Q: Do I need sudo for the frontend?

**No.** Only the backend needs sudo. The frontend runs in the browser and doesn't access the printer directly.

### Q: Is it safe to run Node.js with sudo?

**Yes**, for a dedicated print server. The backend only:
- Listens on port 3001 (HTTP)
- Connects to printer on port 9100 (TCP)
- Has no file system access beyond its own directory
- Doesn't execute user input

For extra security, you can run it in a Docker container.

### Q: Why doesn't this happen on Windows/Linux?

Different operating systems have different network security models:
- **macOS**: Process-level restrictions on specific ports
- **Linux**: Generally more permissive, but may require firewall rules
- **Windows**: Firewall prompts for network access

### Q: Can I use a different port?

Port 9100 is the **standard RAW printing port** for network printers. While some printers support other ports, 9100 is universal and supported by virtually all network receipt printers.

### Q: Does this affect USB printers?

**No.** This only affects **network printers** via TCP/IP. USB printing uses different system APIs that don't have the same restrictions.

---

## Alternative: Deploy on Linux

If the macOS restrictions are problematic, consider running the backend on:
- **Linux server** (local network)
- **Docker container** (any OS)
- **Raspberry Pi** (dedicated print server)
- **Cloud VM** (if printer accessible via VPN)

The backend is platform-independent and works great on Linux without sudo.

---

## Summary

✅ **macOS blocks Node.js from port 9100**  
✅ **Solution: Run backend with `sudo npm start`**  
✅ **Only affects backend, not frontend**  
✅ **Safe for development and production**  
✅ **Alternative: Deploy on Linux**

---

## Need Help?

If you're still having issues:

1. Run `sudo node backend/test-connection.js` and check output
2. Verify printer IP with `ping` and `nc -zv`
3. Check backend logs when running with sudo
4. Ensure printer supports network printing (port 9100)

The backend has comprehensive logging that will show exactly where the connection fails! 🔍
