import React, { useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Minus, Plus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !event.target.closest('#cart-icon-btn')) {
        setIsCartOpen(false);
      }
    };
    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen, setIsCartOpen]);

  const navigate = useNavigate();

  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      toast({ title: 'Cart is empty', description: 'Add some products first.', variant: 'destructive' });
      return;
    }
    setIsCartOpen(false);
    navigate('/checkout');
  }, [cartItems, navigate, setIsCartOpen, toast]);

  const subtotal = getCartTotal();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
          className="apple-glass-dropdown absolute right-0 top-full mt-2 w-[320px] md:w-[380px] z-50 overflow-hidden text-sm"
          style={{ transformOrigin: 'top right' }}
        >
          {/* Decorative Arrow */}
          <div className="absolute -top-[6px] right-[18px] w-3 h-3 bg-white/85 border-t border-l border-[#d2d2d7]/50 transform rotate-45 z-0" />

          <div className="relative z-10 px-5 pt-6 pb-5 flex flex-col max-h-[80vh]">
            {cartItems.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[#6e6e73] font-normal text-base">Your Bag is empty.</p>
                <div className="mt-6 border-t border-[#d2d2d7]/30 pt-4 flex flex-col gap-2 text-[#0066cc]">
                  <Link to="/store" onClick={() => setIsCartOpen(false)} className="hover:underline">Shop today's deals</Link>
                  <Link to="/store" onClick={() => setIsCartOpen(false)} className="hover:underline">Shop Mac</Link>
                  <Link to="/store" onClick={() => setIsCartOpen(false)} className="hover:underline">Shop iPhone</Link>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-[#1d1d1f] font-semibold text-[28px] mb-6">Bag</h2>
                
                <div className="overflow-y-auto flex-1 pr-2 -mr-2 space-y-6">
                  {cartItems.map(item => (
                    <div key={item.variant.id} className="flex gap-4 border-b border-[#d2d2d7]/30 pb-6 last:border-0 last:pb-0">
                      {/* Product image */}
                      <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <Link to={`/product/${item.product.id}`} onClick={() => setIsCartOpen(false)} className="text-[#1d1d1f] font-semibold text-[17px] leading-tight hover:underline line-clamp-2">
                            {item.product.title}
                          </Link>
                        </div>
                        <p className="text-[#6e6e73] text-[13px] mb-2">{item.variant.title}</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-4">
                            <span className="text-[#1d1d1f] text-[17px] font-normal">
                              {item.variant.sale_price_formatted || item.variant.price_formatted}
                            </span>
                            <div className="flex items-center gap-3">
                              <button onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))} className="text-[#0066cc] hover:opacity-70"><Minus className="w-4 h-4" /></button>
                              <span className="text-[#1d1d1f] text-[15px]">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} className="text-[#0066cc] hover:opacity-70"><Plus className="w-4 h-4" /></button>
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(item.variant.id)} className="text-[#0066cc] text-[13px] hover:underline">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-[#d2d2d7]/30">
                  <div className="flex justify-between items-center mb-5 text-[17px]">
                    <span className="text-[#1d1d1f] font-normal">Subtotal</span>
                    <span className="text-[#1d1d1f] font-semibold">{subtotal}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 rounded-lg bg-[#0071e3] text-white font-normal text-[15px] hover:bg-[#0077ED] transition-colors"
                  >
                    Check Out
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;