/**
 * Export Utilities for AuraFlow POS
 * Supports CSV, Excel (XLSX), and JSON exports
 */

import { Order, Transaction, Shift, Customer, Product, User } from './types';

/**
 * Export format types
 */
export type ExportFormat = 'csv' | 'xlsx' | 'json';

/**
 * Export options
 */
export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  selectedFields?: string[];
  includeHeaders?: boolean;
}

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) return '';

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create header row
  const headerRow = csvHeaders.map(escapeCSVValue).join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const value = row[header];
      return escapeCSVValue(value);
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Escape CSV values (handle commas, quotes, newlines)
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) return '';
  
  const stringValue = String(value);
  
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Download data as file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to CSV
 */
export function exportToCSV(data: any[], filename: string, headers?: string[]): void {
  const csv = convertToCSV(data, headers);
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Export data to JSON
 */
export function exportToJSON(data: any[], filename: string): void {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json;charset=utf-8;');
}

/**
 * Export data to Excel (XLSX)
 * Note: This requires the xlsx library. For now, we'll use CSV format with .xlsx extension
 * In production, you would use: import * as XLSX from 'xlsx';
 */
export function exportToExcel(data: any[], filename: string, headers?: string[]): void {
  // For now, export as CSV with .xlsx extension
  // In production, implement proper XLSX generation
  const csv = convertToCSV(data, headers);
  
  // Add UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF';
  downloadFile(BOM + csv, filename, 'text/csv;charset=utf-8;');
  
  console.info('Excel export: Using CSV format. For true XLSX, integrate xlsx library.');
}

/**
 * Format date for export
 */
export function formatDateForExport(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Format datetime for export
 */
export function formatDateTimeForExport(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Export Orders to CSV/Excel
 */
export function exportOrders(orders: Order[], options: ExportOptions): void {
  const filename = options.filename || `orders_${formatDateForExport(new Date())}.${options.format}`;
  
  // Transform orders to flat structure for export
  const exportData = orders.map(order => ({
    'Order Number': order.orderNumber,
    'Date': formatDateTimeForExport(order.dateCreated),
    'Customer': order.customer?.name || 'N/A',
    'Customer Email': order.customer?.email || 'N/A',
    'Status': order.status,
    'Order Type': order.orderType || 'N/A',
    'Table': order.table || 'N/A',
    'Server': order.server || 'N/A',
    'Cashier': order.cashier || 'N/A',
    'Subtotal': order.subtotal.toFixed(2),
    'Discount': order.discount.toFixed(2),
    'Tax': order.tax.toFixed(2),
    'Tip': (order.tip || 0).toFixed(2),
    'Total': order.total.toFixed(2),
    'Payment Method': order.paymentMethods.map(pm => pm.method).join(', '),
    'Terminal': order.terminal?.name || 'N/A',
    'Items Count': order.items.length,
    'Notes': order.notes || '',
    'Training Mode': order.isTrainingMode ? 'Yes' : 'No',
  }));
  
  const headers = options.selectedFields || Object.keys(exportData[0] || {});
  
  switch (options.format) {
    case 'csv':
      exportToCSV(exportData, filename, headers);
      break;
    case 'xlsx':
      exportToExcel(exportData, filename, headers);
      break;
    case 'json':
      exportToJSON(orders, filename);
      break;
  }
}

/**
 * Export Order Items (detailed breakdown)
 */
export function exportOrderItems(orders: Order[], options: ExportOptions): void {
  const filename = options.filename || `order_items_${formatDateForExport(new Date())}.${options.format}`;
  
  // Flatten order items
  const exportData: any[] = [];
  
  orders.forEach(order => {
    order.items.forEach(item => {
      exportData.push({
        'Order Number': order.orderNumber,
        'Order Date': formatDateTimeForExport(order.dateCreated),
        'Customer': order.customer?.name || 'N/A',
        'Item Name': item.name,
        'Category': item.category || 'N/A',
        'Variation': item.variation?.name || 'N/A',
        'Quantity': item.quantity,
        'Unit Price': item.unitPrice.toFixed(2),
        'Total Price': item.totalPrice.toFixed(2),
        'Discount': (item.discount || 0).toFixed(2),
        'Modifiers': item.modifiers.map(m => m.name).join(', ') || 'None',
        'Notes': item.notes || '',
        'Seat': item.seatNumber || 'N/A',
        'Course': item.course || 'N/A',
      });
    });
  });
  
  const headers = options.selectedFields || Object.keys(exportData[0] || {});
  
  switch (options.format) {
    case 'csv':
      exportToCSV(exportData, filename, headers);
      break;
    case 'xlsx':
      exportToExcel(exportData, filename, headers);
      break;
    case 'json':
      exportToJSON(exportData, filename);
      break;
  }
}

/**
 * Export Transactions to CSV/Excel
 */
export function exportTransactions(transactions: Transaction[], options: ExportOptions): void {
  const filename = options.filename || `transactions_${formatDateForExport(new Date())}.${options.format}`;
  
  const exportData = transactions.map(tx => ({
    'Transaction ID': tx.id,
    'Date': formatDateTimeForExport(tx.timestamp),
    'Type': tx.type,
    'Order Number': tx.orderId || 'N/A',
    'User': tx.userId,
    'Amount': tx.amount.toFixed(2),
    'Payment Method': tx.paymentMethod || 'N/A',
    'Terminal': tx.terminalId || 'N/A',
    'Notes': tx.notes || '',
    'Training Mode': tx.isTrainingMode ? 'Yes' : 'No',
  }));
  
  const headers = options.selectedFields || Object.keys(exportData[0] || {});
  
  switch (options.format) {
    case 'csv':
      exportToCSV(exportData, filename, headers);
      break;
    case 'xlsx':
      exportToExcel(exportData, filename, headers);
      break;
    case 'json':
      exportToJSON(transactions, filename);
      break;
  }
}

/**
 * Export Shifts to CSV/Excel
 */
export function exportShifts(shifts: Shift[], options: ExportOptions): void {
  const filename = options.filename || `shifts_${formatDateForExport(new Date())}.${options.format}`;
  
  const exportData = shifts.map(shift => {
    const transactions = shift.transactions || [];
    const sales = transactions.filter(t => t.type === 'sale');
    const returns = transactions.filter(t => t.type === 'return');
    const cashIn = transactions.filter(t => t.type === 'cashIn');
    const cashOut = transactions.filter(t => t.type === 'cashOut');
    
    const totalSales = sales.reduce((sum, t) => sum + t.amount, 0);
    const totalReturns = returns.reduce((sum, t) => sum + t.amount, 0);
    const totalCashIn = cashIn.reduce((sum, t) => sum + t.amount, 0);
    const totalCashOut = cashOut.reduce((sum, t) => sum + t.amount, 0);
    
    const expectedClosing = shift.openingBalance + totalSales + totalCashIn - totalCashOut - Math.abs(totalReturns);
    const discrepancy = shift.closingBalance ? shift.closingBalance - expectedClosing : 0;
    
    return {
      'Shift ID': shift.id,
      'User': shift.userId,
      'Terminal': shift.terminal.name,
      'Start Time': formatDateTimeForExport(shift.startTime),
      'End Time': shift.endTime ? formatDateTimeForExport(shift.endTime) : 'Active',
      'Duration (hours)': shift.endTime 
        ? ((new Date(shift.endTime).getTime() - new Date(shift.startTime).getTime()) / (1000 * 60 * 60)).toFixed(2)
        : 'N/A',
      'Opening Balance': shift.openingBalance.toFixed(2),
      'Closing Balance': shift.closingBalance?.toFixed(2) || 'N/A',
      'Expected Closing': expectedClosing.toFixed(2),
      'Discrepancy': discrepancy.toFixed(2),
      'Total Sales': totalSales.toFixed(2),
      'Total Returns': Math.abs(totalReturns).toFixed(2),
      'Cash In': totalCashIn.toFixed(2),
      'Cash Out': totalCashOut.toFixed(2),
      'Orders Count': shift.orders?.length || 0,
      'Transactions Count': transactions.length,
      'Notes': shift.notes || '',
    };
  });
  
  const headers = options.selectedFields || Object.keys(exportData[0] || {});
  
  switch (options.format) {
    case 'csv':
      exportToCSV(exportData, filename, headers);
      break;
    case 'xlsx':
      exportToExcel(exportData, filename, headers);
      break;
    case 'json':
      exportToJSON(shifts, filename);
      break;
  }
}

/**
 * Export Customers to CSV/Excel
 */
export function exportCustomers(customers: Customer[], options: ExportOptions): void {
  const filename = options.filename || `customers_${formatDateForExport(new Date())}.${options.format}`;
  
  const exportData = customers.map(customer => ({
    'Customer ID': customer.id,
    'Name': customer.name,
    'First Name': customer.firstName || '',
    'Last Name': customer.lastName || '',
    'Email': customer.email || '',
    'Phone': customer.phone || '',
    'Address': customer.address?.street || '',
    'City': customer.address?.city || '',
    'State': customer.address?.state || '',
    'Zip Code': customer.address?.zip || '',
    'Birthday': customer.birthday ? formatDateForExport(customer.birthday) : '',
    'Total Spent': customer.totalSpent?.toFixed(2) || '0.00',
    'Visit Count': customer.visitCount || 0,
    'Average Order': customer.averageOrderValue?.toFixed(2) || '0.00',
    'Last Visit': customer.lastVisit ? formatDateTimeForExport(customer.lastVisit) : 'Never',
    'Tags': customer.tags?.join(', ') || '',
    'Marketing Opt-in': customer.marketingOptIn ? 'Yes' : 'No',
    'Notes': customer.notes || '',
  }));
  
  const headers = options.selectedFields || Object.keys(exportData[0] || {});
  
  switch (options.format) {
    case 'csv':
      exportToCSV(exportData, filename, headers);
      break;
    case 'xlsx':
      exportToExcel(exportData, filename, headers);
      break;
    case 'json':
      exportToJSON(customers, filename);
      break;
  }
}

/**
 * Export Products to CSV/Excel
 */
export function exportProducts(products: Product[], options: ExportOptions): void {
  const filename = options.filename || `products_${formatDateForExport(new Date())}.${options.format}`;
  
  const exportData = products.map(product => ({
    'Product ID': product.id,
    'Name': product.name,
    'Category': product.category,
    'SKU': product.sku || '',
    'Barcode': product.barcode || '',
    'Price': product.price.toFixed(2),
    'Cost': product.cost?.toFixed(2) || '',
    'Stock': product.stock,
    'Low Stock Alert': product.lowStockAlert || '',
    'Tax Rate': product.taxRate ? (product.taxRate * 100).toFixed(1) + '%' : '',
    'Variation Type': product.variationType || '',
    'Variations Count': product.variations?.length || 0,
    'Modifiers Available': product.modifiers?.length || 0,
    'Variable': product.isVariable ? 'Yes' : 'No',
    'Active': product.isActive !== false ? 'Yes' : 'No',
  }));
  
  const headers = options.selectedFields || Object.keys(exportData[0] || {});
  
  switch (options.format) {
    case 'csv':
      exportToCSV(exportData, filename, headers);
      break;
    case 'xlsx':
      exportToExcel(exportData, filename, headers);
      break;
    case 'json':
      exportToJSON(products, filename);
      break;
  }
}

/**
 * Export Product Variations (detailed)
 */
export function exportProductVariations(products: Product[], options: ExportOptions): void {
  const filename = options.filename || `product_variations_${formatDateForExport(new Date())}.${options.format}`;
  
  const exportData: any[] = [];
  
  products.forEach(product => {
    if (product.variations && product.variations.length > 0) {
      product.variations.forEach(variation => {
        exportData.push({
          'Product ID': product.id,
          'Product Name': product.name,
          'Category': product.category,
          'Variation Type': product.variationType || '',
          'Variation Name': variation.name,
          'Variation SKU': variation.sku || '',
          'Price': variation.price.toFixed(2),
          'Stock': variation.stock,
        });
      });
    }
  });
  
  if (exportData.length === 0) {
    throw new Error('No product variations found to export');
  }
  
  const headers = options.selectedFields || Object.keys(exportData[0] || {});
  
  switch (options.format) {
    case 'csv':
      exportToCSV(exportData, filename, headers);
      break;
    case 'xlsx':
      exportToExcel(exportData, filename, headers);
      break;
    case 'json':
      exportToJSON(exportData, filename);
      break;
  }
}

/**
 * Export Users to CSV/Excel
 */
export function exportUsers(users: User[], options: ExportOptions): void {
  const filename = options.filename || `users_${formatDateForExport(new Date())}.${options.format}`;
  
  const exportData = users.map(user => ({
    'User ID': user.id,
    'Name': user.name,
    'First Name': user.firstName || '',
    'Last Name': user.lastName || '',
    'Email': user.email || '',
    'Role': user.role,
    'Active': user.isActive !== false ? 'Yes' : 'No',
  }));
  
  const headers = options.selectedFields || Object.keys(exportData[0] || {});
  
  switch (options.format) {
    case 'csv':
      exportToCSV(exportData, filename, headers);
      break;
    case 'xlsx':
      exportToExcel(exportData, filename, headers);
      break;
    case 'json':
      exportToJSON(users, filename);
      break;
  }
}

/**
 * Filter data by date range
 */
export function filterByDateRange<T extends { dateCreated?: Date | string; timestamp?: Date | string; startTime?: Date | string }>(
  data: T[],
  startDate: Date,
  endDate: Date
): T[] {
  return data.filter(item => {
    const itemDate = item.dateCreated || item.timestamp || item.startTime;
    if (!itemDate) return false;
    
    const date = typeof itemDate === 'string' ? new Date(itemDate) : itemDate;
    return date >= startDate && date <= endDate;
  });
}

/**
 * Get available export formats
 */
export function getExportFormats(): { value: ExportFormat; label: string; description: string }[] {
  return [
    { value: 'csv', label: 'CSV', description: 'Comma-separated values (Excel compatible)' },
    { value: 'xlsx', label: 'Excel', description: 'Microsoft Excel spreadsheet' },
    { value: 'json', label: 'JSON', description: 'JavaScript Object Notation (for developers)' },
  ];
}
