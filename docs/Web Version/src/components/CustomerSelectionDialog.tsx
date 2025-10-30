import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { useStore } from '../lib/store';
import { Customer } from '../lib/types';
import { Badge } from './ui/badge';
import { UserCircle, Search, Phone, Mail, DollarSign, TrendingUp } from 'lucide-react';

interface CustomerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
}

export function CustomerSelectionDialog({
  open,
  onOpenChange,
  currentCustomer,
  onSelectCustomer,
}: CustomerSelectionDialogProps) {
  const customers = useStore((state) => state.customers);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter customers based on search
  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query)
    );
  });

  // Sort by total spent (VIP customers first)
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const aSpent = a.totalSpent || 0;
    const bSpent = b.totalSpent || 0;
    return bSpent - aSpent;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
            <DialogDescription>
              Choose a customer for this order or remove the current selection.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex flex-col gap-4 min-h-0">
            {/* Search */}
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Remove Customer Button */}
            {currentCustomer && (
              <Button
                variant="outline"
                className="w-full justify-start border-dashed flex-shrink-0"
                onClick={() => {
                  onSelectCustomer(null);
                }}
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Remove Customer
              </Button>
            )}

            {/* Customer List */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-2">
                {sortedCustomers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <UserCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No customers found</p>
                    {searchQuery && (
                      <p className="text-sm mt-1">Try a different search term</p>
                    )}
                  </div>
                ) : (
                  sortedCustomers.map((customer) => (
                    <Button
                      key={customer.id}
                      variant={currentCustomer?.id === customer.id ? 'secondary' : 'ghost'}
                      className="w-full justify-start h-auto py-3 px-4"
                      onClick={() => {
                        onSelectCustomer(customer);
                      }}
                    >
                      <div className="flex items-start gap-3 w-full">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-sm">
                            {customer.firstName[0]}
                            {customer.lastName[0]}
                          </span>
                        </div>

                        {/* Customer Info */}
                        <div className="flex-1 text-left space-y-1">
                          <div className="flex items-center gap-2">
                            <span>{customer.name}</span>
                            {customer.tags && customer.tags.length > 0 && (
                              <div className="flex gap-1">
                                {customer.tags.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant={tag === 'VIP' ? 'default' : 'outline'}
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3" />
                              {customer.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              {customer.phone}
                            </div>
                          </div>

                          {/* Customer Stats */}
                          {customer.totalSpent !== undefined && customer.totalSpent > 0 && (
                            <div className="flex gap-3 mt-2 pt-2 border-t border-border/50">
                              <div className="flex items-center gap-1 text-xs">
                                <DollarSign className="w-3 h-3 text-emerald-600 dark:text-emerald-600" />
                                <span className="text-muted-foreground">
                                  ${customer.totalSpent.toFixed(0)} spent
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <TrendingUp className="w-3 h-3 text-sky-600 dark:text-sky-600" />
                                <span className="text-muted-foreground">
                                  {customer.visitCount} visits
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
  );
}