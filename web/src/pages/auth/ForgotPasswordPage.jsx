import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, Loader2, ArrowLeft, Send } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      
      toast.success('Password reset link sent! Check your email.');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset link');
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
          <Link 
            to="/login" 
            className="self-start mb-6 text-[#6e6e73] hover:text-[#1d1d1f] flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          <div className="w-16 h-16 rounded-full bg-[#f0f9ff] flex items-center justify-center mb-6">
            <div className="w-10 h-10 rounded-full bg-[#e0f2fe] flex items-center justify-center text-blue-600">
              <Mail className="w-5 h-5" />
            </div>
          </div>

          <h1 className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight mb-3">
            Reset password
          </h1>
          <p className="text-[17px] text-[#6e6e73] leading-tight mb-8">
            Enter your email and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleResetRequest} className="w-full space-y-4">
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

            <button 
              type="submit" 
              className="w-full h-[52px] bg-[#1d1d1f] hover:bg-black text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Send Link
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-[#6e6e73] text-[14px]">
            Remember your password?{' '}
            <Link to="/login" className="text-[#0071e3] hover:underline font-medium">
              Log in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
