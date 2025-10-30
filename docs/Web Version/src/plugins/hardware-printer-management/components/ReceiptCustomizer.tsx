import React, { useState } from 'react';
import { useStore } from '../../../lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Upload,
  Save,
  RotateCcw,
  Eye,
  Image as ImageIcon,
  FileText,
  Printer,
  Check,
  Info,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SimpleReceiptSettings {
  businessName: string;
  businessAddress: string;
  businessCity: string;
  businessPhone: string;
  businessEmail: string;
  taxId: string;
  headerText: string;
  footerText: string;
  logoBase64: string;
  paperSize: '58mm' | '80mm';
  fontSize: 'small' | 'normal' | 'large';
  showLogo: boolean;
  showTaxId: boolean;
  showQrCode: boolean;
  showBarcode: boolean;
}

const DEFAULT_SETTINGS: SimpleReceiptSettings = {
  businessName: 'AuraFlow POS',
  businessAddress: '123 Main Street',
  businessCity: 'City, State 12345',
  businessPhone: '(555) 123-4567',
  businessEmail: 'contact@auraflow.com',
  taxId: 'Tax ID: 12-3456789',
  headerText: 'Thank you for your visit!',
  footerText: 'Please come again!\nwww.auraflow.com',
  logoBase64: '',
  paperSize: '80mm',
  fontSize: 'normal',
  showLogo: true,
  showTaxId: true,
  showQrCode: false,
  showBarcode: true,
};

