import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Lock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LockScreenProps {
  open: boolean;
  userPin: string;
  userName: string;
  onUnlock: () => void;
}

export function LockScreen({ open, userPin, userName, onUnlock }: LockScreenProps) {
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (open) {
      setPin('');
    }
  }, [open]);

  useEffect(() => {
    if (pin.length === 6) {
      if (pin === userPin) {
        toast.success('Unlocked successfully');
        onUnlock();
        setPin('');
      } else {
        toast.error('Incorrect PIN');
        setPin('');
      }
    }
  }, [pin, userPin, onUnlock]);

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      setPin(pin + num);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center space-y-6 py-6">
          {/* Lock Icon */}
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-10 h-10 text-primary" />
          </div>

          {/* Title */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl">Screen Locked</h2>
            <p className="text-muted-foreground">
              {userName}, enter your PIN to unlock
            </p>
          </div>

          {/* PIN Display */}
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full border-2 transition-colors ${
                  i < pin.length
                    ? 'bg-primary border-primary'
                    : 'bg-transparent border-muted-foreground'
                }`}
              />
            ))}
          </div>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <Button
                key={num}
                variant="outline"
                size="lg"
                className="h-16 text-2xl"
                onClick={() => handleNumberClick(num)}
              >
                {num}
              </Button>
            ))}
            <Button
              variant="outline"
              size="lg"
              className="h-16"
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-16 text-2xl"
              onClick={() => handleNumberClick('0')}
            >
              0
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-16"
              onClick={handleBackspace}
            >
              ⌫
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-muted-foreground text-center">
            Your shift is still active. The POS will unlock once you enter your correct PIN.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
