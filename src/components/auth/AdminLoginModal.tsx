import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ZKLogo } from '../common/ZKLogo.tsx';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, X, Sparkles, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your admin email and password.');
      return;
    }

    setIsLoading(true);
    const res = await login(email.trim(), password, rememberMe);
    setIsLoading(false);

    if (res.success) {
      setEmail('');
      setPassword('');
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md my-auto bg-gradient-to-b from-[#11172f]/95 via-[#0a0f24]/98 to-[#060918]/98 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(59,130,246,0.25)] backdrop-blur-2xl text-white z-10 overflow-hidden">
        {/* Glow ambient spots */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-200 border border-white/5 min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3 transform hover:scale-105 transition-transform duration-300">
            <ZKLogo size="lg" animated />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            ZK Master Control Center
          </div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">
            Admin Authentication
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Restricted Access &bull; Authorized Site Owner Only
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Admin Login ID / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter authorized admin email"
                className="w-full pl-10 pr-4 py-3 bg-[#0d1430]/80 border border-blue-500/25 focus:border-blue-400 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all min-h-[44px]"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Master Password
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                SHA-512 Encrypted
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter master password"
                className="w-full pl-10 pr-11 py-3 bg-[#0d1430]/80 border border-blue-500/25 focus:border-blue-400 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all min-h-[44px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Options Row */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500/40"
              />
              <span>Remember login</span>
            </label>
            <span className="text-emerald-400 text-[11px] font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Brute-Force Protected
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[44px] py-3.5 px-4 mt-2 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 hover:from-blue-500 hover:via-purple-500 hover:to-amber-400 text-white font-semibold text-sm shadow-[0_0_25px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
                <span>ACCESS ADMIN PANEL</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Security Notice Box */}
        <div className="mt-5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center gap-2 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-[11px] text-slate-400">
            Encrypted Bearer Session &bull; Rate-Limited Brute Force Protection (5 attempts max)
          </span>
        </div>
      </div>
    </div>
  );
};
