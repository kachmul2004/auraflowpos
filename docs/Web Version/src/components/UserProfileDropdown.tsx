import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User, Settings, RefreshCw, Clock, Keyboard, Sliders, Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from './ui/alert';

interface UserProfileDropdownProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    pin: string;
    email?: string;
  };
  onOpenShiftStatus?: () => void;
  onOpenSettings?: () => void;
  onOpenKeyboardShortcuts?: () => void;
}

// Generate random 6-digit PIN
const generateRandomPIN = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export function UserProfileDropdown({ 
  user, 
  onOpenShiftStatus,
  onOpenSettings,
  onOpenKeyboardShortcuts 
}: UserProfileDropdownProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPinAuthDialog, setShowPinAuthDialog] = useState(false);
  const [showChangePinDialog, setShowChangePinDialog] = useState(false);
  const [pinAuthAction, setPinAuthAction] = useState<'view' | 'change'>('view');
  const [authPin, setAuthPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isPinVisible, setIsPinVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
  });

  const getInitials = () => {
    const first = user.firstName || user.name.split(' ')[0] || '';
    const last = user.lastName || user.name.split(' ')[1] || '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error('Please fill in first and last name');
      return;
    }

    // TODO: Update user in store
    toast.success('Profile updated successfully');
    setShowEditDialog(false);
  };

  const handleRequestPinAuth = (action: 'view' | 'change') => {
    setPinAuthAction(action);
    setAuthPin('');
    setShowPinAuthDialog(true);
  };

  const handlePinAuth = () => {
    if (authPin !== user.pin) {
      toast.error('Incorrect PIN');
      setAuthPin('');
      return;
    }

    setShowPinAuthDialog(false);
    setAuthPin('');

    if (pinAuthAction === 'view') {
      setIsPinVisible(true);
      toast.success('PIN visible for 30 seconds');
      // Auto-hide after 30 seconds
      setTimeout(() => {
        setIsPinVisible(false);
      }, 30000);
    } else {
      // Open change PIN dialog
      setNewPin('');
      setConfirmPin('');
      setShowChangePinDialog(true);
    }
  };

  const handleChangePin = () => {
    if (newPin.length !== 6) {
      toast.error('PIN must be exactly 6 digits');
      return;
    }

    if (newPin !== confirmPin) {
      toast.error('PINs do not match');
      return;
    }

    if (newPin === user.pin) {
      toast.error('New PIN must be different from current PIN');
      return;
    }

    // TODO: Update user PIN in store
    toast.success('PIN changed successfully');
    setShowChangePinDialog(false);
    setNewPin('');
    setConfirmPin('');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 h-9">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs">{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <User className="w-4 h-4 mr-2" />
            Edit Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {onOpenShiftStatus && (
            <DropdownMenuItem onClick={onOpenShiftStatus}>
              <Clock className="w-4 h-4 mr-2" />
              Shift Status
            </DropdownMenuItem>
          )}
          {onOpenSettings && (
            <DropdownMenuItem onClick={onOpenSettings}>
              <Sliders className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
          )}
          {onOpenKeyboardShortcuts && (
            <DropdownMenuItem onClick={onOpenKeyboardShortcuts}>
              <Keyboard className="w-4 h-4 mr-2" />
              Keyboard Shortcuts
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>

              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-3 pt-2 border-t">
              <Label className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Security PIN
              </Label>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                  <span className="font-mono text-lg tracking-wider">
                    {isPinVisible ? user.pin : '••••••'}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRequestPinAuth('view')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View PIN
                  </Button>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleRequestPinAuth('change')}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change PIN
                </Button>
              </div>

              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  For security, you must enter your current PIN to view or change it. If you forgot your PIN, contact an administrator to reset it.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PIN Authentication Dialog */}
      <Dialog open={showPinAuthDialog} onOpenChange={setShowPinAuthDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Enter Your PIN</DialogTitle>
            <DialogDescription>
              {pinAuthAction === 'view' 
                ? 'Enter your PIN to view it' 
                : 'Enter your current PIN to change it'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current PIN</Label>
              <Input
                type="password"
                maxLength={6}
                value={authPin}
                onChange={(e) => setAuthPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="font-mono text-center text-lg tracking-widest"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && authPin.length === 6) {
                    handlePinAuth();
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPinAuthDialog(false);
              setAuthPin('');
            }}>
              Cancel
            </Button>
            <Button onClick={handlePinAuth} disabled={authPin.length !== 6}>
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change PIN Dialog */}
      <Dialog open={showChangePinDialog} onOpenChange={setShowChangePinDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Change PIN</DialogTitle>
            <DialogDescription>
              Enter and confirm your new 6-digit PIN
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New PIN</Label>
              <Input
                type="password"
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="font-mono text-center text-lg tracking-widest"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>Confirm New PIN</Label>
              <Input
                type="password"
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="font-mono text-center text-lg tracking-widest"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newPin.length === 6 && confirmPin.length === 6) {
                    handleChangePin();
                  }
                }}
              />
            </div>

            {newPin.length === 6 && confirmPin.length === 6 && newPin !== confirmPin && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  PINs do not match
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowChangePinDialog(false);
              setNewPin('');
              setConfirmPin('');
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleChangePin} 
              disabled={newPin.length !== 6 || confirmPin.length !== 6}
            >
              Change PIN
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
