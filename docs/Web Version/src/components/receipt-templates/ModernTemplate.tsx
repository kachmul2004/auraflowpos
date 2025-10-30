import { CartItem, Transaction } from '../../lib/types';
import { ReceiptCustomization, formatReceiptCurrency, formatReceiptDateTime } from '../../lib/receiptTemplates';

interface ModernTemplateProps {
  transaction?: Transaction;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  customization: ReceiptCustomization;
  receiptNumber?: string;
}

export function ModernTemplate({
  transaction,
  items,
  subtotal,
  tax,
  total,
  customization,
  receiptNumber = 'PREVIEW',
}: ModernTemplateProps) {
  const date = transaction?.timestamp ? new Date(transaction.timestamp) : new Date();

  return (
    <div className="receipt-modern bg-white text-black p-8 max-w-[80mm] mx-auto" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-6 pb-6" style={{ borderBottom: `3px solid ${customization.primaryColor}` }}>
        {customization.showLogo && customization.logoUrl && (
          <img
            src={customization.logoUrl}
            alt="Logo"
            className="mx-auto mb-4 max-w-[100px] max-h-[70px] object-contain"
          />
        )}
        
        <div className="font-bold text-xl mb-3" style={{ color: customization.primaryColor }}>
          {customization.businessName}
        </div>
        
        <div className="text-xs leading-loose space-y-0.5 text-gray-700">
          <div>{customization.businessAddress}</div>
          <div>{customization.businessPhone}</div>
        </div>
      </div>

      {/* Receipt Meta */}
      <div className="mb-6 space-y-2 text-xs text-gray-600">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-gray-500">Receipt</span>
            <div className="font-semibold text-black">#{receiptNumber}</div>
          </div>
          <div className="text-right">
            <span className="text-gray-500">Date</span>
            <div className="font-semibold text-black">{formatReceiptDateTime(date)}</div>
          </div>
        </div>
        
        {(transaction?.cashier || transaction?.customer) && (
          <div className="grid grid-cols-2 gap-2 pt-2">
            {transaction?.cashier && (
              <div>
                <span className="text-gray-500">Cashier</span>
                <div className="font-medium text-black">{transaction.cashier}</div>
              </div>
            )}
            {transaction?.customer && (
              <div className="text-right">
                <span className="text-gray-500">Customer</span>
                <div className="font-medium text-black">{transaction.customer}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="mb-6">
        <div className="text-xs text-gray-500 mb-4 uppercase tracking-wider">Order Items</div>
        
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </div>
                </div>
                <div className="font-semibold ml-4">
                  {formatReceiptCurrency(item.price * item.quantity)}
                </div>
              </div>
              
              {item.modifiers && item.modifiers.length > 0 && (
                <div className="text-xs text-gray-600 ml-4 space-y-0.5">
                  {item.modifiers.map((mod, modIndex) => (
                    <div key={modIndex} className="flex justify-between">
                      <span>+ {mod.name}</span>
                      {mod.price > 0 && <span>{formatReceiptCurrency(mod.price)}</span>}
                    </div>
                  ))}
                </div>
              )}
              
              {item.discount && item.discount > 0 && (
                <div className="text-xs text-red-600 ml-4">
                  Discount: -{formatReceiptCurrency(item.discount)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="mb-6 pt-6" style={{ borderTop: `2px solid ${customization.primaryColor}` }}>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatReceiptCurrency(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>{formatReceiptCurrency(tax)}</span>
          </div>
          
          <div className="flex justify-between font-bold text-lg pt-3" style={{ borderTop: '1px solid #e5e7eb' }}>
            <span>Total</span>
            <span style={{ color: customization.primaryColor }}>
              {formatReceiptCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment */}
      {transaction?.paymentMethod && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Payment</div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium uppercase">{transaction.paymentMethod}</span>
            <span className="text-sm font-semibold">{formatReceiptCurrency(total)}</span>
          </div>
          
          {transaction.paymentMethod === 'cash' && transaction.amountPaid && (
            <div className="mt-2 text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Paid</span>
                <span>{formatReceiptCurrency(transaction.amountPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span>Change</span>
                <span>{formatReceiptCurrency(transaction.amountPaid - total)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="text-center space-y-4">
        {customization.showThankYou && (
          <div className="font-semibold" style={{ color: customization.primaryColor }}>
            {customization.thankYouMessage}
          </div>
        )}
        
        {customization.footerMessage && (
          <div className="text-xs text-gray-600">
            {customization.footerMessage}
          </div>
        )}
        
        {customization.showQRCode && customization.qrCodeUrl && (
          <div className="my-4">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(customization.qrCodeUrl + '?receipt=' + receiptNumber)}`}
              alt="QR Code"
              className="mx-auto rounded-lg"
              style={{ border: `2px solid ${customization.primaryColor}` }}
            />
            <div className="text-xs text-gray-500 mt-2">
              Scan for digital receipt & rewards
            </div>
          </div>
        )}
        
        {customization.showSocialMedia && (
          <div className="flex justify-center gap-3 text-xs text-gray-600">
            {customization.socialMediaHandles.website && (
              <span>{customization.socialMediaHandles.website}</span>
            )}
            {customization.socialMediaHandles.instagram && (
              <span>{customization.socialMediaHandles.instagram}</span>
            )}
          </div>
        )}
        
        <div className="text-xs text-gray-400 mt-6 pt-4 border-t border-gray-200">
          AuraFlow POS
        </div>
      </div>
    </div>
  );
}
