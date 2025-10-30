import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import {
  Smartphone,
  Download,
  CheckCircle2,
  AlertCircle,
  WifiOff,
  HardDrive,
  RefreshCw,
  Trash2,
  Info,
} from 'lucide-react';
import {
  isInstalled,
  isIOS,
  isAndroid,
  supportsPWA,
  getCacheSize,
  clearCaches,
  updateServiceWorker,
} from '../lib/pwa';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { toast } from 'sonner@2.0.3';

export function PWAManagement() {
  const [installed, setInstalled] = useState(false);
  const [cacheSize, setCacheSize] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pwaSupported, setPWASupported] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    // Check installation status
    setInstalled(isInstalled());
    setPWASupported(supportsPWA());

    // Get cache size
    getCacheSize().then(size => {
      setCacheSize(size);
    });

    // Listen for online/offline changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const updated = await updateServiceWorker();
      if (updated) {
        toast.success('App updated successfully', {
          description: 'The latest version has been installed. Reload to apply changes.',
        });
      } else {
        toast.info('Already up to date', {
          description: 'You are running the latest version.',
        });
      }
    } catch (error) {
      toast.error('Update failed', {
        description: 'Could not check for updates. Please try again later.',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCache = async () => {
    setClearing(true);
    try {
      await clearCaches();
      setCacheSize(0);
      toast.success('Cache cleared', {
        description: 'All cached data has been removed. Reload to download fresh content.',
      });
    } catch (error) {
      toast.error('Failed to clear cache', {
        description: 'Could not clear cached data. Please try again.',
      });
    } finally {
      setClearing(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Installation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            App Installation
          </CardTitle>
          <CardDescription>
            Install AuraFlow POS for a better experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-1">
              <Label className="text-base">Installation Status</Label>
              <p className="text-sm text-muted-foreground">
                {installed ? 'Installed as app' : 'Running in browser'}
              </p>
            </div>
            <Badge variant={installed ? 'default' : 'outline'} className={installed ? 'bg-green-500' : ''}>
              {installed ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Installed
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Not Installed
                </>
              )}
            </Badge>
          </div>

          {/* Platform Info */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Platform</p>
              <p className="font-medium">
                {isIOS() ? 'iOS' : isAndroid() ? 'Android' : 'Desktop'}
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">PWA Support</p>
              <p className="font-medium">
                {pwaSupported ? 'Supported' : 'Limited'}
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="font-medium flex items-center justify-center gap-1">
                {isOnline ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3" />
                    Offline
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Install Prompt */}
          {!installed && (
            <PWAInstallPrompt variant="card" />
          )}

          {/* Installation Benefits */}
          {installed && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                <strong>App installed successfully!</strong> You can now access AuraFlow POS from your home screen and use it offline.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Offline Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WifiOff className="w-5 h-5" />
            Offline Mode
          </CardTitle>
          <CardDescription>
            Work without internet connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-1">
              <Label className="text-base">Connection Status</Label>
              <p className="text-sm text-muted-foreground">
                {isOnline ? 'Connected to internet' : 'Working offline'}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-amber-500'}`} />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Offline Capabilities:</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                <span>Continue taking orders and processing sales</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                <span>Access product catalog and pricing</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                <span>View customer information</span>
              </li>
              <li className="flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
                <span>Transactions sync automatically when back online</span>
              </li>
            </ul>
          </div>

          {!isOnline && (
            <Alert>
              <WifiOff className="h-4 w-4" />
              <AlertDescription>
                <strong>Working offline.</strong> Your transactions are queued and will sync when you reconnect.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Cache & Storage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Cache & Storage
          </CardTitle>
          <CardDescription>
            Manage app data and cached content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cache Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Cache Size</Label>
              <span className="text-sm font-medium">{formatBytes(cacheSize)}</span>
            </div>
            <Progress value={Math.min((cacheSize / (50 * 1024 * 1024)) * 100, 100)} />
            <p className="text-xs text-muted-foreground">
              Cached data helps the app load faster and work offline
            </p>
          </div>

          {/* Cache Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpdate}
              disabled={updating}
              className="flex-1"
            >
              {updating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check for Updates
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCache}
              disabled={clearing || cacheSize === 0}
              className="flex-1"
            >
              {clearing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cache
                </>
              )}
            </Button>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Clearing cache will remove all offline data. The app will download fresh content on next load.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>
            Configure app behavior and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-base">Auto-Update</Label>
              <p className="text-sm text-muted-foreground">
                Automatically check for and install updates
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-base">Background Sync</Label>
              <p className="text-sm text-muted-foreground">
                Sync data in the background when online (Phase 3)
              </p>
            </div>
            <Switch disabled />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for important events (Phase 3)
              </p>
            </div>
            <Switch disabled />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-base">Offline Queue</Label>
              <p className="text-sm text-muted-foreground">
                Queue transactions when offline for later sync
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Help & Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle>Help & Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Installation Issues?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Make sure you're using a modern browser (Chrome, Safari, Edge)</li>
              <li>• On iOS: Use Safari and tap Share → Add to Home Screen</li>
              <li>• On Android: Look for "Install App" prompt or menu option</li>
              <li>• On Desktop: Look for install icon in address bar</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">App Not Working Offline?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Ensure the app is installed (not just bookmarked)</li>
              <li>• Visit the app while online at least once</li>
              <li>• Check that cache is not disabled in browser settings</li>
              <li>• Try clearing cache and reloading</li>
            </ul>
          </div>

          <Button variant="outline" size="sm" className="w-full">
            View Full Documentation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
