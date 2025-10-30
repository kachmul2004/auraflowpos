/**
 * Printer API
 * Handles communication with the backend print service
 */

export interface PrintRequest {
  printerId: string;
  content: string;
  printerAddress: string;
  printerPort: number;
  contentType: 'escpos' | 'text' | 'raw';
}

export interface PrintResponse {
  success: boolean;
  message: string;
  jobId?: string;
  error?: string;
}

export interface PrinterStatusResponse {
  online: boolean;
  address: string;
  port: number;
  lastChecked: string;
  error?: string;
}

/**
 * Send print job to backend service
 */
export async function sendPrintJob(request: PrintRequest): Promise<PrintResponse> {
  console.log('🌐 sendPrintJob() - Sending to backend');
  console.log('   Request:', request);

  const BACKEND_URL = getBackendUrl();
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/print`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    console.log('   Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('   ❌ Backend error:', errorData);
      throw new Error(errorData.error || `Print failed: ${response.statusText}`);
    }

    const data: PrintResponse = await response.json();
    console.log('   ✅ Success:', data);
    return data;
    
  } catch (error: any) {
    console.error('   ❌ Network error:', error);
    
    // Check if backend is unreachable
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error(
        'Cannot connect to print service. Make sure the backend is running at ' + BACKEND_URL
      );
    }
    
    throw error;
  }
}

/**
 * Check printer status via backend
 */
export async function checkPrinterStatus(
  address: string,
  port: number = 9100
): Promise<PrinterStatusResponse> {
  console.log('🔍 checkPrinterStatus() - Checking printer');
  console.log('   Address:', address);
  console.log('   Port:', port);

  const BACKEND_URL = getBackendUrl();
  
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/printer/status?address=${encodeURIComponent(address)}&port=${port}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('   ❌ Status check failed:', errorData);
      throw new Error(errorData.error || 'Status check failed');
    }

    const data: PrinterStatusResponse = await response.json();
    console.log('   Status:', data);
    return data;
    
  } catch (error: any) {
    console.error('   ❌ Error:', error);
    
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      return {
        online: false,
        address,
        port,
        lastChecked: new Date().toISOString(),
        error: 'Backend service not reachable',
      };
    }
    
    return {
      online: false,
      address,
      port,
      lastChecked: new Date().toISOString(),
      error: error.message,
    };
  }
}

/**
 * Get backend URL from environment or default
 */
function getBackendUrl(): string {
  // Check environment variable
  if (typeof process !== 'undefined' && process.env?.VITE_PRINT_SERVICE_URL) {
    return process.env.VITE_PRINT_SERVICE_URL;
  }
  
  // Default to localhost for development
  return 'http://localhost:3001';
}

/**
 * Test if backend is reachable
 */
export async function testBackendConnection(): Promise<boolean> {
  const BACKEND_URL = getBackendUrl();
  console.log('🔌 Testing backend connection:', BACKEND_URL);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
    });
    
    const isHealthy = response.ok;
    console.log('   Backend status:', isHealthy ? '✅ Healthy' : '❌ Unhealthy');
    return isHealthy;
    
  } catch (error) {
    console.error('   ❌ Backend unreachable:', error);
    return false;
  }
}
