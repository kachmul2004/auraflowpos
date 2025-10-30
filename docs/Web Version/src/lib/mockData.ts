import { User, Product, Customer, Terminal, Modifier, Shift } from './types';

export const mockTerminals: Terminal[] = [
  {
    id: '1',
    name: 'Till 1',
    receiptTemplate: {
      id: '1',
      name: 'Standard Receipt',
      header: 'AuraFlow POS\n123 Main Street\nPhone: (555) 123-4567',
      footer: 'Thank you for your business!\nPlease come again'
    },
    zreportTemplate: {
      id: '2',
      name: 'Z-Report Template',
      header: 'AURAFLOW POS - Z REPORT',
      footer: 'End of Report'
    },
    expensesReportTemplate: {
      id: '3',
      name: 'Expenses Template',
      header: 'AURAFLOW POS - EXPENSES REPORT',
      footer: 'End of Report'
    }
  },
  {
    id: '2',
    name: 'Till 2',
    receiptTemplate: {
      id: '1',
      name: 'Standard Receipt',
      header: 'AuraFlow POS\n123 Main Street\nPhone: (555) 123-4567',
      footer: 'Thank you for your business!\nPlease come again'
    }
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    name: 'Admin User',
    pin: '123456',
    roles: ['admin', 'cashier'],
    permissions: ['all'],
    isAdmin: true,
    terminals: mockTerminals
  },
  {
    id: '2',
    username: 'jcashier',
    firstName: 'John',
    lastName: 'Cashier',
    name: 'John Cashier',
    pin: '567890',
    roles: ['cashier'],
    permissions: ['void_items', 'apply_discounts', 'process_returns', 'open_cash_drawer'],
    isAdmin: false,
    terminals: [mockTerminals[0]]
  },
  {
    id: '3',
    username: 'jstaff',
    firstName: 'Jane',
    lastName: 'Staff',
    name: 'Jane Staff',
    pin: '901234',
    roles: ['cashier'],
    permissions: ['apply_discounts'],
    isAdmin: false,
    terminals: [mockTerminals[1]]
  },
];

export const mockModifiers: Modifier[] = [
  { id: '1', name: 'Extra Cheese', price: 1.50 },
  { id: '2', name: 'Bacon', price: 2.00 },
  { id: '3', name: 'Avocado', price: 1.75 },
  { id: '4', name: 'No Onions' },
  { id: '5', name: 'Extra Sauce', price: 0.50 },
  { id: '6', name: 'Gluten Free', price: 2.00 },
  { id: '7', name: 'Extra Shot', price: 1.00 },
  { id: '8', name: 'Oat Milk', price: 0.75 },
  { id: '9', name: 'Whipped Cream', price: 0.50 },
  { id: '10', name: 'Sugar Free' },
];

