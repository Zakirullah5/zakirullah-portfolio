import React, { useState, useEffect, useRef } from 'react';
import { ZKLogo } from '../common/ZKLogo.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { AdminViewType } from './AdminSidebar.tsx';
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
  UploadCloud,
  FileDown,
  MessageSquare,
  Check,
  Trash2,
  Phone,
  Mail,
  Clock,
  ArrowRight
} from 'lucide-react';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  onNavigateToPortfolio: () => void;
  onOpenLivePreview: () => void;
  onSelectView?: (view: AdminViewType) => void;
  currentViewTitle: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  onNavigateToPortfolio,
  onOpenLivePreview,
  onSelectView,
  currentViewTitle
}) => {
  const { user, logout } = useAuth();
  const {
    data,
    publishChanges,
    isSaving,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications
  } = useData();
  const { theme, isDark, toggleTheme } = useTheme();

  const [timeString, setTimeString] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

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

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const handlePublish = async () => {
    await publishChanges();
  };

  const formatTimeAgo = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const now = Date.now();
      const past = new Date(isoString).getTime();
      const diffSec = Math.floor((now - past) / 1000);
      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour}h ago`;
      const diffDay = Math.floor(diffHour / 24);
      return `${diffDay}d ago`;
    } catch {
      return 'Recent';
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'inquiry':
        return <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />;
      case 'cv':
        return <FileDown className="w-3.5 h-3.5 text-emerald-400" />;
      case 'system':
        return <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const handleNotifClick = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.link && onSelectView) {
      onSelectView(notif.link as AdminViewType);
      setShowNotifications(false);
    }
  };

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-xl border-b px-3 sm:px-6 py-2.5 transition-colors duration-200 ${
      isDark ? 'bg-[#070b1c]/90 border-white/10 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
    }`}>
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Mobile Toggle & ZK Logo / Title */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className={`lg:hidden p-2 rounded-xl border transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer ${
              isDark ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
            }`}
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
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
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* FEATURE: Direct Upload CV Button in Header */}
          <button
            onClick={() => onSelectView?.('cv')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all transform active:scale-95 cursor-pointer min-h-[38px] ${
              currentViewTitle === 'cv'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-400/40 text-cyan-300 hover:text-white'
            }`}
            title="Upload and Manage Portfolio CV / PDF"
          >
            <FileDown className="w-4 h-4 text-cyan-300" />
            <span className="hidden sm:inline">Upload CV</span>
            <span className="sm:hidden text-[11px]">CV</span>
          </button>

          {/* Quick Action: View Website */}
          <button
            onClick={onNavigateToPortfolio}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer min-h-[38px] ${
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
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-xs text-blue-300 hover:text-white transition-all cursor-pointer min-h-[38px]"
            title="Open Live Preview"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Preview</span>
          </button>

          {/* Quick Action: Publish Changes (Emerald glowing button) */}
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all min-h-[38px] cursor-pointer flex-shrink-0 ${
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

          {/* REAL NOTIFICATIONS BELL & DROPDOWN */}
          <div ref={notifRef} className="relative flex-shrink-0">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl border transition-colors relative min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer ${
                showNotifications
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-400'
                  : isDark
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-amber-400'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-amber-600'
              }`}
              title="Notifications & Inquiries"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-[#070b1c] animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* REAL Notification Dropdown Panel */}
            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
                isDark ? 'bg-[#0d1430] border-blue-500/30 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                {/* Header */}
                <div className={`p-3.5 border-b flex items-center justify-between ${isDark ? 'border-white/10 bg-[#090f26]' : 'border-slate-100 bg-slate-50'}`}>
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
                      <Bell className="w-3.5 h-3.5" />
                    </span>
                    <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-bold">
                        {unreadCount} Unread
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllNotificationsRead()}
                        className="px-2 py-1 rounded-lg text-[10px] font-semibold text-cyan-400 hover:bg-cyan-500/10 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Mark all as read"
                      >
                        <Check className="w-3 h-3" />
                        <span>Read all</span>
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={() => clearAllNotifications()}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Clear all notifications"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Notification Items List */}
                <div className="max-h-[340px] overflow-y-auto divide-y divide-white/5 scrollbar-thin">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotifClick(notif)}
                        className={`p-3 transition-colors cursor-pointer flex items-start gap-3 group ${
                          !notif.read
                            ? isDark
                              ? 'bg-blue-600/10 hover:bg-blue-600/15'
                              : 'bg-blue-50/70 hover:bg-blue-100/70'
                            : isDark
                            ? 'hover:bg-white/5'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xs'
                        }`}>
                          {getNotifIcon(notif.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs font-bold truncate ${
                              !notif.read
                                ? isDark ? 'text-white' : 'text-slate-900'
                                : isDark ? 'text-slate-300' : 'text-slate-700'
                            }`}>
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {formatTimeAgo(notif.timestamp)}
                            </span>
                          </div>

                          <p className={`text-[11px] mt-0.5 line-clamp-2 leading-relaxed ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {notif.message}
                          </p>

                          <div className="mt-1.5 flex items-center gap-2">
                            {notif.link && (
                              <span className="text-[10px] text-cyan-400 font-semibold group-hover:underline flex items-center gap-1">
                                <span>View Details</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </span>
                            )}
                            {!notif.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse ml-auto" />
                            )}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all flex-shrink-0"
                          title="Delete notification"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 px-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 text-slate-400">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        No New Notifications
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Client inquiries and system events will appear here in real time.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className={`p-2.5 border-t text-center text-[10px] ${
                    isDark ? 'border-white/10 bg-[#090f26] text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-500'
                  }`}>
                    <span>Showing {notifications.length} real-time alerts</span>
                  </div>
                )}
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
