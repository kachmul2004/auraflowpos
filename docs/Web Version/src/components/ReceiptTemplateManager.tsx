import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Receipt, Eye, Palette, Settings2, Upload, Download } from 'lucide-react';
import {
  RECEIPT_TEMPLATES,
  DEFAULT_CUSTOMIZATION,
  ReceiptCustomization,
  ReceiptTemplateId,
} from '../lib/receiptTemplates';
import { ClassicTemplate } from './receipt-templates/ClassicTemplate';
import { ModernTemplate } from './receipt-templates/ModernTemplate';
import { CompactTemplate } from './receipt-templates/CompactTemplate';
import { BrandedTemplate } from './receipt-templates/BrandedTemplate';
import { toast } from 'sonner@2.0.3';

// Sample data for preview
const SAMPLE_ITEMS = [
  {
    id: '1',
    name: 'Espresso',
    price: 3.50,
    quantity: 2,
    category: 'Beverages',
    modifiers: [
      { name: 'Extra Shot', price: 0.50 },
    ],
  },
  {
    id: '2',
    name: 'Croissant',
    price: 4.25,
    quantity: 1,
    category: 'Pastries',
  },
];

export function ReceiptTemplateManager() {
  const [customization, setCustomization] = useState<ReceiptCustomization>(DEFAULT_CUSTOMIZATION);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<ReceiptTemplateId>('classic');

  const handleTemplateChange = (templateId: ReceiptTemplateId) => {
    setCustomization({ ...customization, templateId });
    toast.success(`Template changed to ${RECEIPT_TEMPLATES[templateId].name}`);
  };

  const handleColorChange = (field: 'primaryColor' | 'accentColor', value: string) => {
    setCustomization({ ...customization, [field]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomization({ ...customization, logoUrl: reader.result as string });
        toast.success('Logo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // In production, save to backend/localStorage
    localStorage.setItem('receiptCustomization', JSON.stringify(customization));
    toast.success('Receipt template settings saved', {
      description: 'Your changes have been applied to all future receipts',
    });
  };

  const handlePreview = (templateId: ReceiptTemplateId) => {
    setPreviewTemplate(templateId);
    setShowPreview(true);
  };

  const renderTemplatePreview = () => {
    const props = {
      items: SAMPLE_ITEMS,
      subtotal: 11.75,
      tax: 0.94,
      total: 12.69,
      customization: { ...customization, templateId: previewTemplate },
      receiptNumber: 'PREVIEW-001',
    };

    switch (previewTemplate) {
      case 'classic':
        return <ClassicTemplate {...props} />;
      case 'modern':
        return <ModernTemplate {...props} />;
      case 'compact':
        return <CompactTemplate {...props} />;
      case 'branded':
        return <BrandedTemplate {...props} />;
      default:
        return <ClassicTemplate {...props} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Receipt Templates
          </CardTitle>
          <CardDescription>
            Choose from 4 professional receipt designs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.values(RECEIPT_TEMPLATES).map((template) => (
              <div
                key={template.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  customization.templateId === template.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
                onClick={() => handleTemplateChange(template.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{template.preview}</span>
                    <div>
                      <h4 className="font-semibold">{template.name}</h4>
                      {customization.templateId === template.id && (
                        <Badge variant="default" className="mt-1">Active</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(template.id);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {template.description}
                </p>

                <div className="space-y-2">
                  <div className="text-xs font-medium">Features:</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {template.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs font-medium mb-1">Best for:</div>
                  <div className="flex flex-wrap gap-1">
                    {template.bestFor.map((item, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customization Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Customize Receipt
          </CardTitle>
          <CardDescription>
            Personalize your receipt appearance and content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="business">
            <TabsList>
              <TabsTrigger value="business">Business Info</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            {/* Business Info Tab */}
            <TabsContent value="business" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={customization.businessName}
                  onChange={(e) =>
                    setCustomization({ ...customization, businessName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Address</Label>
                <Input
                  id="businessAddress"
                  value={customization.businessAddress}
                  onChange={(e) =>
                    setCustomization({ ...customization, businessAddress: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Phone</Label>
                  <Input
                    id="businessPhone"
                    value={customization.businessPhone}
                    onChange={(e) =>
                      setCustomization({ ...customization, businessPhone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={customization.businessEmail}
                    onChange={(e) =>
                      setCustomization({ ...customization, businessEmail: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / EIN</Label>
                <Input
                  id="taxId"
                  value={customization.taxId}
                  onChange={(e) =>
                    setCustomization({ ...customization, taxId: e.target.value })
                  }
                />
              </div>
            </TabsContent>

            {/* Branding Tab */}
            <TabsContent value="branding" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  {customization.logoUrl && (
                    <img
                      src={customization.logoUrl}
                      alt="Logo"
                      className="w-20 h-20 object-contain border rounded"
                    />
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 400x400px, transparent background
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={customization.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      value={customization.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={customization.accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      value={customization.accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      placeholder="#1e40af"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select
                  value={customization.fontSize}
                  onValueChange={(value: 'small' | 'medium' | 'large') =>
                    setCustomization({ ...customization, fontSize: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (save paper)</SelectItem>
                    <SelectItem value="medium">Medium (recommended)</SelectItem>
                    <SelectItem value="large">Large (easy to read)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paperWidth">Paper Width</Label>
                <Select
                  value={customization.paperWidth}
                  onValueChange={(value: '58mm' | '80mm') =>
                    setCustomization({ ...customization, paperWidth: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="58mm">58mm (compact thermal)</SelectItem>
                    <SelectItem value="80mm">80mm (standard thermal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Logo</Label>
                  <p className="text-sm text-muted-foreground">
                    Display logo at top of receipt
                  </p>
                </div>
                <Switch
                  checked={customization.showLogo}
                  onCheckedChange={(checked) =>
                    setCustomization({ ...customization, showLogo: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Tax ID</Label>
                  <p className="text-sm text-muted-foreground">
                    Include tax ID number
                  </p>
                </div>
                <Switch
                  checked={customization.showTaxId}
                  onCheckedChange={(checked) =>
                    setCustomization({ ...customization, showTaxId: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thankYouMessage">Thank You Message</Label>
                <Input
                  id="thankYouMessage"
                  value={customization.thankYouMessage}
                  onChange={(e) =>
                    setCustomization({ ...customization, thankYouMessage: e.target.value })
                  }
                  placeholder="Thank you for your business!"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerMessage">Footer Message</Label>
                <Input
                  id="footerMessage"
                  value={customization.footerMessage}
                  onChange={(e) =>
                    setCustomization({ ...customization, footerMessage: e.target.value })
                  }
                  placeholder="Please visit us again soon."
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">QR Code</Label>
                  <p className="text-sm text-muted-foreground">
                    Add QR code for digital receipt
                  </p>
                </div>
                <Switch
                  checked={customization.showQRCode}
                  onCheckedChange={(checked) =>
                    setCustomization({ ...customization, showQRCode: checked })
                  }
                />
              </div>

              {customization.showQRCode && (
                <div className="space-y-2 ml-4">
                  <Label htmlFor="qrCodeUrl">QR Code URL</Label>
                  <Input
                    id="qrCodeUrl"
                    value={customization.qrCodeUrl}
                    onChange={(e) =>
                      setCustomization({ ...customization, qrCodeUrl: e.target.value })
                    }
                    placeholder="https://yourwebsite.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Receipt number will be automatically appended
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-4 mt-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Social Media Links</Label>
                  <p className="text-sm text-muted-foreground">
                    Show social media handles
                  </p>
                </div>
                <Switch
                  checked={customization.showSocialMedia}
                  onCheckedChange={(checked) =>
                    setCustomization({ ...customization, showSocialMedia: checked })
                  }
                />
              </div>

              {customization.showSocialMedia && (
                <div className="space-y-3 ml-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={customization.socialMediaHandles.website || ''}
                      onChange={(e) =>
                        setCustomization({
                          ...customization,
                          socialMediaHandles: {
                            ...customization.socialMediaHandles,
                            website: e.target.value,
                          },
                        })
                      }
                      placeholder="yourwebsite.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={customization.socialMediaHandles.instagram || ''}
                      onChange={(e) =>
                        setCustomization({
                          ...customization,
                          socialMediaHandles: {
                            ...customization.socialMediaHandles,
                            instagram: e.target.value,
                          },
                        })
                      }
                      placeholder="@yourbusiness"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={customization.socialMediaHandles.facebook || ''}
                      onChange={(e) =>
                        setCustomization({
                          ...customization,
                          socialMediaHandles: {
                            ...customization.socialMediaHandles,
                            facebook: e.target.value,
                          },
                        })
                      }
                      placeholder="facebook.com/yourbusiness"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Barcode (Phase 3)</Label>
                  <p className="text-sm text-muted-foreground">
                    Add barcode for receipt tracking
                  </p>
                </div>
                <Switch disabled />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6 pt-6 border-t">
            <Button onClick={handleSave} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePreview(customization.templateId)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Receipt Preview: {RECEIPT_TEMPLATES[previewTemplate].name}
            </DialogTitle>
          </DialogHeader>
          <div className="bg-gray-100 p-6 rounded-lg">
            {renderTemplatePreview()}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)} className="flex-1">
              Close
            </Button>
            <Button onClick={() => window.print()} className="flex-1">
              Print Test Receipt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
