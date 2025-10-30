import { Plugin } from '../../core/lib/types/plugin.types';

export const barcodeScannerPlugin: Plugin = {
  id: 'barcode-scanner',
  name: 'Barcode Scanner',
  version: '1.0.0',
  description: 'Scan product barcodes with USB scanner or manual entry for quick product lookup',
  author: 'AuraFlow',
  
  config: {
    features: {
      autoLookup: true,
      soundEffects: true,
      multiScan: true,
      manualEntry: true,
      usbScanner: true,
      scanHistory: true,
    },
    scanner: {
      codeTypes: ['EAN13', 'UPC', 'CODE128', 'QR', 'EAN8', 'CODE39'],
      timeout: 5000,
      historyLimit: 50,
    },
  },
  
  recommendedFor: ['retail', 'pharmacy', 'grocery', 'restaurant'],
  tier: 'standard',
};

// Export components
export { BarcodeScannerDialog } from './components/BarcodeScannerDialog';

export default barcodeScannerPlugin;