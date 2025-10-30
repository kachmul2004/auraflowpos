import { create } from 'zustand';
import { 
  User, 
  Cart, 
  CartItem,
  CartItemModifier,
  Shift, 
  ParkedSale, 
  Transaction, 
  Customer, 
  Product, 
  ProductVariation,
  Terminal,
  Order,
  ZReport,
  GiftCard,
  Permission,
  PaymentMethodItem,
  RestaurantTable,
  KitchenOrder,
  BusinessProfile,
  ScannedBarcode,
  OrderType,
  OrderTypeConfig,
  IndustryConfig
} from './types';
import { mockProducts, mockCustomers, mockTerminals, mockModifiers, mockUsers, mockShifts } from './mockData';
import { INDUSTRY_CONFIGS } from './industryConfig';

interface AppStore {
  // User & Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  hasPermission: (permission: Permission) => boolean;
  
  // Shift
  currentShift: Shift | null;
  shifts: Shift[];
  startShift: (userId: string, terminal: Terminal, openingBalance: number) => void;
  endShift: (closingBalance: number) => void;
  
  // Cart
  cart: Cart;
  addToCart: (
    product: Product, 
    variation?: ProductVariation, 
    modifiers?: CartItemModifier[]
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  voidCartItem: (cartItemId: string, reason: string) => void;
  updateCartItemQuantity: (cartItemId: string, quantity: number) => void;
  updateCartItemModifiers: (cartItemId: string, modifiers: CartItemModifier[]) => void;
  setItemDiscount: (cartItemId: string, type: 'percentage' | 'fixed', value: number, reason?: string) => void;
  setPriceOverride: (cartItemId: string, newPrice: number, reason: string) => void;
  setItemSeat: (cartItemId: string, seatNumber: number | undefined) => void;
  setItemCourse: (cartItemId: string, course: 'appetizer' | 'main' | 'dessert' | 'beverage' | null) => void;
  setCustomer: (customer: Customer | null) => void;
  setNotes: (notes: string) => void;
  setDiscount: (type: 'percentage' | 'fixed' | null, value: number) => void;
  setOrderType: (type: OrderType) => void;
  setTip: (amount: number, percentage?: number) => void;
  clearCart: () => void;
  
  // Orders
  orderNumber: number;
  recentOrders: Order[];
  createOrder: (paymentMethods: PaymentMethodItem[], tip?: number, holdOrder?: boolean) => Order | null;
  voidOrder: (orderId: string, reason: string) => void;
  returnOrder: (orderId: string, items: string[], reason: string) => Order | null;
  exchangeOrder: (orderId: string, returnItems: string[], newItems: CartItem[]) => Order | null;
  getOrderById: (orderId: string) => Order | undefined;
  
  // Parked Sales
  parkedSales: ParkedSale[];
  parkSale: () => void;
  loadParkedSale: (id: string) => void;
  deleteParkedSale: (id: string) => void;
  
  // Transactions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp' | 'shiftId'>) => void;
  addCashTransaction: (type: 'cashIn' | 'cashOut', amount: number, note: string) => void;
  noSale: (reason: string) => void;
  getAllTransactions: () => Transaction[];
  
  // Products & Customers
  products: Product[];
  customers: Customer[];
  terminals: Terminal[];
  users: User[];
  searchProducts: (query: string) => Product[];
  searchCustomers: (query: string) => Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'name' | 'totalSpent' | 'visitCount' | 'averageOrderValue' | 'lifetimeValue'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getCustomerAnalytics: (customerId: string) => {
    totalSpent: number;
    visitCount: number;
    averageOrderValue: number;
    lastVisit: Date | null;
    lifetimeValue: number;
  };
  
  // Stock Management
  getAvailableStock: (productId: string, variationId?: string) => number;
  updateProductStock: (productId: string, quantity: number, variationId?: string) => void;
  
  // Gift Cards
  giftCards: GiftCard[];
  createGiftCard: (amount: number) => GiftCard;
  redeemGiftCard: (cardNumber: string, amount: number) => boolean;
  checkGiftCardBalance: (cardNumber: string) => number;
  
  // Reports
  generateZReport: () => ZReport | null;
  
  // Online Status
  isOnline: boolean;
  setOnlineStatus: (status: boolean) => void;
  
  // Training Mode
  isTrainingMode: boolean;
  setTrainingMode: (enabled: boolean) => void;
  
  // Industry Configuration
  businessProfile: BusinessProfile; // Primary business profile (for backward compatibility)
  setBusinessProfile: (type: BusinessProfile) => void;
  
  // Quick Mode Toggle (optional specialized layouts for high-speed service)
  quickBarMode: boolean; // Toggle for bar quick service mode
  setQuickBarMode: (enabled: boolean) => void;
  
  // Order Type Configuration
  orderTypeConfigs: OrderTypeConfig[];
  updateOrderTypeConfig: (orderTypeId: OrderType, updates: Partial<OrderTypeConfig>) => void;
  getOrderTypeLabel: (orderType: OrderType) => string;
  getEnabledOrderTypes: () => OrderTypeConfig[];
  
  // Subscription Management
  subscribedPresets: string[]; // Array of preset IDs user has access to
  setSubscribedPresets: (presets: string[]) => void;
  hasPresetAccess: (presetId: string) => boolean;
  hasFeature: (featureName: keyof IndustryConfig['features']) => boolean;
  
  // Restaurant-specific
  tables: RestaurantTable[];
  assignCartToTable: (tableId: string) => void;
  clearTable: (tableId: string) => void;
  getTableOrders: (tableId: string) => Order[];
  getKitchenOrders: () => Order[];
  updateOrderKitchenStatus: (orderId: string, status: 'new' | 'preparing' | 'ready' | 'served') => void;
  fireOrderToKitchen: (orderId: string) => void;
  
  // Barcode Scanner
  barcodeScannerActive: boolean;
  scannedBarcodes: ScannedBarcode[];
  setBarcodeScannerActive: (active: boolean) => void;
  addProductByBarcode: (barcode: string) => boolean;
  recordScannedBarcode: (scan: ScannedBarcode) => void;
  clearScanHistory: () => void;
  getRecentScans: (limit?: number) => ScannedBarcode[];
  
  // Hardware & Printer Management
  printers: any[];
  receiptSettings: any;
  kitchenRoutes: any[];
  categories: { id: string; name: string }[];
  addPrinter: (printer: any) => void;
  updatePrinter: (id: string, updates: any) => void;
  deletePrinter: (id: string) => void;
  testPrinter: (id: string) => Promise<boolean>;
  updateReceiptSettings: (settings: any) => void;
  addKitchenRoute: (route: any) => void;
  updateKitchenRoute: (id: string, updates: any) => void;
  deleteKitchenRoute: (id: string) => void;
  
  // App Settings
  appSettings: {
    autoPrintReceipts: boolean;
    soundEnabled: boolean;
    darkMode: boolean;
  };
  updateAppSettings: (settings: Partial<AppStore['appSettings']>) => void;
}

const initialCart: Cart = {
  items: [],
  customer: null,
  notes: '',
  discountType: null,
  discountValue: 0,
  taxRate: 0.08, // 8% default tax rate
  tipAmount: 0,
};

// Helper to generate unique cart item ID
const generateCartItemId = () => `cart-item-${Date.now()}-${Math.random()}`;

// Helper to calculate cart item price
const calculateCartItemPrice = (
  basePrice: number,
  quantity: number,
  modifiers: CartItemModifier[]
): number => {
  const modifierTotal = modifiers.reduce(
    (sum, mod) => sum + (mod.price || 0) * mod.quantity,
    0
  );
  return (basePrice + modifierTotal) * quantity;
};

export const useStore = create<AppStore>((set, get) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  
  hasPermission: (permission) => {
    const { currentUser } = get();
    if (!currentUser) return false;
    if (currentUser.isAdmin || currentUser.permissions.includes('all')) return true;
    return currentUser.permissions.includes(permission);
  },
  
  currentShift: null,
  shifts: mockShifts,
  startShift: (userId, terminal, openingBalance) => {
    const shift: Shift = {
      id: `shift-${Date.now()}`,
      userId,
      terminal,
      openingBalance,
      startTime: new Date(),
      transactions: [],
      orders: [],
    };
    set({ currentShift: shift, orderNumber: 1 });
  },
  endShift: (closingBalance) => {
    const shift = get().currentShift;
    const shifts = get().shifts;
    if (shift) {
      const completedShift = {
        ...shift,
        closingBalance,
        endTime: new Date(),
      };
      set({
        currentShift: null,
        shifts: [...shifts, completedShift],
      });
    }
  },
  
  cart: initialCart,
  
  addToCart: (product, variation, modifiers = []) => {
    const { cart, getAvailableStock } = get();
    const variationId = variation?.id;
    const availableStock = getAvailableStock(product.id, variationId);
    
    if (availableStock <= 0) {
      return;
    }
    
    // For products with variations/modifiers, always create new cart items
    // This allows the same product with different configurations
    const shouldMerge = !variation && modifiers.length === 0;
    
    if (shouldMerge) {
      const existingItem = cart.items.find(
        item => 
          item.product.id === product.id && 
          !item.variation && 
          item.modifiers.length === 0
      );
      
      if (existingItem) {
        // Fix: Check if adding one more would exceed available stock
        // availableStock already accounts for items in cart, so we just need to check if we can add 1 more
        if (availableStock < 1) {
          return;
        }
        
        set({
          cart: {
            ...cart,
            items: cart.items.map(item =>
              item.id === existingItem.id
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                    totalPrice: calculateCartItemPrice(
                      item.unitPrice,
                      item.quantity + 1,
                      item.modifiers
                    ),
                  }
                : item
            ),
          },
        });
        return;
      }
    }
    
    // Create new cart item
    const unitPrice = variation?.price || product.price;
    const sku = variation?.sku || product.sku || product.id;
    const newItem: CartItem = {
      id: generateCartItemId(),
      product,
      variation,
      quantity: 1,
      modifiers,
      sku,
      unitPrice,
      totalPrice: calculateCartItemPrice(unitPrice, 1, modifiers),
    };
    
    set({
      cart: {
        ...cart,
        items: [...cart.items, newItem],
      },
    });
  },
  
