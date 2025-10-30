import { CartItem, Transaction } from '../../lib/types';
import { ReceiptCustomization, formatReceiptCurrency, formatReceiptDateTime } from '../../lib/receiptTemplates';

interface BrandedTemplateProps {
  transaction?: Transaction;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  customization: ReceiptCustomization;
  receiptNumber?: string;
}

export function BrandedTemplate({
  transaction,
  items,
  subtotal,
  tax,
  total,
  customization,
  receiptNumber = 'PREVIEW',
}: BrandedTemplateProps) {
  const date = transaction?.timestamp ? new Date(transaction.timestamp) : new Date();

  return (
    <div className="receipt-branded bg-white text-black max-w-[80mm] mx-auto overflow-hidden">
      {/* Branded Header */}
      <div
        className="text-center p-6 text-white relative"
        style={{
          background: `linear-gradient(135deg, ${customization.primaryColor} 0%, ${customization.accentColor} 100%)`,
        }}
      >
        {customization.showLogo && customization.logoUrl && (
          <img
            src={customization.logoUrl}
            alt="Logo"
            className="mx-auto mb-3 max-w-[140px] max-h-[90px] object-contain filter drop-shadow-lg"
          />
        )}
        
        <div className="font-bold text-2xl mb-2 drop-shadow-lg">
          {customization.businessName}
        </div>
        
        <div className="text-sm opacity-90 leading-relaxed">
          <div>{customization.businessAddress}</div>
          <div>{customization.businessPhone}</div>
        </div>
        
        {/* Decorative wave */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '20px',
            background: 'white',
            clipPath: 'ellipse(100% 100% at 50% 100%)',
          }}
        />
      </div>

      <div className="p-6">
        {/* Receipt Info */}
        <div className="mb-5 p-4 rounded-lg" style={{ background: `${customization.primaryColor}10` }}>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-gray-500 mb-1">Receipt Number</div>
              <div className="font-bold" style={{ color: customization.primaryColor }}>
                #{receiptNumber}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Date & Time</div>
              <div className="font-medium">{formatReceiptDateTime(date)}</div>
            </div>
          </div>
          
          {(transaction?.cashier || transaction?.customer) && (
            <div className="grid grid-cols-2 gap-3 text-sm mt-3 pt-3 border-t border-gray-200">
              {transaction?.cashier && (
                <div>
                  <div className="text-xs text-gray-500">Served by</div>
                  <div className="font-medium">{transaction.cashier}</div>
                </div>
              )}
              {transaction?.customer && (
                <div className="text-right">
                  <div className="text-xs text-gray-500">Customer</div>
                  <div className="font-medium">{transaction.customer}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Items */}
        <div className="mb-5">
          <div
            className="text-xs uppercase tracking-wider mb-3 font-semibold"
            style={{ color: customization.primaryColor }}
          >
            Order Details
          </div>
          
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border"
                style={{ borderColor: `${customization.primaryColor}20` }}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.quantity} × {formatReceiptCurrency(item.price)}
                    </div>
                  </div>
                  <div className="font-bold text-lg ml-4" style={{ color: customization.accentColor }}>
                    {formatReceiptCurrency(item.price * item.quantity)}
                  </div>
                </div>
                
                {item.modifiers && item.modifiers.length > 0 && (
                  <div className="text-xs text-gray-600 mt-2 pl-3 border-l-2" style={{ borderColor: customization.primaryColor }}>
                    {item.modifiers.map((mod, modIndex) => (
                      <div key={modIndex} className="flex justify-between py-0.5">
                        <span>+ {mod.name}</span>
                        {mod.price > 0 && <span>{formatReceiptCurrency(mod.price)}</span>}
                      </div>
                    ))}
                  </div>
                )}
                
                {item.discount && item.discount > 0 && (
                  <div className="text-xs text-red-600 mt-1 font-medium">
                    💰 Discount: -{formatReceiptCurrency(item.discount)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="mb-5">
          <div className="space-y-2 text-sm mb-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatReceiptCurrency(subtotal)}</span>
            </div>
            
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatReceiptCurrency(tax)}</span>
            </div>
          </div>
          
          <div
            className="flex justify-between items-center p-4 rounded-lg text-white font-bold text-xl"
            style={{
              background: `linear-gradient(135deg, ${customization.primaryColor} 0%, ${customization.accentColor} 100%)`,
            }}
          >
            <span>Total Paid</span>
            <span>{formatReceiptCurrency(total)}</span>
          </div>
        </div>

        {/* Payment Method */}
        {transaction?.paymentMethod && (
          <div className="mb-5 p-3 rounded-lg bg-gray-50 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold uppercase">{transaction.paymentMethod}</span>
            </div>
            
            {transaction.paymentMethod === 'cash' && transaction.amountPaid && (
              <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Cash Received</span>
                  <span>{formatReceiptCurrency(transaction.amountPaid)}</span>
                </div>
                <div className="flex justify-between font-medium text-black">
                  <span>Change Due</span>
                  <span>{formatReceiptCurrency(transaction.amountPaid - total)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* QR Code & Thank You */}
        {customization.showQRCode && customization.qrCodeUrl && (
          <div className="text-center mb-5">
            <div
              className="inline-block p-3 rounded-lg"
              style={{ background: `${customization.primaryColor}10` }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(customization.qrCodeUrl + '?receipt=' + receiptNumber)}`}
                alt="QR Code"
                className="mx-auto"
              />
            </div>
            <div className="text-xs text-gray-600 mt-2">
              Scan to view digital receipt & earn rewards
            </div>
          </div>
        )}

        {/* Footer Message */}
        {customization.showThankYou && (
          <div className="text-center mb-4">
            <div className="text-lg font-bold mb-2" style={{ color: customization.primaryColor }}>
              {customization.thankYouMessage}
            </div>
            {customization.footerMessage && (
              <div className="text-sm text-gray-600">
                {customization.footerMessage}
              </div>
            )}
          </div>
        )}

        {/* Social Media */}
        {customization.showSocialMedia && (
          <div className="text-center space-y-2 mb-4">
            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Stay Connected
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              {customization.socialMediaHandles.website && (
                <div className="flex items-center gap-1">
                  <span>🌐</span>
                  <span style={{ color: customization.primaryColor }}>
                    {customization.socialMediaHandles.website}
                  </span>
                </div>
              )}
              {customization.socialMediaHandles.instagram && (
                <div className="flex items-center gap-1">
                  <span>📷</span>
                  <span style={{ color: customization.primaryColor }}>
                    {customization.socialMediaHandles.instagram}
                  </span>
                </div>
              )}
              {customization.socialMediaHandles.facebook && (
                <div className="flex items-center gap-1">
                  <span>👍</span>
                  <span style={{ color: customization.primaryColor }}>
                    {customization.socialMediaHandles.facebook}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Powered By */}
        <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-200">
          Powered by AuraFlow POS
        </div>
      </div>
    </div>
  );
}
