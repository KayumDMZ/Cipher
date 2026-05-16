import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { updatePassword, user } = useAuth();
  const navigate = useNavigate();

  // Basic security check: if no user is present (even recovery user), redirect to login
  // Note: Supabase recovery links automatically log the user in.
  useEffect(() => {
    if (!user) {
      // We might want to wait a bit for the session to be established
      const timer = setTimeout(() => {
        if (!user) {
          toast.error('Session expired or invalid link.');
          navigate('/login');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(password);
      if (error) throw error;
      
      toast.success('Password updated successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
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
          <div className="w-16 h-16 rounded-full bg-[#f0fdf4] flex items-center justify-center mb-6">
            <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-green-600">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          <h1 className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight mb-3">
            New password
          </h1>
          <p className="text-[17px] text-[#6e6e73] leading-tight mb-8">
            Create a secure password for your Cipher account.
          </p>

          <form onSubmit={handleUpdatePassword} className="w-full space-y-4">
            <div className="space-y-2 text-left">
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#f5f5f7] border-none text-[#1d1d1f] pl-12 pr-4 h-[52px] rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 font-mono"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-[#f5f5f7] border-none text-[#1d1d1f] pl-12 pr-4 h-[52px] rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 font-mono"
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
                  Update Password
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
