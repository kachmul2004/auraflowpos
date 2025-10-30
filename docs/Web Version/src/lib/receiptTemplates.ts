// Receipt Template System for AuraFlow POS

export type ReceiptTemplateId = 'classic' | 'modern' | 'compact' | 'branded';

export interface ReceiptTemplate {
  id: ReceiptTemplateId;
  name: string;
  description: string;
  preview: string;
  features: string[];
  bestFor: string[];
}

export interface ReceiptCustomization {
  templateId: ReceiptTemplateId;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  taxId: string;
  logoUrl?: string;
  showLogo: boolean;
  showTaxId: boolean;
  showThankYou: boolean;
  thankYouMessage: string;
  footerMessage: string;
  showQRCode: boolean;
  qrCodeUrl: string;
  primaryColor: string;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  paperWidth: '58mm' | '80mm';
  showBarcode: boolean;
  showSocialMedia: boolean;
  socialMediaHandles: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
}

export const RECEIPT_TEMPLATES: Record<ReceiptTemplateId, ReceiptTemplate> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional business receipt with clean, professional formatting',
    preview: '📄',
    features: [
      'Clean header with business info',
      'Traditional line-item layout',
      'Clear total breakdown',
      'Professional footer',
    ],
    bestFor: ['Retail stores', 'General businesses', 'Traditional shops'],
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Sleek, minimal design with modern typography and spacing',
    preview: '✨',
    features: [
      'Minimal, clean aesthetic',
      'Modern typography',
      'Generous white space',
      'QR code for digital receipt',
    ],
    bestFor: ['Cafes', 'Tech stores', 'Boutiques', 'Modern brands'],
  },
  compact: {
    id: 'compact',
    name: 'Compact',
    description: 'Space-efficient design perfect for thermal printers',
    preview: '📝',
    features: [
      'Optimized for 58mm printers',
      'Minimal paper usage',
      'Condensed information',
      'Fast printing',
    ],
    bestFor: ['Food trucks', 'Kiosks', 'Quick service', 'Mobile POS'],
  },
  branded: {
    id: 'branded',
    name: 'Branded',
    description: 'Logo-prominent design with brand colors and custom styling',
    preview: '🎨',
    features: [
      'Large logo display',
      'Custom brand colors',
      'Social media links',
      'Marketing message space',
    ],
    bestFor: ['Restaurants', 'Branded stores', 'Franchises', 'Marketing-focused'],
  },
};

export const DEFAULT_CUSTOMIZATION: ReceiptCustomization = {
  templateId: 'classic',
  businessName: 'AuraFlow POS Demo Store',
  businessAddress: '123 Main Street, New York, NY 10001',
  businessPhone: '(555) 123-4567',
  businessEmail: 'contact@auraflow.com',
  taxId: '12-3456789',
  showLogo: true,
  showTaxId: true,
  showThankYou: true,
  thankYouMessage: 'Thank you for your business!',
  footerMessage: 'Please visit us again soon.',
  showQRCode: true,
  qrCodeUrl: 'https://auraflow.com',
  primaryColor: '#3b82f6',
  accentColor: '#1e40af',
  fontSize: 'medium',
  paperWidth: '80mm',
  showBarcode: false,
  showSocialMedia: true,
  socialMediaHandles: {
    website: 'auraflow.com',
    instagram: '@auraflow',
  },
};

// Generate QR code data URL
export function generateQRCodeDataURL(data: string, size: number = 128): string {
  // In production, you'd use a QR code library like 'qrcode' or 'qr-code-styling'
  // For now, return placeholder
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}

// Generate barcode data URL for receipt number
export function generateBarcodeDataURL(receiptNumber: string): string {
  // In production, use a barcode library like 'jsbarcode'
  // For now, return placeholder
  return `https://barcode.tec-it.com/barcode.ashx?data=${receiptNumber}&code=Code128&translate-esc=on`;
}

// Format currency for receipts
export function formatReceiptCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Format date/time for receipts
export function formatReceiptDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

