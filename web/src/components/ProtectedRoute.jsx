import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShieldOff } from 'lucide-react';

/**
 * ProtectedRoute — Wraps routes that require authentication.
 * If `requireAdmin` is true, also checks the user's admin role.
 * - Unauthenticated users → redirected to /login (or /admin-login for admin routes)
 * - Authenticated but non-admin trying to reach admin route → Access Denied page
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Still resolving auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <p className="text-white/40 text-sm">Verifying access…</p>
        </div>
      </div>
    );
  }

  // Not logged in at all
  if (!user) {
    const loginPath = requireAdmin ? '/admin-login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Logged in but not an admin, trying to reach an admin route
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <ShieldOff className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Access Denied</h1>
          <p className="text-zinc-500 mb-2">Your account does not have admin privileges.</p>
          <p className="text-zinc-600 text-sm mb-8">
            If you believe this is an error, contact your system administrator.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="/"
              className="px-6 py-2.5 rounded-full bg-white/8 hover:bg-white/12 text-white text-sm font-medium transition-all"
            >
              Back to Store
            </a>
            <a
              href="/admin-login"
              className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all"
            >
              Use Admin Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
