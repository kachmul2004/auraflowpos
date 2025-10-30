import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Download, X, Share, Smartphone, Info } from 'lucide-react';
import {
  canInstall,
  isInstalled,
  promptInstall,
  isIOS,
  isAndroid,
  getIOSInstructions,
} from '../lib/pwa';

interface PWAInstallPromptProps {
  variant?: 'banner' | 'button' | 'card';
}

export function PWAInstallPrompt({ variant = 'banner' }: PWAInstallPromptProps) {
  const [show, setShow] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if we should show the prompt
    const checkInstallability = () => {
      const alreadyInstalled = isInstalled();
      const isDismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
      
      if (!alreadyInstalled && !isDismissed) {
        if (canInstall() || isIOS()) {
          setShow(true);
        }
      }
    };

    // Check after a short delay to avoid flash
    const timer = setTimeout(checkInstallability, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInstall = async () => {
    if (isIOS()) {
      setShowIOSInstructions(true);
      return;
    }

    const result = await promptInstall();
    
    if (result === 'accepted') {
      setShow(false);
    } else if (result === 'unavailable') {
      // Show generic instructions
      setShowIOSInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!show || dismissed) {
    return null;
  }

  // Banner variant (top of screen)
  if (variant === 'banner') {
    return (
      <>
        <Alert className="border-primary/50 bg-primary/5 m-4">
          <Smartphone className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between gap-4">
            <div>
              <strong className="font-medium">Install AuraFlow POS</strong>
              <p className="text-sm text-muted-foreground mt-0.5">
                Install the app for a better experience with offline support
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleInstall}>
                <Download className="w-4 h-4 mr-2" />
                Install
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDismiss}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {/* iOS Instructions Dialog */}
        <Dialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Share className="w-5 h-5" />
                Install on {isIOS() ? 'iOS' : 'your device'}
              </DialogTitle>
              <DialogDescription>
                Follow these steps to install AuraFlow POS on your home screen
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {isIOS() ? (
                <div className="space-y-3">
                  {getIOSInstructions().map((instruction, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                        {index + 1}
                      </div>
                      <p className="pt-0.5">{instruction}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Info className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Use your browser's menu to add this app to your home screen
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={() => setShowIOSInstructions(false)}>
                Got it
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Button variant (inline)
  if (variant === 'button') {
    return (
      <Button onClick={handleInstall} variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Install App
      </Button>
    );
  }

  // Card variant (settings page)
  if (variant === 'card') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Install AuraFlow POS
          </CardTitle>
          <CardDescription>
            Install the app for offline access and a native-like experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Benefits:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Works offline</li>
              <li>• Faster loading</li>
              <li>• Home screen access</li>
              <li>• Native app experience</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleInstall} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              {isIOS() ? 'View Instructions' : 'Install Now'}
            </Button>
            <Button variant="outline" onClick={handleDismiss}>
              Dismiss
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
