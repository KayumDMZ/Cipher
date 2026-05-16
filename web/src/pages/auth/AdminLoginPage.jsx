import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { toast } from 'sonner';
import { Shield, Loader2, Eye, EyeOff, Lock, Mail, UserPlus, KeyRound, User } from 'lucide-react';

// ─── Change this to your own secret passphrase ────────────────────────────────
const ADMIN_SECRET_KEY = 'CIPHER-ADMIN-2025';
// ─────────────────────────────────────────────────────────────────────────────

const AdminLoginPage = () => {
  const { user, isAdmin, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regKey, setRegKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  // Already logged in as admin → go straight to dashboard
  if (!loading && user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast.error('Invalid credentials. Access denied.');
      return;
    }
    navigate('/admin');
  };

  // ── Register Admin ─────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    if (regKey !== ADMIN_SECRET_KEY) {
      toast.error('Invalid admin secret key. Access denied.');
      return;
    }
    if (regPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);

    // Try creating a new account first
    const { user: newUser, error } = await signUp(regEmail, regPassword, {
      full_name: regName,
      phone_number: '',
      role: 'admin',
    });

    // ── Email already in use: upgrade the existing account instead ──────────
    if (error?.code === 'auth/email-already-in-use') {
      // Sign them in with the provided password to verify ownership
      const { user: existingUser, error: loginErr } = await signIn(regEmail, regPassword);
      if (loginErr) {
        setSubmitting(false);
        toast.error('Email already registered — wrong password. Cannot upgrade account.');
        return;
      }
      // Upgrade their Firestore profile to admin
      const profileRef = doc(db, 'profiles', existingUser.uid);
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        await updateDoc(profileRef, { role: 'admin' });
      } else {
        await setDoc(profileRef, {
          id: existingUser.uid,
          email: existingUser.email,
          full_name: regName || existingUser.email,
          phone_number: '',
          role: 'admin',
          created_at: new Date().toISOString(),
        });
      }
      setSubmitting(false);
      toast.success('Existing account upgraded to admin! Redirecting…');
      setRegName(''); setRegEmail(''); setRegPassword(''); setRegKey('');
      navigate('/admin');
      return;
    }

    setSubmitting(false);
    if (error) {
      toast.error(error.message || 'Failed to create admin account.');
      return;
    }
    toast.success('Admin account created! You can now log in.');
    setMode('login');
    setRegName(''); setRegEmail(''); setRegPassword(''); setRegKey('');
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(rgba(99,102,241,0.4) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      {/* Glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/4 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              {mode === 'register'
                ? <UserPlus className="w-8 h-8 text-indigo-400" />
                : <Shield className="w-8 h-8 text-indigo-400" />
              }
            </div>
          </div>

          <h1 className="text-2xl font-black text-white text-center mb-1">
            {mode === 'register' ? 'Create Admin Account' : 'Admin Access'}
          </h1>
          <p className="text-zinc-500 text-sm text-center mb-8">
            {mode === 'register' ? 'Requires the admin secret key.' : 'Restricted area. Authorized personnel only.'}
          </p>

          {/* ── MODE TABS ── */}
          <div className="flex bg-black/30 border border-white/8 rounded-xl p-1 mb-7">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'register' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* ── LOGIN FORM ── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Admin email"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  id="admin-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="submit"
                id="admin-login-btn"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                {submitting ? 'Verifying…' : 'Access Dashboard'}
              </button>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="Full name"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  type="email"
                  autoComplete="username"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Password (min 6 chars)"
                  required
                  minLength={6}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Secret key */}
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/70 pointer-events-none" />
                <input
                  type={showKey ? 'text' : 'password'}
                  value={regKey}
                  onChange={e => setRegKey(e.target.value)}
                  placeholder="Admin secret key"
                  required
                  className="w-full bg-amber-500/5 border border-amber-500/20 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
                <button type="button" onClick={() => setShowKey(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                id="admin-register-btn"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {submitting ? 'Creating account…' : 'Create Admin Account'}
              </button>
            </form>
          )}

          {/* Security notice */}
          <div className="mt-8 pt-6 border-t border-white/6 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-400 text-[9px] font-black">!</span>
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed">
              This page is for <span className="text-zinc-400 font-semibold">Cipher staff only</span>.
              Unauthorized access attempts are logged and may result in account suspension.
            </p>
          </div>
        </div>

        {/* Back link */}
        <p className="text-center mt-6 text-zinc-600 text-xs">
          Not staff?{' '}
          <a href="/" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
            Return to store
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
