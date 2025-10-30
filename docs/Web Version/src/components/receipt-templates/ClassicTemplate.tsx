import { CartItem, Transaction } from '../../lib/types';
import { ReceiptCustomization, formatReceiptCurrency, formatReceiptDateTime } from '../../lib/receiptTemplates';

interface ClassicTemplateProps {
  transaction?: Transaction;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  customization: ReceiptCustomization;
  receiptNumber?: string;
}

export function ClassicTemplate({
  transaction,
  items,
  subtotal,
  tax,
  total,
  customization,
  receiptNumber = 'PREVIEW',
}: ClassicTemplateProps) {
  const date = transaction?.timestamp ? new Date(transaction.timestamp) : new Date();

  return (
    <div className="receipt-classic bg-white text-black p-6 max-w-[80mm] mx-auto font-mono text-sm">
      {/* Header */}
      <div className="text-center mb-4 pb-4 border-b-2 border-dashed border-gray-400">
        {customization.showLogo && customization.logoUrl && (
          <img
            src={customization.logoUrl}
            alt="Logo"
            className="mx-auto mb-3 max-w-[120px] max-h-[80px] object-contain"
          />
        )}
        
        <div className="font-bold text-lg mb-2">{customization.businessName}</div>
        
        <div className="text-xs leading-relaxed space-y-0.5">
          <div>{customization.businessAddress}</div>
          <div>{customization.businessPhone}</div>
          {customization.businessEmail && <div>{customization.businessEmail}</div>}
          {customization.showTaxId && customization.taxId && (
            <div>Tax ID: {customization.taxId}</div>
          )}
        </div>
      </div>

      {/* Receipt Info */}
      <div className="mb-4 text-xs space-y-1">
        <div className="flex justify-between">
          <span>Receipt #:</span>
          <span className="font-semibold">{receiptNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{formatReceiptDateTime(date)}</span>
        </div>
        {transaction?.cashier && (
          <div className="flex justify-between">
            <span>Cashier:</span>
            <span>{transaction.cashier}</span>
          </div>
        )}
        {transaction?.customer && (
          <div className="flex justify-between">
            <span>Customer:</span>
            <span>{transaction.customer}</span>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="mb-4 pb-4 border-b-2 border-dashed border-gray-400">
        <div className="mb-2 flex justify-between font-semibold text-xs">
          <span>Item</span>
          <span>Amount</span>
        </div>
        
        {items.map((item, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between">
              <span className="flex-1">{item.name}</span>
              <span className="ml-2 font-semibold">
                {formatReceiptCurrency(item.price * item.quantity)}
              </span>
            </div>
            
            <div className="text-xs text-gray-600 ml-2">
              {item.quantity} × {formatReceiptCurrency(item.price)}
            </div>
            
            {item.modifiers && item.modifiers.length > 0 && (
              <div className="text-xs text-gray-600 ml-4 mt-1">
                {item.modifiers.map((mod, modIndex) => (
                  <div key={modIndex}>
                    + {mod.name} {mod.price > 0 && `(${formatReceiptCurrency(mod.price)})`}
                  </div>
                ))}
              </div>
            )}
            
            {item.discount && item.discount > 0 && (
              <div className="text-xs text-gray-600 ml-4">
                Discount: -{formatReceiptCurrency(item.discount)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mb-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatReceiptCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>{formatReceiptCurrency(tax)}</span>
        </div>
        
        <div className="flex justify-between font-bold text-base pt-2 border-t-2 border-black">
          <span>TOTAL:</span>
          <span>{formatReceiptCurrency(total)}</span>
        </div>
      </div>

      {/* Payment Info */}
      {transaction?.paymentMethod && (
        <div className="mb-4 pb-4 border-b-2 border-dashed border-gray-400 text-xs space-y-1">
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span className="uppercase font-semibold">{transaction.paymentMethod}</span>
          </div>
          {transaction.paymentMethod === 'cash' && transaction.amountPaid && (
            <>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span>{formatReceiptCurrency(transaction.amountPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span>Change:</span>
                <span>{formatReceiptCurrency(transaction.amountPaid - total)}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs space-y-3">
        {customization.showThankYou && (
          <div className="font-semibold text-sm">
            {customization.thankYouMessage}
          </div>
        )}
        
        {customization.footerMessage && (
          <div className="text-gray-600">
            {customization.footerMessage}
          </div>
        )}
        
        {customization.showQRCode && customization.qrCodeUrl && (
          <div className="my-3">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(customization.qrCodeUrl + '?receipt=' + receiptNumber)}`}
              alt="QR Code"
              className="mx-auto"
            />
            <div className="text-xs text-gray-600 mt-1">
              Scan for digital receipt
            </div>
          </div>
        )}
        
        {customization.showSocialMedia && (
          <div className="text-xs text-gray-600 space-y-0.5">
            {customization.socialMediaHandles.website && (
              <div>🌐 {customization.socialMediaHandles.website}</div>
            )}
            {customization.socialMediaHandles.instagram && (
              <div>📷 {customization.socialMediaHandles.instagram}</div>
            )}
            {customization.socialMediaHandles.facebook && (
              <div>👍 {customization.socialMediaHandles.facebook}</div>
            )}
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-4">
          Powered by AuraFlow POS
        </div>
      </div>
    </div>
  );
}
