import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { Package, AlertTriangle, TrendingUp, TrendingDown, ClipboardList, ChevronDown, ChevronRight } from 'lucide-react';
import { DataTable } from './DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { useStore } from '../../lib/store';
import { Product, StockAdjustment, ProductVariation } from '../../lib/types';
import { Badge } from '../ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

export function InventoryModule() {
  const products = useStore((state) => state.products);
  const updateProductStock = useStore((state) => state.updateProductStock);
  const [showStockTaking, setShowStockTaking] = useState(false);
  const [showAdjustment, setShowAdjustment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [adjustmentNotes, setAdjustmentNotes] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const handleStockAdjustment = () => {
    if (!selectedProduct || !newQuantity || !adjustmentReason) {
      toast.error('Please fill in all required fields');
      return;
    }

    const qty = parseInt(newQuantity);
    if (isNaN(qty) || qty < 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    // Update stock - pass variationId if a variation is selected
    updateProductStock(selectedProduct.id, qty, selectedVariation?.id);
    
    const itemName = selectedVariation 
      ? `${selectedProduct.name} (${selectedVariation.name})` 
      : selectedProduct.name;
    toast.success(`Updated stock for ${itemName}`);
    setShowAdjustment(false);
    setSelectedProduct(null);
    setSelectedVariation(null);
    setAdjustmentReason('');
    setAdjustmentNotes('');
    setNewQuantity('');
  };

  const handleOpenAdjustment = (product: Product, variation?: ProductVariation) => {
    setSelectedProduct(product);
    setSelectedVariation(variation || null);
    
    // Set initial quantity based on whether we're adjusting a variation or main product
    const currentStock = variation 
      ? variation.stockQuantity 
      : product.stockQuantity;
    setNewQuantity(currentStock.toString());
    
    setShowAdjustment(true);
  };

  const toggleRowExpansion = (productId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedRows(newExpanded);
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Product Name',
      cell: ({ row }) => {
        const hasVariations = row.original.variations && row.original.variations.length > 0;
        const isExpanded = expandedRows.has(row.original.id);
        
        return (
          <div className="flex items-center gap-2">
            {hasVariations && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => toggleRowExpansion(row.original.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            )}
            <span>{row.original.name}</span>
            {hasVariations && (
              <Badge variant="secondary" className="text-xs">
                {row.original.variations.length} variations
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
      cell: ({ row }) => row.original.sku || '-',
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'stockQuantity',
      header: 'Total Stock',
      cell: ({ row }) => {
        const stock = row.original.stockQuantity;
        const isLow = stock < 10;
        return (
          <div className="flex items-center gap-2">
            <span className={isLow ? 'text-destructive' : ''}>{stock}</span>
            {isLow && <AlertTriangle className="w-4 h-4 text-destructive" />}
          </div>
        );
      },
    },
    {
      accessorKey: 'inStock',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.inStock ? 'default' : 'destructive'}>
          {row.original.inStock ? 'In Stock' : 'Out of Stock'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const hasVariations = row.original.variations && row.original.variations.length > 0;
        
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenAdjustment(row.original)}
            disabled={hasVariations}
            title={hasVariations ? 'Expand to adjust variations' : 'Adjust stock'}
          >
            {hasVariations ? 'See Variations' : 'Adjust Stock'}
          </Button>
        );
      },
    },
  ];

  // Filter products based on search
  const filteredProducts = products.filter((p) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.sku?.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.variations?.some(v => 
        v.name.toLowerCase().includes(query) || 
        v.sku.toLowerCase().includes(query)
      )
    );
  });

  const lowStockProducts = products.filter((p) => p.stockQuantity < 10 && p.stockQuantity > 0);
  const outOfStockProducts = products.filter((p) => p.stockQuantity === 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Inventory Management</h2>
          <p className="text-muted-foreground">
            Manage stock levels and perform stock takes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowStockTaking(true)}>
            <ClipboardList className="w-4 h-4 mr-2" />
            Stock Taking
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Products</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In inventory system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Low Stock</CardTitle>
            <TrendingDown className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-amber-500">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Less than 10 units
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Out of Stock</CardTitle>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-destructive">{outOfStockProducts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Need restocking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Levels</CardTitle>
          <CardDescription>
            View and manage stock levels for all products. Expand products to see and adjust variations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search products, SKU, or variations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div className="space-y-2">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No products found matching "{searchQuery}"
              </div>
            ) : (
              filteredProducts.map((product) => {
              const isExpanded = expandedRows.has(product.id);
              const hasVariations = product.variations && product.variations.length > 0;
              const stock = product.stockQuantity;
              const isLow = stock < 10;
              
              return (
                <div key={product.id} className="border rounded-lg">
                  {/* Main Product Row */}
                  <div className="flex items-center gap-4 p-4 hover:bg-muted/50">
                    <div className="flex-1 flex items-center gap-3">
                      {hasVariations && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleRowExpansion(product.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                      {!hasVariations && <div className="w-8" />}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span>{product.name}</span>
                          {hasVariations && (
                            <Badge variant="secondary" className="text-xs">
                              {product.variations.length} variations
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          SKU: {product.sku || '-'} • {product.category}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <span className={isLow ? 'text-destructive' : ''}>{stock}</span>
                      {isLow && <AlertTriangle className="w-4 h-4 text-destructive" />}
                    </div>
                    
                    <div className="min-w-[120px]">
                      <Badge variant={product.inStock ? 'default' : 'destructive'}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                    
                    <div className="min-w-[140px]">
                      {!hasVariations && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenAdjustment(product)}
                        >
                          Adjust Stock
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Variations Rows */}
                  {hasVariations && isExpanded && (
                    <div className="border-t bg-muted/30">
                      {product.variations?.map((variation) => {
                        const varStock = variation.stockQuantity || 0;
                        const varIsLow = varStock < 10;
                        
                        return (
                          <div
                            key={variation.id}
                            className="flex items-center gap-4 p-4 pl-16 hover:bg-muted/50 border-b last:border-b-0"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{variation.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  ${variation.price.toFixed(2)}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                SKU: {variation.sku}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 min-w-[100px]">
                              <span className={varIsLow ? 'text-destructive' : ''}>{varStock}</span>
                              {varIsLow && <AlertTriangle className="w-4 h-4 text-destructive" />}
                            </div>
                            
                            <div className="min-w-[120px]">
                              <Badge variant={varStock > 0 ? 'default' : 'destructive'} className="text-xs">
                                {varStock > 0 ? 'In Stock' : 'Out of Stock'}
                              </Badge>
                            </div>
                            
                            <div className="min-w-[140px]">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenAdjustment(product, variation)}
                              >
                                Adjust Stock
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stock Adjustment Dialog */}
      <Dialog open={showAdjustment} onOpenChange={setShowAdjustment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              Update stock levels for {selectedProduct?.name}
              {selectedVariation && ` - ${selectedVariation.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedVariation && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Adjusting Variation</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedVariation.name} • SKU: {selectedVariation.sku}
                    </p>
                  </div>
                  <Badge variant="outline">${selectedVariation.price.toFixed(2)}</Badge>
                </div>
              </div>
            )}
            
            <div>
              <Label>Current Stock</Label>
              <Input
                value={selectedVariation?.stockQuantity || selectedProduct?.stockQuantity || 0}
                disabled
                className="bg-muted"
              />
            </div>

            <div>
              <Label>New Quantity *</Label>
              <Input
                type="number"
                min="0"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                placeholder="Enter new stock quantity"
              />
            </div>

            <div>
              <Label>Reason *</Label>
              <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock_take">Stock Take</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="lost">Lost/Stolen</SelectItem>
                  <SelectItem value="received">Stock Received</SelectItem>
                  <SelectItem value="return">Customer Return</SelectItem>
                  <SelectItem value="correction">Correction</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={adjustmentNotes}
                onChange={(e) => setAdjustmentNotes(e.target.value)}
                placeholder="Additional notes (optional)"
                rows={3}
              />
            </div>

            {newQuantity && selectedProduct && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  Adjustment:{' '}
                  <span
                    className={
                      parseInt(newQuantity) > (selectedVariation?.stockQuantity || selectedProduct.stockQuantity)
                        ? 'text-green-600'
                        : 'text-destructive'
                    }
                  >
                    {parseInt(newQuantity) > (selectedVariation?.stockQuantity || selectedProduct.stockQuantity) ? '+' : ''}
                    {parseInt(newQuantity) - (selectedVariation?.stockQuantity || selectedProduct.stockQuantity)}
                  </span>
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjustment(false)}>
              Cancel
            </Button>
            <Button onClick={handleStockAdjustment}>Save Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Taking Dialog */}
      <Dialog open={showStockTaking} onOpenChange={setShowStockTaking}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Stock Taking</DialogTitle>
            <DialogDescription>
              Perform a complete stock take of your inventory
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This feature will allow you to count physical stock and update the system.
              Coming soon: Barcode scanner integration.
            </p>
            {/* TODO: Implement stock taking interface */}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStockTaking(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
