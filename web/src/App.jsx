import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/hooks/useCart';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import StorePage from './pages/StorePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import CheckoutPage from './pages/CheckoutPage';
import IPhonePage from './pages/IPhonePage';
import MacPage from './pages/MacPage';
import IpadPage from './pages/IpadPage';
import WatchPage from './pages/WatchPage';
import AirpodsPage from './pages/AirpodsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
          <Route path="/iphone" element={<IPhonePage />} />
          <Route path="/mac" element={<MacPage />} />
          <Route path="/ipad" element={<IpadPage />} />
          <Route path="/watch" element={<WatchPage />} />
          <Route path="/airpods" element={<AirpodsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <Toaster />
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;