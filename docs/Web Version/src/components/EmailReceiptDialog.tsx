import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Order } from '../lib/types';
import { Mail, Send, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EmailReceiptDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order;
}

export function EmailReceiptDialog({
  open,
  onClose,
  order,
}: EmailReceiptDialogProps) {
  const [email, setEmail] = useState(order.customer?.email || '');
  const [message, setMessage] = useState('Thank you for your purchase!');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    // Validate email
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSending(true);

    try {
      // Simulate sending email
      // In production, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock email sending
      console.log('Sending receipt to:', email);
      console.log('Order:', order.orderNumber);
      console.log('Message:', message);

      toast.success(`Receipt sent to ${email}`);
      
      // Close dialog
      setTimeout(() => {
        onClose();
        setEmail('');
        setMessage('Thank you for your purchase!');
      }, 500);
    } catch (error) {
      console.error('Email send error:', error);
      toast.error('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      onClose();
      setEmail('');
      setMessage('Thank you for your purchase!');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Receipt
          </DialogTitle>
          <DialogDescription>
            Send a digital copy of the receipt to the customer's email
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Order Info */}
          <div className="p-3 bg-muted rounded-lg space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order #:</span>
              <span className="font-medium">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">${order.total.toFixed(2)}</span>
            </div>
            {order.customer && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium">{order.customer.name}</span>
              </div>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sending}
            />
            <p className="text-xs text-muted-foreground">
              The receipt will be sent as a PDF attachment
            </p>
          </div>

          {/* Optional Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              disabled={sending}
            />
          </div>

          {/* Email Preview Info */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Email will include:</strong>
            </p>
            <ul className="text-xs text-blue-700 dark:text-blue-300 mt-2 space-y-1 ml-4 list-disc">
              <li>Receipt as PDF attachment</li>
              <li>Order summary in email body</li>
              <li>Store contact information</li>
              <li>Return policy</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={sending}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={sending || !email}
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Receipt
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
