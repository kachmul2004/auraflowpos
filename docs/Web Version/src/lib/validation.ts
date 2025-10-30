import { z } from 'zod';

// Product Validation Schema
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Name must be less than 100 characters'),
  price: z.number().min(0, 'Price must be 0 or greater').max(999999.99, 'Price is too large'),
  category: z.string().min(1, 'Category is required'),
  barcode: z.string().optional(),
  sku: z.string().optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  stockQuantity: z.number().int().min(0, 'Stock must be 0 or greater').optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  cost: z.number().min(0, 'Cost must be 0 or greater').optional(),
  taxable: z.boolean().optional(),
  enabled: z.boolean().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Customer Validation Schema
export const customerSchema = z.object({
  name: z.string().min(1, 'Customer name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string()
    .regex(/^[\d\s\-\+\(\)]*$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits')
    .optional()
    .or(z.literal('')),
  address: z.string().max(200, 'Address must be less than 200 characters').optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  loyaltyPoints: z.number().int().min(0).optional(),
  birthday: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

// User Validation Schema
export const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'manager', 'cashier'], {
    errorMap: () => ({ message: 'Invalid role selected' }),
  }),
  pin: z.string()
    .regex(/^\d{4,6}$/, 'PIN must be 4-6 digits')
    .optional(),
  active: z.boolean().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;

// Terminal Validation Schema
export const terminalSchema = z.object({
  name: z.string().min(1, 'Terminal name is required').max(50),
  location: z.string().optional(),
  printerEnabled: z.boolean().optional(),
  printerName: z.string().optional(),
  cashDrawerEnabled: z.boolean().optional(),
  scannerEnabled: z.boolean().optional(),
  active: z.boolean().optional(),
});

export type TerminalFormData = z.infer<typeof terminalSchema>;

// Discount Validation Schema
export const discountSchema = z.object({
  name: z.string().min(1, 'Discount name is required').max(50),
  type: z.enum(['percentage', 'fixed'], {
    errorMap: () => ({ message: 'Invalid discount type' }),
  }),
  value: z.number().min(0, 'Value must be 0 or greater'),
  minimumPurchase: z.number().min(0).optional(),
  maximumDiscount: z.number().min(0).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  active: z.boolean().optional(),
}).refine(
  (data) => {
    if (data.type === 'percentage') {
      return data.value <= 100;
    }
    return true;
  },
  {
    message: 'Percentage discount cannot exceed 100%',
    path: ['value'],
  }
);

export type DiscountFormData = z.infer<typeof discountSchema>;

// Settings Validation Schema
export const settingsSchema = z.object({
  storeName: z.string().min(1, 'Store name is required').max(100),
  storeAddress: z.string().max(200).optional(),
  storePhone: z.string()
    .regex(/^[\d\s\-\+\(\)]*$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  storeEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  taxRate: z.number().min(0, 'Tax rate must be 0 or greater').max(100, 'Tax rate cannot exceed 100%'),
  currency: z.string().min(1, 'Currency is required'),
  receiptFooter: z.string().max(200, 'Receipt footer must be less than 200 characters').optional(),
  lowStockThreshold: z.number().int().min(0, 'Threshold must be 0 or greater'),
  autoCloseShift: z.boolean().optional(),
  printReceiptAutomatically: z.boolean().optional(),
  enableOfflineMode: z.boolean().optional(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

// Login Validation Schema
export const loginSchema = z.object({
  email: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// PIN Login Validation
export const pinLoginSchema = z.object({
  pin: z.string().regex(/^\d{4,6}$/, 'PIN must be 4-6 digits'),
});

export type PinLoginFormData = z.infer<typeof pinLoginSchema>;

// Inventory Adjustment Schema
export const inventoryAdjustmentSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().int('Quantity must be a whole number'),
  reason: z.enum(['restock', 'damage', 'theft', 'correction', 'other'], {
    errorMap: () => ({ message: 'Please select a reason' }),
  }),
  notes: z.string().max(200, 'Notes must be less than 200 characters').optional(),
});

export type InventoryAdjustmentFormData = z.infer<typeof inventoryAdjustmentSchema>;

// Payment Validation Schema
export const paymentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  method: z.enum(['cash', 'card', 'digital', 'giftcard', 'custom'], {
    errorMap: () => ({ message: 'Invalid payment method' }),
  }),
  reference: z.string().optional(),
  customMethodName: z.string().optional(),
}).refine(
  (data) => {
    if (data.method === 'custom' && !data.customMethodName) {
      return false;
    }
    return true;
  },
  {
    message: 'Custom method name is required',
    path: ['customMethodName'],
  }
);

export type PaymentFormData = z.infer<typeof paymentSchema>;

// Refund Validation Schema
export const refundSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  amount: z.number().min(0.01, 'Refund amount must be greater than 0'),
  reason: z.enum(['customer_request', 'defective', 'wrong_item', 'other'], {
    errorMap: () => ({ message: 'Please select a reason' }),
  }),
  notes: z.string().max(300, 'Notes must be less than 300 characters').optional(),
  refundMethod: z.enum(['original', 'cash', 'store_credit'], {
    errorMap: () => ({ message: 'Please select a refund method' }),
  }),
});

export type RefundFormData = z.infer<typeof refundSchema>;

// Table Management Schema
export const tableSchema = z.object({
  number: z.string().min(1, 'Table number is required'),
  name: z.string().max(50, 'Name must be less than 50 characters').optional(),
  capacity: z.number().int().min(1, 'Capacity must be at least 1').max(50, 'Capacity too large'),
  section: z.string().optional(),
  shape: z.enum(['square', 'round', 'rectangle'], {
    errorMap: () => ({ message: 'Invalid table shape' }),
  }).optional(),
});

export type TableFormData = z.infer<typeof tableSchema>;

// Helper function to get form errors in a friendly format
export function getFormErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  error.errors.forEach((err) => {
    if (err.path) {
      errors[err.path.join('.')] = err.message;
    }
  });
  return errors;
}

// Helper to validate form data
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: getFormErrors(error) };
    }
    return { success: false, errors: { _general: 'Validation failed' } };
  }
}