export const mockProducts: Product[] = [
  { id: '1', name: 'Organic Apples', price: 2.99, priceDisplay: '$2.99', category: 'Fruits', inStock: true, stockQuantity: 50, sku: 'FRT-001', barcode: '0123456789012', imageUrl: 'https://images.unsplash.com/photo-1683688684067-b87a189c7503?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG9yZ2FuaWMlMjBhcHBsZXxlbnwxfHx8fDE3NjE2NDA1MDB8MA&ixlib=rb-4.1.0&q=80&w=400' },
  { id: '2', name: 'Whole Wheat Bread', price: 4.5, priceDisplay: '$4.50', category: 'Bakery', inStock: true, stockQuantity: 30, sku: 'BAK-001', barcode: '0123456789029', imageUrl: 'https://images.unsplash.com/photo-1654524069610-31e8242a25c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwYnJlYWQlMjBsb2FmfGVufDF8fHx8MTc2MTY4MDE5MXww&ixlib=rb-4.1.0&q=80&w=400' },
  { id: '3', name: 'Free-Range Eggs', price: 5.2, priceDisplay: '$5.20', category: 'Dairy', inStock: true, stockQuantity: 25, sku: 'DAI-001', barcode: '0123456789036', imageUrl: 'https://images.unsplash.com/photo-1660224286794-fc173fa9295c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGVnZ3MlMjBjYXJ0b258ZW58MXx8fHwxNzYxNzQzMTQzfDA&ixlib=rb-4.1.0&q=80&w=400' },
  { id: '4', name: 'Almond Milk', price: 3.75, priceDisplay: '$3.75', category: 'Dairy', inStock: true, stockQuantity: 40, sku: 'DAI-002', barcode: '0123456789043' },
  { id: '5', name: 'Cheddar Cheese', price: 7.0, priceDisplay: '$7.00', category: 'Dairy', inStock: true, stockQuantity: 20, sku: 'DAI-003', barcode: '0123456789050' },
  { id: '6', name: 'Chicken Breast', price: 9.5, priceDisplay: '$9.50', category: 'Meat', inStock: true, stockQuantity: 15, sku: 'MEA-001', barcode: '0123456789067' },
  { id: '7', name: 'Avocado', price: 1.5, priceDisplay: '$1.50', category: 'Fruits', inStock: true, stockQuantity: 35, sku: 'FRT-002', barcode: '0123456789074' },
  { id: '8', name: 'Organic Spinach', price: 3.25, priceDisplay: '$3.25', category: 'Vegetables', inStock: true, stockQuantity: 28, sku: 'VEG-001', barcode: '0123456789081' },
  {
    id: '9',
    name: 'Coffee',
    price: 3.50,
    priceDisplay: 'from $3.50',
    category: 'Coffee',
    inStock: true,
    stockQuantity: 100,
    sku: 'COF-001',
    barcode: '0123456789098',
    imageUrl: 'https://images.unsplash.com/photo-1640587662002-ae577f8f96dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBlc3ByZXNzbyUyMGN1cHxlbnwxfHx8fDE3NjE3NDMxNDV8MA&ixlib=rb-4.1.0&q=80&w=400',
    variationType: { id: '1', name: 'Size' },
    variations: [
      { id: '9a', name: 'Small', price: 3.50, stockQuantity: 50, sku: 'COF-001-S' },
      { id: '9b', name: 'Medium', price: 4.50, stockQuantity: 30, sku: 'COF-001-M' },
      { id: '9c', name: 'Large', price: 5.50, stockQuantity: 20, sku: 'COF-001-L' }
    ],
    modifiers: [mockModifiers[6], mockModifiers[7], mockModifiers[8], mockModifiers[9]]
  },
  { id: '10', name: 'Painkiller Tablets', price: 8.99, priceDisplay: '$8.99', category: 'Pharmacy', inStock: true, stockQuantity: 45, sku: 'PHA-001', barcode: '0123456789104' },
  { id: '11', name: 'Shampoo', price: 6.5, priceDisplay: '$6.50', category: 'Salon', inStock: true, stockQuantity: 22, sku: 'SAL-001', barcode: '0123456789111' },
  {
    id: '12',
    name: 'Beef Burger',
    price: 12.0,
    priceDisplay: 'from $12.00',
    category: 'Restaurant',
    inStock: true,
    stockQuantity: 50,
    sku: 'RES-001',
    barcode: '0123456789128',
    variationType: { id: '1', name: 'Size' },
    variations: [
      { id: '12a', name: 'Single', price: 12.00, stockQuantity: 30, sku: 'RES-001-S' },
      { id: '12b', name: 'Double', price: 16.00, stockQuantity: 20, sku: 'RES-001-D' }
    ],
    modifiers: [mockModifiers[0], mockModifiers[1], mockModifiers[2], mockModifiers[3], mockModifiers[4], mockModifiers[5]]
  },
  { id: '13', name: 'Bananas', price: 1.99, priceDisplay: '$1.99', category: 'Fruits', inStock: true, stockQuantity: 60, sku: 'FRT-003', barcode: '0123456789135' },
  { id: '14', name: 'Strawberries', price: 4.99, priceDisplay: '$4.99', category: 'Fruits', inStock: true, stockQuantity: 8, sku: 'FRT-004', barcode: '0123456789142' },
  { id: '15', name: 'Orange Juice', price: 5.5, priceDisplay: '$5.50', category: 'Beverages', inStock: true, stockQuantity: 32, sku: 'BEV-001', barcode: '0123456789159' },
  { id: '16', name: 'Greek Yogurt', price: 4.25, priceDisplay: '$4.25', category: 'Dairy', inStock: true, stockQuantity: 27, sku: 'DAI-004', barcode: '0123456789166' },
  { id: '17', name: 'Salmon Fillet', price: 14.99, priceDisplay: '$14.99', category: 'Seafood', inStock: true, stockQuantity: 10, sku: 'SEA-001', barcode: '0123456789173' },
  { id: '18', name: 'Croissant', price: 3.5, priceDisplay: '$3.50', category: 'Bakery', inStock: true, stockQuantity: 24, sku: 'BAK-002', barcode: '0123456789180' },
  { id: '19', name: 'Tomatoes', price: 2.75, priceDisplay: '$2.75', category: 'Vegetables', inStock: true, stockQuantity: 42, sku: 'VEG-002', barcode: '0123456789197' },
  { id: '20', name: 'Olive Oil', price: 11.99, priceDisplay: '$11.99', category: 'Vegetables', inStock: true, stockQuantity: 16, sku: 'VEG-003', barcode: '0123456789203' },
  { id: '21', name: 'Energy Drink', price: 2.99, priceDisplay: '$2.99', category: 'Beverages', inStock: true, stockQuantity: 48, sku: '08102023125', barcode: '08102023125' },
  
  // Bar & Nightclub Products
  // Beer
  { id: '22', name: 'Budweiser Draft', price: 6.00, priceDisplay: '$6.00', category: 'Beer', inStock: true, stockQuantity: 100, sku: 'BEER-001', barcode: '0123456789210', imageUrl: 'https://images.unsplash.com/photo-1635705143334-1b74e7c97b3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFmdCUyMGJlZXIlMjBnbGFzc3xlbnwxfHx8fDE3NjE2OTQ0MTh8MA&ixlib=rb-4.1.0&q=80&w=400' },
  { id: '23', name: 'Corona Extra', price: 7.00, priceDisplay: '$7.00', category: 'Beer', inStock: true, stockQuantity: 75, sku: 'BEER-002', barcode: '0123456789227', imageUrl: 'https://images.unsplash.com/photo-1635705143334-1b74e7c97b3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFmdCUyMGJlZXIlMjBnbGFzc3xlbnwxfHx8fDE3NjE2OTQ0MTh8MA&ixlib=rb-4.1.0&q=80&w=400' },
  { id: '24', name: 'Guinness Stout', price: 8.00, priceDisplay: '$8.00', category: 'Beer', inStock: true, stockQuantity: 50, sku: 'BEER-003', barcode: '0123456789234' },
  { id: '25', name: 'Blue Moon', price: 7.50, priceDisplay: '$7.50', category: 'Beer', inStock: true, stockQuantity: 60, sku: 'BEER-004', barcode: '0123456789241' },
  { id: '26', name: 'IPA Draft', price: 8.50, priceDisplay: '$8.50', category: 'Beer', inStock: true, stockQuantity: 80, sku: 'BEER-005', barcode: '0123456789258' },
  
  // Wine
  { id: '27', name: 'Cabernet Sauvignon', price: 12.00, priceDisplay: '$12.00', category: 'Wine', inStock: true, stockQuantity: 40, sku: 'WINE-001', barcode: '0123456789265', imageUrl: 'https://images.unsplash.com/photo-1630369160812-26c7604cbd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB3aW5lJTIwZ2xhc3N8ZW58MXx8fHwxNzYxNzA3Nzg2fDA&ixlib=rb-4.1.0&q=80&w=400' },
  { id: '28', name: 'Chardonnay', price: 11.00, priceDisplay: '$11.00', category: 'Wine', inStock: true, stockQuantity: 45, sku: 'WINE-002', barcode: '0123456789272' },
  { id: '29', name: 'Pinot Noir', price: 13.00, priceDisplay: '$13.00', category: 'Wine', inStock: true, stockQuantity: 35, sku: 'WINE-003', barcode: '0123456789289' },
  { id: '30', name: 'Prosecco', price: 10.00, priceDisplay: '$10.00', category: 'Wine', inStock: true, stockQuantity: 50, sku: 'WINE-004', barcode: '0123456789296' },
  
  // Spirits
  { id: '31', name: 'Jack Daniels', price: 10.00, priceDisplay: '$10.00', category: 'Spirits', inStock: true, stockQuantity: 30, sku: 'SPRT-001', barcode: '0123456789302' },
  { id: '32', name: 'Grey Goose Vodka', price: 12.00, priceDisplay: '$12.00', category: 'Spirits', inStock: true, stockQuantity: 35, sku: 'SPRT-002', barcode: '0123456789319' },
  { id: '33', name: 'Patron Tequila', price: 14.00, priceDisplay: '$14.00', category: 'Spirits', inStock: true, stockQuantity: 25, sku: 'SPRT-003', barcode: '0123456789326' },
  { id: '34', name: 'Bacardi Rum', price: 9.00, priceDisplay: '$9.00', category: 'Spirits', inStock: true, stockQuantity: 40, sku: 'SPRT-004', barcode: '0123456789333' },
  { id: '35', name: 'Tanqueray Gin', price: 11.00, priceDisplay: '$11.00', category: 'Spirits', inStock: true, stockQuantity: 30, sku: 'SPRT-005', barcode: '0123456789340' },
  
  // Cocktails
  { id: '36', name: 'Margarita', price: 12.00, priceDisplay: '$12.00', category: 'Cocktails', inStock: true, stockQuantity: 999, sku: 'CKTL-001', barcode: '0123456789357', imageUrl: 'https://images.unsplash.com/photo-1678862656501-9bd5d0bf6de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMG1hcmdhcml0YXxlbnwxfHx8fDE3NjE3NDMxODR8MA&ixlib=rb-4.1.0&q=80&w=400' },
  { id: '37', name: 'Mojito', price: 11.00, priceDisplay: '$11.00', category: 'Cocktails', inStock: true, stockQuantity: 999, sku: 'CKTL-002', barcode: '0123456789364', imageUrl: 'https://images.unsplash.com/photo-1678862656501-9bd5d0bf6de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMG1hcmdhcml0YXxlbnwxfHx8fDE3NjE3NDMxODR8MA&ixlib=rb-4.1.0&q=80&w=400' },
  { id: '38', name: 'Old Fashioned', price: 13.00, priceDisplay: '$13.00', category: 'Cocktails', inStock: true, stockQuantity: 999, sku: 'CKTL-003', barcode: '0123456789371' },
  { id: '39', name: 'Manhattan', price: 13.00, priceDisplay: '$13.00', category: 'Cocktails', inStock: true, stockQuantity: 999, sku: 'CKTL-004', barcode: '0123456789388' },
  { id: '40', name: 'Cosmopolitan', price: 12.00, priceDisplay: '$12.00', category: 'Cocktails', inStock: true, stockQuantity: 999, sku: 'CKTL-005', barcode: '0123456789395' },
  { id: '41', name: 'Long Island Iced Tea', price: 14.00, priceDisplay: '$14.00', category: 'Cocktails', inStock: true, stockQuantity: 999, sku: 'CKTL-006', barcode: '0123456789401' },
  
  // Shots
  { id: '42', name: 'Jägermeister Shot', price: 6.00, priceDisplay: '$6.00', category: 'Shots', inStock: true, stockQuantity: 999, sku: 'SHOT-001', barcode: '0123456789418' },
  { id: '43', name: 'Fireball Shot', price: 5.00, priceDisplay: '$5.00', category: 'Shots', inStock: true, stockQuantity: 999, sku: 'SHOT-002', barcode: '0123456789425' },
  { id: '44', name: 'Tequila Shot', price: 7.00, priceDisplay: '$7.00', category: 'Shots', inStock: true, stockQuantity: 999, sku: 'SHOT-003', barcode: '0123456789432' },
  { id: '45', name: 'Vodka Shot', price: 6.00, priceDisplay: '$6.00', category: 'Shots', inStock: true, stockQuantity: 999, sku: 'SHOT-004', barcode: '0123456789449' },
  
  // Non-Alcoholic
  { id: '46', name: 'Virgin Mojito', price: 6.00, priceDisplay: '$6.00', category: 'Non-Alcoholic', inStock: true, stockQuantity: 999, sku: 'NONA-001', barcode: '0123456789456' },
  { id: '47', name: 'Shirley Temple', price: 5.00, priceDisplay: '$5.00', category: 'Non-Alcoholic', inStock: true, stockQuantity: 999, sku: 'NONA-002', barcode: '0123456789463' },
  { id: '48', name: 'Coca-Cola', price: 3.00, priceDisplay: '$3.00', category: 'Non-Alcoholic', inStock: true, stockQuantity: 999, sku: 'NONA-003', barcode: '0123456789470' },
  { id: '49', name: 'Red Bull', price: 5.00, priceDisplay: '$5.00', category: 'Non-Alcoholic', inStock: true, stockQuantity: 999, sku: 'NONA-004', barcode: '0123456789487' },
  { id: '50', name: 'Sparkling Water', price: 3.00, priceDisplay: '$3.00', category: 'Non-Alcoholic', inStock: true, stockQuantity: 999, sku: 'NONA-005', barcode: '0123456789494' },
  
  // Bar Food
  { id: '51', name: 'Wings (12pc)', price: 14.00, priceDisplay: '$14.00', category: 'Food', inStock: true, stockQuantity: 50, sku: 'FOOD-001', barcode: '0123456789500', imageUrl: 'https://images.unsplash.com/photo-1712746783860-94fabfbac42c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwd2luZ3MlMjBwbGF0ZXxlbnwxfHx8fDE3NjE3NDMxODR8MA&ixlib=rb-4.1.0&q=80&w=400' },
  { id: '52', name: 'Nachos Supreme', price: 12.00, priceDisplay: '$12.00', category: 'Food', inStock: true, stockQuantity: 50, sku: 'FOOD-002', barcode: '0123456789517', imageUrl: 'https://images.unsplash.com/photo-1712746783860-94fabfbac42c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwd2luZ3MlMjBwbGF0ZXxlbnwxfHx8fDE3NjE3NDMxODR8MA&ixlib=rb-4.1.0&q=80&w=400' },
  { id: '53', name: 'Loaded Fries', price: 8.00, priceDisplay: '$8.00', category: 'Food', inStock: true, stockQuantity: 50, sku: 'FOOD-003', barcode: '0123456789524' },
  { id: '54', name: 'Pretzel Bites', price: 7.00, priceDisplay: '$7.00', category: 'Food', inStock: true, stockQuantity: 50, sku: 'FOOD-004', barcode: '0123456789531' },
  { id: '55', name: 'Sliders (3pc)', price: 11.00, priceDisplay: '$11.00', category: 'Food', inStock: true, stockQuantity: 50, sku: 'FOOD-005', barcode: '0123456789548' },
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 234-5678',
    address: '123 Main Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    birthday: '1985-06-15',
    tags: ['VIP', 'Local'],
    marketingOptIn: true,
    createdAt: new Date('2024-01-15'),
    lastVisit: new Date('2025-01-10'),
    totalSpent: 1250.75,
    visitCount: 28,
    averageOrderValue: 44.67,
    lifetimeValue: 1250.75,
    notes: 'Prefers dairy-free products',
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '(555) 345-6789',
    address: '456 Oak Avenue',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62702',
    birthday: '1992-03-22',
    tags: ['Wholesale'],
    marketingOptIn: true,
    createdAt: new Date('2024-03-20'),
    lastVisit: new Date('2025-01-12'),
    totalSpent: 3420.50,
    visitCount: 45,
    averageOrderValue: 76.01,
    lifetimeValue: 3420.50,
    notes: 'Restaurant owner, large orders',
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '(555) 456-7890',
    address: '789 Elm Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62703',
    birthday: '1988-11-08',
    tags: ['Local'],
    marketingOptIn: false,
    createdAt: new Date('2024-06-10'),
    lastVisit: new Date('2025-01-08'),
    totalSpent: 875.25,
    visitCount: 15,
    averageOrderValue: 58.35,
    lifetimeValue: 875.25,
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Thompson',
    name: 'David Thompson',
    email: 'david.t@email.com',
    phone: '(555) 567-8901',
    address: '321 Pine Road',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62704',
    birthday: '1975-09-30',
    tags: ['VIP'],
    marketingOptIn: true,
    createdAt: new Date('2023-11-05'),
    lastVisit: new Date('2025-01-13'),
    totalSpent: 5680.00,
    visitCount: 89,
    averageOrderValue: 63.82,
    lifetimeValue: 5680.00,
    notes: 'Weekly standing order for fresh produce',
  },
  {
    id: '5',
    firstName: 'Jessica',
    lastName: 'Martinez',
    name: 'Jessica Martinez',
    email: 'j.martinez@email.com',
    phone: '(555) 678-9012',
    address: '654 Maple Drive',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62705',
    birthday: '1995-12-18',
    tags: ['Local'],
    marketingOptIn: true,
    createdAt: new Date('2024-09-12'),
    lastVisit: new Date('2025-01-11'),
    totalSpent: 435.60,
    visitCount: 8,
    averageOrderValue: 54.45,
    lifetimeValue: 435.60,
  },
  {
    id: '6',
    firstName: 'Robert',
    lastName: 'Anderson',
    name: 'Robert Anderson',
    email: 'r.anderson@email.com',
    phone: '(555) 789-0123',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62706',
    tags: [],
    marketingOptIn: false,
    createdAt: new Date('2024-12-01'),
    lastVisit: new Date('2024-12-28'),
    totalSpent: 125.50,
    visitCount: 2,
    averageOrderValue: 62.75,
    lifetimeValue: 125.50,
  },
];

