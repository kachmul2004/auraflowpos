import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { useStore } from '../lib/store';
import { toast } from 'sonner@2.0.3';
import { setSoundEnabled } from '../lib/audioUtils';
import { Volume2, Printer, Moon, Keyboard } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface QuickSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function QuickSettingsDialog({ open, onClose }: QuickSettingsDialogProps) {
  const appSettings = useStore(state => state.appSettings);
  const updateAppSettings = useStore(state => state.updateAppSettings);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Settings</DialogTitle>
          <DialogDescription>
            Configure common POS preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Auto-Print Receipts */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Printer className="w-4 h-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label className="text-sm cursor-pointer">Auto-Print Receipts</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically open print dialog after sale
                </p>
              </div>
            </div>
            <Switch
              checked={appSettings.autoPrintReceipts}
              onCheckedChange={(checked) => {
                updateAppSettings({ autoPrintReceipts: checked });
                toast.success(checked ? 'Auto-print enabled' : 'Auto-print disabled');
              }}
            />
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label className="text-sm cursor-pointer">Sound Effects</Label>
                <p className="text-xs text-muted-foreground">
                  Play sounds for scan, checkout, errors
                </p>
              </div>
            </div>
            <Switch
              checked={appSettings.soundEnabled}
              onCheckedChange={(checked) => {
                updateAppSettings({ soundEnabled: checked });
                setSoundEnabled(checked);
                toast.success(checked ? 'Sound enabled' : 'Sound disabled');
              }}
            />
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Moon className="w-4 h-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label className="text-sm cursor-pointer">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Use dark theme (reload to apply)
                </p>
              </div>
            </div>
            <Switch
              checked={appSettings.darkMode}
              onCheckedChange={(checked) => {
                updateAppSettings({ darkMode: checked });
                toast.success(checked ? 'Dark mode enabled' : 'Light mode enabled');
                toast.info('Reload page to apply theme');
              }}
            />
          </div>

          <Alert>
            <Keyboard className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Shortcuts:</strong> <kbd className="px-1.5 py-0.5 bg-muted rounded border text-xs">F2</kbd> Quick Payment · 
              <kbd className="px-1.5 py-0.5 bg-muted rounded border text-xs ml-1">Ctrl+P</kbd> Print · 
              <kbd className="px-1.5 py-0.5 bg-muted rounded border text-xs ml-1">Ctrl+K</kbd> Search
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
}
