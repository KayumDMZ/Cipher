import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, Home, Package, Mail } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

function CheckoutSuccessPage() {
  const { state } = useLocation();
  const orderNum = state?.orderNum || `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const email = state?.email || null;
  const shipping = state?.shipping || null;

  return (
    <>
      <Helmet>
        <title>Order Confirmed — Cipher</title>
        <meta name="description" content="Your Cipher order has been confirmed. Thank you for shopping with us." />
      </Helmet>

      <div style={{ background: '#0a0a0f' }} className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
          <div className="orb orb-blue absolute w-96 h-96 top-0 right-0 opacity-25 pointer-events-none" />
          <div className="orb orb-purple absolute w-80 h-80 bottom-0 left-0 opacity-20 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10 max-w-lg w-full mx-auto"
          >
            {/* Success card */}
            <div className="glass rounded-3xl p-10 border border-white/10 text-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-emerald-400" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h1 className="text-4xl font-black text-white mb-2">Order Confirmed!</h1>
                <p className="text-white/40 text-base mb-1">Thank you for your purchase</p>

                {/* Order number badge */}
                <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-4 py-1.5 mt-3 mb-5">
                  <Package className="w-4 h-4 text-violet-400" />
                  <span className="text-white/70 text-sm font-mono font-semibold tracking-wider">{orderNum}</span>
                </div>

                {/* Email confirmation */}
                {email && (
                  <div className="flex items-center justify-center gap-2 text-white/35 text-sm mb-6">
                    <Mail className="w-4 h-4" />
                    <span>Confirmation sent to <span className="text-white/60 font-medium">{email}</span></span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Shipping summary */}
            {shipping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="glass rounded-2xl p-5 border border-white/8 mb-4"
              >
                <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Shipping To</p>
                <p className="text-white/80 text-sm font-semibold">{shipping.firstName} {shipping.lastName}</p>
                <p className="text-white/50 text-xs mt-1">{shipping.address}{shipping.address2 ? `, ${shipping.address2}` : ''}</p>
                <p className="text-white/50 text-xs">{shipping.city}, {shipping.state} {shipping.zip}, {shipping.country}</p>
                <div className="mt-3 pt-3 border-t border-white/8">
                  <span className="text-white/35 text-xs">Method: </span>
                  <span className="text-white/60 text-xs font-medium capitalize">
                    {shipping.shippingMethod === 'standard' ? 'Standard (5–7 days)' : shipping.shippingMethod === 'express' ? 'Express (2–3 days)' : 'Overnight (Next day)'}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link to="/store" id="success-back-store" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl btn-primary-3d text-white font-semibold"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Continue Shopping
                </motion.button>
              </Link>
              <Link to="/" id="success-home" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border border-white/15 text-white/70 font-semibold hover:bg-white/5 transition-all"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default CheckoutSuccessPage;