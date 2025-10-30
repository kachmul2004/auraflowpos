export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  name: string; // Computed: firstName + lastName
  pin: string;
  roles: string[];
  permissions: Permission[];
  isAdmin: boolean;
  terminals: Terminal[];
}

export type Permission = 
  | 'void_items'
  | 'void_transactions'
  | 'apply_discounts'
  | 'price_override'
  | 'process_returns'
  | 'open_cash_drawer'
  | 'manager_override'
  | 'view_reports'
  | 'modify_orders'
  | 'all';

export type OrderType = 'dine-in' | 'takeout' | 'delivery' | 'in-store' | 'pickup';

export interface OrderTypeConfig {
  id: OrderType;
  label: string;
  enabled: boolean;
  icon?: string;
}

export interface Terminal {
  id: string;
  name: string;
  receiptTemplate?: ReceiptTemplate;
  zreportTemplate?: ReceiptTemplate;
  expensesReportTemplate?: ReceiptTemplate;
}

export interface ReceiptTemplate {
  id: string;
  name: string;
  header: string;
  footer: string;
}

export interface Modifier {
  id: string;
  name: string;
  price?: number;
}

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  sku?: string;
}

export interface VariationType {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  cost?: number; // Cost price for margins
  priceDisplay: string;
  category: string;
  imageUrl?: string;
  inStock: boolean;
  stockQuantity: number;
  sku?: string;
  barcode?: string; // UPC/EAN barcode
  variationType?: VariationType;
  variations?: ProductVariation[];
  modifiers?: Modifier[];
  isVariable?: boolean; // Variable weight/price product
  recipeId?: string; // Link to recipe if product uses one
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  name: string; // Computed: firstName + lastName
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  birthday?: string; // ISO date string
  notes?: string;
  tags?: string[]; // e.g., ['VIP', 'Wholesale', 'Local']
  marketingOptIn?: boolean;
  createdAt: Date;
  lastVisit?: Date;
  totalSpent?: number; // Computed
  visitCount?: number; // Computed
  averageOrderValue?: number; // Computed
  lifetimeValue?: number; // Computed
  // Loyalty Program fields
  loyaltyPoints?: number; // Current points balance
  loyaltyTier?: 'bronze' | 'silver' | 'gold' | 'platinum'; // Current tier
  loyaltyTierProgress?: number; // Progress to next tier (0-100)
  pointsEarned?: number; // Lifetime points earned
  pointsRedeemed?: number; // Lifetime points redeemed
  rewardsRedeemed?: number; // Number of rewards redeemed
}

// Barcode Scanner
export interface ScannedBarcode {
  barcode: string;
  timestamp: Date;
  productId?: string;
  productName?: string;
  success: boolean;
}

export interface CartItemModifier {
  id: string;
  name: string;
  quantity: number;
  price?: number;
}

export interface CartItem {
  id: string; // Unique cart item ID for tracking
  product: Product;
  variation?: ProductVariation;
  quantity: number;
  modifiers: CartItemModifier[];
  sku: string;
  unitPrice: number;
  totalPrice: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  priceOverride?: number;
  taxRate?: number;
  taxAmount?: number;
  isReturn?: boolean;
  originalOrderId?: string; // For returns/exchanges
  seatNumber?: number; // Restaurant: seat assignment for split checks
  course?: 'appetizer' | 'main' | 'dessert' | 'beverage' | null; // Restaurant: course management
}

export interface Cart {
  items: CartItem[];
  customer: Customer | null;
  notes: string;
  discountType: 'percentage' | 'fixed' | null;
  discountValue: number;
  orderType?: OrderType;
  taxRate: number;
  tipAmount?: number;
  tipPercentage?: number;
  tableId?: string; // Restaurant: assigned table
  serverId?: string; // Restaurant: assigned server
}

export interface OrderItem {
  name: string;
  product: string; // Product ID
  variation?: string; // Variation ID if applicable
  sku: string;
  quantity: number;
  unitPrice: number;
  modifiers: CartItemModifier[];
  seatNumber?: number; // Restaurant: seat assignment
  course?: 'appetizer' | 'main' | 'dessert' | 'beverage' | null; // Restaurant: course
  sentToKitchen?: boolean; // Restaurant: fired to kitchen
  sentAt?: Date; // Restaurant: when sent to kitchen
}

