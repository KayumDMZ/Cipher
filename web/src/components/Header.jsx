import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import ShoppingCart from '@/components/ShoppingCart.jsx';
import { User } from 'lucide-react';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();
  const { user } = useAuth();

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Store', path: '/store' },
    { name: 'Apple', path: '/store?brand=apple' },
    { name: 'Samsung', path: '/store?brand=samsung' },
    { name: 'Google', path: '/store?brand=google' },
    { name: 'Accessories', path: '/store?category=accessories' },
    { name: 'Support', path: '/support' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 apple-nav text-xs font-normal transition-colors duration-300">
        <nav className="max-w-[1024px] mx-auto px-4">
          <div className="flex items-center justify-between h-[44px]">
            {/* Logo */}
            <Link to="/" className="text-white/90 hover:text-white transition-colors flex-shrink-0 flex items-center gap-1.5 font-semibold text-sm tracking-tight" aria-label="Cipher">
              <img src="/logo.png" alt="Cipher" className="w-[20px] h-[20px] object-contain rounded-sm" />
              Cipher
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between flex-1 px-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-white/80 hover:text-white transition-colors tracking-wide"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-6 lg:space-x-4">
              <button
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search className="w-[15px] h-[15px]" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  id="cart-icon-btn"
                  className="relative text-white/80 hover:text-white transition-colors"
                  aria-label="Shopping Cart"
                >
                  <ShoppingBag className="w-[15px] h-[15px]" />
                  <AnimatePresence>
                    {cartItemCount > 0 && (
                      <motion.span
                        key="badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] text-[9px] font-bold leading-none text-white bg-blue-500 rounded-full flex items-center justify-center px-1"
                      >
                        {cartItemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
              </div>

              <Link
                to={user ? "/profile" : "/login"}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Profile"
              >
                <User className="w-[15px] h-[15px]" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white/80 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-[15px] h-[15px]" />
                ) : (
                  <Menu className="w-[15px] h-[15px]" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100vh' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-[#1d1d1f] overflow-y-auto"
            >
              <div className="px-10 py-4 flex flex-col space-y-4">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-[28px] font-semibold text-white/90 hover:text-white border-b border-white/10 pb-2"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.04 }}
                  className="pt-4"
                >
                  <Link
                    to={user ? "/profile" : "/login"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-[28px] font-semibold text-blue-400 hover:text-blue-300"
                  >
                    {user ? 'Profile' : 'Sign In'}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default Header;