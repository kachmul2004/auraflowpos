import { Search, ShoppingCart as CartIcon, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useStore } from '../lib/store';

interface MobileHeaderProps {
  onOpenCart: () => void;
  onOpenFilter: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MobileHeader({ onOpenCart, onOpenFilter, searchQuery, onSearchChange }: MobileHeaderProps) {
  const cart = useStore(state => state.cart);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="lg:hidden sticky top-0 z-50 bg-background border-b border-border">
      {/* Title Bar */}
      <div className="px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl">AuraFlow POS</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenCart}
          className="relative"
        >
          <CartIcon className="w-6 h-6" />
          {itemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-muted/50"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={onOpenFilter}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