export interface PaymentMethodItem {
  method: 'cash' | 'card' | 'cheque' | 'giftcard' | 'store-credit';
  amount: number;
  tender?: number;
  change?: number;
  cardLast4?: string;
  giftCardNumber?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  status: 'paid' | 'pending' | 'cancelled' | 'voided' | 'returned';
  total: number;
  subtotal: number;
  discount: number;
  tax: number;
  tip?: number;
  paymentMethods: PaymentMethodItem[];
  shift: string;
  customer?: Customer;
  notes?: string;
  items: OrderItem[];
  dateCreated: Date;
  orderType?: OrderType;
  voidReason?: string;
  voidedBy?: string;
  voidedAt?: Date;
  returnedOrderId?: string; // For exchanges
  isTrainingMode?: boolean;
  tableId?: string; // Restaurant: table number
  serverId?: string; // Restaurant: server name
  kitchenStatus?: 'new' | 'preparing' | 'ready' | 'served'; // Restaurant: kitchen order status
  fireTime?: Date; // Restaurant: when order was sent to kitchen
  // Fire control (hybrid auto-fire system)
  fireStatus?: 'auto-fired' | 'manually-fired' | 'held' | 'not-applicable';
  heldReason?: string; // Why the order is held
  heldBy?: string; // User ID who held the order
  heldAt?: Date; // When order was held
}

export interface Transaction {
  id: string;
  type: 'sale' | 'cashIn' | 'cashOut' | 'noSale' | 'void' | 'return' | 'exchange';
  timestamp: Date;
  userId: string;
  shiftId: string;
  amount: number;
  note?: string;
  order?: Order;
  paymentMethod?: string;
  requiresApproval?: boolean;
  approvedBy?: string;
  isTrainingMode?: boolean;
}

export interface GiftCard {
  id: string;
  cardNumber: string;
  balance: number;
  isActive: boolean;
  createdAt: Date;
}

export interface ManagerOverride {
  action: string;
  requestedBy: string;
  timestamp: Date;
  reason?: string;
}

export interface Shift {
  id: string;
  userId: string;
  terminal: Terminal;
  openingBalance: number;
  closingBalance?: number;
  startTime: Date;
  endTime?: Date;
  transactions: Transaction[];
  orders: Order[];
}

export interface ParkedSale {
  id: string;
  cart: Cart;
  timestamp: Date;
  userId: string;
}

export interface PaymentMethodSale {
  name: string;
  quantitySold: number;
  totalSales: number;
}

export interface CategorySale {
  id: string;
  name: string;
  quantitySold: number;
  totalSales: number;
}

export interface CashTransactionTotal {
  id: string;
  name: string;
  total: number;
}

export interface CashTransactionReport {
  note: string;
  amount: number;
  type: string;
}

export interface ZReport {
  terminal: string;
  cashier: string;
  shift: Shift;
  paymentMethodSales: PaymentMethodSale[];
  categorySales: CategorySale[];
  cashTransactionTotals: CashTransactionTotal[];
  cashTransactionReport: CashTransactionReport[];
}

// Restaurant-specific types
export interface RestaurantTable {
  id: string;
  number: number;
  name: string;
  seats: number;
  section?: string;
  status: 'available' | 'occupied' | 'reserved';
  currentOrderId?: string;
  server?: string;
}

// Recipe and inventory types
export interface RecipeIngredient {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: RecipeIngredient[];
  yield: number; // How many units this recipe produces
  unit: string; // Unit of measurement
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  industry?: IndustryType; // Which industry this category belongs to
  icon?: string;
  sortOrder?: number;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  variationId?: string;
  previousQuantity: number;
  newQuantity: number;
  adjustmentQuantity: number;
  reason: string;
  notes?: string;
  userId: string;
  timestamp: Date;
}

