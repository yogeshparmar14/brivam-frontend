'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, updateQuantity, removeItem, couponCode, discount, applyCoupon, removeCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const SHIPPING_THRESHOLD = 999;
  const shippingCharge = subtotal - discount >= SHIPPING_THRESHOLD ? 0 : 79;
  const total = subtotal - discount + shippingCharge;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const { discount: d } = await applyCoupon(couponInput.trim());
      toast.success(`Coupon applied! You save ${formatPrice(d)}`);
    } catch {
      toast.error('Invalid or expired coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) return (
    <div className="container-site py-24 text-center">
      <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
      <h1 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h1>
      <p className="text-gray-400 mb-8">Add some products to get started</p>
      <Link href="/shop" className="btn-primary">Start Shopping</Link>
    </div>
  );

  return (
    <div className="container-site py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({items.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.variantSku} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl">
              <Link href={`/product/${item.product}`} className="relative w-20 h-20 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                <Image src={item.image || '/placeholder-product.png'} alt={item.name} fill className="object-cover" />
              </Link>
              <div className="flex-1">
                <Link href={`/product/${item.product}`} className="font-semibold text-gray-800 hover:text-brand-700 text-sm md:text-base line-clamp-2">
                  {item.name}
                </Link>
                {(item.flavor || item.weight) && (
                  <p className="text-xs text-gray-400 mt-0.5">{[item.flavor, item.weight].filter(Boolean).join(' · ')}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 border border-gray-200 rounded">
                    <button onClick={() => updateQuantity(item.variantSku, item.quantity - 1)} className="p-1.5 hover:bg-gray-50 text-gray-600">
                      <Minus size={13} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.variantSku, item.quantity + 1)} className="p-1.5 hover:bg-gray-50 text-gray-600">
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                      {item.quantity > 1 && <p className="text-xs text-gray-400">{formatPrice(item.price)} each</p>}
                    </div>
                    <button onClick={() => removeItem(item.variantSku)} className="text-gray-300 hover:text-red-400 transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={15} className="text-brand-700" />
              <h3 className="font-semibold text-gray-800 text-sm">Apply Coupon</h3>
            </div>
            {couponCode ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
                <span className="text-sm font-mono font-bold text-green-700">{couponCode}</span>
                <button onClick={removeCoupon} className="text-xs text-red-500 hover:text-red-700">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-600 uppercase"
                  onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  className="btn-primary py-2 px-3 text-xs disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shippingCharge === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatPrice(shippingCharge)}</span>
              </div>
              {subtotal - discount < SHIPPING_THRESHOLD && (
                <p className="text-xs text-brand-600 bg-brand-50 px-2 py-1 rounded">
                  Add {formatPrice(SHIPPING_THRESHOLD - (subtotal - discount))} more for free shipping
                </p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full text-center mt-4 flex items-center justify-center gap-2">
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>
            <Link href="/shop" className="block text-center text-sm text-gray-400 hover:text-brand-700 mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
