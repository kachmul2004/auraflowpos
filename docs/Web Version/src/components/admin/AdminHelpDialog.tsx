import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  HelpCircle,
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  Monitor,
  BarChart3,
  Settings,
  CheckCircle2,
} from 'lucide-react';

interface AdminHelpDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AdminHelpDialog({ open, onClose }: AdminHelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Admin Dashboard Guide
          </DialogTitle>
          <DialogDescription>
            Complete guide for administrators and managers
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4 pr-4">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <section>
                <h3 className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Welcome to Admin Dashboard
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The admin dashboard provides comprehensive tools for managing your business operations,
                  from product catalog to staff performance analytics.
                </p>
              </section>

              <section>
                <h4 className="mb-2">Dashboard Sections</h4>
                <div className="space-y-3">
                  <div className="flex gap-3 p-3 bg-muted rounded-lg">
                    <LayoutDashboard className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Dashboard Home</p>
                      <p className="text-xs text-muted-foreground">
                        View sales summary, inventory alerts, and quick actions
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 bg-muted rounded-lg">
                    <Package className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Products</p>
                      <p className="text-xs text-muted-foreground">
                        Manage product catalog, prices, inventory, and variations
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 bg-muted rounded-lg">
                    <FolderTree className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Categories</p>
                      <p className="text-xs text-muted-foreground">
                        Organize products into categories for easier browsing
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 bg-muted rounded-lg">
                    <Users className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Users</p>
                      <p className="text-xs text-muted-foreground">
                        Manage staff accounts, roles, and permissions
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 bg-muted rounded-lg">
                    <Monitor className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Terminals</p>
                      <p className="text-xs text-muted-foreground">
                        Configure POS terminals and receipt settings
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 bg-muted rounded-lg">
                    <BarChart3 className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Reports</p>
                      <p className="text-xs text-muted-foreground">
                        View sales analytics, staff performance, and business insights
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 bg-muted rounded-lg">
                    <Settings className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Settings</p>
                      <p className="text-xs text-muted-foreground">
                        Configure business profile, tax settings, and system preferences
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="mb-2">Navigation</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Use the sidebar to navigate between different sections</p>
                  <p>• Click "Back to POS" to return to the cashier interface</p>
                  <p>• Use the search bar in the top navigation for quick access</p>
                  <p>• Access help from any section using the Help button in sidebar</p>
                </div>
              </section>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <section>
                <h3 className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-primary" />
                  Product Management
                </h3>
              </section>

              <section>
                <h4 className="mb-2">Creating Products</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Click "Add Product" button</li>
                  <li>Enter product name (required)</li>
                  <li>Set price (required)</li>
                  <li>Select or create category (required)</li>
                  <li>Add SKU/barcode (optional but recommended)</li>
                  <li>Set stock quantity</li>
                  <li>Toggle "In Stock" availability</li>
                  <li>Add description (optional)</li>
                  <li>Click "Create Product"</li>
                </ol>
              </section>

              <section>
                <h4 className="mb-2">Editing Products</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Click the Edit icon next to any product</p>
                  <p>• Update fields as needed</p>
                  <p>• Changes take effect immediately in POS</p>
                </div>
              </section>

              <section>
                <h4 className="mb-2">Stock Management</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Stock levels update automatically with each sale</p>
                  <p>• Low stock items (under 10 units) highlighted in amber</p>
                  <p>• Out of stock items cannot be added to cart in POS</p>
                  <p>• Use stock quantity field to adjust inventory</p>
                </div>
              </section>

              <section>
                <h4 className="mb-2">Search and Filter</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Search by product name, SKU, or category</p>
                  <p>• Results update in real-time as you type</p>
                </div>
              </section>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <section>
                <h3 className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-primary" />
                  User Management
                </h3>
              </section>

              <section>
                <h4 className="mb-2">Creating User Accounts</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Click "Add User" button</li>
                  <li>Enter full name and email</li>
                  <li>Set 4-digit PIN for POS login</li>
                  <li>Select role (Cashier, Manager, or Admin)</li>
                  <li>Check permissions for the user</li>
                  <li>Click "Create User"</li>
                </ol>
              </section>

              <section>
                <h4 className="mb-2">User Roles</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-medium mb-1">Cashier</p>
                    <p className="text-muted-foreground">
                      Basic POS access for processing sales. Requires manager approval for voids,
                      returns, and price overrides.
                    </p>
                  </div>

                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-medium mb-1">Manager</p>
                    <p className="text-muted-foreground">
                      Full POS access including voids, returns, price overrides, and cash management.
                      Can approve cashier requests.
                    </p>
                  </div>

                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-medium mb-1">Admin</p>
                    <p className="text-muted-foreground">
                      Complete system access including dashboard, user management, settings, and all
                      manager permissions.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="mb-2">Permissions</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Process Sales - Ring up transactions</p>
                  <p>• Void Items - Remove items with reason tracking</p>
                  <p>• Price Override - Change item prices</p>
                  <p>• Process Returns - Handle refunds and exchanges</p>
                  <p>• Cash Management - Access cash drawer operations</p>
                  <p>• View Reports - Access sales and business reports</p>
                  <p>• Manage Products - Edit product catalog</p>
                  <p>• Manage Users - Create and edit user accounts</p>
                </div>
              </section>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <section>
                <h3 className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Reports & Analytics
                </h3>
              </section>

              <section>
                <h4 className="mb-2">Available Reports</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-medium mb-1">Sales Reports</p>
                    <p className="text-muted-foreground">
                      View sales by hour, day, week, or month. Track revenue trends and identify
                      peak sales periods.
                    </p>
                  </div>

                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-medium mb-1">Product Performance</p>
                    <p className="text-muted-foreground">
                      See top-selling products, category breakdown, and inventory movement.
                    </p>
                  </div>

                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-medium mb-1">Staff Performance</p>
                    <p className="text-muted-foreground">
                      Track individual cashier sales, average order value, and transaction counts.
                    </p>
                  </div>

                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-medium mb-1">Void Analysis</p>
                    <p className="text-muted-foreground">
                      Monitor voided items by user, reason, and frequency to identify training needs.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="mb-2">Exporting Data</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Click "Export" button to download report data</p>
                  <p>• Available formats: PDF, Excel/CSV</p>
                  <p>• Exports include current filters and date range</p>
                </div>
              </section>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <section>
                <h3 className="flex items-center gap-2 mb-3">
                  <Settings className="w-5 h-5 text-primary" />
                  System Settings
                </h3>
              </section>

              <section>
                <h4 className="mb-2">Business Profile</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Update business name, address, and contact information</p>
                  <p>• Set tax ID / EIN for receipts and reports</p>
                  <p>• Select industry type to customize POS features</p>
                  <p>• Changes are saved immediately</p>
                </div>
              </section>

              <section>
                <h4 className="mb-2">Tax Configuration</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Set tax rate as a percentage</p>
                  <p>• Customize tax label (e.g., "Sales Tax", "VAT")</p>
                  <p>• Toggle tax-inclusive pricing</p>
                  <p>• Tax automatically calculated on all sales</p>
                </div>
              </section>

              <section>
                <h4 className="mb-2">Receipt Settings</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Configure receipt header and footer</p>
                  <p>• Toggle logo, tax ID, and thank you message</p>
                  <p>• Enable email receipt option</p>
                  <p>• Settings apply to all terminals</p>
                </div>
              </section>

              <section>
                <h4 className="mb-2">Industry Configuration</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Select industry type in Business Profile</p>
                  <p>• Restaurant: Table management, order types</p>
                  <p>• Retail: Barcode scanning, inventory focus</p>
                  <p>• Pharmacy: Prescription tracking, compliance</p>
                  <p>• Furniture: Custom orders, delivery scheduling</p>
                </div>
              </section>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
