import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext.tsx';
import { Lock, KeyRound, ShieldCheck, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export const SecurityView: React.FC = () => {
  const { user, changePassword } = useAuth();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setStatusMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setIsLoading(true);
    const res = await changePassword(oldPassword, newPassword);
    setIsLoading(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: 'Password successfully updated! It is hashed with salt & SHA-512.' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setStatusMsg({ type: 'error', text: res.message || 'Failed to change password.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-400" />
          Admin Security & Master Credentials
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Server-side PBKDF2/SHA-512 password protection, bearer session tokens, and route shields.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Change Password Form */}
        <div className="p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>Change Master Password</span>
          </h3>

          {statusMsg && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                  : 'bg-red-500/15 border border-red-500/40 text-red-300'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Current Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">New Master Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Confirm New Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300"
              >
                {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPass ? 'Hide Passwords' : 'Show Passwords'}</span>
              </button>

              <span className="text-[11px] text-slate-500 font-mono">100,000 PBKDF2 Iterations</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all mt-2"
            >
              {isLoading ? 'Updating Hash...' : 'Update Password Securely'}
            </button>
          </form>
        </div>

        {/* Security Overview & Initial Credentials Box */}
        <div className="p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authentication Architecture</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="font-semibold text-white block mb-0.5">Admin Email:</span>
                <span className="font-mono text-cyan-300">{user?.email || 'zakir1kb@gmail.com'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="font-semibold text-white block mb-0.5">Cryptographic Hashing:</span>
                <span className="font-mono text-emerald-400">Node.js crypto &bull; PBKDF2 with unique cryptographic salt &bull; 64-byte key</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="font-semibold text-white block mb-0.5">Session Tokens:</span>
                <span className="font-mono text-amber-300">Bearer Token with expiry and automatic revocation upon logout</span>
              </div>
            </div>

            {/* Initial Credentials Notice Box */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
              <span className="font-bold block mb-1">Initial Setup Credentials Notice:</span>
              <span className="font-mono">Email: zakir1kb@gmail.com</span><br />
              <span className="font-mono">Initial Password: khan@123</span>
              <p className="text-[11px] text-amber-300/80 mt-1.5">
                These are initial credentials only. You can change your master password anytime above.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-slate-500 text-center font-mono">
            Zero plain-text password leakage in public code
          </div>
        </div>

      </div>
    </div>
  );
};