  removeFromCart: (cartItemId) => {
    const { cart } = get();
    set({
      cart: {
        ...cart,
        items: cart.items.filter(item => item.id !== cartItemId),
      },
    });
  },
  
  updateCartItemQuantity: (cartItemId, quantity) => {
    const { cart, getAvailableStock } = get();
    if (quantity <= 0) {
      get().removeFromCart(cartItemId);
      return;
    }
    
    const item = cart.items.find(i => i.id === cartItemId);
    if (!item) return;
    
    const availableStock = getAvailableStock(
      item.product.id,
      item.variation?.id
    );
    const finalQuantity = Math.min(quantity, availableStock);
    
    set({
      cart: {
        ...cart,
        items: cart.items.map(i =>
          i.id === cartItemId
            ? {
                ...i,
                quantity: finalQuantity,
                totalPrice: calculateCartItemPrice(
                  i.unitPrice,
                  finalQuantity,
                  i.modifiers
                ),
              }
            : i
        ),
      },
    });
  },
  
  updateCartItemModifiers: (cartItemId, modifiers) => {
    const { cart } = get();
    set({
      cart: {
        ...cart,
        items: cart.items.map(item =>
          item.id === cartItemId
            ? {
                ...item,
                modifiers,
                totalPrice: calculateCartItemPrice(
                  item.unitPrice,
                  item.quantity,
                  modifiers
                ),
              }
            : item
        ),
      },
    });
  },
  
