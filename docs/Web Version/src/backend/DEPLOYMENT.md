# Backend Deployment Guide

## Deployment Options

Choose based on your setup:

---

## Option 1: Same Machine (Recommended for Single Terminal)

**Use case:** One computer running both POS frontend and print service

**Setup:**
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
npm run dev
```

**Configuration:** None needed - uses `http://localhost:3001` automatically

**Pros:**
- Simplest setup
- No network configuration
- Best for kiosks

**Cons:**
- Backend dies if terminal restarts

---

## Option 2: Dedicated Print Server (Recommended for Multiple Terminals)

**Use case:** Multiple POS terminals sharing one print service

**Setup:**

### On Print Server (e.g., 192.168.1.50):
```bash
cd backend
npm install
npm start
```

Keep this running 24/7 (or use PM2 - see below).

### On Each POS Terminal:
Create `.env` file:
```
VITE_PRINT_SERVICE_URL=http://192.168.1.50:3001
```

Restart frontend.

**Pros:**
- Centralized print management
- Terminals can restart without losing print service
- Easier updates

**Cons:**
- Requires dedicated machine
- Network dependency

---

## Option 3: PM2 (Process Manager)

**Use case:** Keep backend running in background, auto-restart on crashes

**Setup:**
```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
cd backend
pm2 start server.js --name auraflow-print

# Save process list (auto-starts on reboot)
pm2 save
pm2 startup
```

**Useful PM2 commands:**
```bash
pm2 status              # Check status
pm2 logs auraflow-print # View logs
pm2 restart auraflow-print  # Restart
pm2 stop auraflow-print     # Stop
pm2 delete auraflow-print   # Remove
```

---

## Option 4: Docker

**Use case:** Containerized deployment, cloud-ready

### Create Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

### Build and Run:
```bash
# Build image
docker build -t auraflow-print-service ./backend

# Run container
docker run -d \
  --name auraflow-print \
  -p 3001:3001 \
  --restart unless-stopped \
  auraflow-print-service

# View logs
docker logs -f auraflow-print
```

---

## Option 5: Windows Service

**Use case:** Run backend as Windows service

**Setup:**
```bash
# Install node-windows
npm install -g node-windows

# Create service installer script
```

Create `install-service.js`:
```javascript
const Service = require('node-windows').Service;

const svc = new Service({
  name: 'AuraFlow Print Service',
  description: 'Backend print service for AuraFlow POS',
  script: require('path').join(__dirname, 'server.js'),
  nodeOptions: ['--harmony', '--max_old_space_size=4096']
});

svc.on('install', () => {
  svc.start();
  console.log('Service installed and started');
});

svc.install();
```

```bash
# Run installer
node install-service.js
```

Service will start automatically on Windows boot.

---

## Option 6: Linux systemd Service

**Use case:** Run backend as Linux service

Create `/etc/systemd/system/auraflow-print.service`:
```ini
[Unit]
Description=AuraFlow Print Service
After=network.target

[Service]
Type=simple
User=pos
WorkingDirectory=/home/pos/auraflow-pos/backend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=auraflow-print

[Install]
WantedBy=multi-user.target
```

**Enable and start:**
```bash
sudo systemctl enable auraflow-print
sudo systemctl start auraflow-print

# Check status
sudo systemctl status auraflow-print

# View logs
sudo journalctl -u auraflow-print -f
```

---

## Option 7: Cloud Deployment (Advanced)

**Use case:** POS runs remotely, printers accessible via VPN

### Heroku:
```bash
# Install Heroku CLI
heroku login

# Create app
heroku create auraflow-print-service

# Deploy
git subtree push --prefix backend heroku main

# Set frontend env var
VITE_PRINT_SERVICE_URL=https://auraflow-print-service.herokuapp.com
```

### Railway:
```bash
# Install Railway CLI
railway login

# Deploy
cd backend
railway up

# Get URL and set in frontend
VITE_PRINT_SERVICE_URL=https://your-app.railway.app
```

⚠️ **Important:** Printer must be accessible from cloud server (requires VPN or port forwarding)

---

## Network Configuration

### Firewall Rules

**On Print Server:**
```bash
# Linux (ufw)
sudo ufw allow 3001/tcp

# Windows Firewall
netsh advfirewall firewall add rule name="AuraFlow Print" dir=in action=allow protocol=TCP localport=3001

# macOS
# System Preferences > Security & Privacy > Firewall > Options
# Add Node.js and allow incoming connections
```

### Printer Firewall

Ensure printer allows incoming connections on port 9100:
- Most printers allow this by default
- Check printer's network settings if issues occur

---

## Environment Variables

### Backend (.env)
```bash
PORT=3001                    # Server port
NODE_ENV=production          # production or development
API_KEY=your-secret-key      # Optional: Enable auth
LOG_LEVEL=info              # Log verbosity
```

### Frontend (.env)
```bash
VITE_PRINT_SERVICE_URL=http://localhost:3001    # Backend URL
```

---

## Security

### For Production:

