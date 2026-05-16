import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserPlus, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(email, password, {
        full_name: fullName,
        phone_number: phone
      });
      if (error) throw error;

      toast.success('Account created! Please check your email for verification.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to sign up');
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
          {/* Humorous Lock Icon */}
          <div className="w-16 h-16 rounded-full bg-[#fffbeb] flex items-center justify-center mb-6">
            <div className="w-10 h-10 rounded-full bg-[#fef3c7] flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#f59e0b] fill-[#f59e0b]" />
            </div>
          </div>

          <h1 className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight mb-3">
            Create Your Cipher Account
          </h1>

          <div className="space-y-1 mb-8">
            <p className="text-[17px] text-[#6e6e73] leading-tight px-4">
              Don't reuse your bank password, we didn't spend a lot on security for this app.
            </p>
            <p className="text-[14px] text-[#86868b]">
              At least 6 characters
            </p>
          </div>

          <form onSubmit={handleSignup} className="w-full space-y-4">
            {/* Full Name and Email included for functional signup, but styled minimally */}
            <div className="space-y-2 text-left">
              <div className="relative group">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-[#f5f5f7] border-none text-[#1d1d1f] pl-12 pr-4 h-[52px] rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <div className="relative group">
                <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.79 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-[#f5f5f7] border-none text-[#1d1d1f] pl-12 pr-4 h-[52px] rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

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
                  minLength={6}
                  className="w-full bg-[#f5f5f7] border-none text-[#1d1d1f] pl-12 pr-12 h-[52px] rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 font-mono"
                />
                <button type="button" className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                </button>
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
            Already have an account?{' '}
            <Link to="/login" className="text-[#0071e3] hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
