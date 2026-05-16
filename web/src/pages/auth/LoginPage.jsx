import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LogIn, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      
      toast.success('Welcome back to Cipher!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] bg-white rounded-[32px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#f0f9ff] flex items-center justify-center mb-6">
            <div className="w-10 h-10 rounded-full bg-[#e0f2fe] flex items-center justify-center text-blue-600">
              <LogIn className="w-5 h-5" />
            </div>
          </div>

          <h1 className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight mb-3">
            Welcome back
          </h1>
          <p className="text-[17px] text-[#6e6e73] leading-tight mb-8">
            Sign in to track your orders and manage your details.
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div className="space-y-2 text-left">
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#f5f5f7] border-none text-[#1d1d1f] pl-12 pr-4 h-[52px] rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#f5f5f7] border-none text-[#1d1d1f] pl-12 pr-12 h-[52px] rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 font-mono"
                />
                <Link to="/forgot-password" size="sm" className="absolute right-4 top-3.5 text-xs text-[#0071e3] hover:underline font-medium">
                  Forgot?
                </Link>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full h-[52px] bg-[#1d1d1f] hover:bg-black text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Continue"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-[#6e6e73] text-[14px]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#0071e3] hover:underline font-medium">
              Create one
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