// Industry-specific types
export type IndustryType = 
  | 'restaurant' 
  | 'retail' 
  | 'grocery' 
  | 'pharmacy' 
  | 'furniture'
  | 'cafe'
  | 'salon'
  | 'general'
  | 'ultimate';

export type BusinessProfile = 
  | 'restaurant' 
  | 'retail' 
  | 'grocery' 
  | 'pharmacy' 
  | 'furniture'
  | 'cafe'
  | 'bar'
  | 'salon'
  | 'general'
  | 'ultimate';

// Subscription packages that businesses can activate
export type SubscriptionPackage = 
  | 'restaurant'
  | 'bar'
  | 'retail'
  | 'cafe'
  | 'pharmacy'
  | 'salon'
  | 'ultimate';

export interface IndustryConfig {
  type: BusinessProfile;
  name: string;
  description: string;
  features: {
    // Restaurant features
    tableManagement: boolean;
    orderTypes: boolean; // dine-in, takeout, delivery
    tipping: boolean;
    serverAssignment: boolean;
    
    // Grocery features
    variableWeight: boolean;
    pluCodeEntry: boolean;
    ageVerification: boolean;
    
    // Pharmacy features
    prescriptionTracking: boolean;
    insuranceBilling: boolean;
    
    // Furniture features
    customOrders: boolean;
    deliveryScheduling: boolean;
    
    // Retail features
    layaway: boolean;
    
    // Universal features (available to all)
    barcodeScanner: boolean;
    customerManagement: boolean;
    giftCards: boolean;
    returns: boolean;
    discounts: boolean;
  };
}

export interface Settings {
  businessName: string;
  address: string;
  phone: string;
  email: string;
  taxRate: number;
  currency: string;
  timeZone: string;
  industry: IndustryType;
  industryConfig: IndustryConfig;
}

// Restaurant Kitchen Types
export type KitchenStation = 'grill' | 'fry' | 'salad' | 'pizza' | 'bar' | 'expo' | 'all';

export interface KitchenOrder {
  id: string;
  orderNumber: number;
  tableId?: string;
  tableName?: string;
  orderType?: OrderType;
  serverId?: string;
  serverName?: string;
  status: 'new' | 'preparing' | 'ready' | 'served';
  items: OrderItem[];
  notes?: string;
  fireTime: Date;
  readyTime?: Date;
  elapsedMinutes: number; // Computed field
  priority: 'low' | 'medium' | 'high'; // Based on elapsed time
}

// Loyalty Program Types
export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface LoyaltyTierConfig {
  tier: LoyaltyTier;
  name: string;
  color: string;
  icon: string;
  minPoints: number; // Minimum points to reach this tier
  maxPoints?: number; // Max points (undefined for highest tier)
  benefits: string[];
  pointsMultiplier: number; // e.g., 1.5x for Gold tier
  discountPercentage?: number; // Automatic discount for this tier
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  rewardType: 'discount-percentage' | 'discount-fixed' | 'free-item' | 'special-offer';
  discountValue?: number; // For discount rewards
  productId?: string; // For free item rewards
  isActive: boolean;
  minTier?: LoyaltyTier; // Minimum tier required
  expiryDate?: Date;
  usageLimit?: number; // Max times this reward can be redeemed
  usageCount?: number; // Times already redeemed
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  type: 'earned' | 'redeemed' | 'expired' | 'adjusted';
  points: number; // Positive for earned, negative for redeemed
  orderId?: string; // Associated order
  rewardId?: string; // Associated reward if redeemed
  reason?: string; // For adjustments or manual entries
  timestamp: Date;
  userId?: string; // Who made the adjustment
}

export interface LoyaltyProgramSettings {
  enabled: boolean;
  pointsPerDollar: number; // e.g., 1 point per $1 spent
  minPurchaseForPoints?: number; // Minimum purchase to earn points
  pointsExpireDays?: number; // Points expire after X days (0 = never)
  welcomeBonus?: number; // Points given on signup
  birthdayBonus?: number; // Points given on birthday
  tiers: LoyaltyTierConfig[];
  autoApplyTierDiscounts: boolean; // Automatically apply tier discounts
}