1. **Enable HTTPS**
   ```bash
   # Use nginx as reverse proxy with SSL
   server {
     listen 443 ssl;
     server_name print.example.com;
     
     ssl_certificate /path/to/cert.pem;
     ssl_certificate_key /path/to/key.pem;
     
     location / {
       proxy_pass http://localhost:3001;
     }
   }
   ```

2. **Add API Key Authentication**
   
   Backend:
   ```javascript
   app.use((req, res, next) => {
     if (req.headers['x-api-key'] !== process.env.API_KEY) {
       return res.status(401).json({ error: 'Unauthorized' });
     }
     next();
   });
   ```
   
   Frontend (`printer.api.ts`):
   ```typescript
   headers: {
     'Content-Type': 'application/json',
     'X-API-Key': 'your-secret-key'
   }
   ```

3. **IP Whitelist**
   ```javascript
   const allowedIPs = ['192.168.1.10', '192.168.1.11'];
   
   app.use((req, res, next) => {
     const clientIP = req.ip || req.connection.remoteAddress;
     if (!allowedIPs.includes(clientIP)) {
       return res.status(403).json({ error: 'Forbidden' });
     }
     next();
   });
   ```

---

## Monitoring

### Health Checks

**Uptime monitoring:**
```bash
# Cron job to check health every 5 minutes
*/5 * * * * curl -f http://localhost:3001/api/health || systemctl restart auraflow-print
```

**External monitoring:**
- UptimeRobot (free)
- Pingdom
- StatusCake

### Logging

**PM2 logs:**
```bash
pm2 logs auraflow-print --lines 100
```

**Docker logs:**
```bash
docker logs -f --tail=100 auraflow-print
```

**systemd logs:**
```bash
sudo journalctl -u auraflow-print -f
```

---

## Troubleshooting

### Backend won't start
```bash
# Check port not in use
lsof -i :3001  # Linux/Mac
netstat -ano | findstr :3001  # Windows

# Kill process using port
kill -9 <PID>  # Linux/Mac
taskkill /F /PID <PID>  # Windows
```

### Can't connect from frontend
```bash
# Test backend is reachable
curl http://localhost:3001/api/health

# Test from another machine
curl http://192.168.1.50:3001/api/health

# Check firewall
sudo ufw status  # Linux
```

### Prints not working
```bash
# Test printer connection from backend server
telnet 192.168.1.100 9100

# If telnet works, backend can reach printer
# If telnet fails, check printer network settings
```

---

## Backup & Recovery

### Backup (if adding job queue/database later)
```bash
# Backup logs
tar -czf logs-backup-$(date +%Y%m%d).tar.gz logs/

# Backup config
cp .env .env.backup
```

### Recovery
```bash
# Restore from backup
cp .env.backup .env

# Restart service
pm2 restart auraflow-print
# or
sudo systemctl restart auraflow-print
```

---

## Performance Tuning

### Node.js Memory
```bash
# Increase heap size if needed
node --max-old-space-size=4096 server.js
```

### Connection Pooling (future enhancement)
For high-volume printing, implement connection pooling to reuse TCP connections.

---

## Recommended Setup by Business Size

| Business Size | Recommended Setup |
|--------------|-------------------|
| **Single terminal / Kiosk** | Option 1 (Same machine) + PM2 |
| **2-5 terminals** | Option 2 (Dedicated server) + PM2 |
| **6+ terminals** | Option 2 + Docker/systemd |
| **Multi-location** | Option 7 (Cloud) + VPN |
| **Enterprise** | Docker + Load balancer + Monitoring |

---

## Quick Start Commands by OS

### Windows
```bash
cd backend
npm install
npm install -g pm2
pm2 start server.js --name auraflow-print
pm2 save
pm2 startup
```

### Linux
```bash
cd backend
npm install
sudo npm install -g pm2
pm2 start server.js --name auraflow-print
pm2 save
pm2 startup
```

### macOS
```bash
cd backend
npm install
sudo npm install -g pm2
pm2 start server.js --name auraflow-print
pm2 save
pm2 startup
```

---

## Support Matrix

| Platform | Supported | Notes |
|----------|-----------|-------|
| Windows 10/11 | ✅ | Full support |
| Ubuntu 20.04+ | ✅ | Full support |
| macOS 11+ | ✅ | Full support |
| Docker | ✅ | Recommended for production |
| Heroku | ✅ | Requires printer VPN access |
| AWS EC2 | ✅ | Requires printer VPN access |
| Raspberry Pi | ✅ | Node.js 18+ required |

---

## Next Steps After Deployment

1. ✅ Backend deployed and running
2. ✅ Frontend configured with backend URL
3. ✅ Test print successful
4. 🔄 Set up monitoring
5. 🔄 Configure automatic backups
6. 🔄 Document printer IP addresses
7. 🔄 Train staff on troubleshooting

---

## Need Help?

Check:
1. Backend logs (see Monitoring section)
2. Frontend console (F12)
3. Network connectivity (`ping`, `telnet`)
4. Firewall rules

**Most common issues:**
1. Backend not running → Start with `npm start` or `pm2 start`
2. Wrong URL in frontend → Check `VITE_PRINT_SERVICE_URL`
3. Firewall blocking → Allow port 3001
4. Printer offline → Check printer power/network
