/**
 * Simple test script to debug printer connection
 * Run: node backend/test-connection.js
 */

const net = require('net');
const dns = require('dns');
const os = require('os');

const PRINTER_IP = '192.168.0.158';
const PRINTER_PORT = 9100;

console.log('╔════════════════════════════════════════════════╗');
console.log('║   🔍 Network Printer Connection Test          ║');
console.log('╚════════════════════════════════════════════════╝\n');

console.log('Target: ' + PRINTER_IP + ':' + PRINTER_PORT);
console.log('');

// Show local network interfaces
console.log('📍 Local Network Interfaces:');
const interfaces = os.networkInterfaces();
Object.keys(interfaces).forEach(name => {
  interfaces[name].forEach(iface => {
    if (iface.family === 'IPv4' && !iface.internal) {
      console.log(`   ${name}: ${iface.address}`);
    }
  });
});
console.log('');

// Test 1: DNS Resolution
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 1: DNS Resolution');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
dns.lookup(PRINTER_IP, { family: 4 }, (err, address, family) => {
  if (err) {
    console.log('❌ DNS lookup failed:', err.message);
  } else {
    console.log(`✅ DNS resolved: ${PRINTER_IP} -> ${address} (IPv${family})`);
  }
  console.log('');

  // Test 2: Basic Socket Connection (no options)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 2: Basic Connection (no options)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const client1 = new net.Socket();
  client1.setTimeout(5000);
  
  client1.connect(PRINTER_PORT, PRINTER_IP, () => {
    console.log('✅ Connected successfully!');
    client1.destroy();
    runTest3();
  });
  
  client1.on('error', (err) => {
    console.log('❌ Connection failed:', err.message);
    console.log('   Error code:', err.code);
    runTest3();
  });
  
  client1.on('timeout', () => {
    console.log('❌ Connection timeout');
    client1.destroy();
    runTest3();
  });
});

// Test 3: Connection with IPv4 forced
function runTest3() {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 3: Connection with IPv4 forced');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const client2 = new net.Socket();
  client2.setTimeout(5000);
  
  const options = {
    port: PRINTER_PORT,
    host: PRINTER_IP,
    family: 4
  };
  
  console.log('Options:', JSON.stringify(options, null, 2));
  
  client2.connect(options, () => {
    console.log('✅ Connected successfully!');
    
    // Try sending some data
    console.log('📤 Sending test data...');
    client2.write('TEST PRINT\n\n\n');
    
    setTimeout(() => {
      console.log('✅ Test complete');
      client2.destroy();
      runTest4();
    }, 1000);
  });
  
  client2.on('error', (err) => {
    console.log('❌ Connection failed:', err.message);
    console.log('   Error code:', err.code);
    console.log('   Full error:', err);
    runTest4();
  });
  
  client2.on('timeout', () => {
    console.log('❌ Connection timeout');
    client2.destroy();
    runTest4();
  });
}

// Test 4: Connection with all options
function runTest4() {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 4: Connection with keep-alive');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const client3 = new net.Socket();
  client3.setTimeout(5000);
  client3.setKeepAlive(true, 1000);
  client3.setNoDelay(true);
  
  const options = {
    port: PRINTER_PORT,
    host: PRINTER_IP,
    family: 4
  };
  
  client3.connect(options, () => {
    console.log('✅ Connected successfully!');
    console.log('✅ All tests passed!');
    client3.destroy();
    process.exit(0);
  });
  
  client3.on('error', (err) => {
    console.log('❌ Connection failed:', err.message);
    console.log('');
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   ❌ CONNECTION FAILED                         ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log('');
    console.log('Possible causes:');
    console.log('1. macOS Firewall blocking Node.js');
    console.log('2. Network routing issue');
    console.log('3. Printer firewall');
    console.log('');
    console.log('Try:');
    console.log('- Check System Preferences > Security > Firewall');
    console.log('- Run: sudo pfctl -d (disable firewall temporarily)');
    console.log('- Check printer network settings');
    process.exit(1);
  });
  
  client3.on('timeout', () => {
    console.log('❌ Connection timeout');
    client3.destroy();
    process.exit(1);
  });
}
