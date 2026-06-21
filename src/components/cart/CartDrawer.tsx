'use client';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem } = useCartStore();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const SHIPPING_THRESHOLD = 999;
  const shippingCharge = subtotal >= SHIPPING_THRESHOLD ? 0 : 79;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-brand-700" />
            <h2 className="font-semibold text-gray-800">Your Cart ({items.length})</h2>
          </div>
          <button onClick={closeCart} className="p-1 text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingCart size={48} className="text-gray-200" />
              <div>
                <p className="font-semibold text-gray-500">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Add some products to get started</p>
              </div>
              <button onClick={closeCart} className="btn-primary py-2 px-6">
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {subtotal < SHIPPING_THRESHOLD && (
                <div className="bg-brand-50 text-brand-800 text-xs px-3 py-2 rounded text-center">
                  Add {formatPrice(SHIPPING_THRESHOLD - subtotal)} more for <strong>FREE shipping</strong>
                </div>
              )}
              {items.map((item) => (
                <div key={item.variantSku} className="flex gap-3 pb-4 border-b border-gray-50">
                  <div className="relative w-16 h-16 shrink-0 rounded bg-gray-50 overflow-hidden">
                    <Image src={item.image || '/placeholder-product.png'} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{item.name}</p>
                    {(item.flavor || item.weight) && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {[item.flavor, item.weight].filter(Boolean).join(' • ')}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5 border border-gray-200 rounded">
                        <button
                          onClick={() => updateQuantity(item.variantSku, item.quantity - 1)}
                          className="p-1 hover:bg-gray-50 text-gray-600"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantSku, item.quantity + 1)}
                          className="p-1 hover:bg-gray-50 text-gray-600"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                        <button
                          onClick={() => removeItem(item.variantSku)}
                          className="text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span>{shippingCharge === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatPrice(shippingCharge)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 text-base border-t border-gray-100 pt-3">
              <span>Total</span>
              <span>{formatPrice(subtotal + shippingCharge)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center block"
            >
              Proceed to Checkout
            </Link>
            <button onClick={closeCart} className="w-full text-center text-sm text-gray-500 hover:text-brand-700 py-1">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