  setItemSeat: (cartItemId, seatNumber) => {
    const { cart } = get();
    set({
      cart: {
        ...cart,
        items: cart.items.map(item =>
          item.id === cartItemId
            ? { ...item, seatNumber }
            : item
        ),
      },
    });
  },
  
  setItemCourse: (cartItemId, course) => {
    const { cart } = get();
    set({
      cart: {
        ...cart,
        items: cart.items.map(item =>
          item.id === cartItemId
            ? { ...item, course }
            : item
        ),
      },
    });
  },
  
  setCustomer: (customer) => {
    const { cart } = get();
    set({ cart: { ...cart, customer } });
  },
  
  setNotes: (notes) => {
    const { cart } = get();
    set({ cart: { ...cart, notes } });
  },
  
  setDiscount: (type, value) => {
    const { cart } = get();
    set({ cart: { ...cart, discountType: type, discountValue: value } });
  },
  
  clearCart: () => {
    const { businessProfile } = get();
    const defaultOrderType = businessProfile === 'ultimate' ? 'in-store' : 'dine-in';
    set({ cart: { ...initialCart, orderType: defaultOrderType as OrderType } });
  },
  
  orderNumber: 1,
  
  createOrder: (paymentMethods, tip = 0, holdOrder = false) => {
    const { cart, currentShift, currentUser, orderNumber, updateProductStock, isTrainingMode } = get();
    
    if (!currentShift || !currentUser || cart.items.length === 0) {
      return null;
    }
    
    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    let discount = 0;
    if (cart.discountType === 'percentage') {
      discount = (subtotal * cart.discountValue) / 100;
    } else if (cart.discountType === 'fixed') {
      discount = cart.discountValue;
    }
    const tax = (subtotal - discount) * (cart.taxRate || 0.08);
    const total = subtotal - discount + tax + tip;
    
    // Determine fire status
    let fireStatus: 'auto-fired' | 'manually-fired' | 'held' | 'not-applicable' = 'not-applicable';
    if (cart.orderType === 'dine-in' && cart.tableId) {
      fireStatus = holdOrder ? 'held' : 'auto-fired';
    }
    
    // Create order
    const order: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      status: 'paid',
      total,
      subtotal,
      discount,
      tax,
      tip: tip > 0 ? tip : undefined,
      paymentMethods,
      shift: currentShift.id,
      customer: cart.customer || undefined,
      notes: cart.notes || undefined,
      orderType: cart.orderType,
      items: cart.items.map(item => ({
        name: item.variation 
          ? `${item.product.name} - ${item.variation.name}`
          : item.product.name,
        product: item.product.id,
        variation: item.variation?.id,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        modifiers: item.modifiers,
        seatNumber: item.seatNumber,
        course: item.course,
        sentToKitchen: false,
      })),
      dateCreated: new Date(),
      isTrainingMode,
      fireStatus,
      heldBy: holdOrder ? currentUser.id : undefined,
      heldAt: holdOrder ? new Date() : undefined,
      tableId: cart.tableId,
      serverId: cart.serverId,
    };
    
    // Update stock (not in training mode)
    if (!isTrainingMode) {
      cart.items.forEach(item => {
        if (!item.isReturn) {
          const currentStock = item.variation?.stockQuantity || item.product.stockQuantity;
          updateProductStock(
            item.product.id,
            currentStock - item.quantity,
            item.variation?.id
          );
        }
      });
      
      // Update customer analytics
      if (cart.customer) {
        const { updateCustomer } = get();
        const analytics = get().getCustomerAnalytics(cart.customer.id);
        updateCustomer(cart.customer.id, {
          totalSpent: analytics.totalSpent + total,
          visitCount: analytics.visitCount + 1,
          lastVisit: new Date(),
          averageOrderValue: (analytics.totalSpent + total) / (analytics.visitCount + 1),
          lifetimeValue: analytics.totalSpent + total,
        });
      }
    }
    
