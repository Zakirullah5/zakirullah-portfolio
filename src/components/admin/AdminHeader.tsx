import React, { useState, useEffect } from 'react';
import { ZKLogo } from '../common/ZKLogo.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import {
  Bell,
  Sun,
  Moon,
  ExternalLink,
  Eye,
  CheckCircle,
  Menu,
  X,
  Sparkles,
  LogOut,
  ShieldCheck,
  UploadCloud
} from 'lucide-react';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  onNavigateToPortfolio: () => void;
  onOpenLivePreview: () => void;
  currentViewTitle: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  onNavigateToPortfolio,
  onOpenLivePreview,
  currentViewTitle
}) => {
  const { user, logout } = useAuth();
  const { data, publishChanges, isSaving } = useData();
  const { theme, isDark, toggleTheme } = useTheme();
  const [timeString, setTimeString] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePublish = async () => {
    await publishChanges();
  };

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-xl border-b px-4 sm:px-6 py-3 transition-colors duration-200 ${
      isDark ? 'bg-[#070b1c]/90 border-white/10 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
    }`}>
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & ZK Logo / Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className={`lg:hidden p-2 rounded-xl border transition-colors ${
              isDark ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <ZKLogo size="sm" showSubtitle={false} />
            <div className={`hidden sm:block border-l pl-3 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-display font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600">
                  ZK MASTER CONTROL CENTER
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
                  v3.0
                </span>
              </div>
              <div className={`text-[10px] tracking-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                One Dashboard. Complete Website Control.
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right: Action Buttons & Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Action: View Website */}
          <button
            onClick={onNavigateToPortfolio}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
            title="View Live Website"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
            <span>View Website</span>
          </button>

          {/* Quick Action: Live Preview */}
          <button
            onClick={onOpenLivePreview}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-xs text-blue-400 hover:text-blue-300 transition-all"
            title="Open Live Preview"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Preview</span>
          </button>

          {/* Quick Action: Publish Changes (Emerald glowing button) */}
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all ${
              data?.isDraft
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 animate-pulse'
                : 'bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-400/40'
            }`}
            title="Publish all drafted modifications to live portfolio"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Publish Changes</span>
            <span className="sm:hidden">Publish</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl border transition-colors relative ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-amber-400'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-amber-600'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center border-2 border-transparent">
                3
              </span>
            </button>

            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-72 rounded-2xl border p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 ${
                isDark ? 'bg-[#0d1430] border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                <div className={`flex items-center justify-between pb-2 mb-2 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notifications</span>
                  <span className="text-[10px] text-amber-500 font-semibold">3 Unread</span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className={`p-2 rounded-xl ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                    <span className={`font-semibold block ${isDark ? 'text-white' : 'text-slate-800'}`}>Project Added</span>
                    3D Gold ZK Crown Emblem published to gallery.
                  </div>
                  <div className={`p-2 rounded-xl ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                    <span className={`font-semibold block ${isDark ? 'text-white' : 'text-slate-800'}`}>Auto Backup</span>
                    System backup generated successfully.
                  </div>
                  <div className={`p-2 rounded-xl ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                    <span className={`font-semibold block ${isDark ? 'text-white' : 'text-slate-800'}`}>Security Notice</span>
                    Admin logged in securely.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Mode Switch (Functional for both Dark and Light Mode on all screens) */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-cyan-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-600 hover:text-amber-700 shadow-sm'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Dark and Light Mode"
          >
            {isDark ? (
              <>
                <Moon className="w-4 h-4 text-cyan-400" />
                <span className="hidden md:inline text-xs font-medium text-slate-300">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="hidden md:inline text-xs font-medium text-slate-700">Light</span>
              </>
            )}
          </button>

          {/* Live Date/Time Badge */}
          <div className={`hidden xl:flex flex-col items-end px-3 py-1 rounded-xl border text-[11px] font-mono ${
            isDark ? 'bg-white/[0.03] border-white/5 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            <span>{timeString}</span>
          </div>

          {/* Admin User Chip */}
          <div className={`flex items-center gap-2 pl-2 border-l ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={user?.name || 'Admin'}
              className="w-8 h-8 rounded-xl object-cover border border-amber-400/40"
            />
            <div className="hidden lg:block text-left">
              <div className={`text-xs font-bold leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {user?.name || 'Zakirullah'}
              </div>
              <div className="text-[10px] text-amber-500 font-semibold leading-tight mt-0.5">
                {user?.role || 'Administrator'}
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
