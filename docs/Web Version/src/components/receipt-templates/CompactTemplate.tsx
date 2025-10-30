import { CartItem, Transaction } from '../../lib/types';
import { ReceiptCustomization, formatReceiptCurrency, formatReceiptDateTime } from '../../lib/receiptTemplates';

interface CompactTemplateProps {
  transaction?: Transaction;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  customization: ReceiptCustomization;
  receiptNumber?: string;
}

export function CompactTemplate({
  transaction,
  items,
  subtotal,
  tax,
  total,
  customization,
  receiptNumber = 'PREVIEW',
}: CompactTemplateProps) {
  const date = transaction?.timestamp ? new Date(transaction.timestamp) : new Date();

  return (
    <div className="receipt-compact bg-white text-black p-3 max-w-[58mm] mx-auto font-mono text-xs leading-tight">
      {/* Compact Header */}
      <div className="text-center mb-2 pb-2 border-b border-dashed border-gray-400">
        <div className="font-bold text-sm mb-1">{customization.businessName}</div>
        <div className="text-[10px] leading-tight">
          <div>{customization.businessPhone}</div>
          <div>#{receiptNumber}</div>
          <div>{new Date(date).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Compact Items */}
      <div className="mb-2 pb-2 border-b border-dashed border-gray-400">
        {items.map((item, index) => (
          <div key={index} className="mb-1.5">
            <div className="flex justify-between">
              <span className="flex-1 truncate">{item.name}</span>
              <span className="ml-2 font-semibold whitespace-nowrap">
                {formatReceiptCurrency(item.price * item.quantity)}
              </span>
            </div>
            <div className="text-[10px] text-gray-600">
              {item.quantity}x @ {formatReceiptCurrency(item.price)}
            </div>
          </div>
        ))}
      </div>

      {/* Compact Totals */}
      <div className="space-y-0.5 text-xs mb-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatReceiptCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatReceiptCurrency(tax)}</span>
        </div>
        <div className="flex justify-between font-bold text-sm pt-1 border-t border-black">
          <span>TOTAL</span>
          <span>{formatReceiptCurrency(total)}</span>
        </div>
      </div>

      {/* Compact Payment */}
      {transaction?.paymentMethod && (
        <div className="mb-2 pb-2 border-b border-dashed border-gray-400 text-[10px]">
          <div className="flex justify-between">
            <span>Payment:</span>
            <span className="uppercase font-semibold">{transaction.paymentMethod}</span>
          </div>
        </div>
      )}

      {/* Compact Footer */}
      <div className="text-center text-[10px]">
        {customization.showThankYou && (
          <div className="font-semibold mb-1">{customization.thankYouMessage}</div>
        )}
        {customization.showQRCode && customization.qrCodeUrl && (
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(customization.qrCodeUrl + '?receipt=' + receiptNumber)}`}
            alt="QR Code"
            className="mx-auto my-1"
          />
        )}
      </div>
    </div>
  );
}