export function ReceiptCustomizer() {
  const { receiptSettings, updateReceiptSettings, printers } = useStore();
  
  // Ensure all settings have default values
  const initialSettings = {
    ...DEFAULT_SETTINGS,
    ...(receiptSettings || {}),
  };
  
  const [settings, setSettings] = useState<SimpleReceiptSettings>(initialSettings);
  const [showPreview, setShowPreview] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const receiptPrinters = printers.filter(p => p.type === 'receipt' && p.enabled);

  const handleChange = (field: keyof SimpleReceiptSettings, value: any) => {
    setSettings({ ...settings, [field]: value });
    setHasChanges(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo file size must be less than 2MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      handleChange('logoBase64', base64);
      toast.success('Logo uploaded successfully');
    };
    reader.onerror = () => {
      toast.error('Failed to upload logo');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    handleChange('logoBase64', '');
    toast.success('Logo removed');
  };

  const handleSave = () => {
    updateReceiptSettings(settings);
    setHasChanges(false);
    toast.success('Receipt settings saved');
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
    toast.success('Settings reset to defaults');
  };

  const handleTestPrint = async () => {
    if (receiptPrinters.length === 0) {
      toast.error('No receipt printers configured');
      return;
    }

    toast.success('Test receipt sent to printer');
    // In real implementation, this would call the printer service
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Settings */}
      <div className="space-y-6">
        {/* Info Banner */}
        <Alert className="bg-blue-500/10 border-blue-500/20">
          <Info className="w-4 h-4 text-blue-500" />
          <AlertDescription className="text-sm">
            <strong>Receipt Customization:</strong> Customize your receipt design including logo, 
            business information, and header/footer text. Changes apply to all receipt printers.
          </AlertDescription>
        </Alert>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Business Information
            </CardTitle>
            <CardDescription>
              This information appears on every receipt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={settings.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                placeholder="Your Business Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress">Address</Label>
              <Input
                id="businessAddress"
                value={settings.businessAddress}
                onChange={(e) => handleChange('businessAddress', e.target.value)}
                placeholder="Street Address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessCity">City, State, ZIP</Label>
              <Input
                id="businessCity"
                value={settings.businessCity}
                onChange={(e) => handleChange('businessCity', e.target.value)}
                placeholder="City, State ZIP"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessPhone">Phone</Label>
                <Input
                  id="businessPhone"
                  value={settings.businessPhone}
                  onChange={(e) => handleChange('businessPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessEmail">Email</Label>
                <Input
                  id="businessEmail"
                  value={settings.businessEmail}
                  onChange={(e) => handleChange('businessEmail', e.target.value)}
                  placeholder="email@business.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID (Optional)</Label>
              <Input
                id="taxId"
                value={settings.taxId}
                onChange={(e) => handleChange('taxId', e.target.value)}
                placeholder="Tax ID: XX-XXXXXXX"
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Receipt Logo
            </CardTitle>
            <CardDescription>
              Upload your business logo (max 2MB, recommended 300x300px)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.logoBase64 ? (
              <div className="space-y-3">
                <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={settings.logoBase64}
                    alt="Receipt Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveLogo}
                    className="flex-1"
                  >
                    Remove Logo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    className="flex-1"
                  >
                    Change Logo
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 2MB
                </p>
              </div>
            )}
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </CardContent>
        </Card>

        {/* Header & Footer */}
        <Card>
          <CardHeader>
            <CardTitle>Header & Footer Text</CardTitle>
            <CardDescription>
              Custom text that appears at the top and bottom of receipts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="headerText">Header Text</Label>
              <Textarea
                id="headerText"
                value={settings.headerText}
                onChange={(e) => handleChange('headerText', e.target.value)}
                placeholder="Thank you for your visit!"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Appears below business info, above items
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="footerText">Footer Text</Label>
              <Textarea
                id="footerText"
                value={settings.footerText}
                onChange={(e) => handleChange('footerText', e.target.value)}
                placeholder="Please come again!"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Appears at the bottom of receipt. Use \n for new lines.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Receipt Options */}
        <Card>
          <CardHeader>
            <CardTitle>Receipt Options</CardTitle>
            <CardDescription>
              Configure receipt format and display options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paperSize">Paper Size</Label>
                <Select
                  value={settings.paperSize}
                  onValueChange={(value: any) => handleChange('paperSize', value)}
                >
                  <SelectTrigger id="paperSize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="58mm">58mm (2.3 inch)</SelectItem>
                    <SelectItem value="80mm">80mm (3.15 inch)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select
                  value={settings.fontSize}
                  onValueChange={(value: any) => handleChange('fontSize', value)}
                >
                  <SelectTrigger id="fontSize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="showLogo" className="cursor-pointer">
                  Show Logo on Receipt
                </Label>
                <input
                  id="showLogo"
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer"
                  checked={settings.showLogo}
                  onChange={(e) => handleChange('showLogo', e.target.checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showTaxId" className="cursor-pointer">
                  Show Tax ID
                </Label>
                <input
                  id="showTaxId"
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer"
                  checked={settings.showTaxId}
                  onChange={(e) => handleChange('showTaxId', e.target.checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showBarcode" className="cursor-pointer">
                  Show Order Barcode
                </Label>
                <input
                  id="showBarcode"
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer"
                  checked={settings.showBarcode}
                  onChange={(e) => handleChange('showBarcode', e.target.checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showQrCode" className="cursor-pointer">
                  Show QR Code (Feedback/Survey)
                </Label>
                <input
                  id="showQrCode"
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer"
                  checked={settings.showQrCode}
                  onChange={(e) => handleChange('showQrCode', e.target.checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
          <Button
            variant="outline"
            onClick={handleTestPrint}
            disabled={receiptPrinters.length === 0}
          >
            <Printer className="w-4 h-4 mr-2" />
            Test Print
          </Button>
        </div>
      </div>

      {/* Right Column - Live Preview */}
      <div className="space-y-4">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Live Preview</span>
              <Badge variant="secondary">{settings.paperSize}</Badge>
            </CardTitle>
            <CardDescription>
              Preview how your receipt will look
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className={`mx-auto bg-white text-black font-mono text-sm overflow-hidden shadow-lg ${
                settings.paperSize === '58mm' ? 'max-w-[220px]' : 'max-w-[300px]'
              }`}
              style={{
                fontSize: settings.fontSize === 'small' ? '11px' : settings.fontSize === 'large' ? '15px' : '13px',
              }}
            >
              {/* Receipt Content */}
              <div className="p-4 space-y-2">
                {/* Logo */}
                {settings.showLogo && settings.logoBase64 && (
                  <div className="flex justify-center mb-3">
                    <img
                      src={settings.logoBase64}
                      alt="Logo"
                      className="max-h-16 object-contain"
                    />
                  </div>
                )}

                {/* Business Info */}
                <div className="text-center space-y-1 border-b border-dashed border-gray-400 pb-2">
                  <div className="font-bold">{settings.businessName}</div>
                  <div className="text-xs">{settings.businessAddress}</div>
                  <div className="text-xs">{settings.businessCity}</div>
                  <div className="text-xs">{settings.businessPhone}</div>
                  <div className="text-xs">{settings.businessEmail}</div>
                  {settings.showTaxId && settings.taxId && (
                    <div className="text-xs">{settings.taxId}</div>
                  )}
                </div>

                {/* Header Text */}
                {settings.headerText && (
                  <div className="text-center text-xs border-b border-dashed border-gray-400 pb-2">
                    {settings.headerText}
                  </div>
                )}

                {/* Order Info */}
                <div className="text-xs space-y-1 border-b border-dashed border-gray-400 pb-2">
                  <div className="flex justify-between">
                    <span>Order #1234</span>
                    <span>12/25/2025 2:30 PM</span>
                  </div>
                  <div>Cashier: John Doe</div>
                </div>

                {/* Sample Items */}
                <div className="space-y-1 border-b border-dashed border-gray-400 pb-2">
                  <div className="flex justify-between text-xs">
                    <span>2x Coffee</span>
                    <span>$6.00</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>1x Sandwich</span>
                    <span>$8.50</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>1x Salad</span>
                    <span>$7.00</span>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-1 text-xs border-b border-dashed border-gray-400 pb-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>$21.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>$1.72</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>TOTAL:</span>
                    <span>$23.22</span>
                  </div>
                </div>

                {/* Payment */}
                <div className="text-xs space-y-1 border-b border-dashed border-gray-400 pb-2">
                  <div className="flex justify-between">
                    <span>Cash:</span>
                    <span>$25.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Change:</span>
                    <span>$1.78</span>
                  </div>
                </div>

                {/* Footer Text */}
                {settings.footerText && (
                  <div className="text-center text-xs border-b border-dashed border-gray-400 pb-2">
                    {settings.footerText.split('\\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                )}

                {/* Barcode */}
                {settings.showBarcode && (
                  <div className="flex justify-center py-2">
                    <div className="bg-black h-12 w-32 flex items-center justify-center text-white text-[10px]">
                      *1234*
                    </div>
                  </div>
                )}

                {/* QR Code */}
                {settings.showQrCode && (
                  <div className="flex flex-col items-center space-y-1 py-2">
                    <div className="bg-black h-16 w-16" />
                    <div className="text-[10px] text-center">
                      Scan for feedback
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Reminder */}
        {hasChanges && (
          <Alert className="bg-amber-500/10 border-amber-500/20">
            <Info className="w-4 h-4 text-amber-500" />
            <AlertDescription className="text-sm">
              <strong>Unsaved changes:</strong> Click "Save Settings" to apply your changes.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}