import { useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { BusinessProfile } from '../../lib/types';
import { INDUSTRY_CONFIGS } from '../../lib/industryConfig';
import { usePlugins } from '../../core/hooks/usePlugins';
import { getAllPresets } from '../../presets';
import { toast } from 'sonner@2.0.3';
import { setSoundEnabled, isSoundEnabled } from '../../lib/audioUtils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Store,
  Receipt,
  CreditCard,
  Bell,
  ShieldCheck,
  Puzzle,
  Info,
  CheckCircle2,
  ArrowUpCircle,
  Mail,
  Printer,
  Smartphone,
  Download,
  Wifi,
  WifiOff,
  HardDrive,
} from 'lucide-react';
import { HardwareManagement } from '../../plugins/hardware-printer-management/components/HardwareManagement';
import { PWAInstallPrompt } from '../PWAInstallPrompt';
import { PWAManagement } from '../PWAManagement';
import { ReceiptTemplateManager } from '../ReceiptTemplateManager';
import { OrderTypeSettings } from './OrderTypeSettings';

export function SettingsModule() {
  const businessProfile = useStore((state) => state.businessProfile);
  const setBusinessProfile = useStore((state) => state.setBusinessProfile);
  const plugins = usePlugins();
  const allPresets = getAllPresets();
  
  // Subscription management
  const subscribedPresets = useStore((state) => state.subscribedPresets);
  const setSubscribedPresets = useStore((state) => state.setSubscribedPresets);
  const hasPresetAccess = useStore((state) => state.hasPresetAccess);
  
  // Determine which business types to show based on subscription
  // If user has Ultimate, show all options; otherwise show only subscribed presets
  const hasUltimate = subscribedPresets.includes('ultimate');
  const availablePresets = hasUltimate 
    ? allPresets // Show all presets if user has Ultimate
    : allPresets.filter(preset => subscribedPresets.includes(preset.id)); // Show only subscribed presets
  
  // Local state for form fields
  const [businessInfo, setBusinessInfo] = useState({
    name: 'AuraFlow POS Demo Store',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    phone: '(555) 123-4567',
    email: 'contact@auraflow.com',
    taxId: '12-3456789',
    profile: businessProfile,
  });

  const [taxSettings, setTaxSettings] = useState({
    taxRate: '8.00',
    taxLabel: 'Sales Tax',
    includeTaxInPrice: false,
  });

  const [receiptSettings, setReceiptSettings] = useState({
    showLogo: true,
    showTaxId: true,
    showThankYou: true,
    emailReceipts: false,
    autoPrint: true,
    printerType: 'browser',
  });

  const handleSaveBusinessInfo = () => {
    // Update business profile in store
    setBusinessProfile(businessInfo.profile as BusinessProfile);
    toast.success('Business information saved successfully');
    toast.info('POS will adapt to your selected business profile');
  };

  const handleSaveTax = () => {
    toast.success('Tax settings saved successfully');
  };

  const handleSaveReceipt = () => {
    toast.success('Receipt settings saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your business and system preferences
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="business" className="w-full">
        <TabsList>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
          <TabsTrigger value="app">App Settings</TabsTrigger>
          <TabsTrigger value="hardware">Hardware</TabsTrigger>
          <TabsTrigger value="pwa">App & Offline</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="order-types">Order Types</TabsTrigger>
          <TabsTrigger value="plugins">Plugins</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Business Profile Tab */}
        <TabsContent value="business" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Business Information
              </CardTitle>
              <CardDescription>
                Basic information about your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessInfo.name}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={businessInfo.phone}
                    onChange={(e) =>
                      setBusinessInfo({ ...businessInfo, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={businessInfo.email}
                    onChange={(e) =>
                      setBusinessInfo({ ...businessInfo, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={businessInfo.address}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, address: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={businessInfo.city}
                    onChange={(e) =>
                      setBusinessInfo({ ...businessInfo, city: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={businessInfo.state}
                    onChange={(e) =>
                      setBusinessInfo({ ...businessInfo, state: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={businessInfo.zip}
                    onChange={(e) =>
                      setBusinessInfo({ ...businessInfo, zip: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / EIN</Label>
                <Input
                  id="taxId"
                  value={businessInfo.taxId}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, taxId: e.target.value })
                  }
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="businessProfile">Business Profile</Label>
                <p className="text-xs text-muted-foreground">
                  Select the business profile that best matches how you want the POS to operate.
                  This determines which features and workflows are shown to cashiers.
                </p>
                <Select
                  value={businessInfo.profile}
                  onValueChange={(value) =>
                    setBusinessInfo({ ...businessInfo, profile: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePresets.map(preset => (
                      <SelectItem key={preset.id} value={preset.id}>
                        {preset.icon} {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Show selected profile description */}
                {businessInfo.profile && (() => {
                  const selectedPreset = availablePresets.find(p => p.id === businessInfo.profile);
                  const config = INDUSTRY_CONFIGS[businessInfo.profile as BusinessProfile];
                  return config ? (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <span className="font-medium">
                          {config.name}:
                        </span>{' '}
                        {selectedPreset?.description || config.description}
                      </AlertDescription>
                    </Alert>
                  ) : null;
                })()}
                
                <p className="text-xs text-muted-foreground">
                  The POS interface will automatically show/hide features based on your selected profile. 
                  For example, retail profiles won't see table management, while restaurant profiles will.
                </p>
                
                {!hasUltimate && (
                  <p className="text-xs text-amber-600">
                    💡 Your subscription includes: {subscribedPresets.join(', ')}. 
                    Upgrade to Ultimate to access all business profiles.
                  </p>
                )}
              </div>

              <Button onClick={handleSaveBusinessInfo}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Industry Subscriptions
              </CardTitle>
              <CardDescription>
                Manage your industry-specific feature packages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Subscription Status */}
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium mb-1">Your Active Subscriptions</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      You have access to the following industry packages
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {subscribedPresets.map(presetId => {
                        const preset = allPresets.find(p => p.id === presetId);
                        return preset ? (
                          <Badge key={presetId} className="text-sm">
                            {preset.icon} {preset.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                  {hasUltimate && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                      ⚡ ULTIMATE
                    </Badge>
                  )}
                </div>
              </div>

              {/* Available Industry Packages */}
              <div>
                <h3 className="font-medium mb-4">Available Industry Packages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Restaurant */}
                  <Card className={subscribedPresets.includes('restaurant') ? 'border-2 border-primary' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🍽️</span>
                          <div>
                            <CardTitle className="text-lg">Restaurant & Food Service</CardTitle>
                            <CardDescription className="text-sm">$79/month</CardDescription>
                          </div>
                        </div>
                        {subscribedPresets.includes('restaurant') && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Full-service restaurant POS with table management, kitchen display, and order types
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Table Management</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Kitchen Display System</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Split Checks & Open Tabs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Course Management</span>
                        </div>
                      </div>
                      {!hasUltimate && (
                        <Button 
                          size="sm" 
                          variant={subscribedPresets.includes('restaurant') ? 'outline' : 'default'}
                          className="w-full"
                          onClick={() => {
                            if (subscribedPresets.includes('restaurant')) {
                              setSubscribedPresets(subscribedPresets.filter(p => p !== 'restaurant'));
                              toast.success('Unsubscribed from Restaurant package');
                            } else {
                              setSubscribedPresets([...subscribedPresets, 'restaurant']);
                              toast.success('Subscribed to Restaurant package');
                            }
                          }}
                        >
                          {subscribedPresets.includes('restaurant') ? 'Unsubscribe' : 'Subscribe'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Bar & Nightclub */}
                  <Card className={subscribedPresets.includes('bar') ? 'border-2 border-primary' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🍺</span>
                          <div>
                            <CardTitle className="text-lg">Bar & Nightclub</CardTitle>
                            <CardDescription className="text-sm">$79/month</CardDescription>
                          </div>
                        </div>
                        {subscribedPresets.includes('bar') && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Optimized for bars, pubs, and nightclubs with age verification and quick service
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Age Verification & Compliance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Open Tabs with Card Holds</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Split Checks & Quick Service</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Bottle Service & VIP Sections</span>
                        </div>
                      </div>
                      {!hasUltimate && (
                        <Button 
                          size="sm" 
                          variant={subscribedPresets.includes('bar') ? 'outline' : 'default'}
                          className="w-full"
                          onClick={() => {
                            if (subscribedPresets.includes('bar')) {
                              setSubscribedPresets(subscribedPresets.filter(p => p !== 'bar'));
                              toast.success('Unsubscribed from Bar & Nightclub package');
                            } else {
                              setSubscribedPresets([...subscribedPresets, 'bar']);
                              toast.success('Subscribed to Bar & Nightclub package');
                            }
                          }}
                        >
                          {subscribedPresets.includes('bar') ? 'Unsubscribe' : 'Subscribe'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Retail */}
                  <Card className={subscribedPresets.includes('retail') ? 'border-2 border-primary' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🏪</span>
                          <div>
                            <CardTitle className="text-lg">Retail Store</CardTitle>
                            <CardDescription className="text-sm">$69/month</CardDescription>
                          </div>
                        </div>
                        {subscribedPresets.includes('retail') && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Standard retail POS with inventory, barcode scanning, and quick checkout
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Barcode Scanner Integration</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Inventory Management</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Product Variations & Stock</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Layaway & Price Checker</span>
                        </div>
                      </div>
                      {!hasUltimate && (
                        <Button 
                          size="sm" 
                          variant={subscribedPresets.includes('retail') ? 'outline' : 'default'}
                          className="w-full"
                          onClick={() => {
                            if (subscribedPresets.includes('retail')) {
                              setSubscribedPresets(subscribedPresets.filter(p => p !== 'retail'));
                              toast.success('Unsubscribed from Retail package');
                            } else {
                              setSubscribedPresets([...subscribedPresets, 'retail']);
                              toast.success('Subscribed to Retail package');
                            }
                          }}
                        >
                          {subscribedPresets.includes('retail') ? 'Unsubscribe' : 'Subscribe'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Cafe */}
                  <Card className={subscribedPresets.includes('cafe') ? 'border-2 border-primary' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">☕</span>
                          <div>
                            <CardTitle className="text-lg">Coffee Shop / Cafe</CardTitle>
                            <CardDescription className="text-sm">$59/month</CardDescription>
                          </div>
                        </div>
                        {subscribedPresets.includes('cafe') && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Quick-service cafe POS with order types and loyalty program
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Order Types (Dine-in, Takeout)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Loyalty Program</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Open Tabs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Quick Service Features</span>
                        </div>
                      </div>
                      {!hasUltimate && (
                        <Button 
                          size="sm" 
                          variant={subscribedPresets.includes('cafe') ? 'outline' : 'default'}
                          className="w-full"
                          onClick={() => {
                            if (subscribedPresets.includes('cafe')) {
                              setSubscribedPresets(subscribedPresets.filter(p => p !== 'cafe'));
                              toast.success('Unsubscribed from Cafe package');
                            } else {
                              setSubscribedPresets([...subscribedPresets, 'cafe']);
                              toast.success('Subscribed to Cafe package');
                            }
                          }}
                        >
                          {subscribedPresets.includes('cafe') ? 'Unsubscribe' : 'Subscribe'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Pharmacy */}
                  <Card className={subscribedPresets.includes('pharmacy') ? 'border-2 border-primary' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">💊</span>
                          <div>
                            <CardTitle className="text-lg">Pharmacy / Healthcare</CardTitle>
                            <CardDescription className="text-sm">$99/month</CardDescription>
                          </div>
                        </div>
                        {subscribedPresets.includes('pharmacy') && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Healthcare POS with prescription tracking and compliance features
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Prescription Tracking</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Age Verification</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Inventory Management</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Barcode Scanning</span>
                        </div>
                      </div>
                      {!hasUltimate && (
                        <Button 
                          size="sm" 
                          variant={subscribedPresets.includes('pharmacy') ? 'outline' : 'default'}
                          className="w-full"
                          onClick={() => {
                            if (subscribedPresets.includes('pharmacy')) {
                              setSubscribedPresets(subscribedPresets.filter(p => p !== 'pharmacy'));
                              toast.success('Unsubscribed from Pharmacy package');
                            } else {
                              setSubscribedPresets([...subscribedPresets, 'pharmacy']);
                              toast.success('Subscribed to Pharmacy package');
                            }
                          }}
                        >
                          {subscribedPresets.includes('pharmacy') ? 'Unsubscribe' : 'Subscribe'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Salon */}
                  <Card className={subscribedPresets.includes('salon') ? 'border-2 border-primary' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">💇</span>
                          <div>
                            <CardTitle className="text-lg">Salon & Spa</CardTitle>
                            <CardDescription className="text-sm">$69/month</CardDescription>
                          </div>
                        </div>
                        {subscribedPresets.includes('salon') && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Service-based POS with appointments and customer management
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Appointment Scheduling</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Service Packages</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Customer Management</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Staff Performance Tracking</span>
                        </div>
                      </div>
                      {!hasUltimate && (
                        <Button 
                          size="sm" 
                          variant={subscribedPresets.includes('salon') ? 'outline' : 'default'}
                          className="w-full"
                          onClick={() => {
                            if (subscribedPresets.includes('salon')) {
                              setSubscribedPresets(subscribedPresets.filter(p => p !== 'salon'));
                              toast.success('Unsubscribed from Salon package');
                            } else {
                              setSubscribedPresets([...subscribedPresets, 'salon']);
                              toast.success('Subscribed to Salon package');
                            }
                          }}
                        >
                          {subscribedPresets.includes('salon') ? 'Unsubscribe' : 'Subscribe'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Ultimate Package */}
              <div className="mt-6">
                <Card className={`${hasUltimate ? 'border-2 border-primary bg-gradient-to-br from-purple-500/5 to-pink-500/5' : 'border-2 border-purple-500/20'}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-2xl">⚡</span>
                        </div>
                        <div>
                          <CardTitle className="text-xl">Ultimate Package</CardTitle>
                          <CardDescription>$299/month - All Industries + Advanced Features</CardDescription>
                        </div>
                      </div>
                      {hasUltimate && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                          ACTIVE
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Get access to ALL industry packages plus advanced features like multi-location management, 
                      advanced analytics, API access, and priority support.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                        <span>All Industry Packages</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                        <span>Multi-Location</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                        <span>Advanced Analytics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                        <span>API Access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                        <span>Priority Support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                        <span>Custom Integrations</span>
                      </div>
                    </div>

                    {!hasUltimate ? (
                      <Button 
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        onClick={() => {
                          setSubscribedPresets(['ultimate']);
                          toast.success('Upgraded to Ultimate package!', {
                            description: 'You now have access to all features and industry packages'
                          });
                        }}
                      >
                        <ArrowUpCircle className="w-4 h-4 mr-2" />
                        Upgrade to Ultimate
                      </Button>
                    ) : (
                      <Button 
                        size="lg"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setSubscribedPresets(['restaurant']); // Downgrade to restaurant as example
                          toast.info('Downgraded from Ultimate', {
                            description: 'You can reactivate Ultimate anytime'
                          });
                        }}
                      >
                        Downgrade Plan
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  💡 <strong>Multi-Industry Tip:</strong> You can subscribe to multiple industry packages 
                  (e.g., Restaurant + Bar) if your business has multiple revenue streams. Each package 
                  adds its specific plugins and features to your POS.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Settings Tab */}
        <TabsContent value="tax" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Tax Configuration
              </CardTitle>
              <CardDescription>
                Configure sales tax settings for your location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={taxSettings.taxRate}
                    onChange={(e) =>
                      setTaxSettings({ ...taxSettings, taxRate: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxLabel">Tax Label</Label>
                  <Input
                    id="taxLabel"
                    value={taxSettings.taxLabel}
                    onChange={(e) =>
                      setTaxSettings({ ...taxSettings, taxLabel: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Include Tax in Price</Label>
                  <p className="text-sm text-muted-foreground">
                    Display prices with tax included
                  </p>
                </div>
                <Switch
                  checked={taxSettings.includeTaxInPrice}
                  onCheckedChange={(checked) =>
                    setTaxSettings({ ...taxSettings, includeTaxInPrice: checked })
                  }
                />
              </div>

              <Button onClick={handleSaveTax}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receipt Settings Tab */}
        <TabsContent value="receipts" className="space-y-6 mt-6">
          <ReceiptTemplateManager />
        </TabsContent>

        {/* App Settings Tab */}
        <TabsContent value="app" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Quick Wins - App Preferences
              </CardTitle>
              <CardDescription>
                Configure sound effects, auto-print, and other app behaviors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto-Print Receipts */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-Print Receipts</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically open print dialog after completing a sale
                  </p>
                </div>
                <Switch
                  checked={useStore((state) => state.appSettings.autoPrintReceipts)}
                  onCheckedChange={(checked) => {
                    useStore.getState().updateAppSettings({ autoPrintReceipts: checked });
                    toast.success(checked ? 'Auto-print enabled' : 'Auto-print disabled');
                  }}
                />
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound when scanning items, completing sales, and errors
                  </p>
                </div>
                <Switch
                  checked={useStore((state) => state.appSettings.soundEnabled)}
                  onCheckedChange={(checked) => {
                    useStore.getState().updateAppSettings({ soundEnabled: checked });
                    setSoundEnabled(checked);
                    toast.success(checked ? 'Sound effects enabled' : 'Sound effects disabled');
                  }}
                />
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme throughout the app (recommended for POS)
                  </p>
                </div>
                <Switch
                  checked={useStore((state) => state.appSettings.darkMode)}
                  onCheckedChange={(checked) => {
                    useStore.getState().updateAppSettings({ darkMode: checked });
                    toast.success(checked ? 'Dark mode enabled' : 'Light mode enabled');
                    toast.info('Theme will update on next page load');
                  }}
                />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Keyboard Shortcuts:</strong> Press <kbd className="px-2 py-1 bg-muted rounded border">F2</kbd> for quick cash payment, 
                  <kbd className="px-2 py-1 bg-muted rounded border ml-1">Ctrl+P</kbd> to print receipt, 
                  <kbd className="px-2 py-1 bg-muted rounded border ml-1">Ctrl+K</kbd> for quick search.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hardware Tab */}
        <TabsContent value="hardware" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="w-5 h-5" />
                Hardware Management
              </CardTitle>
              <CardDescription>
                Configure and manage hardware devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <HardwareManagement />
            </CardContent>
          </Card>
        </TabsContent>

        {/* PWA Tab */}
        <TabsContent value="pwa" className="space-y-6 mt-6">
          <PWAManagement />
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Configure accepted payment methods and processing settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Phase 3 Notice */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Phase 3 Feature:</strong> Real payment processing integration (Stripe, Square) will be available after backend integration is complete.
                </AlertDescription>
              </Alert>

              {/* Accepted Payment Methods */}
              <div className="space-y-4">
                <h3 className="font-medium">Accepted Payment Methods</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Cash</Label>
                      <p className="text-sm text-muted-foreground">
                        Accept cash payments
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Credit/Debit Cards</Label>
                      <p className="text-sm text-muted-foreground">
                        Accept card payments (requires payment processor)
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Mobile Payments</Label>
                      <p className="text-sm text-muted-foreground">
                        Accept Apple Pay, Google Pay, etc.
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Gift Cards</Label>
                      <p className="text-sm text-muted-foreground">
                        Accept store gift cards
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Store Credit</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to use store credit
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              {/* Payment Processing */}
              <div className="space-y-4">
                <h3 className="font-medium">Payment Processing (Phase 3)</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Stripe</CardTitle>
                      <CardDescription className="text-xs">Recommended for most businesses</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Badge variant="outline" className="text-xs">2.9% + $0.30 per transaction</Badge>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        Connect Stripe (Phase 3)
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Square</CardTitle>
                      <CardDescription className="text-xs">Popular for retail & restaurants</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Badge variant="outline" className="text-xs">2.6% + $0.10 per transaction</Badge>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        Connect Square (Phase 3)
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Cash Management */}
              <div className="space-y-4">
                <h3 className="font-medium">Cash Management</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openingCash">Opening Cash Amount</Label>
                    <Input
                      id="openingCash"
                      type="number"
                      placeholder="200.00"
                      defaultValue="200.00"
                    />
                    <p className="text-xs text-muted-foreground">Default amount for starting cash drawer</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cashThreshold">Cash Drop Threshold</Label>
                    <Input
                      id="cashThreshold"
                      type="number"
                      placeholder="500.00"
                      defaultValue="500.00"
                    />
                    <p className="text-xs text-muted-foreground">Alert when cash exceeds this amount</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Require Cash Drop Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Require manager approval for cash drops
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button onClick={() => toast.success('Payment settings saved')}>
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Order Types Tab */}
        <TabsContent value="order-types" className="space-y-6 mt-6">
          <OrderTypeSettings />
        </TabsContent>

        {/* Plugins & Upgrades Tab */}
        <TabsContent value="plugins" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Puzzle className="w-5 h-5" />
                Industry Feature Packages
              </CardTitle>
              <CardDescription>
                View your current industry configuration and request access to additional industry features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Industry Section */}
              <div className="space-y-3">
                <h3 className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Current Configuration
                </h3>
                {(() => {
                  const currentPreset = allPresets.find(p => p.id === businessProfile);
                  return currentPreset ? (
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg">{currentPreset.name}</h4>
                            <Badge variant="default" className="bg-emerald-600 dark:bg-emerald-600">
                              Active
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {currentPreset.description}
                          </p>
                          
                          {/* Show included plugins */}
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                              Included Features:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {currentPreset.plugins.map((pluginId) => {
                                const plugin = plugins.getPlugin(pluginId);
                                return plugin ? (
                                  <Badge key={pluginId} variant="outline" className="text-xs">
                                    {plugin.name}
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No industry configuration selected
                    </p>
                  );
                })()}
              </div>

              <div className="border-t" />

              {/* Available Industry Packages Section */}
              <div className="space-y-3">
                <h3 className="text-lg flex items-center gap-2">
                  <ArrowUpCircle className="w-5 h-5 text-blue-500" />
                  Request Industry Packages
                </h3>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Expanding to a new industry or need additional capabilities? Request access to other
                    industry-specific feature packages to grow your business.
                  </AlertDescription>
                </Alert>
                
                {/* Display all available presets */}
                <div className="grid gap-3 mt-4">
                  {allPresets
                    .filter((preset) => preset.id !== businessProfile)
                    .map((preset) => {
                      return (
                        <div
                          key={preset.id}
                          className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">{preset.icon}</span>
                                <h4>{preset.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  Premium Package
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {preset.description}
                              </p>
                              
                              {/* Show what's included */}
                              <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">
                                  Includes {preset.plugins.length} specialized features:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {preset.plugins.slice(0, 6).map((pluginId) => {
                                    const plugin = plugins.getPlugin(pluginId);
                                    return plugin ? (
                                      <Badge
                                        key={pluginId}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {plugin.name}
                                      </Badge>
                                    ) : null;
                                  })}
                                  {preset.plugins.length > 6 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{preset.plugins.length - 6} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                toast.success(
                                  `Request sent for ${preset.name} package`,
                                  {
                                    description:
                                      'Our sales team will contact you with pricing and implementation details.',
                                  }
                                );
                              }}
                            >
                              <Mail className="w-4 h-4 mr-1" />
                              Request Access
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage system alerts and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-4">
                <h3 className="font-medium">Email Notifications</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Daily Sales Summary</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive daily sales report via email
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Low Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when products run low
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Failed Transactions</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert when payment processing fails
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">New Orders</Label>
                      <p className="text-sm text-muted-foreground">
                        Notification for new online orders
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              {/* In-App Notifications */}
              <div className="space-y-4">
                <h3 className="font-medium">In-App Notifications</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Show notifications for system updates
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Shift Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Remind employees about open shifts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Performance Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Alerts for unusual activity or metrics
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              {/* Notification Recipients */}
              <div className="space-y-4">
                <h3 className="font-medium">Notification Recipients</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="admin@example.com"
                    defaultValue="admin@auraflow.com"
                  />
                  <p className="text-xs text-muted-foreground">Primary email for system notifications</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="managerEmail">Manager Email</Label>
                  <Input
                    id="managerEmail"
                    type="email"
                    placeholder="manager@example.com"
                    defaultValue="manager@auraflow.com"
                  />
                  <p className="text-xs text-muted-foreground">Email for operational notifications</p>
                </div>
              </div>

              {/* Sound Notifications */}
              <div className="space-y-4">
                <h3 className="font-medium">Sound Notifications</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enable Sound Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sound for important notifications
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Order Ready Chime</Label>
                      <p className="text-sm text-muted-foreground">
                        Sound alert when order is ready for pickup
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Button onClick={() => toast.success('Notification settings saved')}>
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Policy */}
              <div className="space-y-4">
                <h3 className="font-medium">Password Policy</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Require Strong Passwords</Label>
                      <p className="text-sm text-muted-foreground">
                        Enforce minimum 8 characters with numbers & symbols
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Password Expiration</Label>
                      <p className="text-sm text-muted-foreground">
                        Require password change every 90 days
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Prevent Password Reuse</Label>
                      <p className="text-sm text-muted-foreground">
                        Don't allow last 5 passwords
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              {/* Access Control */}
              <div className="space-y-4">
                <h3 className="font-medium">Access Control</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for admin accounts (Phase 3)
                      </p>
                    </div>
                    <Switch disabled />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto-Lock After Inactivity</Label>
                      <p className="text-sm text-muted-foreground">
                        Lock POS after 15 minutes of inactivity
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Manager Approval for Voids</Label>
                      <p className="text-sm text-muted-foreground">
                        Require manager PIN for void transactions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Manager Approval for Discounts</Label>
                      <p className="text-sm text-muted-foreground">
                        Require manager approval for discounts over 20%
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              {/* Session Management */}
              <div className="space-y-4">
                <h3 className="font-medium">Session Management</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    placeholder="15"
                    defaultValue="15"
                  />
                  <p className="text-xs text-muted-foreground">Automatically log out inactive users</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Remember Login</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to stay logged in on trusted devices
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Single Sign-On</Label>
                    <p className="text-sm text-muted-foreground">
                      One login session per user (prevent concurrent logins)
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              {/* Audit & Compliance */}
              <div className="space-y-4">
                <h3 className="font-medium">Audit & Compliance</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Activity Logging</Label>
                      <p className="text-sm text-muted-foreground">
                        Log all user actions and system events
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">PCI Compliance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable PCI-DSS security requirements (Phase 3)
                      </p>
                    </div>
                    <Switch disabled />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Failed Login Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert after 3 failed login attempts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logRetention">Log Retention (days)</Label>
                  <Input
                    id="logRetention"
                    type="number"
                    placeholder="90"
                    defaultValue="90"
                  />
                  <p className="text-xs text-muted-foreground">How long to keep activity logs</p>
                </div>
              </div>

              {/* IP Restrictions */}
              <div className="space-y-4">
                <h3 className="font-medium">IP Restrictions (Phase 3)</h3>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    IP whitelisting and geo-blocking features will be available in Phase 3 with backend integration.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable IP Whitelisting</Label>
                    <p className="text-sm text-muted-foreground">
                      Only allow access from approved IP addresses
                    </p>
                  </div>
                  <Switch disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowedIPs">Allowed IP Addresses</Label>
                  <Input
                    id="allowedIPs"
                    placeholder="192.168.1.1, 10.0.0.0/8"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">Comma-separated list of allowed IPs (Phase 3)</p>
                </div>
              </div>

              <Button onClick={() => toast.success('Security settings saved')}>
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}