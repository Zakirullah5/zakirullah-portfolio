import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext.tsx';
import { Lock, KeyRound, ShieldCheck, AlertCircle, CheckCircle, Eye, EyeOff, Mail, ShieldAlert, Sparkles, Check } from 'lucide-react';

export const SecurityView: React.FC = () => {
  const { user, changePassword, changeEmail } = useAuth();

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passStatusMsg, setPassStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPassLoading, setIsPassLoading] = useState(false);

  // Email (Admin ID) state
  const [newEmail, setNewEmail] = useState('');
  const [emailAuthPassword, setEmailAuthPassword] = useState('');
  const [showEmailPass, setShowEmailPass] = useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: 'None', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, text: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score: 2, text: 'Medium', color: 'bg-amber-500' };
    return { score: 3, text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassStatusMsg(null);

    if (newPassword !== confirmPassword) {
      setPassStatusMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setPassStatusMsg({ type: 'error', text: 'New password must be at least 8 characters long for enhanced security.' });
      return;
    }

    setIsPassLoading(true);
    const res = await changePassword(oldPassword, newPassword);
    setIsPassLoading(false);

    if (res.success) {
      setPassStatusMsg({ type: 'success', text: 'Master password successfully updated! It is hashed with salt & SHA-512.' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPassStatusMsg({ type: 'error', text: res.message || 'Failed to change password.' });
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatusMsg(null);

    if (!newEmail.trim()) {
      setEmailStatusMsg({ type: 'error', text: 'Please enter a valid new admin email.' });
      return;
    }

    if (!emailAuthPassword) {
      setEmailStatusMsg({ type: 'error', text: 'Current master password is required to authorize Login ID change.' });
      return;
    }

    setIsEmailLoading(true);
    const res = await changeEmail(emailAuthPassword, newEmail.trim());
    setIsEmailLoading(false);

    if (res.success) {
      setEmailStatusMsg({ type: 'success', text: `Admin Login ID successfully updated to: ${newEmail.trim()}` });
      setNewEmail('');
      setEmailAuthPassword('');
    } else {
      setEmailStatusMsg({ type: 'error', text: res.message || 'Failed to update admin login email.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            Admin Security & Login Credentials
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure your Admin Login ID (Email), Master Password, and view server cryptographic protections.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Shield Active &bull; PBKDF2/SHA-512</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Change Master Password Form */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Change Master Password</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Update the master secret password used to sign into the ZK Control Center.
            </p>

            {passStatusMsg && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 mb-4 animate-in fade-in duration-200 ${
                  passStatusMsg.type === 'success'
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                    : 'bg-red-500/15 border border-red-500/40 text-red-300'
                }`}
              >
                {passStatusMsg.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <span>{passStatusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                  Current Master Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter existing password"
                    className="w-full px-4 py-2.5 pr-10 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400 min-h-[42px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    New Master Password
                  </label>
                  {newPassword && (
                    <span className={`text-[11px] font-bold ${
                      strength.score === 1 ? 'text-red-400' : strength.score === 2 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {strength.text}
                    </span>
                  )}
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters (letters, numbers, symbols)"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400 min-h-[42px]"
                />

                {/* Password strength bar */}
                {newPassword && (
                  <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden flex gap-1">
                    <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-700'}`} />
                    <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-700'}`} />
                    <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-700'}`} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400 min-h-[42px]"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="text-[11px] text-slate-400">PBKDF2 100,000 Rounds &bull; 64-Byte Salt</span>
                <span className="text-[11px] text-amber-400 font-mono">Zero Plaintext Leak</span>
              </div>

              <button
                type="submit"
                disabled={isPassLoading}
                className="w-full min-h-[44px] py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all mt-2 cursor-pointer disabled:opacity-50"
              >
                {isPassLoading ? 'Updating Hash...' : 'Update Password Securely'}
              </button>
            </form>
          </div>
        </div>

        {/* 2. Change Admin Login ID (Email) Form */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Change Admin Login ID (Email)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Update the primary administrator email address required to access the login modal.
            </p>

            {emailStatusMsg && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 mb-4 animate-in fade-in duration-200 ${
                  emailStatusMsg.type === 'success'
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                    : 'bg-red-500/15 border border-red-500/40 text-red-300'
                }`}
              >
                {emailStatusMsg.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <span>{emailStatusMsg.text}</span>
              </div>
            )}

            {/* Current Active ID Display */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 mb-4">
              <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                Current Active Login ID:
              </div>
              <div className="text-sm font-mono font-bold text-cyan-300 mt-0.5 truncate">
                {user?.email || 'zakir1kb@gmail.com'}
              </div>
            </div>

            <form onSubmit={handleChangeEmail} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                  New Admin Login Email
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. newadmin@example.com"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400 min-h-[42px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                  Confirm Current Master Password
                </label>
                <div className="relative">
                  <input
                    type={showEmailPass ? 'text' : 'password'}
                    required
                    value={emailAuthPassword}
                    onChange={(e) => setEmailAuthPassword(e.target.value)}
                    placeholder="Enter current password to authorize change"
                    className="w-full px-4 py-2.5 pr-10 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400 min-h-[42px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailPass(!showEmailPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showEmailPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Required: Your current password verifies owner authorization.
                </p>
              </div>

              <button
                type="submit"
                disabled={isEmailLoading}
                className="w-full min-h-[44px] py-3 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all mt-4 cursor-pointer disabled:opacity-50"
              >
                {isEmailLoading ? 'Verifying & Updating...' : 'Save New Login ID'}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Security Architecture & Brute-Force Shield Notice */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#090e24]/90 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Active Security Protections & Defenses</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="font-bold text-emerald-400 block mb-1">Brute-Force Shield</span>
            <span className="text-slate-300 text-[11px] leading-relaxed">
              IP-based rate limiter locks unauthorized access for 15 minutes after 5 consecutive failed login attempts.
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="font-bold text-cyan-400 block mb-1">PBKDF2 SHA-512 Hashing</span>
            <span className="text-slate-300 text-[11px] leading-relaxed">
              Passwords are cryptographically salted and hashed with 100,000 iterations. Zero plaintext stored.
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="font-bold text-purple-400 block mb-1">Bearer Session Tokens</span>
            <span className="text-slate-300 text-[11px] leading-relaxed">
              HMAC-SHA256 signed tokens validated on every administrative request, revoked immediately on logout.
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="font-bold text-amber-400 block mb-1">Private Credentials</span>
            <span className="text-slate-300 text-[11px] leading-relaxed">
              Login credentials are kept completely private with zero auto-filling or public display anywhere on the website.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
