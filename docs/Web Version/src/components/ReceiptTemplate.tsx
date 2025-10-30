import { Order } from '../lib/types';
import { format } from 'date-fns';
import { useStore } from '../lib/store';

interface ReceiptTemplateProps {
  order: Order;
  businessInfo?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    taxId?: string;
  };
  showLogo?: boolean;
  showTaxId?: boolean;
  showThankYou?: boolean;
  receiptType?: 'sale' | 'return' | 'exchange';
  forPrint?: boolean; // If true, optimizes for printing
}

export function ReceiptTemplate({
  order,
  businessInfo = {
    name: 'AuraFlow POS Demo Store',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    phone: '(555) 123-4567',
    email: 'contact@auraflow.com',
    taxId: '12-3456789',
  },
  showLogo = true,
  showTaxId = true,
  showThankYou = true,
  receiptType = 'sale',
  forPrint = false,
}: ReceiptTemplateProps) {
  const getOrderTypeLabel = useStore(state => state.getOrderTypeLabel);
  
  const receiptTypeLabel = {
    sale: 'RECEIPT',
    return: 'RETURN RECEIPT',
    exchange: 'EXCHANGE RECEIPT',
  };

  return (
    <div
      className={`receipt-template ${forPrint ? 'print-optimized' : ''} bg-white text-black p-6 max-w-[80mm] mx-auto`}
      style={{
        fontFamily: 'monospace',
        fontSize: forPrint ? '12px' : '14px',
        lineHeight: '1.4',
      }}
    >
      {/* Business Header */}
      <div className="text-center mb-4 border-b-2 border-black pb-4">
        {showLogo && (
          <div className="mb-2">
            <div className="text-2xl font-bold">{businessInfo.name}</div>
          </div>
        )}
        <div className="text-xs">
          <div>{businessInfo.address}</div>
          <div>
            {businessInfo.city}, {businessInfo.state} {businessInfo.zip}
          </div>
          <div className="mt-1">{businessInfo.phone}</div>
          <div>{businessInfo.email}</div>
          {showTaxId && businessInfo.taxId && (
            <div className="mt-1">Tax ID: {businessInfo.taxId}</div>
          )}
        </div>
      </div>

      {/* Receipt Type */}
      <div className="text-center font-bold text-lg mb-3 border-b border-black pb-2">
        {receiptTypeLabel[receiptType]}
      </div>

      {/* Transaction Info */}
      <div className="mb-4 text-xs space-y-1 border-b border-dashed border-black pb-3">
        <div className="flex justify-between">
          <span>Order #:</span>
          <span className="font-bold">{order.orderNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{format(new Date(order.dateCreated), 'MM/dd/yyyy')}</span>
        </div>
        <div className="flex justify-between">
          <span>Time:</span>
          <span>{format(new Date(order.dateCreated), 'hh:mm a')}</span>
        </div>
        {order.cashier && (
          <div className="flex justify-between">
            <span>Cashier:</span>
            <span>{order.cashier}</span>
          </div>
        )}
        {order.terminal && (
          <div className="flex justify-between">
            <span>Terminal:</span>
            <span>{order.terminal.name}</span>
          </div>
        )}
        {order.orderType && (
          <div className="flex justify-between">
            <span>Order Type:</span>
            <span>{getOrderTypeLabel(order.orderType)}</span>
          </div>
        )}
        {order.table && (
          <div className="flex justify-between">
            <span>Table:</span>
            <span>{order.table}</span>
          </div>
        )}
        {order.customer && (
          <div className="flex justify-between">
            <span>Customer:</span>
            <span>{order.customer.name}</span>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="mb-4 text-xs border-b border-black pb-3">
        <div className="font-bold mb-2">ITEMS</div>
        {order.items.map((item, index) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between">
              <span className="flex-1">
                {item.quantity}x {item.name}
                {item.variation && ` (${item.variation.name})`}
              </span>
              <span className="font-mono">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
            
            {/* Modifiers */}
            {item.modifiers && item.modifiers.length > 0 && (
              <div className="ml-4 text-gray-600">
                {item.modifiers.map((mod, modIndex) => (
                  <div key={modIndex} className="flex justify-between">
                    <span>+ {mod.name}</span>
                    {mod.price > 0 && <span>${mod.price.toFixed(2)}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Discount */}
            {item.discount && item.discount > 0 && (
              <div className="ml-4 text-gray-600 flex justify-between">
                <span>Discount</span>
                <span>-${item.discount.toFixed(2)}</span>
              </div>
            )}

            {/* Notes */}
            {item.notes && (
              <div className="ml-4 text-gray-600 italic text-xs">
                Note: {item.notes}
              </div>
            )}

            {/* Course & Seat (Restaurant) */}
            {(item.course || item.seatNumber) && (
              <div className="ml-4 text-gray-600 text-xs">
                {item.course && <span>Course: {item.course} </span>}
                {item.seatNumber && <span>Seat: {item.seatNumber}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mb-4 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-mono">${order.subtotal.toFixed(2)}</span>
        </div>

        {order.discount && order.discount > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Discount:</span>
            <span className="font-mono">-${order.discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Tax ({(order.taxRate || 8).toFixed(1)}%):</span>
          <span className="font-mono">${order.tax.toFixed(2)}</span>
        </div>

        {order.tip && order.tip > 0 && (
          <div className="flex justify-between">
            <span>Tip:</span>
            <span className="font-mono">${order.tip.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-lg border-t-2 border-black pt-2 mt-2">
          <span>TOTAL:</span>
          <span className="font-mono">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Info */}
      <div className="mb-4 text-xs border-t border-dashed border-black pt-3 space-y-1">
        <div className="font-bold mb-2">PAYMENT</div>
        {order.payments?.map((payment, index) => (
          <div key={index} className="flex justify-between">
            <span className="capitalize">{payment.method}:</span>
            <span className="font-mono">${payment.amount.toFixed(2)}</span>
          </div>
        ))}
        {order.paymentMethod && !order.payments && (
          <div className="flex justify-between">
            <span className="capitalize">{order.paymentMethod}:</span>
            <span className="font-mono">${order.total.toFixed(2)}</span>
          </div>
        )}
        
        {/* Change Given */}
        {order.changeGiven && order.changeGiven > 0 && (
          <div className="flex justify-between font-bold mt-2 pt-2 border-t border-dashed border-black">
            <span>Change:</span>
            <span className="font-mono">${order.changeGiven.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Return Policy / Notes */}
      {receiptType === 'sale' && (
        <div className="text-xs text-center mb-4 border-t border-black pt-3">
          <div className="font-bold mb-1">RETURN POLICY</div>
          <div className="text-gray-600">
            Items may be returned within 30 days with receipt.
          </div>
          <div className="text-gray-600">
            Opened items may be subject to restocking fee.
          </div>
        </div>
      )}

      {/* Training Mode Indicator */}
      {order.isTrainingMode && (
        <div className="text-center font-bold text-lg mb-3 border-2 border-black p-2">
          *** TRAINING MODE - NOT A REAL TRANSACTION ***
        </div>
      )}

      {/* Thank You Message */}
      {showThankYou && (
        <div className="text-center text-sm font-bold border-t-2 border-black pt-4">
          Thank You For Your Business!
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs mt-3 text-gray-600">
        <div>Please visit us again!</div>
        {businessInfo.email && (
          <div className="mt-1">Questions? {businessInfo.email}</div>
        )}
      </div>

      {/* Barcode/QR Code Placeholder */}
      <div className="text-center mt-4 pt-4 border-t border-dashed border-black">
        <div className="text-xs text-gray-600 mb-2">Order #{order.orderNumber}</div>
        <div className="h-16 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
          [QR CODE PLACEHOLDER]
        </div>
      </div>
    </div>
  );
}