export const categories = [
  // Grocery categories
  { id: 'fruits', name: 'Fruits', industry: 'grocery' },
  { id: 'bakery', name: 'Bakery', industry: 'grocery' },
  { id: 'dairy', name: 'Dairy', industry: 'grocery' },
  { id: 'meat', name: 'Meat', industry: 'grocery' },
  { id: 'vegetables', name: 'Vegetables', industry: 'grocery' },
  { id: 'seafood', name: 'Seafood', industry: 'grocery' },
  
  // Restaurant categories
  { id: 'coffee', name: 'Coffee', industry: 'restaurant' },
  { id: 'restaurant', name: 'Restaurant', industry: 'restaurant' },
  { id: 'beverages', name: 'Beverages', industry: 'restaurant' },
  
  // Bar categories
  { id: 'beer', name: 'Beer', industry: 'bar' },
  { id: 'wine', name: 'Wine', industry: 'bar' },
  { id: 'spirits', name: 'Spirits', industry: 'bar' },
  { id: 'cocktails', name: 'Cocktails', industry: 'bar' },
  { id: 'shots', name: 'Shots', industry: 'bar' },
  { id: 'non-alcoholic', name: 'Non-Alcoholic', industry: 'bar' },
  { id: 'food', name: 'Food', industry: 'bar' },
  
  // Pharmacy categories
  { id: 'pharmacy', name: 'Pharmacy', industry: 'pharmacy' },
  { id: 'medications', name: 'Medications', industry: 'pharmacy' },
  { id: 'wellness', name: 'Wellness', industry: 'pharmacy' },
  
  // Retail categories
  { id: 'salon', name: 'Salon', industry: 'retail' },
  { id: 'electronics', name: 'Electronics', industry: 'retail' },
  { id: 'clothing', name: 'Clothing', industry: 'retail' },
  
  // Furniture categories
  { id: 'living-room', name: 'Living Room', industry: 'furniture' },
  { id: 'bedroom', name: 'Bedroom', industry: 'furniture' },
  { id: 'office', name: 'Office', industry: 'furniture' },
  
  // General categories (shown in all industries)
  { id: 'general', name: 'General' },
  { id: 'miscellaneous', name: 'Miscellaneous' },
];

