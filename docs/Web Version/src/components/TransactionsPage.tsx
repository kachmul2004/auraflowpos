import { useStore } from '../lib/store';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { ArrowLeft } from 'lucide-react';

interface TransactionsPageProps {
  onBack: () => void;
}

export function TransactionsPage({ onBack }: TransactionsPageProps) {
  const currentShift = useStore(state => state.currentShift);

  if (!currentShift) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <header className="border-b border-border px-6 py-4 bg-card">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1>Transactions</h1>
              <p className="text-sm text-muted-foreground">View all transactions for the current session</p>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No active shift</p>
        </div>
      </div>
    );
  }

  const transactions = [...currentShift.transactions].reverse();

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b border-border px-6 py-4 bg-card">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>Transactions</h1>
            <p className="text-sm text-muted-foreground">View all transactions for the current session</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden p-6">
        <div className="max-w-5xl mx-auto h-full">
          <ScrollArea className="h-full">
            {transactions.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-muted-foreground">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-4 pb-6">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-6 bg-card border border-border rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={transaction.type === 'sale' ? 'default' : 'secondary'}>
                            {transaction.type.toUpperCase()}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {transaction.customer && (
                          <p className="text-sm text-muted-foreground">
                            Customer: {transaction.customer.name}
                          </p>
                        )}
                        {transaction.notes && (
                          <p className="text-sm text-muted-foreground">
                            Note: {transaction.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl">${transaction.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.paymentMethod}
                        </p>
                      </div>
                    </div>

                    {transaction.items && transaction.items.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border text-sm">
                        <p className="font-medium mb-2">Items:</p>
                        <ul className="space-y-1">
                          {transaction.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-muted-foreground">
                              <span>
                                {item.product.name} x{item.quantity}
                              </span>
                              <span>
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
