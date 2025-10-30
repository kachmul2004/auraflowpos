import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { 
  CreditCard, 
  Plus, 
  Clock, 
  DollarSign, 
  User,
  Receipt,
  X,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface OpenTab {
  id: string;
  customerName: string;
  cardLast4?: string;
  openedAt: Date;
  items: number;
  total: number;
  preAuthAmount?: number;
}

export function TabsManagementView() {
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([
    {
      id: 'tab-1',
      customerName: 'John Smith',
      cardLast4: '4242',
      openedAt: new Date(Date.now() - 45 * 60000),
      items: 3,
      total: 47.50,
      preAuthAmount: 100
    },
    {
      id: 'tab-2',
      customerName: 'Sarah Johnson',
      cardLast4: '5555',
      openedAt: new Date(Date.now() - 120 * 60000),
      items: 7,
      total: 112.75,
      preAuthAmount: 150
    },
    {
      id: 'tab-3',
      customerName: 'Mike Davis',
      openedAt: new Date(Date.now() - 15 * 60000),
      items: 1,
      total: 12.00
    }
  ]);

  const [showNewTabDialog, setShowNewTabDialog] = useState(false);
  const [newTabForm, setNewTabForm] = useState({
    customerName: '',
    cardLast4: '',
    preAuthAmount: '100'
  });

  const getTabDuration = (openedAt: Date) => {
    const minutes = Math.floor((Date.now() - openedAt.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const handleOpenNewTab = () => {
    if (!newTabForm.customerName.trim()) {
      toast.error('Customer name is required');
      return;
    }

    const newTab: OpenTab = {
      id: `tab-${Date.now()}`,
      customerName: newTabForm.customerName,
      cardLast4: newTabForm.cardLast4 || undefined,
      openedAt: new Date(),
      items: 0,
      total: 0,
      preAuthAmount: newTabForm.cardLast4 ? parseFloat(newTabForm.preAuthAmount) : undefined
    };

    setOpenTabs([...openTabs, newTab]);
    setShowNewTabDialog(false);
    setNewTabForm({ customerName: '', cardLast4: '', preAuthAmount: '100' });
    
    toast.success('Tab opened', {
      description: `Started tab for ${newTab.customerName}`
    });
  };

  const handleCloseTab = (tabId: string) => {
    const tab = openTabs.find(t => t.id === tabId);
    if (!tab) return;

    if (tab.items === 0) {
      setOpenTabs(openTabs.filter(t => t.id !== tabId));
      toast.success('Tab closed', {
        description: 'Empty tab removed'
      });
    } else {
      toast.info('Process payment to close tab', {
        description: `${tab.items} items totaling $${tab.total.toFixed(2)}`
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Open Tabs</h2>
          <p className="text-sm text-muted-foreground">
            {openTabs.length} active {openTabs.length === 1 ? 'tab' : 'tabs'}
          </p>
        </div>
        <Button onClick={() => setShowNewTabDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Open New Tab
        </Button>
      </div>

      {/* Tabs Grid */}
      {openTabs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No open tabs</p>
            <Button 
              variant="outline" 
              className="mt-4 gap-2"
              onClick={() => setShowNewTabDialog(true)}
            >
              <Plus className="w-4 h-4" />
              Open First Tab
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {openTabs.map(tab => {
            const duration = getTabDuration(tab.openedAt);
            const isLongTab = Date.now() - tab.openedAt.getTime() > 2 * 60 * 60 * 1000; // > 2 hours
            const isHighValue = tab.total > 200;

            return (
              <Card 
                key={tab.id} 
                className={`${isHighValue ? 'border-amber-500' : ''} ${isLongTab ? 'border-orange-500' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {tab.customerName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3" />
                        Open {duration}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleCloseTab(tab.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Card Info */}
                  {tab.cardLast4 && (
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">•••• {tab.cardLast4}</span>
                      {tab.preAuthAmount && (
                        <Badge variant="outline" className="text-xs">
                          ${tab.preAuthAmount} hold
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Items & Total */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Items</p>
                      <p className="text-lg font-bold">{tab.items}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="text-lg font-bold text-primary">
                        ${tab.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Warnings */}
                  {isLongTab && (
                    <div className="flex items-start gap-2 p-2 bg-orange-500/10 rounded-md">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-orange-700 dark:text-orange-300">
                          Long running tab ({duration})
                        </p>
                      </div>
                    </div>
                  )}

                  {isHighValue && (
                    <div className="flex items-start gap-2 p-2 bg-amber-500/10 rounded-md">
                      <DollarSign className="w-4 h-4 text-amber-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                          High value tab (${tab.total.toFixed(2)})
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Plus className="w-3 h-3" />
                      Add Items
                    </Button>
                    <Button size="sm" className="flex-1 gap-2">
                      <Receipt className="w-3 h-3" />
                      Close Tab
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* New Tab Dialog */}
      <Dialog open={showNewTabDialog} onOpenChange={setShowNewTabDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Open New Tab
            </DialogTitle>
            <DialogDescription>
              Start a new tab for a customer. Pre-authorize a card for automatic payment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                placeholder="Enter customer name"
                value={newTabForm.customerName}
                onChange={(e) => setNewTabForm({ ...newTabForm, customerName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardLast4">Card Last 4 Digits (Optional)</Label>
              <Input
                id="cardLast4"
                placeholder="4242"
                maxLength={4}
                value={newTabForm.cardLast4}
                onChange={(e) => setNewTabForm({ ...newTabForm, cardLast4: e.target.value.replace(/\D/g, '') })}
              />
              <p className="text-xs text-muted-foreground">
                For credit card holds and automatic payment
              </p>
            </div>

            {newTabForm.cardLast4 && (
              <div className="space-y-2">
                <Label htmlFor="preAuthAmount">Pre-Authorization Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="preAuthAmount"
                    type="number"
                    placeholder="100"
                    className="pl-9"
                    value={newTabForm.preAuthAmount}
                    onChange={(e) => setNewTabForm({ ...newTabForm, preAuthAmount: e.target.value })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Amount to hold on card (typical: $50-$200)
                </p>
              </div>
            )}

            <div className="bg-muted p-3 rounded-lg space-y-1">
              <p className="text-xs font-medium">💡 Tab Best Practices</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Always get a card to hold for tabs</li>
                <li>Pre-authorize 20-50% more than expected tab</li>
                <li>Close tabs within 2 hours when possible</li>
                <li>Add 20% auto-gratuity for large tabs</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowNewTabDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 gap-2"
              onClick={handleOpenNewTab}
            >
              <Plus className="w-4 h-4" />
              Open Tab
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
