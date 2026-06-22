'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

interface Address {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi'];

export default function CheckoutPage() {
  const { items, discount, couponCode, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
  });

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCharge = subtotal - discount >= 999 ? 0 : 79;
  const total = subtotal - discount + shippingCharge;

  if (!user) {
    return (
      <div className="container-site py-24 text-center">
        <p className="text-lg mb-4 text-gray-600">Please login to continue checkout</p>
        <Link href="/login" className="btn-primary">Login to Continue</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-site py-24 text-center">
        <p className="text-lg mb-4 text-gray-600">Your cart is empty</p>
        <Link href="/shop" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  const updateAddress = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setAddress(prev => ({ ...prev, [k]: e.target.value }));

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill in all required address fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: { ...address, label: 'Delivery' },
        paymentMethod,
        couponCode,
      });

      if (paymentMethod === 'razorpay') {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: Math.round(total * 100),
          currency: 'INR',
          name: 'OJAM',
          description: `Order ${data.order.orderNumber}`,
          order_id: data.razorpayOrderId,
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            await api.post('/orders/verify-payment', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            clearCart();
            router.push(`/order-success?orderId=${data.order._id}`);
          },
          prefill: { name: address.fullName, contact: address.phone, email: user.email },
          theme: { color: '#1c3d6b' },
        };
        const Razorpay = (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay;
        const rzp = new Razorpay(options);
        rzp.open();
        setLoading(false);
      } else {
        clearCart();
        router.push(`/order-success?orderId=${data.order._id}`);
      }
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Order failed');
      setLoading(false);
    }
  };

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      <div className="container-site py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Address + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h2 className="font-bold text-gray-900 mb-5">Delivery Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'fullName', label: 'Full Name', type: 'text', span: 1, required: true },
                  { key: 'phone', label: 'Phone Number', type: 'tel', span: 1, required: true },
                  { key: 'line1', label: 'Address Line 1', type: 'text', span: 2, required: true },
                  { key: 'line2', label: 'Address Line 2 (optional)', type: 'text', span: 2, required: false },
                  { key: 'city', label: 'City', type: 'text', span: 1, required: true },
                  { key: 'pincode', label: 'Pincode', type: 'text', span: 1, required: true },
                ].map(({ key, label, type, span, required }) => (
                  <div key={key} className={span === 2 ? 'sm:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={type}
                      value={address[key as keyof Address]}
                      onChange={updateAddress(key as keyof Address)}
                      required={required}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-600"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">State <span className="text-red-500">*</span></label>
                  <select
                    value={address.state}
                    onChange={updateAddress('state')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-600 bg-white"
                  >
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h2 className="font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                {([
                  { value: 'razorpay', label: 'Online Payment (Razorpay)', sub: 'UPI, Cards, Net Banking, Wallets', icon: '💳' },
                  { value: 'cod', label: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: '💵' },
                ] as const).map(({ value, label, sub, icon }) => (
                  <label key={value} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === value ? 'border-brand-600 bg-brand-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={paymentMethod === value}
                      onChange={() => setPaymentMethod(value)}
                      className="accent-brand-700"
                    />
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400">{sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {items.map(item => (
                  <div key={item.variantSku} className="flex gap-3">
                    <div className="relative w-12 h-12 shrink-0 bg-gray-50 rounded overflow-hidden">
                      <Image src={item.image || '/placeholder-product.png'} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-800 line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-400">{[item.flavor, item.weight].filter(Boolean).join(' · ')} × {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-800 shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({couponCode})</span><span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCharge === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shippingCharge)}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-primary w-full mt-4 disabled:opacity-60"
              >
                {loading ? 'Placing Order…' : paymentMethod === 'razorpay' ? `Pay ${formatPrice(total)}` : 'Place Order (COD)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