// Calculate receipt dimensions based on paper width
export function getReceiptDimensions(paperWidth: '58mm' | '80mm') {
  const widths = {
    '58mm': { pixels: 384, chars: 32 },
    '80mm': { pixels: 576, chars: 48 },
  };
  return widths[paperWidth];
}

// Truncate or pad text to fit receipt width
export function formatReceiptLine(
  text: string,
  maxChars: number,
  align: 'left' | 'center' | 'right' = 'left'
): string {
  if (text.length > maxChars) {
    return text.substring(0, maxChars - 3) + '...';
  }

  if (align === 'center') {
    const padding = Math.floor((maxChars - text.length) / 2);
    return ' '.repeat(padding) + text;
  }

  if (align === 'right') {
    return text.padStart(maxChars, ' ');
  }

  return text;
}

// Generate receipt print styles based on template
export function getReceiptStyles(customization: ReceiptCustomization): string {
  const { templateId, primaryColor, accentColor, fontSize } = customization;
  
  const fontSizes = {
    small: { base: '11px', header: '14px', title: '16px' },
    medium: { base: '12px', header: '16px', title: '18px' },
    large: { base: '14px', header: '18px', title: '20px' },
  };
  
  const sizes = fontSizes[fontSize];
  
  return `
    @media print {
      @page {
        size: ${customization.paperWidth} auto;
        margin: 0;
      }
      body {
        font-family: 'Courier New', monospace;
        font-size: ${sizes.base};
        line-height: 1.4;
      }
    }
    
    .receipt-container {
      width: 100%;
      max-width: ${customization.paperWidth === '58mm' ? '58mm' : '80mm'};
      margin: 0 auto;
      padding: 8mm;
      background: white;
      color: black;
    }
    
    .receipt-header {
      text-align: center;
      margin-bottom: 4mm;
      border-bottom: 1px dashed #000;
      padding-bottom: 4mm;
    }
    
    .receipt-logo {
      max-width: 30mm;
      max-height: 20mm;
      margin: 0 auto 2mm;
    }
    
    .receipt-business-name {
      font-size: ${sizes.title};
      font-weight: bold;
      margin-bottom: 1mm;
    }
    
    .receipt-business-info {
      font-size: ${sizes.base};
      line-height: 1.3;
    }
    
    .receipt-items {
      margin: 4mm 0;
      border-bottom: 1px dashed #000;
      padding-bottom: 4mm;
    }
    
    .receipt-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2mm;
    }
    
    .receipt-totals {
      margin: 4mm 0;
    }
    
    .receipt-total-line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1mm;
    }
    
    .receipt-total-line.grand-total {
      font-weight: bold;
      font-size: ${sizes.header};
      border-top: 1px solid #000;
      padding-top: 2mm;
      margin-top: 2mm;
    }
    
    .receipt-footer {
      text-align: center;
      margin-top: 4mm;
      border-top: 1px dashed #000;
      padding-top: 4mm;
    }
    
    .receipt-qr-code {
      margin: 4mm auto;
      display: block;
    }
    
    .receipt-thank-you {
      font-size: ${sizes.header};
      font-weight: bold;
      margin-bottom: 2mm;
    }
    
    /* Template-specific styles */
    ${templateId === 'modern' ? `
      .receipt-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .receipt-header {
        border-bottom: 2px solid ${primaryColor};
      }
      .receipt-business-name {
        color: ${primaryColor};
      }
    ` : ''}
    
    ${templateId === 'branded' ? `
      .receipt-header {
        background: linear-gradient(135deg, ${primaryColor}, ${accentColor});
        color: white;
        padding: 4mm;
        margin: -8mm -8mm 4mm -8mm;
        border-bottom: none;
      }
      .receipt-business-name,
      .receipt-business-info {
        color: white;
      }
    ` : ''}
    
    ${templateId === 'compact' ? `
      .receipt-container {
        padding: 4mm;
        font-size: ${fontSizes.small.base};
      }
      .receipt-header,
      .receipt-items,
      .receipt-footer {
        margin: 2mm 0;
        padding: 2mm 0;
      }
    ` : ''}
  `;
}
