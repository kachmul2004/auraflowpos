import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { useStore } from '../lib/store';

interface CashDrawerDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CashDrawerDialog({ open, onClose }: CashDrawerDialogProps) {
  const addCashTransaction = useStore(state => state.addCashTransaction);
  const currentShift = useStore(state => state.currentShift);
  
  const [type, setType] = useState<'cashIn' | 'cashOut'>('cashIn');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  // Calculate current expected cash drawer balance
  const getCurrentBalance = () => {
    if (!currentShift) return 0;
    
    // Start with opening balance
    let balance = currentShift.openingBalance;
    
    // Add all cash transactions
    currentShift.transactions.forEach(transaction => {
      if (transaction.type === 'sale' && transaction.paymentMethod === 'cash') {
        balance += transaction.amount;
      } else if (transaction.type === 'cashIn') {
        balance += transaction.amount;
      } else if (transaction.type === 'cashOut') {
        balance -= transaction.amount;
      } else if (transaction.type === 'return' && transaction.paymentMethod === 'cash') {
        balance -= transaction.amount;
      }
    });
    
    return balance;
  };

  const handleSubmit = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0) {
      addCashTransaction(type, value, reason || `${type === 'cashIn' ? 'Cash In' : 'Cash Out'}`);
      setAmount('');
      setReason('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cash Drawer</DialogTitle>
          <DialogDescription>
            Add or remove cash from the drawer.
          </DialogDescription>
        </DialogHeader>

        {/* Current Balance Display */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Balance:</span>
            <span className="text-2xl font-mono">${getCurrentBalance().toFixed(2)}</span>
          </div>
        </div>

        <Tabs value={type} onValueChange={(v) => setType(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cashIn">Cash In</TabsTrigger>
            <TabsTrigger value="cashOut">Cash Out</TabsTrigger>
          </TabsList>

          <TabsContent value="cashIn" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add cash to the drawer (e.g., for making change).
            </p>
            <div className="space-y-2">
              <Label htmlFor="amountIn">Amount</Label>
              <Input
                id="amountIn"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-input-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reasonIn">Reason</Label>
              <Textarea
                id="reasonIn"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for cash in..."
                className="bg-input-background"
              />
            </div>
          </TabsContent>

          <TabsContent value="cashOut" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Remove cash from the drawer (e.g., for deposits, petty cash).
            </p>
            <div className="space-y-2">
              <Label htmlFor="amountOut">Amount</Label>
              <Input
                id="amountOut"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-input-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reasonOut">Reason</Label>
              <Textarea
                id="reasonOut"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for cash out..."
                className="bg-input-background"
              />
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0}
            className="flex-1"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}