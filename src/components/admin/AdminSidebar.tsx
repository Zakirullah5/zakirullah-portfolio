import React from 'react';
import { ZKLogo } from '../common/ZKLogo.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import {
  LayoutDashboard,
  Globe,
  Sliders,
  User,
  Shield,
  Briefcase,
  Image,
  Video,
  Settings2,
  DollarSign,
  Sparkles,
  MessageSquare,
  PhoneCall,
  Palette,
  UploadCloud,
  Eye,
  Database,
  Lock,
  ListOrdered,
  LogOut,
  X,
  Sun,
  Moon
} from 'lucide-react';

export type AdminViewType =
  | 'dashboard'
  | 'overview'
  | 'hero'
  | 'about'
  | 'logo'
  | 'portfolio'
  | 'images'
  | 'videos'
  | 'services'
  | 'pricing'
  | 'skills'
  | 'testimonials'
  | 'contact'
  | 'theme'
  | 'uploads'
  | 'preview'
  | 'backup'
  | 'security'
  | 'activities';

interface AdminSidebarProps {
  currentView: AdminViewType;
  onSelectView: (view: AdminViewType) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenLivePreview: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentView,
  onSelectView,
  isOpen,
  onClose,
  onOpenLivePreview
}) => {
  const { logout } = useAuth();
  const { data } = useData();
  const { isDark, toggleTheme } = useTheme();

  const menuItems: { id: AdminViewType | 'logout'; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'overview', label: 'Website Overview', icon: Globe },
    { id: 'hero', label: 'Hero Section', icon: Sliders },
    { id: 'about', label: 'About Me', icon: User },
    { id: 'logo', label: 'Logo Manager', icon: Shield },
    { id: 'portfolio', label: 'Portfolio Manager', icon: Briefcase },
    { id: 'images', label: 'Image Manager', icon: Image },
    { id: 'videos', label: 'Video Manager', icon: Video },
    { id: 'services', label: 'Services Manager', icon: Settings2 },
    { id: 'pricing', label: 'Pricing Manager', icon: DollarSign },
    { id: 'skills', label: 'Skills Manager', icon: Sparkles },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'contact', label: 'Contact Settings', icon: PhoneCall },
    { id: 'theme', label: 'Theme Settings', icon: Palette },
    { id: 'uploads', label: 'Upload Manager', icon: UploadCloud },
    { id: 'preview', label: 'Live Preview', icon: Eye },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
    { id: 'security', label: 'Admin Security', icon: Lock },
    { id: 'activities', label: 'Activity Logs', icon: ListOrdered },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  const handleItemClick = (id: AdminViewType | 'logout') => {
    if (id === 'logout') {
      logout();
    } else if (id === 'preview') {
      onOpenLivePreview();
      onSelectView('preview');
      onClose();
    } else {
      onSelectView(id);
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r flex flex-col justify-between transition-all duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDark
            ? 'bg-gradient-to-b from-[#090f26] via-[#060a1d] to-[#040614] border-white/10 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800 shadow-xl'
        }`}
      >
        {/* Top Branding */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          <ZKLogo size="sm" />
          <button
            onClick={onClose}
            className={`lg:hidden p-1.5 rounded-lg transition-colors ${
              isDark ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigation Items - Scrollable */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isLogout = item.id === 'logout';

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                    : isLogout
                    ? 'text-red-500 hover:bg-red-500/10 hover:text-red-600 mt-2'
                    : isDark
                    ? 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive
                        ? 'text-white'
                        : isLogout
                        ? 'text-red-500'
                        : isDark
                        ? 'text-slate-400 group-hover:text-blue-400'
                        : 'text-slate-500 group-hover:text-blue-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Theme Mode Quick Switch */}
        <div className={`p-2.5 mx-3 my-1 rounded-2xl border flex items-center justify-between transition-colors ${
          isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-100/80 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            {isDark ? <Moon className="w-3.5 h-3.5 text-cyan-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 border-white/10 text-cyan-300'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-amber-600 shadow-xs'
            }`}
            title="Toggle theme mode"
          >
            {isDark ? 'Switch Light' : 'Switch Dark'}
          </button>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className={`p-3 border-t text-center ${
          isDark ? 'border-white/10 bg-[#040614]/80' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-[10px] text-amber-400">👑</span>
            <span className={`text-[11px] font-cursive ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>
              Your Vision, My Creativity.
            </span>
          </div>
          <div className={`text-[9px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            ZK MASTER CONTROL CENTER
          </div>
        </div>
      </aside>
    </>
  );
};
