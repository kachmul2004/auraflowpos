import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertCircle } from 'lucide-react';
import { mockUsers } from '../lib/mockData';

interface ManagerOverrideDialogProps {
  open: boolean;
  onClose: () => void;
  action: string;
  onApprove: (managerId: string) => void;
}

export function ManagerOverrideDialog({
  open,
  onClose,
  action,
  onApprove,
}: ManagerOverrideDialogProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = () => {
    const manager = mockUsers.find(u => u.pin === pin && u.isAdmin);
    
    if (manager) {
      onApprove(manager.id);
      setPin('');
      setError('');
      onClose();
    } else {
      setError('Invalid manager PIN');
    }
  };
  
  const handleClose = () => {
    setPin('');
    setError('');
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manager Approval Required</DialogTitle>
          <DialogDescription>
            This action requires manager authorization
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 bg-muted rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <p className="font-medium">Action: {action}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please enter a manager PIN to approve this action
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="managerPin">Manager PIN</Label>
          <Input
            id="managerPin"
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter manager PIN"
            className="bg-input-background"
            autoFocus
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!pin}>
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
