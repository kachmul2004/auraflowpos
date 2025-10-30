import { ReactNode } from 'react';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  FileText, 
  Inbox,
  Search,
  Database,
  TrendingUp,
  UtensilsCrossed,
  Receipt
} from 'lucide-react';
import { Button } from '../ui/button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div className="text-center max-w-md">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          {icon || <Inbox className="h-8 w-8 text-muted-foreground" />}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-6">{description}</p>
        )}
        {action}
      </div>
    </div>
  );
}

// No Products
export function EmptyProducts({ onAddProduct }: { onAddProduct?: () => void }) {
  return (
    <EmptyState
      icon={<Package className="h-8 w-8 text-muted-foreground" />}
      title="No products yet"
      description="Get started by adding your first product to the catalog."
      action={
        onAddProduct && (
          <Button onClick={onAddProduct}>
            <Package className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        )
      }
    />
  );
}

// No Customers
export function EmptyCustomers({ onAddCustomer }: { onAddCustomer?: () => void }) {
  return (
    <EmptyState
      icon={<Users className="h-8 w-8 text-muted-foreground" />}
      title="No customers yet"
      description="Start building your customer base by adding your first customer."
      action={
        onAddCustomer && (
          <Button onClick={onAddCustomer}>
            <Users className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        )
      }
    />
  );
}

// No Orders
export function EmptyOrders() {
  return (
    <EmptyState
      icon={<ShoppingCart className="h-8 w-8 text-muted-foreground" />}
      title="No orders yet"
      description="Orders will appear here once customers start making purchases."
    />
  );
}

// No Transactions
export function EmptyTransactions() {
  return (
    <EmptyState
      icon={<Receipt className="h-8 w-8 text-muted-foreground" />}
      title="No transactions yet"
      description="Transaction history will appear here once you start processing sales."
    />
  );
}

// No Reports
export function EmptyReports({ onGenerate }: { onGenerate?: () => void }) {
  return (
    <EmptyState
      icon={<FileText className="h-8 w-8 text-muted-foreground" />}
      title="No reports available"
      description="Generate your first report to see business insights and analytics."
      action={
        onGenerate && (
          <Button onClick={onGenerate}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        )
      }
    />
  );
}

// No Search Results
export function EmptySearchResults({ 
  query,
  onClear 
}: { 
  query: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      icon={<Search className="h-8 w-8 text-muted-foreground" />}
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search.`}
      action={
        onClear && (
          <Button variant="outline" onClick={onClear}>
            Clear Search
          </Button>
        )
      }
    />
  );
}

// No Data
export function EmptyData({ 
  resource = 'data',
  message
}: { 
  resource?: string;
  message?: string;
}) {
  return (
    <EmptyState
      icon={<Database className="h-8 w-8 text-muted-foreground" />}
      title={`No ${resource} available`}
      description={message || `There is no ${resource} to display at the moment.`}
    />
  );
}

// Empty Cart
export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <ShoppingCart className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Cart is empty</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Add items to the cart to start a new order
      </p>
    </div>
  );
}

// Empty Kitchen Display
export function EmptyKitchen() {
  return (
    <EmptyState
      icon={<UtensilsCrossed className="h-8 w-8 text-muted-foreground" />}
      title="No active orders"
      description="New orders will appear here when customers place them."
    />
  );
}

// Empty Open Tabs
export function EmptyTabs({ onCreateTab }: { onCreateTab?: () => void }) {
  return (
    <EmptyState
      icon={<Receipt className="h-8 w-8 text-muted-foreground" />}
      title="No open tabs"
      description="Open a new tab to start tracking customer orders."
      action={
        onCreateTab && (
          <Button onClick={onCreateTab}>
            <Receipt className="w-4 h-4 mr-2" />
            Open New Tab
          </Button>
        )
      }
    />
  );
}

// Generic Empty State with custom content
export function CustomEmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon?: any;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <EmptyState
      icon={<Icon className="h-8 w-8 text-muted-foreground" />}
      title={title}
      description={description}
      action={
        actionLabel && onAction && (
          <Button onClick={onAction}>{actionLabel}</Button>
        )
      }
    />
  );
}