    // Add sale transaction
    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'sale',
      timestamp: new Date(),
      userId: currentUser.id,
      shiftId: currentShift.id,
      amount: total,
      order,
      paymentMethod: paymentMethods[0]?.method,
      isTrainingMode,
    };
    
    // Update shift and recent orders
    set({
      currentShift: {
        ...currentShift,
        transactions: [...currentShift.transactions, transaction],
        orders: [...currentShift.orders, order],
      },
      orderNumber: orderNumber + 1,
      recentOrders: [order, ...get().recentOrders].slice(0, 50), // Keep last 50
    });
    
    // Auto-fire to kitchen if it's a dine-in order (restaurant feature)
    if (cart.orderType === 'dine-in' && cart.tableId && !holdOrder) {
      // Delay to ensure state is updated
      setTimeout(() => {
        get().fireOrderToKitchen(order.id);
      }, 100);
    }
    
    return order;
  },
  
  parkedSales: [],
  parkSale: () => {
    const { cart, currentUser, parkedSales } = get();
    if (cart.items.length === 0 || !currentUser) return;
    
    const parkedSale: ParkedSale = {
      id: `parked-${Date.now()}`,
      cart: { ...cart },
      timestamp: new Date(),
      userId: currentUser.id,
    };
    
    set({
      parkedSales: [...parkedSales, parkedSale],
      cart: initialCart,
    });
  },
  
  loadParkedSale: (id) => {
    const { parkedSales } = get();
    const parkedSale = parkedSales.find(ps => ps.id === id);
    if (parkedSale) {
      set({
        cart: { ...parkedSale.cart },
        parkedSales: parkedSales.filter(ps => ps.id !== id),
      });
    }
  },
  
  deleteParkedSale: (id) => {
    const { parkedSales } = get();
    set({ parkedSales: parkedSales.filter(ps => ps.id !== id) });
  },
  
  addTransaction: (transaction) => {
    const { currentShift } = get();
    if (!currentShift) return;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn-${Date.now()}`,
      timestamp: new Date(),
      shiftId: currentShift.id,
    };
    
    set({
      currentShift: {
        ...currentShift,
        transactions: [...currentShift.transactions, newTransaction],
      },
    });
  },
  
  addCashTransaction: (type, amount, note) => {
    const { currentUser } = get();
    if (!currentUser) return;
    
    get().addTransaction({
      type,
      amount,
      userId: currentUser.id,
      note,
      paymentMethod: 'cash',
    });
  },
  
  products: mockProducts,
  customers: mockCustomers,
  terminals: mockTerminals,
  users: mockUsers,
  
  getAvailableStock: (productId, variationId) => {
    const { products, cart } = get();
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    
    let totalStock = 0;
    
    if (variationId && product.variations) {
      const variation = product.variations.find(v => v.id === variationId);
      totalStock = variation?.stockQuantity || 0;
    } else {
      totalStock = product.stockQuantity;
    }
    
    // Calculate how many are currently in cart
    const inCart = cart.items
      .filter(item => {
        if (variationId) {
          return item.product.id === productId && item.variation?.id === variationId;
        }
        return item.product.id === productId && !item.variation;
      })
      .reduce((sum, item) => sum + item.quantity, 0);
    
    return totalStock - inCart;
  },
  
  updateProductStock: (productId, quantity, variationId) => {
    const { products } = get();
    
    set({
      products: products.map(p => {
        if (p.id !== productId) return p;
        
        if (variationId && p.variations) {
          return {
            ...p,
            variations: p.variations.map(v =>
              v.id === variationId
                ? { ...v, stockQuantity: quantity }
                : v
            ),
            stockQuantity: p.variations.reduce(
              (sum, v) => sum + (v.id === variationId ? quantity : v.stockQuantity),
              0
            ),
            inStock: p.variations.some(
              v => (v.id === variationId ? quantity : v.stockQuantity) > 0
            ),
          };
        }
        
        return {
          ...p,
          stockQuantity: quantity,
          inStock: quantity > 0,
        };
      }),
    });
  },
  
  generateZReport: () => {
    const { currentShift, currentUser } = get();
    if (!currentShift || !currentUser) return null;
    
    const orders = currentShift.orders;
    const transactions = currentShift.transactions;
    
    // Payment method sales
    const paymentMethodSales = ['cash', 'card', 'cheque'].map(method => {
      const methodOrders = orders.filter(o => o.paymentMethod === method);
      return {
        name: method.charAt(0).toUpperCase() + method.slice(1),
        quantitySold: methodOrders.length,
        totalSales: methodOrders.reduce((sum, o) => sum + o.total, 0),
      };
    }).filter(pm => pm.quantitySold > 0);
    
    // Category sales
    const categoryMap = new Map<string, { id: string; name: string; quantity: number; total: number }>();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const product = get().products.find(p => p.id === item.product);
        if (product) {
          const existing = categoryMap.get(product.category);
          if (existing) {
            existing.quantity += item.quantity;
            existing.total += item.quantity * item.unitPrice;
          } else {
            categoryMap.set(product.category, {
              id: product.category,
              name: product.category,
              quantity: item.quantity,
              total: item.quantity * item.unitPrice,
            });
          }
        }
      });
    });
    
    const categorySales = Array.from(categoryMap.values()).map(cat => ({
      id: cat.id,
      name: cat.name,
      quantitySold: cat.quantity,
      totalSales: cat.total,
    }));
    
    // Cash transactions
    const cashIn = transactions
      .filter(t => t.type === 'cashIn')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const cashOut = transactions
      .filter(t => t.type === 'cashOut')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const cashTransactionTotals = [
      { id: '1', name: 'Cash In', total: cashIn },
      { id: '2', name: 'Cash Out', total: cashOut },
    ].filter(ct => ct.total > 0);
    
    const cashTransactionReport = transactions
      .filter(t => t.type === 'cashIn' || t.type === 'cashOut')
      .map(t => ({
        note: t.note || '',
        amount: t.amount,
        type: t.type === 'cashIn' ? 'Cash In' : 'Cash Out',
      }));
    
    const zReport: ZReport = {
      terminal: currentShift.terminal.name,
      cashier: currentUser.name,
      shift: currentShift,
      paymentMethodSales,
      categorySales,
      cashTransactionTotals,
      cashTransactionReport,
    };
    
    return zReport;
  },
  
  isOnline: true,
  setOnlineStatus: (status) => set({ isOnline: status }),
  
  // New Features
  voidCartItem: (cartItemId, reason) => {
    const { cart, hasPermission, addTransaction, currentUser } = get();
    if (!hasPermission('void_items')) return;
    
    const item = cart.items.find(i => i.id === cartItemId);
    if (item && currentUser) {
      addTransaction({
        type: 'void',
        amount: item.totalPrice,
        userId: currentUser.id,
        note: `Voided: ${item.product.name} - ${reason}`,
      });
    }
    
    get().removeFromCart(cartItemId);
  },
  
  setItemDiscount: (cartItemId, type, value, reason) => {
    const { cart } = get();
    set({
      cart: {
        ...cart,
        items: cart.items.map(item => {
          if (item.id !== cartItemId) return item;
          
          const basePrice = calculateCartItemPrice(
            item.unitPrice,
            item.quantity,
            item.modifiers
          );
          
          let discountedPrice = basePrice;
          if (type === 'percentage') {
            discountedPrice = basePrice * (1 - value / 100);
          } else {
            discountedPrice = basePrice - value;
          }
          
          return {
            ...item,
            discountType: type,
            discountValue: value,
            totalPrice: Math.max(0, discountedPrice),
          };
        }),
      },
    });
  },
  
  setPriceOverride: (cartItemId, newPrice, reason) => {
    const { cart, hasPermission } = get();
    if (!hasPermission('price_override')) return;
    
    set({
      cart: {
        ...cart,
        items: cart.items.map(item =>
          item.id === cartItemId
            ? { ...item, priceOverride: newPrice, totalPrice: newPrice * item.quantity }
            : item
        ),
      },
    });
  },
  
  setOrderType: (type) => {
    const { cart } = get();
    set({ cart: { ...cart, orderType: type } });
  },
  
  setTip: (amount, percentage) => {
    const { cart } = get();
    set({ cart: { ...cart, tipAmount: amount, tipPercentage: percentage } });
  },
  
  recentOrders: [],
  
  voidOrder: (orderId, reason) => {
    const { currentShift, hasPermission, currentUser } = get();
    if (!currentShift || !hasPermission('void_transactions') || !currentUser) return;
    
    const orderIndex = currentShift.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    const order = currentShift.orders[orderIndex];
    const voidedOrder: Order = {
      ...order,
      status: 'voided',
      voidReason: reason,
      voidedBy: currentUser.id,
      voidedAt: new Date(),
    };
    
    // Add void transaction
    const voidTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'void',
      timestamp: new Date(),
      userId: currentUser.id,
      shiftId: currentShift.id,
      amount: -order.total,
      note: reason,
      order: voidedOrder,
    };
    
    set({
      currentShift: {
        ...currentShift,
        orders: currentShift.orders.map((o, i) => 
          i === orderIndex ? voidedOrder : o
        ),
        transactions: [...currentShift.transactions, voidTransaction],
      },
    });
  },
  
  returnOrder: (orderId, itemIds, reason) => {
    const { currentShift, currentUser, hasPermission, orderNumber } = get();
    if (!currentShift || !currentUser || !hasPermission('process_returns')) return null;
    
    const originalOrder = currentShift.orders.find(o => o.id === orderId);
    if (!originalOrder) return null;
    
    const returnItems = originalOrder.items.filter(item => 
      itemIds.includes(item.product)
    );
    
    if (returnItems.length === 0) return null;
    
    const subtotal = returnItems.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0
    );
    const tax = subtotal * 0.08;
    const total = -(subtotal + tax); // Negative for return
    
    const returnOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      status: 'returned',
      total,
      subtotal: -subtotal,
      discount: 0,
      tax: -tax,
      paymentMethods: [{
        method: originalOrder.paymentMethods[0]?.method || 'cash',
        amount: total,
      }],
      shift: currentShift.id,
      customer: originalOrder.customer,
      notes: `Return: ${reason}`,
      items: returnItems,
      dateCreated: new Date(),
      returnedOrderId: orderId,
    };
    
    const returnTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'return',
      timestamp: new Date(),
      userId: currentUser.id,
      shiftId: currentShift.id,
      amount: total,
      note: reason,
      order: returnOrder,
    };
    
    set({
      currentShift: {
        ...currentShift,
        orders: [...currentShift.orders, returnOrder],
        transactions: [...currentShift.transactions, returnTransaction],
      },
      orderNumber: orderNumber + 1,
    });
    
    return returnOrder;
  },
  
  exchangeOrder: (orderId, returnItemIds, newItems) => {
    const { currentShift, currentUser, orderNumber } = get();
    if (!currentShift || !currentUser) return null;
    
    // Process return first
    const returnOrder = get().returnOrder(orderId, returnItemIds, 'Exchange');
    if (!returnOrder) return null;
    
    // Create new sale with new items
    const subtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    const exchangeOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      status: 'paid',
      total,
      subtotal,
      discount: 0,
      tax,
      paymentMethods: [{ method: 'cash', amount: total }],
      shift: currentShift.id,
      notes: `Exchange from order #${orderId}`,
      items: newItems.map(item => ({
        name: item.variation 
          ? `${item.product.name} - ${item.variation.name}`
          : item.product.name,
        product: item.product.id,
        variation: item.variation?.id,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        modifiers: item.modifiers,
      })),
      dateCreated: new Date(),
      returnedOrderId: orderId,
    };
    
    const exchangeTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'exchange',
      timestamp: new Date(),
      userId: currentUser.id,
      shiftId: currentShift.id,
      amount: total - Math.abs(returnOrder.total),
      note: 'Exchange transaction',
      order: exchangeOrder,
    };
    
    set({
      currentShift: {
        ...currentShift,
        orders: [...currentShift.orders, exchangeOrder],
        transactions: [...currentShift.transactions, exchangeTransaction],
      },
      orderNumber: orderNumber + 1,
    });
    
    return exchangeOrder;
  },
  
  getOrderById: (orderId) => {
    const { currentShift, recentOrders } = get();
    const allOrders = [
      ...(currentShift?.orders || []),
      ...recentOrders,
    ];
    return allOrders.find(o => o.id === orderId);
  },
  
  noSale: (reason) => {
    const { currentUser, addTransaction } = get();
    if (!currentUser) return;
    
    addTransaction({
      type: 'noSale',
      amount: 0,
      userId: currentUser.id,
      note: reason,
    });
  },
  
  getAllTransactions: () => {
    const { currentShift, shifts } = get();
    
    // Combine transactions from current shift and all completed shifts
    const allTransactions: Transaction[] = [];
    
    // Add transactions from completed shifts
    shifts.forEach(shift => {
      if (shift.transactions) {
        allTransactions.push(...shift.transactions);
      }
    });
    
    // Add transactions from current shift
    if (currentShift?.transactions) {
      allTransactions.push(...currentShift.transactions);
    }
    
    // Sort by timestamp (newest first)
    return allTransactions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },
  
  searchProducts: (query) => {
    const { products } = get();
    const lowerQuery = query.toLowerCase();
    
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.sku?.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.variations?.some(v => 
        v.name.toLowerCase().includes(lowerQuery) ||
        v.sku?.toLowerCase().includes(lowerQuery)
      )
    );
  },
  
  searchCustomers: (query) => {
    const { customers } = get();
    const lowerQuery = query.toLowerCase();
    
    return customers.filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.email?.toLowerCase().includes(lowerQuery) ||
      c.phone?.toLowerCase().includes(lowerQuery)
    );
  },
  
  addCustomer: (customerData) => {
    const { customers } = get();
    const newCustomer: Customer = {
      ...customerData,
      id: `customer-${Date.now()}`,
      name: `${customerData.firstName} ${customerData.lastName}`,
      createdAt: new Date(),
      totalSpent: 0,
      visitCount: 0,
      averageOrderValue: 0,
      lifetimeValue: 0,
    };
    
    set({ customers: [...customers, newCustomer] });
    return newCustomer;
  },
  
  updateCustomer: (id, updates) => {
    const { customers } = get();
    set({
      customers: customers.map(c => {
        if (c.id !== id) return c;
        const updated = { ...c, ...updates };
        // Recompute name if first/last name changed
        if (updates.firstName || updates.lastName) {
          updated.name = `${updated.firstName} ${updated.lastName}`;
        }
        return updated;
      }),
    });
  },
  
  deleteCustomer: (id) => {
    const { customers } = get();
    set({ customers: customers.filter(c => c.id !== id) });
  },
  
  getCustomerById: (id) => {
    const { customers } = get();
    return customers.find(c => c.id === id);
  },
  
  getCustomerAnalytics: (customerId) => {
    const { currentShift, recentOrders } = get();
    
    // Combine shift orders and recent orders
    const allOrders = [
      ...(currentShift?.orders || []),
      ...recentOrders,
    ].filter(order => 
      order.customer?.id === customerId && 
      order.status === 'paid' &&
      !order.isTrainingMode
    );
    
    const totalSpent = allOrders.reduce((sum, order) => sum + order.total, 0);
    const visitCount = allOrders.length;
    const averageOrderValue = visitCount > 0 ? totalSpent / visitCount : 0;
    const lastVisit = allOrders.length > 0 
      ? new Date(Math.max(...allOrders.map(o => o.dateCreated.getTime())))
      : null;
    const lifetimeValue = totalSpent; // Can be enhanced with predictive analytics
    
    return {
      totalSpent,
      visitCount,
      averageOrderValue,
      lastVisit,
      lifetimeValue,
    };
  },
  
  giftCards: [],
  
  createGiftCard: (amount) => {
    const { giftCards } = get();
    const cardNumber = `GC${Date.now()}${Math.floor(Math.random() * 10000)}`;
    
    const newCard: GiftCard = {
      id: `giftcard-${Date.now()}`,
      cardNumber,
      balance: amount,
      isActive: true,
      createdAt: new Date(),
    };
    
    set({ giftCards: [...giftCards, newCard] });
    return newCard;
  },
  
  redeemGiftCard: (cardNumber, amount) => {
    const { giftCards } = get();
    const card = giftCards.find(c => c.cardNumber === cardNumber && c.isActive);
    
    if (!card || card.balance < amount) return false;
    
    set({
      giftCards: giftCards.map(c =>
        c.cardNumber === cardNumber
          ? { ...c, balance: c.balance - amount }
          : c
      ),
    });
    
    return true;
  },
  
  checkGiftCardBalance: (cardNumber) => {
    const { giftCards } = get();
    const card = giftCards.find(c => c.cardNumber === cardNumber && c.isActive);
    return card?.balance || 0;
  },
  
  isTrainingMode: false,
  setTrainingMode: (enabled) => set({ isTrainingMode: enabled }),
  
  // Industry Configuration
  businessProfile: 'ultimate',
  setBusinessProfile: (type) => set({ businessProfile: type }),
  
  // Quick Mode Toggle
  quickBarMode: false,
  setQuickBarMode: (enabled) => set({ quickBarMode: enabled }),
  
  // Order Type Configuration
  orderTypeConfigs: [
    { id: 'dine-in', label: 'Dine In', enabled: true, icon: 'UtensilsCrossed' },
    { id: 'takeout', label: 'Takeout', enabled: true, icon: 'ShoppingBag' },
    { id: 'delivery', label: 'Delivery', enabled: true, icon: 'Truck' },
    { id: 'in-store', label: 'In-Store', enabled: true, icon: 'Store' },
    { id: 'pickup', label: 'Pickup', enabled: true, icon: 'Package' },
  ],
  
  updateOrderTypeConfig: (orderTypeId, updates) => {
    const { orderTypeConfigs } = get();
    set({
      orderTypeConfigs: orderTypeConfigs.map(config =>
        config.id === orderTypeId ? { ...config, ...updates } : config
      ),
    });
  },
  
  getOrderTypeLabel: (orderType) => {
    const { orderTypeConfigs } = get();
    const config = orderTypeConfigs.find(c => c.id === orderType);
    return config?.label || orderType.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  },
  
  getEnabledOrderTypes: () => {
    const { orderTypeConfigs, businessProfile, hasFeature } = get();
    
    // Only show order types if any subscribed preset has the orderTypes feature
    if (!hasFeature('orderTypes')) {
      return [];
    }
    
    // Filter by business profile
    const relevantTypes = businessProfile === 'ultimate'
      ? ['in-store', 'pickup', 'delivery']
      : ['dine-in', 'takeout', 'delivery'];
    
    return orderTypeConfigs.filter(c => c.enabled && relevantTypes.includes(c.id));
  },
  
  // Subscription Management
  // NOTE: Change subscriptions in Admin → Settings → Subscription Packages
  // Default is Restaurant + Bar. Try Pharmacy + Salon to see conditional features in action!
  subscribedPresets: ['restaurant', 'bar'], // Demo: Restaurant + Bar packages
  setSubscribedPresets: (presets) => set({ subscribedPresets: presets }),
  hasPresetAccess: (presetId) => {
    const { subscribedPresets } = get();
    return subscribedPresets.includes(presetId);
  },
  hasFeature: (featureName) => {
    const { subscribedPresets } = get();
    // Check if ANY subscribed preset has this feature enabled
    const result = subscribedPresets.some(presetId => {
      const config = INDUSTRY_CONFIGS[presetId as BusinessProfile];
      const hasIt = config?.features[featureName] === true;
      
      // Debug logging
      if (featureName === 'tableManagement') {
        console.log(`[hasFeature] Checking ${presetId}:`, {
          presetId,
          config: config?.name,
          tableManagement: config?.features.tableManagement,
          hasIt
        });
      }
      
      return hasIt;
    });
    
    // Debug logging for final result
    if (featureName === 'tableManagement') {
      console.log(`[hasFeature] Final result for ${featureName}:`, result, 'from presets:', subscribedPresets);
    }
    
    return result;
  },
  
  // Restaurant-specific features
  tables: [
    // Mock tables for restaurant industry
    { id: 'table-1', number: 1, name: 'Table 1', seats: 2, section: 'Main', status: 'available' },
    { id: 'table-2', number: 2, name: 'Table 2', seats: 4, section: 'Main', status: 'available' },
    { id: 'table-3', number: 3, name: 'Table 3', seats: 4, section: 'Main', status: 'available' },
    { id: 'table-4', number: 4, name: 'Table 4', seats: 6, section: 'Main', status: 'available' },
    { id: 'table-5', number: 5, name: 'Table 5', seats: 2, section: 'Patio', status: 'available' },
    { id: 'table-6', number: 6, name: 'Table 6', seats: 4, section: 'Patio', status: 'available' },
    { id: 'table-7', number: 7, name: 'Table 7', seats: 8, section: 'Private', status: 'available' },
    { id: 'table-8', number: 8, name: 'Table 8', seats: 2, section: 'Bar', status: 'available' },
  ],
  
  assignCartToTable: (tableId) => {
    const { cart, tables, currentUser } = get();
    if (!currentUser) return;
    
    // Update cart with table assignment
    set({
      cart: {
        ...cart,
        tableId,
        orderType: 'dine-in',
      },
      tables: tables.map(t =>
        t.id === tableId
          ? { ...t, status: 'occupied', server: currentUser.name }
          : t
      ),
    });
  },
  
  clearTable: (tableId) => {
    const { tables } = get();
    set({
      tables: tables.map(t =>
        t.id === tableId
          ? { ...t, status: 'available', server: undefined, currentOrderId: undefined }
          : t
      ),
    });
  },
  
  getTableOrders: (tableId) => {
    const { currentShift } = get();
    if (!currentShift) return [];
    
    return currentShift.orders.filter(order => order.tableId === tableId);
  },
  
  getKitchenOrders: () => {
    const { currentShift, shifts } = get();
    
    // Get all orders from current shift and completed shifts
    const allOrders: Order[] = [];
    
    // Add orders from completed shifts (only today's orders)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    shifts.forEach(shift => {
      if (shift.orders) {
        const todaysOrders = shift.orders.filter(order => {
          const orderDate = new Date(order.dateCreated);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === today.getTime();
        });
        allOrders.push(...todaysOrders);
      }
    });
    
    // Add orders from current shift
    if (currentShift?.orders) {
      allOrders.push(...currentShift.orders);
    }
    
    // Only return orders that need kitchen attention
    return allOrders.filter(order => 
      order.status === 'paid' && 
      order.kitchenStatus !== 'served' &&
      !order.isTrainingMode
    );
  },
  
  updateOrderKitchenStatus: (orderId, status) => {
    const { currentShift } = get();
    if (!currentShift) return;
    
    set({
      currentShift: {
        ...currentShift,
        orders: currentShift.orders.map(order =>
          order.id === orderId
            ? { ...order, kitchenStatus: status }
            : order
        ),
      },
    });
  },
  
  fireOrderToKitchen: (orderId) => {
    const { currentShift } = get();
    if (!currentShift) return;
    
    set({
      currentShift: {
        ...currentShift,
        orders: currentShift.orders.map(order =>
          order.id === orderId
            ? { 
                ...order, 
                kitchenStatus: 'new',
                fireTime: new Date(),
                items: order.items.map(item => ({
                  ...item,
                  sentToKitchen: true,
                  sentAt: new Date(),
                })),
              }
            : order
        ),
      },
    });
  },
  
  // Barcode Scanner
  barcodeScannerActive: false,
  scannedBarcodes: [],
  setBarcodeScannerActive: (active) => set({ barcodeScannerActive: active }),
  addProductByBarcode: (barcode) => {
    const { products, addToCart, recordScannedBarcode } = get();
    
    // Search by barcode first, then by SKU
    let product = products.find(p => p.barcode === barcode);
    if (!product) {
      product = products.find(p => p.sku === barcode);
    }
    
    // Also check variations
    if (!product) {
      for (const p of products) {
        if (p.variations) {
          const variation = p.variations.find(v => v.sku === barcode);
          if (variation) {
            addToCart(p, variation);
            recordScannedBarcode({
              barcode,
              timestamp: new Date(),
              productId: p.id,
              productName: `${p.name} - ${variation.name}`,
              success: true,
            });
            return true;
          }
        }
      }
    }
    
    if (product) {
      addToCart(product);
      recordScannedBarcode({
        barcode,
        timestamp: new Date(),
        productId: product.id,
        productName: product.name,
        success: true,
      });
      return true;
    }
    
    // Record failed scan
    recordScannedBarcode({
      barcode,
      timestamp: new Date(),
      success: false,
    });
    return false;
  },
  recordScannedBarcode: (scan) => {
    const { scannedBarcodes } = get();
    set({ scannedBarcodes: [...scannedBarcodes, scan] });
  },
  clearScanHistory: () => set({ scannedBarcodes: [] }),
  getRecentScans: (limit = 10) => {
    const { scannedBarcodes } = get();
    return scannedBarcodes.slice(-limit).reverse(); // Most recent first
  },
  
  // Hardware & Printer Management
  printers: [],
  receiptSettings: {
    businessInfo: {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: '',
      taxId: '',
    },
    logo: undefined,
    headerText: '',
    footerText: '',
    paperSize: '80mm' as const,
    fontSize: 'normal' as const,
    showLogo: true,
    showTaxId: false,
    showBarcode: true,
    showQRCode: false,
  },
  kitchenRoutes: [],
  categories: [
    { id: 'appetizers', name: 'Appetizers' },
    { id: 'entrees', name: 'Entrees' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'pizza', name: 'Pizza' },
    { id: 'pasta', name: 'Pasta' },
    { id: 'salads', name: 'Salads' },
    { id: 'sandwiches', name: 'Sandwiches' },
    { id: 'seafood', name: 'Seafood' },
    { id: 'steaks', name: 'Steaks' },
  ],
  addPrinter: (printer) => {
    const { printers } = get();
    set({ printers: [...printers, printer] });
  },
  updatePrinter: (id, updates) => {
    const { printers } = get();
    set({
      printers: printers.map(p =>
        p.id === id
          ? { ...p, ...updates }
          : p
      ),
    });
  },
  deletePrinter: (id) => {
    const { printers } = get();
    set({ printers: printers.filter(p => p.id !== id) });
  },
  testPrinter: async (id) => {
    console.log('📞 store.testPrinter() called with ID:', id);
    
    const { printers } = get();
    const printer = printers.find(p => p.id === id);
    
    console.log('   All printers in store:', printers.map(p => ({ id: p.id, name: p.name })));
    
    if (!printer) {
      console.error('   ❌ Printer not found in store');
      return Promise.resolve(false);
    }
    
    console.log('   ✅ Printer found:', printer);
    
    // Import printer service dynamically to avoid circular deps
    const { printerService } = await import('../plugins/hardware-printer-management/lib/printer.service');
    
    // Pass the printer object directly to the service
    console.log('   Calling printerService.testPrintWithPrinter()...');
    return printerService.testPrintWithPrinter(printer);
  },
  updateReceiptSettings: (settings) => set({ receiptSettings: settings }),
  addKitchenRoute: (route) => {
    const { kitchenRoutes } = get();
    set({ kitchenRoutes: [...kitchenRoutes, route] });
  },
  updateKitchenRoute: (id, updates) => {
    const { kitchenRoutes } = get();
    set({
      kitchenRoutes: kitchenRoutes.map(r =>
        r.id === id
          ? { ...r, ...updates }
          : r
      ),
    });
  },
  deleteKitchenRoute: (id) => {
    const { kitchenRoutes } = get();
    set({ kitchenRoutes: kitchenRoutes.filter(r => r.id !== id) });
  },
  
  // App Settings - Load from localStorage or use defaults
  appSettings: (() => {
    const stored = localStorage.getItem('pos-app-settings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {
          autoPrintReceipts: false,
          soundEnabled: true,
          darkMode: true,
        };
      }
    }
    return {
      autoPrintReceipts: false, // Auto-print after checkout
      soundEnabled: true, // Sound effects
      darkMode: true, // Dark mode (default on)
    };
  })(),
  updateAppSettings: (settings) => {
    const { appSettings } = get();
    const newSettings = { ...appSettings, ...settings };
    set({ appSettings: newSettings });
    // Persist to localStorage
    localStorage.setItem('pos-app-settings', JSON.stringify(newSettings));
  },
}));