// Real-time field validator
export function validateField<T>(
  schema: z.ZodSchema<T>,
  fieldName: string,
  value: any
): string | null {
  try {
    // Create a partial schema for single field validation
    const fieldSchema = (schema as any).shape[fieldName];
    if (fieldSchema) {
      fieldSchema.parse(value);
    }
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Invalid value';
    }
    return 'Invalid value';
  }
}

// Common regex patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s\-\+\(\)]{10,}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  creditCard: /^\d{13,19}$/,
  cvv: /^\d{3,4}$/,
  barcode: /^[\d\-]{8,14}$/,
  sku: /^[A-Z0-9\-]{3,20}$/i,
  pin: /^\d{4,6}$/,
  postalCode: /^[A-Z0-9\s\-]{3,10}$/i,
};

// Validation helpers
export const validators = {
  isEmail: (value: string) => patterns.email.test(value),
  isPhone: (value: string) => patterns.phone.test(value.replace(/\s/g, '')),
  isZipCode: (value: string) => patterns.zipCode.test(value),
  isCreditCard: (value: string) => patterns.creditCard.test(value.replace(/\s/g, '')),
  isCVV: (value: string) => patterns.cvv.test(value),
  isBarcode: (value: string) => patterns.barcode.test(value),
  isSKU: (value: string) => patterns.sku.test(value),
  isPIN: (value: string) => patterns.pin.test(value),
  isPositiveNumber: (value: number) => !isNaN(value) && value >= 0,
  isInteger: (value: number) => Number.isInteger(value),
  isInRange: (value: number, min: number, max: number) => value >= min && value <= max,
  isNotEmpty: (value: string) => value.trim().length > 0,
  isUrl: (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
};
