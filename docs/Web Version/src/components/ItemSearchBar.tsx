import { useState, useEffect, useRef } from 'react';
import { Search, Barcode, X } from 'lucide-react';
import { Input } from './ui/input';
import { useStore } from '../lib/store';
import { Product } from '../lib/types';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

interface ItemSearchBarProps {
  onSelectProduct: (product: Product) => void;
}

export function ItemSearchBar({ onSelectProduct }: ItemSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchProducts = useStore(state => state.searchProducts);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const results = searchQuery.length > 0 ? searchProducts(searchQuery) : [];
  
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);
  
  const handleSelect = (product: Product) => {
    onSelectProduct(product);
    setSearchQuery('');
    setShowResults(false);
    inputRef.current?.focus();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowResults(false);
        setSearchQuery('');
        break;
    }
  };
  
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search by name, SKU, or scan barcode..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-20 bg-input-background"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSearchQuery('');
              setShowResults(false);
              inputRef.current?.focus();
            }}
            className="absolute right-9 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        <Barcode className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>
      
      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-96 overflow-hidden"
        >
          <ScrollArea className="max-h-96">
            {results.map((product, index) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
                className={`w-full px-4 py-3 text-left hover:bg-accent transition-colors ${
                  index === selectedIndex ? 'bg-accent' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                      {product.sku && <span>SKU: {product.sku}</span>}
                      <span>•</span>
                      <span>{product.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
