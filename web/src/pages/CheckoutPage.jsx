import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Lock, CreditCard, MapPin, CheckCircle, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { createOrder } from '@/api/EcommerceApi';
import { toast } from 'sonner';

const STEPS = ['Shipping', 'Payment', 'Review'];

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all duration-200';
const labelClass = 'block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider';

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  done
                    ? 'bg-emerald-500 text-white'
                    : active
                    ? 'bg-violet-600 text-white ring-4 ring-violet-500/20'
                    : 'bg-white/10 text-white/30'
                }`}
              >
                {done ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[10px] font-medium uppercase tracking-wider ${active ? 'text-white' : done ? 'text-emerald-400' : 'text-white/30'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-16 mb-5 mx-1 transition-all duration-500 ${done ? 'bg-emerald-500' : 'bg-white/10'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ShippingStep({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!data.firstName.trim()) e.firstName = true;
    if (!data.lastName.trim()) e.lastName = true;
    if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email)) e.email = true;
    if (!data.address.trim()) e.address = true;
    if (!data.city.trim()) e.city = true;
    if (!data.state.trim()) e.state = true;
    if (!data.zip.trim()) e.zip = true;
    if (!data.country.trim()) e.country = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const field = (name, label, placeholder, type = 'text', half = false) => (
    <div className={half ? 'flex-1' : 'w-full'}>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={data[name]}
        onChange={e => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} ${errors[name] ? 'border-red-500/60' : ''}`}
      />
      {errors[name] && <p className="text-red-400 text-xs mt-1">Required</p>}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-5 h-5 text-violet-400" />
        <h2 className="text-white font-semibold text-lg">Shipping Address</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          {field('firstName', 'First Name', 'John', 'text', true)}
          {field('lastName', 'Last Name', 'Doe', 'text', true)}
        </div>
        {field('email', 'Email Address', 'john@example.com', 'email')}
        {field('phone', 'Phone Number', '+1 (555) 000-0000', 'tel')}
        {field('address', 'Street Address', '123 Main St', 'text')}
        {field('address2', 'Apt, Suite, Unit (optional)', 'Apt 4B')}
        <div className="flex gap-4">
          {field('city', 'City', 'New York', 'text', true)}
          {field('state', 'State / Province', 'NY', 'text', true)}
        </div>
        <div className="flex gap-4">
          {field('zip', 'ZIP / Postal Code', '10001', 'text', true)}
          <div className="flex-1">
            <label className={labelClass}>Country</label>
            <select
              value={data.country}
              onChange={e => onChange('country', e.target.value)}
              className={`${inputClass} ${errors.country ? 'border-red-500/60' : ''}`}
              style={{ appearance: 'none' }}
            >
              <option value="" style={{ background: '#1a1a2e' }}>Select country</option>
              {['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'India', 'Singapore', 'UAE'].map(c => (
                <option key={c} value={c} style={{ background: '#1a1a2e' }}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-xl border border-white/8 bg-white/3">
        <p className="text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Shipping Method</p>
        {[
          { id: 'standard', label: 'Standard Shipping', sub: '5–7 business days', price: 'Free' },
          { id: 'express', label: 'Express Shipping', sub: '2–3 business days', price: '৳1,100' },
          { id: 'overnight', label: 'Overnight Shipping', sub: 'Next business day', price: '৳2,750' },
        ].map(opt => (
          <label key={opt.id} className="flex items-center gap-3 py-2.5 cursor-pointer group">
            <input
              type="radio"
              name="shipping"
              value={opt.id}
              checked={data.shippingMethod === opt.id}
              onChange={() => onChange('shippingMethod', opt.id)}
              className="accent-violet-500 w-4 h-4"
            />
            <div className="flex-1">
              <span className="text-white/80 text-sm font-medium">{opt.label}</span>
              <span className="text-white/35 text-xs ml-2">{opt.sub}</span>
            </div>
            <span className="text-white/70 text-sm font-semibold">{opt.price}</span>
          </label>
        ))}
      </div>

      <button
        onClick={() => { if (validate()) onNext(); }}
        className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-purple-500 transition-all duration-200 flex items-center justify-center gap-2"
      >
        Continue to Payment <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function PaymentStep({ data, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const formatCard = (val) => val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (val) => {
    const v = val.replace(/\D/g, '').slice(0, 4);
    return v.length >= 3 ? `${v.slice(0, 2)}/${v.slice(2)}` : v;
  };

  const validate = () => {
    const e = {};
    if (!data.cardName.trim()) e.cardName = true;
    if (data.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = true;
    if (!data.expiry || data.expiry.length < 5) e.expiry = true;
    if (!data.cvv || data.cvv.length < 3) e.cvv = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const cardType = () => {
    const n = data.cardNumber.replace(/\s/g, '');
    if (n.startsWith('4')) return 'VISA';
    if (n.startsWith('5')) return 'MC';
    if (n.startsWith('3')) return 'AMEX';
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="w-5 h-5 text-violet-400" />
        <h2 className="text-white font-semibold text-lg">Payment Details</h2>
        <div className="ml-auto flex items-center gap-1 text-white/30 text-xs">
          <Lock className="w-3 h-3" /> SSL Secured
        </div>
      </div>

      {/* Card visual */}
      <div className="relative h-44 rounded-2xl bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 p-6 mb-6 overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
        <div className="absolute top-4 right-4 text-white/60 font-bold text-sm tracking-widest">{cardType() || '····'}</div>
        <div className="absolute bottom-14 left-6 text-white/90 font-mono text-lg tracking-widest">
          {data.cardNumber || '•••• •••• •••• ••••'}
        </div>
        <div className="absolute bottom-6 left-6 text-white/60 text-xs uppercase tracking-wider">
          {data.cardName || 'CARDHOLDER NAME'}
        </div>
        <div className="absolute bottom-6 right-6 text-white/60 text-xs">
          {data.expiry || 'MM/YY'}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>Name on Card</label>
          <input value={data.cardName} onChange={e => onChange('cardName', e.target.value)} placeholder="John Doe"
            className={`${inputClass} ${errors.cardName ? 'border-red-500/60' : ''}`} />
          {errors.cardName && <p className="text-red-400 text-xs mt-1">Required</p>}
        </div>
        <div>
          <label className={labelClass}>Card Number</label>
          <input value={data.cardNumber} onChange={e => onChange('cardNumber', formatCard(e.target.value))}
            placeholder="1234 5678 9012 3456" maxLength={19}
            className={`${inputClass} font-mono ${errors.cardNumber ? 'border-red-500/60' : ''}`} />
          {errors.cardNumber && <p className="text-red-400 text-xs mt-1">Enter valid 16-digit card number</p>}
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className={labelClass}>Expiry Date</label>
            <input value={data.expiry} onChange={e => onChange('expiry', formatExpiry(e.target.value))}
              placeholder="MM/YY" maxLength={5}
              className={`${inputClass} ${errors.expiry ? 'border-red-500/60' : ''}`} />
            {errors.expiry && <p className="text-red-400 text-xs mt-1">Required</p>}
          </div>
          <div className="flex-1">
            <label className={labelClass}>CVV</label>
            <input value={data.cvv} onChange={e => onChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="•••" maxLength={4} type="password"
              className={`${inputClass} ${errors.cvv ? 'border-red-500/60' : ''}`} />
            {errors.cvv && <p className="text-red-400 text-xs mt-1">Required</p>}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
        <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <p className="text-emerald-300/80 text-xs">Your payment information is encrypted and never stored on our servers.</p>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onBack}
          className="flex-1 py-3.5 rounded-2xl border border-white/15 text-white/60 font-semibold text-sm hover:bg-white/5 transition-all flex items-center justify-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={() => { if (validate()) onNext(); }}
          className="flex-[2] py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2">
          Review Order <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function ReviewStep({ shipping, payment, onBack, onPlace, placing }) {
  const { cartItems, getCartTotal } = useCart();

  const shippingCost = shipping.shippingMethod === 'express' ? 1100 : shipping.shippingMethod === 'overnight' ? 2750 : 0;
  const subtotalRaw = cartItems.reduce((t, item) => {
    const p = item.variant.sale_price_in_cents ?? item.variant.price_in_cents;
    return t + p * item.quantity;
  }, 0) / 100;
  const tax = subtotalRaw * 0.05;
  const total = subtotalRaw + shippingCost + tax;

  const fmt = (n) => `৳${new Intl.NumberFormat('en-IN').format(Math.round(n))}`;
  const masked = payment.cardNumber ? `•••• •••• •••• ${payment.cardNumber.replace(/\s/g, '').slice(-4)}` : '';

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-5 h-5 text-violet-400" />
        <h2 className="text-white font-semibold text-lg">Review Your Order</h2>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-5">
        {cartItems.map(item => {
          const price = (item.variant.sale_price_in_cents ?? item.variant.price_in_cents) / 100;
          return (
            <div key={item.variant.id} className="flex gap-3 items-center p-3 rounded-xl bg-white/4 border border-white/8">
              <img src={item.product.image} alt={item.product.title} className="w-12 h-12 object-contain" />
              <div className="flex-1 min-w-0">
                <p className="text-white/90 text-sm font-medium line-clamp-1">{item.product.title}</p>
                <p className="text-white/40 text-xs">{item.variant.title} × {item.quantity}</p>
              </div>
              <p className="text-white/80 text-sm font-semibold">{fmt(price * item.quantity)}</p>
            </div>
          );
        })}
      </div>

      {/* Summary blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div className="p-4 rounded-xl bg-white/4 border border-white/8">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Ship To</p>
          <p className="text-white/80 text-sm font-medium">{shipping.firstName} {shipping.lastName}</p>
          <p className="text-white/50 text-xs mt-1">{shipping.address}{shipping.address2 ? `, ${shipping.address2}` : ''}</p>
          <p className="text-white/50 text-xs">{shipping.city}, {shipping.state} {shipping.zip}</p>
          <p className="text-white/50 text-xs">{shipping.country}</p>
        </div>
        <div className="p-4 rounded-xl bg-white/4 border border-white/8">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Payment</p>
          <p className="text-white/80 text-sm font-medium">{payment.cardName}</p>
          <p className="text-white/50 text-xs mt-1">{masked}</p>
          <p className="text-white/50 text-xs">Expires {payment.expiry}</p>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="p-4 rounded-xl bg-white/4 border border-white/8 space-y-2 mb-6">
        <div className="flex justify-between text-sm text-white/60">
          <span>Subtotal</span><span>{fmt(subtotalRaw)}</span>
        </div>
        <div className="flex justify-between text-sm text-white/60">
          <span>Shipping ({shipping.shippingMethod === 'standard' ? 'Standard' : shipping.shippingMethod === 'express' ? 'Express' : 'Overnight'})</span>
          <span>{shippingCost === 0 ? 'Free' : fmt(shippingCost)}</span>
        </div>
        <div className="flex justify-between text-sm text-white/60">
          <span>Estimated Tax (8%)</span><span>{fmt(tax)}</span>
        </div>
        <div className="h-px bg-white/10 my-1" />
        <div className="flex justify-between text-base text-white font-bold">
          <span>Total</span><span>{fmt(total)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} disabled={placing}
          className="flex-1 py-3.5 rounded-2xl border border-white/15 text-white/60 font-semibold text-sm hover:bg-white/5 transition-all flex items-center justify-center gap-2 disabled:opacity-40">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={onPlace} disabled={placing}
          className="flex-[2] py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
          {placing ? (
            <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing…</>
          ) : (
            <><Lock className="w-4 h-4" /> Place Order</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

const defaultShipping = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', address2: '', city: '', state: '', zip: '', country: '',
  shippingMethod: 'standard',
};
const defaultPayment = { cardName: '', cardNumber: '', expiry: '', cvv: '' };

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState(() => ({
    ...defaultShipping,
    firstName: profile?.full_name?.split(' ')[0] || '',
    lastName: profile?.full_name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    address: profile?.address || '',
    city: profile?.city || '',
    state: profile?.state || '',
    zip: profile?.zip_code || '',
    country: profile?.country || '',
  }));
  const [payment, setPayment] = useState(defaultPayment);
  const [placing, setPlacing] = useState(false);

  const patchShipping = (k, v) => setShipping(s => ({ ...s, [k]: v }));
  const patchPayment = (k, v) => setPayment(p => ({ ...p, [k]: v }));

  const placeOrder = async () => {
    setPlacing(true);
    
    try {
      const subtotalRaw = cartItems.reduce((t, item) => {
        const p = item.variant.sale_price_in_cents ?? item.variant.price_in_cents;
        return t + p * item.quantity;
      }, 0);
      const shippingCost = (shipping.shippingMethod === 'express' ? 1100 : shipping.shippingMethod === 'overnight' ? 2750 : 0) * 100;
      const tax = Math.round(subtotalRaw * 0.08);
      const totalAmount = subtotalRaw + shippingCost + tax;

      const shippingAddress = `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zip}, ${shipping.country}`;

      if (user) {
        const { success, orderId, error } = await createOrder(
          user.id,
          cartItems,
          totalAmount,
          shippingAddress
        );

        if (!success) throw error;
        
        clearCart();
        navigate('/success', { state: { orderNum: orderId, email: shipping.email, shipping, payment } });
      } else {
        // Guest checkout (simulated)
        await new Promise(r => setTimeout(r, 1800));
        clearCart();
        const orderNum = `ORD-${Date.now().toString(36).toUpperCase()}`;
        navigate('/success', { state: { orderNum, email: shipping.email, shipping, payment } });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
      setPlacing(false);
    }
  };

  if (cartItems.length === 0 && !placing) {
    return (
      <>
        <Helmet><title>Checkout — Cipher</title></Helmet>
        <div style={{ background: '#0a0a0f' }} className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <ShoppingBag className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h1 className="text-white text-2xl font-bold mb-2">Your bag is empty</h1>
              <p className="text-white/40 mb-6">Add items before checking out.</p>
              <Link to="/store" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-all">
                <ShoppingBag className="w-4 h-4" /> Shop Now
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Checkout — Cipher</title><meta name="description" content="Complete your Cipher order securely." /></Helmet>
      <div style={{ background: '#0a0a0f' }} className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 px-4 py-12">
          <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
          <div className="orb orb-blue absolute w-96 h-96 top-0 right-0 opacity-20 pointer-events-none" />
          <div className="orb orb-purple absolute w-80 h-80 bottom-0 left-0 opacity-15 pointer-events-none" />

          <div className="relative z-10 max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white mb-1">Checkout</h1>
              <p className="text-white/35 text-sm">Secure checkout powered by Cipher</p>
            </div>

            <StepIndicator current={step} />

            <div className="glass rounded-3xl p-8 border border-white/10">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <ShippingStep key="shipping" data={shipping} onChange={patchShipping} onNext={() => setStep(1)} />
                )}
                {step === 1 && (
                  <PaymentStep key="payment" data={payment} onChange={patchPayment} onNext={() => setStep(2)} onBack={() => setStep(0)} />
                )}
                {step === 2 && (
                  <ReviewStep key="review" shipping={shipping} payment={payment} onBack={() => setStep(1)} onPlace={placeOrder} placing={placing} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