// Generate comprehensive sample data for shifts with transactions and orders
export const mockShifts: Shift[] = (() => {
  const shifts: Shift[] = [];
  
  // Shift 1 - January 10, 2025 (Admin User, Till 1)
  const shift1Orders = [
    {
      id: 'order-1001',
      orderNumber: 1001,
      status: 'paid' as const,
      total: 48.73,
      subtotal: 45.50,
      discount: 0,
      tax: 3.23,
      paymentMethods: [{ method: 'cash', amount: 48.73 }],
      shift: 'shift-1',
      customer: mockCustomers[0],
      items: [
        { name: 'Organic Apples', product: '1', sku: 'FRT-001', quantity: 2, unitPrice: 2.99, modifiers: [] },
        { name: 'Whole Wheat Bread', product: '2', sku: 'BAK-001', quantity: 3, unitPrice: 4.50, modifiers: [] },
        { name: 'Free-Range Eggs', product: '3', sku: 'DAI-001', quantity: 5, unitPrice: 5.20, modifiers: [] },
      ],
      dateCreated: new Date('2025-01-10T09:30:00'),
      orderType: 'takeout' as const,
    },
    {
      id: 'order-1002',
      orderNumber: 1002,
      status: 'paid' as const,
      total: 35.42,
      subtotal: 32.99,
      discount: 0,
      tax: 2.43,
      paymentMethods: [{ method: 'card', amount: 35.42 }],
      shift: 'shift-1',
      items: [
        { name: 'Coffee - Medium', product: '9', variation: '9b', sku: 'COF-001-M', quantity: 2, unitPrice: 4.50, modifiers: [{ id: '7', name: 'Extra Shot', price: 1.00, quantity: 1 }] },
        { name: 'Croissant', product: '18', sku: 'BAK-002', quantity: 4, unitPrice: 3.50, modifiers: [] },
      ],
      dateCreated: new Date('2025-01-10T10:15:00'),
    },
    {
      id: 'order-1003',
      orderNumber: 1003,
      status: 'paid' as const,
      total: 87.56,
      subtotal: 81.48,
      discount: 0,
      tax: 6.08,
      paymentMethods: [{ method: 'card', amount: 87.56 }],
      shift: 'shift-1',
      customer: mockCustomers[1],
      items: [
        { name: 'Chicken Breast', product: '6', sku: 'MEA-001', quantity: 3, unitPrice: 9.50, modifiers: [] },
        { name: 'Salmon Fillet', product: '17', sku: 'SEA-001', quantity: 2, unitPrice: 14.99, modifiers: [] },
        { name: 'Olive Oil', product: '20', sku: 'VEG-003', quantity: 2, unitPrice: 11.99, modifiers: [] },
      ],
      dateCreated: new Date('2025-01-10T11:45:00'),
      orderType: 'takeout' as const,
    },
    {
      id: 'order-1004',
      orderNumber: 1004,
      status: 'paid' as const,
      total: 129.87,
      subtotal: 120.80,
      discount: 0,
      tax: 9.07,
      tip: 15.00,
      paymentMethods: [{ method: 'card', amount: 129.87 }],
      shift: 'shift-1',
      customer: mockCustomers[3],
      items: [
        { name: 'Beef Burger - Double', product: '12', variation: '12b', sku: 'RES-001-D', quantity: 4, unitPrice: 16.00, modifiers: [{ id: '1', name: 'Extra Cheese', price: 1.50, quantity: 1 }] },
        { name: 'Orange Juice', product: '15', sku: 'BEV-001', quantity: 4, unitPrice: 5.50, modifiers: [] },
      ],
      dateCreated: new Date('2025-01-10T12:30:00'),
      orderType: 'dine-in' as const,
    },
  ];
  
  const shift1Transactions = [
    ...shift1Orders.map((order, idx) => ({
      id: `txn-${1001 + idx}`,
      type: 'sale' as const,
      timestamp: order.dateCreated,
      userId: '1',
      shiftId: 'shift-1',
      amount: order.total,
      order,
      paymentMethod: order.paymentMethods[0].method,
    })),
    {
      id: 'txn-1005',
      type: 'cashIn' as const,
      timestamp: new Date('2025-01-10T13:00:00'),
      userId: '1',
      shiftId: 'shift-1',
      amount: 200.00,
      note: 'Bank deposit from morning sales',
      paymentMethod: 'cash',
    },
  ];
  
  shifts.push({
    id: 'shift-1',
    userId: '1',
    terminal: mockTerminals[0],
    openingBalance: 500.00,
    closingBalance: 801.58,
    startTime: new Date('2025-01-10T09:00:00'),
    endTime: new Date('2025-01-10T17:00:00'),
    transactions: shift1Transactions,
    orders: shift1Orders,
  });
  
  // Shift 2 - January 10, 2025 (John Cashier, Till 2)
  const shift2Orders = [
    {
      id: 'order-2001',
      orderNumber: 2001,
      status: 'paid' as const,
      total: 24.67,
      subtotal: 22.98,
      discount: 0,
      tax: 1.69,
      paymentMethods: [{ method: 'cash', amount: 24.67 }],
      shift: 'shift-2',
      items: [
        { name: 'Bananas', product: '13', sku: 'FRT-003', quantity: 5, unitPrice: 1.99, modifiers: [] },
        { name: 'Greek Yogurt', product: '16', sku: 'DAI-004', quantity: 3, unitPrice: 4.25, modifiers: [] },
      ],
      dateCreated: new Date('2025-01-10T09:45:00'),
    },
    {
      id: 'order-2002',
      orderNumber: 2002,
      status: 'paid' as const,
      total: 18.91,
      subtotal: 17.60,
      discount: 0,
      tax: 1.31,
      paymentMethods: [{ method: 'card', amount: 18.91 }],
      shift: 'shift-2',
      customer: mockCustomers[2],
      items: [
        { name: 'Coffee - Small', product: '9', variation: '9a', sku: 'COF-001-S', quantity: 4, unitPrice: 3.50, modifiers: [] },
        { name: 'Avocado', product: '7', sku: 'FRT-002', quantity: 2, unitPrice: 1.5, modifiers: [] },
      ],
      dateCreated: new Date('2025-01-10T10:30:00'),
    },
    {
      id: 'order-2003',
      orderNumber: 2003,
      status: 'returned' as const,
      total: -16.20,
      subtotal: -15.00,
      discount: 0,
      tax: -1.20,
      paymentMethods: [{ method: 'cash', amount: -16.20 }],
      shift: 'shift-2',
      notes: 'Return: Product damaged',
      items: [
        { name: 'Strawberries', product: '14', sku: 'FRT-004', quantity: 3, unitPrice: 4.99, modifiers: [] },
      ],
      dateCreated: new Date('2025-01-10T14:20:00'),
      returnedOrderId: 'order-2002',
    },
  ];
  
  const shift2Transactions = [
    ...shift2Orders.map((order, idx) => ({
      id: `txn-${2001 + idx}`,
      type: order.status === 'returned' ? ('return' as const) : ('sale' as const),
      timestamp: order.dateCreated,
      userId: '2',
      shiftId: 'shift-2',
      amount: order.total,
      order,
      paymentMethod: order.paymentMethods[0].method,
    })),
    {
      id: 'txn-2004',
      type: 'cashOut' as const,
      timestamp: new Date('2025-01-10T15:00:00'),
      userId: '2',
      shiftId: 'shift-2',
      amount: 50.00,
      note: 'Petty cash for supplies',
      paymentMethod: 'cash',
    },
  ];
  
  shifts.push({
    id: 'shift-2',
    userId: '2',
    terminal: mockTerminals[1],
    openingBalance: 300.00,
    closingBalance: 277.38,
    startTime: new Date('2025-01-10T09:30:00'),
    endTime: new Date('2025-01-10T17:30:00'),
    transactions: shift2Transactions,
    orders: shift2Orders,
  });
  
  // Shift 3 - January 11, 2025 (Jane Staff, Till 1)
  const shift3Orders = [
    {
      id: 'order-3001',
      orderNumber: 3001,
      status: 'paid' as const,
      total: 156.48,
      subtotal: 145.50,
      discount: 0,
      tax: 10.98,
      paymentMethods: [{ method: 'card', amount: 156.48 }],
      shift: 'shift-3',
      customer: mockCustomers[3],
      items: [
        { name: 'Cheddar Cheese', product: '5', sku: 'DAI-003', quantity: 10, unitPrice: 7.00, modifiers: [] },
        { name: 'Almond Milk', product: '4', sku: 'DAI-002', quantity: 20, unitPrice: 3.75, modifiers: [] },
      ],
      dateCreated: new Date('2025-01-11T10:00:00'),
      orderType: 'takeout' as const,
    },
    {
      id: 'order-3002',
      orderNumber: 3002,
      status: 'paid' as const,
      total: 67.89,
      subtotal: 63.15,
      discount: 0,
      tax: 4.74,
      paymentMethods: [{ method: 'cash', amount: 67.89 }],
      shift: 'shift-3',
      items: [
        { name: 'Tomatoes', product: '19', sku: 'VEG-002', quantity: 15, unitPrice: 2.75, modifiers: [] },
        { name: 'Organic Spinach', product: '8', sku: 'VEG-001', quantity: 5, unitPrice: 3.25, modifiers: [] },
      ],
      dateCreated: new Date('2025-01-11T11:20:00'),
    },
    {
      id: 'order-3003',
      orderNumber: 3003,
      status: 'voided' as const,
      total: 0,
      subtotal: 24.50,
      discount: 0,
      tax: 1.96,
      paymentMethods: [{ method: 'cash', amount: 0 }],
      shift: 'shift-3',
      voidReason: 'Customer changed mind',
      voidedBy: '1',
      voidedAt: new Date('2025-01-11T12:05:00'),
      items: [
        { name: 'Coffee - Large', product: '9', variation: '9c', sku: 'COF-001-L', quantity: 4, unitPrice: 5.50, modifiers: [] },
      ],
      dateCreated: new Date('2025-01-11T12:00:00'),
    },
  ];
  
  const shift3Transactions = [
    ...shift3Orders.filter(o => o.status !== 'voided').map((order, idx) => ({
      id: `txn-${3001 + idx}`,
      type: 'sale' as const,
      timestamp: order.dateCreated,
      userId: '3',
      shiftId: 'shift-3',
      amount: order.total,
      order,
      paymentMethod: order.paymentMethods[0].method,
    })),
    {
      id: 'txn-3003',
      type: 'void' as const,
      timestamp: new Date('2025-01-11T12:05:00'),
      userId: '1',
      shiftId: 'shift-3',
      amount: -26.46,
      note: 'Voided: Customer changed mind',
      order: shift3Orders[2],
    },
    {
      id: 'txn-3004',
      type: 'noSale' as const,
      timestamp: new Date('2025-01-11T13:30:00'),
      userId: '3',
      shiftId: 'shift-3',
      amount: 0,
      note: 'Cash drawer check',
      paymentMethod: 'cash',
    },
  ];
  
  shifts.push({
    id: 'shift-3',
    userId: '3',
    terminal: mockTerminals[0],
    openingBalance: 500.00,
    closingBalance: 724.37,
    startTime: new Date('2025-01-11T09:00:00'),
    endTime: new Date('2025-01-11T17:00:00'),
    transactions: shift3Transactions,
    orders: shift3Orders,
  });
  
  // Shift 4 - January 12, 2025 (Admin User, Till 1)
  const shift4Orders = [
    {
      id: 'order-4001',
      orderNumber: 4001,
      status: 'paid' as const,
      total: 42.12,
      subtotal: 39.25,
      discount: 0,
      tax: 2.87,
      paymentMethods: [{ method: 'cash', amount: 42.12 }],
      shift: 'shift-4',
      customer: mockCustomers[4],
      items: [
        { name: 'Painkiller Tablets', product: '10', sku: 'PHA-001', quantity: 3, unitPrice: 8.99, modifiers: [] },
        { name: 'Shampoo', product: '11', sku: 'SAL-001', quantity: 2, unitPrice: 6.50, modifiers: [] },
      ],
      dateCreated: new Date('2025-01-12T09:25:00'),
    },
  ];
  
  const shift4Transactions = [
    ...shift4Orders.map((order, idx) => ({
      id: `txn-${4001 + idx}`,
      type: 'sale' as const,
      timestamp: order.dateCreated,
      userId: '1',
      shiftId: 'shift-4',
      amount: order.total,
      order,
      paymentMethod: order.paymentMethods[0].method,
    })),
  ];
  
  shifts.push({
    id: 'shift-4',
    userId: '1',
    terminal: mockTerminals[0],
    openingBalance: 500.00,
    closingBalance: 542.12,
    startTime: new Date('2025-01-12T09:00:00'),
    endTime: new Date('2025-01-12T17:00:00'),
    transactions: shift4Transactions,
    orders: shift4Orders,
  });
  
  return shifts;
})();