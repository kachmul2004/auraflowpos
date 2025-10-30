import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ShoppingCart, 
  CreditCard, 
  Archive, 
  Search, 
  RotateCcw,
  DollarSign,
  FileText,
  Keyboard,
  Clock,
  GraduationCap,
  Zap,
  AlertCircle,
  CheckCircle2,
  Info,
  XCircle,
  Scan,
  Maximize2
} from 'lucide-react';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

export function HelpDialog({ open, onClose }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            AuraFlow POS User Guide
          </DialogTitle>
          <DialogDescription>
            Complete guide for cashiers and managers
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4 pr-4">
            {/* Getting Started Tab */}
            <TabsContent value="getting-started" className="space-y-6">
              <section>
                <h3 className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  Welcome to AuraFlow POS
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  AuraFlow POS is a modern point-of-sale system designed to make checkout fast and efficient.
                  This guide will help you get started and master all features.
                </p>
              </section>

              <Separator />

              <section>
                <h4 className="mb-2">Clocking In</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Log in with your credentials</li>
                  <li>Click <Badge variant="outline">Clock In</Badge> button to start your session</li>
                  <li>Select your terminal</li>
                  <li>Enter your starting cash drawer balance</li>
                  <li>Click "Clock In" to begin</li>
                </ol>
              </section>

              <section>
                <h4 className="mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                  Training Mode
                </h4>
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg text-sm space-y-2">
                  <p className="font-medium">What is Training Mode?</p>
                  <p>
                    Training Mode allows you to practice using the POS without affecting real business data.
                    When enabled:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Transactions are marked as "training"</li>
                    <li>Inventory is NOT deducted</li>
                    <li>Sales are NOT included in reports</li>
                    <li>Financial records are NOT affected</li>
                  </ul>
                  <p className="font-medium mt-2">How to Enable:</p>
                  <p>Toggle the "Training" switch in the top header or press <kbd className="px-1.5 py-0.5 bg-muted rounded">Ctrl+Shift+T</kbd></p>
                  
                  <div className="mt-3 p-2 bg-destructive/20 text-destructive rounded border border-destructive/30">
                    <p className="font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Important Warning
                    </p>
                    <p className="mt-1">
                      Always turn OFF Training Mode before processing real customer transactions. 
                      Transactions in training mode will NOT be recorded in your sales or financial data!
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="mb-2">Understanding the Interface</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="w-24 shrink-0 font-medium">Left Side:</div>
                    <div className="text-muted-foreground">Product grid with categories and search</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-24 shrink-0 font-medium">Right Side:</div>
                    <div className="text-muted-foreground">Shopping cart with current order items</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-24 shrink-0 font-medium">Bottom:</div>
                    <div className="text-muted-foreground">Action bar with clock status, cash drawer, and other functions</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-24 shrink-0 font-medium">Top:</div>
                    <div className="text-muted-foreground">Status indicators (online, clocked in status, user)</div>
                  </div>
                </div>
              </section>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <section>
                <h3 className="flex items-center gap-2 mb-3">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  Taking Orders
                </h3>
              </section>

              <section>
                <h4 className="mb-2">Adding Items to Cart</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Click on a product in the product grid</li>
                  <li>If the item has variations (size, color, etc.), select the variation</li>
                  <li>Add any modifiers (extras, toppings, etc.)</li>
                  <li>Adjust quantity if needed</li>
                  <li>Click "Add to Cart"</li>
                </ol>
              </section>

              <section>
                <h4 className="mb-2">Managing Cart Items</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium mb-1">Change Quantity:</p>
                    <p className="text-muted-foreground">Use +/- buttons or click the quantity number to enter a specific amount</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Item Actions Menu:</p>
                    <p className="text-muted-foreground">Click the three dots (⋮) on any cart item to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Edit quantity</li>
                      <li>Apply item-specific discount</li>
                      <li>Override price (requires permission)</li>
                      <li>Void item (requires permission & reason)</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-destructive" />
                  Understanding Void Tracking
                </h4>
                <div className="p-3 bg-muted rounded-lg text-sm space-y-2">
                  <p className="font-medium">What Happens When You Void an Item?</p>
                  <p className="text-muted-foreground">
                    Voiding removes an item from the cart <span className="font-medium text-foreground">with full audit trail</span>. 
                    The system records:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                    <li>Item name and price</li>
                    <li>Your user ID</li>
                    <li>Exact timestamp</li>
                    <li>Your reason (required field)</li>
                  </ul>
                  <div className="mt-2 p-2 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded border border-amber-500/30">
                    <p className="font-medium">Why This Matters:</p>
                    <p className="text-sm">
                      Void tracking prevents theft, identifies patterns, and provides accountability. 
                      All voids appear in management reports and are regularly audited.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="mb-2">Order Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <Badge variant="outline" className="mr-2">Customer</Badge>
                    <span className="text-muted-foreground">Click "Add Customer" to select a customer for the order</span>
                  </div>
                  <div>
                    <Badge variant="outline" className="mr-2">Order Type</Badge>
                    <span className="text-muted-foreground">Select Dine-in, Takeout, or Delivery</span>
                  </div>
                  <div>
                    <Badge variant="outline" className="mr-2">Notes</Badge>
                    <span className="text-muted-foreground">Click "Order Notes" to add special instructions</span>
                  </div>
                  <div>
                    <Badge variant="outline" className="mr-2">Discount</Badge>
                    <span className="text-muted-foreground">Click "Discount" to apply order-level discount (percentage or fixed)</span>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="mb-2 flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Parking Sales
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Park a sale to temporarily save it and start a new order.
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Click "Park Sale" button</li>
                  <li>The current order is saved</li>
                  <li>Cart is cleared for a new order</li>
                  <li>To resume: Click "Park Sale" again and select the parked order</li>
                </ol>
                <div className="mt-2 p-2 bg-muted rounded text-xs">
                  <Info className="w-3 h-3 inline mr-1" />
                  A badge shows the number of parked sales on the button
                </div>
              </section>

              <section>
                <h4 className="mb-2 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Finding Products
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium mb-1">Quick Search:</p>
                    <p className="text-muted-foreground">
                      Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">F3</kbd> or click "Lookup" to open search bar
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Search by:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                      <li>Product name</li>
                      <li>SKU number</li>
                      <li>Barcode (scan or type)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Category Filter:</p>
                    <p className="text-muted-foreground">Click category tabs above the product grid</p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="mb-2 flex items-center gap-2">
                  <Scan className="w-4 h-4 text-success" />
                  Barcode Scanner
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Quickly add products to cart by scanning barcodes with a USB scanner or manual entry.
                </p>
                
                <div className="space-y-3">
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg text-sm">
                    <p className="font-medium text-success mb-2">USB Barcode Scanner (Recommended):</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                      <li>Click the green "Scan" button in action bar</li>
                      <li>Ensure the input field is focused (auto-focuses)</li>
                      <li>Scan any product barcode with your USB scanner</li>
                      <li>Product is automatically added to cart!</li>
                      <li>Continue scanning more items</li>
                    </ol>
                    <div className="mt-2 p-2 bg-muted rounded">
                      <p className="text-xs">
                        <Info className="w-3 h-3 inline mr-1" />
                        USB scanners work like keyboards - just scan!
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-1 text-sm">Manual Barcode Entry:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-2">
                      <li>Click "Scan" button</li>
                      <li>Type barcode or SKU number</li>
                      <li>Press Enter or click "Scan"</li>
                      <li>Product added if found</li>
                    </ol>
                  </div>

                  <div>
                    <p className="font-medium mb-1 text-sm">View Scan History:</p>
                    <p className="text-sm text-muted-foreground">
                      Click the "History" tab in scanner dialog to see all recent scans with success/failure status.
                      You can re-scan items or clear history.
                    </p>
                  </div>

                  <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-600">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    If a product isn't found, check that the product has a barcode or SKU assigned in the admin panel.
                  </div>
                </div>
              </section>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6">
              <section>
                <h3 className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-success" />
                  Processing Payments
                </h3>
              </section>

              <section>
                <h4 className="mb-2">Standard Checkout</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Review items and total in cart</li>
                  <li>Click the green "Charge" button</li>
                  <li>Select payment method (Cash, Card, etc.)</li>
                  <li>For cash: Enter amount tendered, change is calculated</li>
                  <li>For card: Process card payment</li>
                  <li>Add tip if applicable (Dine-in only)</li>
                  <li>Click "Complete Payment"</li>
                  <li>Receipt is displayed</li>
                </ol>
              </section>

              <section>
                <h4 className="mb-2">Payment Methods</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 border border-border rounded-lg">
                    <p className="font-medium mb-1">Cash</p>
                    <p className="text-xs text-muted-foreground">
                      Enter amount received. Change is calculated automatically.
                      Opens cash drawer.
                    </p>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <p className="font-medium mb-1">Credit/Debit Card</p>
                    <p className="text-xs text-muted-foreground">
                      Process card payment through terminal. Enter last 4 digits for reference.
                    </p>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <p className="font-medium mb-1">Cheque</p>
                    <p className="text-xs text-muted-foreground">
                      Accept check payment. Enter check number for tracking.
                    </p>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <p className="font-medium mb-1">Gift Card</p>
                    <p className="text-xs text-muted-foreground">
                      Redeem gift card. Enter card number. Balance is checked automatically.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="mb-2">Split Payments</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Accept multiple payment methods for a single order.
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>In payment dialog, select first payment method</li>
                  <li>Enter partial amount</li>
                  <li>Click "Add Payment"</li>
                  <li>Repeat for additional payment methods</li>
                  <li>Remaining balance shows what's left to pay</li>
                  <li>Complete when balance reaches $0.00</li>
                </ol>
              </section>

              <section>
                <h4 className="mb-2">Tipping</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    Tips are available for Dine-in orders only (not Takeout/Delivery).
                  </p>
                  <div className="p-3 bg-muted rounded">
                    <p className="font-medium mb-2">Quick Tip Percentages:</p>
                    <div className="flex gap-2">
                      <Badge>15%</Badge>
                      <Badge>18%</Badge>
                      <Badge>20%</Badge>
                      <Badge>25%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Or enter a custom tip amount
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="mb-2">Gift Cards</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium mb-1">Selling Gift Cards:</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                      <li>In payment dialog, click "Create Gift Card"</li>
                      <li>Enter amount for new gift card</li>
                      <li>Complete payment for the gift card</li>
                      <li>Gift card code is generated</li>
                    </ol>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Redeeming Gift Cards:</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                      <li>Select "Gift Card" as payment method</li>
                      <li>Enter or scan gift card code</li>
                      <li>Available balance is shown</li>
                      <li>Amount is deducted from card</li>
                    </ol>
                  </div>
                </div>
              </section>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-6">
              <section>
                <h3 className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-warning" />
                  Advanced Features
                </h3>
              </section>

              <section>
                <h4 className="mb-2 flex items-center gap-2">
                  <Maximize2 className="w-4 h-4" />
                  Fullscreen Mode
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Maximize screen space for a distraction-free POS experience.
                </p>
                <div className="p-3 bg-accent/50 rounded-lg text-sm space-y-2">
                  <p className="font-medium">How to Use:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                    <li>Click "Fullscreen" button in the action bar</li>
                    <li>Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">F11</kbd> on your keyboard</li>
                    <li>To exit: Click "Exit Fullscreen" or press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">F11</kbd> again</li>
                    <li>Or press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd> to exit fullscreen</li>
                  </ul>
                  <p className="text-muted-foreground">
                    💡 Tip: Use fullscreen mode during busy periods to maximize visibility of products and cart.
                  </p>
                </div>
              </section>

              <section>
                <h4 className="mb-2 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Returns & Refunds
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Process returns for previous purchases.
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Click "Returns" button in action bar</li>
                  <li>Search for original transaction</li>
                  <li>Select items to return</li>
                  <li>Enter return reason</li>
                  <li>Process refund to original payment method</li>
                </ol>
              </section>

              <section>
                <h4 className="mb-2">Void Items</h4>
                <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm space-y-2">
                  <p className="font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Requires Permission
                  </p>
                  <p>
                    Voiding removes an item from the cart with full audit trail.
                    Different from regular removal - all voids are logged.
                  </p>
                  <p className="font-medium mt-2">How to Void:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Click item menu (⋮) in cart</li>
                    <li>Select "Void Item"</li>
                    <li>Enter reason (required)</li>
                    <li>Confirm void</li>
                  </ol>
                </div>
              </section>

              <section>
                <h4 className="mb-2">Price Override</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    Override an item's price for special circumstances.
                  </p>
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
                    <p className="font-medium mb-1">Requires manager approval if you don't have permission</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Click item menu (⋮) in cart</li>
                      <li>Select "Price Override"</li>
                      <li>Enter new price</li>
                      <li>Enter reason (required)</li>
                      <li>Manager may need to approve with PIN</li>
                    </ol>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="mb-2">Item Discounts</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Apply discounts to specific items (different from order-level discounts).
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Click item menu (⋮) in cart</li>
                  <li>Select "Item Discount"</li>
                  <li>Choose percentage or fixed amount</li>
                  <li>Enter discount value</li>
                  <li>Preview shows new price</li>
                </ol>
              </section>

              <section>
                <h4 className="mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Cash Drawer Operations
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium mb-1">No Sale (Open Drawer):</p>
                    <p className="text-muted-foreground">
                      Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">F10</kbd> to open cash drawer without a sale
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Cash In/Out:</p>
                    <p className="text-muted-foreground">Click "Cash Drawer" → Select "Cash In" or "Cash Out"</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1 text-muted-foreground">
                      <li>Cash In: Adding money to drawer (e.g., starting float)</li>
                      <li>Cash Out: Removing money (e.g., safe drop, expense)</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="mb-2">Recent Orders</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  View and reprint receipts for recent transactions.
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Click "Orders" button in action bar</li>
                  <li>Browse recent completed orders</li>
                  <li>Click "View Receipt" to see details</li>
                  <li>Click "Reprint Receipt" if needed</li>
                </ol>
              </section>

              <section>
                <h4 className="mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Clocking Out
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Click "Clock Out" in action bar</li>
                  <li>Count cash drawer</li>
                  <li>Enter closing balance</li>
                  <li>Z-Report is generated showing session summary</li>
                  <li>Review sales, payments, and cash reconciliation</li>
                  <li>Print or save report</li>
                </ol>
              </section>
            </TabsContent>

            {/* Shortcuts Tab */}
            <TabsContent value="shortcuts" className="space-y-6">
              <section>
                <h3 className="flex items-center gap-2 mb-3">
                  <Keyboard className="w-5 h-5 text-purple-500" />
                  Keyboard Shortcuts
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Speed up your workflow with these keyboard shortcuts
                </p>
              </section>

              <div className="grid grid-cols-2 gap-6">
                <section>
                  <h4 className="mb-3">General</h4>
                  <div className="space-y-2 text-sm">
                    <ShortcutRow keys={["F1"]} description="Show keyboard shortcuts" />
                    <ShortcutRow keys={["F2"]} description="Park current sale" />
                    <ShortcutRow keys={["F3"]} description="Search products" />
                    <ShortcutRow keys={["Ctrl", "K"]} description="Quick search" />
                    <ShortcutRow keys={["Esc"]} description="Close dialogs / Clear search" />
                  </div>
                </section>

                <section>
                  <h4 className="mb-3">Payment</h4>
                  <div className="space-y-2 text-sm">
                    <ShortcutRow keys={["F4"]} description="Cash payment" />
                    <ShortcutRow keys={["F5"]} description="Card payment" />
                    <ShortcutRow keys={["F6"]} description="Process payment" />
                    <ShortcutRow keys={["Ctrl", "T"]} description="Add tip" />
                  </div>
                </section>

                <section>
                  <h4 className="mb-3">Orders</h4>
                  <div className="space-y-2 text-sm">
                    <ShortcutRow keys={["F7"]} description="Recent orders" />
                    <ShortcutRow keys={["F8"]} description="Process return" />
                    <ShortcutRow keys={["Ctrl", "R"]} description="Reload parked sale" />
                    <ShortcutRow keys={["Ctrl", "N"]} description="Clear cart / New order" />
                  </div>
                </section>

                <section>
                  <h4 className="mb-3">Cash Drawer</h4>
                  <div className="space-y-2 text-sm">
                    <ShortcutRow keys={["F9"]} description="Open cash drawer" />
                    <ShortcutRow keys={["F10"]} description="No sale (open drawer)" />
                    <ShortcutRow keys={["Ctrl", "D"]} description="Cash in/out" />
                  </div>
                </section>

                <section>
                  <h4 className="mb-3">Cart Actions</h4>
                  <div className="space-y-2 text-sm">
                    <ShortcutRow keys={["Delete"]} description="Remove selected item" />
                    <ShortcutRow keys={["Ctrl", "+"]} description="Increase quantity" />
                    <ShortcutRow keys={["Ctrl", "-"]} description="Decrease quantity" />
                    <ShortcutRow keys={["Ctrl", "I"]} description="Apply item discount" />
                    <ShortcutRow keys={["Ctrl", "P"]} description="Price override" />
                  </div>
                </section>

                <section>
                  <h4 className="mb-3">Admin</h4>
                  <div className="space-y-2 text-sm">
                    <ShortcutRow keys={["F11"]} description="View clock status summary" />
                    <ShortcutRow keys={["F12"]} description="View transactions" />
                    <ShortcutRow keys={["Ctrl", "L"]} description="Lock screen" />
                    <ShortcutRow keys={["Ctrl", "Shift", "T"]} description="Toggle training mode" />
                  </div>
                </section>
              </div>

              <section className="mt-6">
                <div className="p-4 bg-primary/10 text-primary rounded-lg">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Pro Tip
                  </p>
                  <p className="text-sm">
                    Most keyboard shortcuts are also shown as hints next to buttons throughout the interface.
                    Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">F1</kbd> anytime to see the full list!
                  </p>
                </div>
              </section>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function ShortcutRow({ keys, description }: { keys: string[], description: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{description}</span>
      <div className="flex gap-1">
        {keys.map((key, i) => (
          <span key={i} className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
              {key}
            </kbd>
            {i < keys.length - 1 && (
              <span className="text-xs text-muted-foreground">+</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}