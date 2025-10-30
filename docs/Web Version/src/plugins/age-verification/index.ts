import { Plugin } from '../../core/lib/types/plugin.types';

export const ageVerificationPlugin: Plugin = {
  id: 'age-verification',
  name: 'Age Verification',
  version: '1.0.0',
  description: 'Age verification for restricted products (alcohol, tobacco, etc.)',
  author: 'AuraFlow',
  tier: 'standard',
  recommendedFor: ['bar', 'pharmacy', 'retail', 'liquor'],
  
  features: {
    manualVerification: true,
    idScanning: true, // Requires hardware integration
    complianceLogging: true,
    multipleIDTypes: true,
    managerOverride: true,
  },
  
  config: {
    minimumAge: 21, // Configurable per region/product
    requireForAlcohol: true,
    requireForTobacco: true,
    logVerifications: true,
    checkEveryTransaction: false, // Once per customer session
    refusalLogging: true,
  },
  
  ui: {
    showAgePrompt: true,
    requireManagerOverride: false,
    supportedIDTypes: [
      "Driver's License",
      'Passport',
      'State ID',
      'Military ID',
    ],
  },
};

export { AgeVerificationDialog } from './components/AgeVerificationDialog';
export default ageVerificationPlugin;