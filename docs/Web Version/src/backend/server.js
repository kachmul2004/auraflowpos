/**
 * AuraFlow POS - Print Service Backend
 * 
 * Simple Node.js backend service that receives print jobs from the frontend
 * and sends them to network printers via TCP/IP (port 9100).
 * 
 * SETUP:
 * 1. npm install express cors
 * 2. node backend/server.js
 * 3. Runs on http://localhost:3001
 */

const express = require('express');
const cors = require('cors');
const net = require('net');
const dns = require('dns');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'AuraFlow Print Service',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/print
 * Send a print job to a network printer
 */
app.post('/api/print', async (req, res) => {
  const { printerId, content, printerAddress, printerPort, contentType } = req.body;

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🖨️  PRINT JOB RECEIVED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Printer ID:', printerId);
  console.log('Address:', printerAddress);
  console.log('Port:', printerPort);
  console.log('Content Type:', contentType);
  console.log('Content Length:', content.length, 'characters');
  console.log('─────────────────────────────────────────');

  // Validation
  if (!printerAddress) {
    console.error('❌ Missing printer address');
    return res.status(400).json({ 
      success: false, 
      error: 'Printer address is required' 
    });
  }

  if (!content) {
    console.error('❌ Missing content');
    return res.status(400).json({ 
      success: false, 
      error: 'Content is required' 
    });
  }

  const port = printerPort || 9100;

  try {
    // Send to printer
    await sendToPrinter(printerAddress, port, content);
    
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('✅ Print job completed successfully');
    console.log('Job ID:', jobId);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.json({ 
      success: true, 
      message: 'Print job sent successfully',
      jobId: jobId
    });
    
  } catch (error) {
    console.error('❌ Print job failed:', error.message);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * GET /api/printer/status
 * Check if a printer is online and reachable
 */
app.get('/api/printer/status', async (req, res) => {
  const { address, port = 9100 } = req.query;

  console.log('🔍 Checking printer status:', address, ':', port);

  if (!address) {
    return res.status(400).json({ 
      success: false, 
      error: 'Printer address is required' 
    });
  }

  try {
    const isOnline = await checkPrinterConnection(address, parseInt(port));
    
    console.log('   Status:', isOnline ? '✅ Online' : '❌ Offline');
    
    res.json({
      online: isOnline,
      address: address,
      port: parseInt(port),
      lastChecked: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('   ❌ Status check failed:', error.message);
    
    res.json({
      online: false,
      address: address,
      port: parseInt(port),
      lastChecked: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * Send data to printer via TCP socket
 */
function sendToPrinter(address, port, content) {
  return new Promise((resolve, reject) => {
    console.log(`📡 Connecting to ${address}:${port}...`);
    
    // First, resolve the DNS to ensure we have the right IP
    dns.lookup(address, { family: 4 }, (err, resolvedAddress, family) => {
      if (err) {
        console.error('❌ DNS lookup failed:', err.message);
        console.log('   Attempting direct connection anyway...');
      } else {
        console.log(`🔍 DNS resolved: ${address} -> ${resolvedAddress} (IPv${family})`);
      }
      
      const targetAddress = resolvedAddress || address;
      
      const client = new net.Socket();
      let connected = false;
      
      // Set timeout (10 seconds)
      client.setTimeout(10000);
      
      // Enable keep-alive
      client.setKeepAlive(true, 1000);
      
      // Disable Nagle's algorithm for immediate sending
      client.setNoDelay(true);
      
      // IMPORTANT: Force IPv4 and set socket options for macOS compatibility
      const options = {
        port: port,
        host: targetAddress,
        family: 4,  // Force IPv4
        localAddress: undefined,  // Let system choose
        hints: dns.ADDRCONFIG  // Only use addresses configured on the system
      };
      
      console.log('🔧 Socket options:', JSON.stringify(options, null, 2));
      console.log('📍 Local network interfaces:');
      const interfaces = os.networkInterfaces();
      Object.keys(interfaces).forEach(name => {
        interfaces[name].forEach(iface => {
          if (iface.family === 'IPv4' && !iface.internal) {
            console.log(`   ${name}: ${iface.address}`);
          }
        });
      });
      
      // Connection established
      client.connect(options, () => {
        connected = true;
        console.log('✅ Connected to printer');
        console.log('📤 Sending data...');
        
        // Send the content
        client.write(content);
        
        // For ESC/POS printers, add paper cut command if not already present
        if (!content.includes('\x1d\x56')) {
          client.write('\n\n\n');  // Feed paper
          client.write('\x1d\x56\x00');  // Partial cut
        }
        
        console.log('✅ Data sent');
      });
      
      // Data received from printer (usually printer status)
      client.on('data', (data) => {
        console.log('📥 Received from printer:', data.length, 'bytes');
      });
      
      // Connection closed
      client.on('close', () => {
        console.log('🔌 Connection closed');
        if (connected) {
          resolve();
        }
      });
      
      // Connection ended
      client.on('end', () => {
        console.log('🔚 Connection ended');
        if (connected) {
          resolve();
        }
      });
      
      // Error handling
      client.on('error', (err) => {
        console.error('❌ Socket error:', err.message);
        console.error('   Error code:', err.code);
        console.error('   Error errno:', err.errno);
        console.error('   Full error:', err);
        reject(new Error(`Failed to connect to printer: ${err.message}`));
      });
      
      // Timeout handling
      client.on('timeout', () => {
        console.error('❌ Connection timeout');
        client.destroy();
        reject(new Error('Connection to printer timed out'));
      });
    });
  });
}

/**
 * Check if printer is reachable (quick connection test)
 */
function checkPrinterConnection(address, port) {
  return new Promise((resolve) => {
    const client = new net.Socket();
    
    // Short timeout for status check
    client.setTimeout(3000);
    
    // Force IPv4
    const options = {
      port: port,
      host: address,
      family: 4
    };
    
    client.connect(options, () => {
      client.destroy();
      resolve(true);
    });
    
    client.on('error', () => {
      resolve(false);
    });
    
    client.on('timeout', () => {
      client.destroy();
      resolve(false);
    });
  });
}

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║                                                ║');
  console.log('║     🖨️  AuraFlow POS - Print Service 🖨️       ║');
  console.log('║                                                ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('');
  console.log('📋 Endpoints:');
  console.log(`   GET  /api/health          - Health check`);
  console.log(`   POST /api/print           - Send print job`);
  console.log(`   GET  /api/printer/status  - Check printer status`);
  console.log('');
  console.log('🔌 Ready to receive print jobs...');
  console.log('');
});
