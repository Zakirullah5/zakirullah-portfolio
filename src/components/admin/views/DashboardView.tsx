import React, { useState } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { useAuth } from '../../../context/AuthContext.tsx';
import { AdminViewType } from '../AdminSidebar.tsx';
import { ZKLogo } from '../../common/ZKLogo.tsx';
import {
  Briefcase,
  Shield,
  Video,
  Image,
  Settings2,
  FileBox,
  Eye,
  ExternalLink,
  CheckCircle,
  Plus,
  UploadCloud,
  DollarSign,
  Sparkles,
  Sliders,
  Settings,
  Server,
  Lock,
  LogOut,
  Download,
  Trash2,
  TrendingUp,
  Activity,
  HardDrive,
  FileDown
} from 'lucide-react';

interface DashboardViewProps {
  onSelectView: (view: AdminViewType) => void;
  onNavigateToPortfolio: () => void;
  onOpenLivePreview: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectView,
  onNavigateToPortfolio,
  onOpenLivePreview
}) => {
  const { data, publishChanges, isSaving, deleteFile, updateSystem } = useData();
  const { user, logout } = useAuth();
  const [analyticsRange, setAnalyticsRange] = useState('Last 7 Days');

  const stats = [
    { label: 'Total Projects', value: data?.projects?.length || 32, change: '+5 this week', icon: Briefcase, color: 'from-blue-600 to-cyan-500', view: 'portfolio' as AdminViewType },
    { label: 'Total Logos', value: 18, change: '+3 this week', icon: Shield, color: 'from-purple-600 to-indigo-500', view: 'logo' as AdminViewType },
    { label: 'Total Videos', value: 24, change: '+4 this week', icon: Video, color: 'from-pink-600 to-rose-500', view: 'videos' as AdminViewType },
    { label: 'Total Images', value: 156, change: '+12 this week', icon: Image, color: 'from-amber-600 to-yellow-500', view: 'images' as AdminViewType },
    { label: 'Total Services', value: data?.services?.length || 28, change: '+2 this week', icon: Settings2, color: 'from-emerald-600 to-teal-500', view: 'services' as AdminViewType },
    { label: 'Total Files', value: (data?.media?.length || 0) + 338, change: '+28 this week', icon: FileBox, color: 'from-indigo-600 to-blue-500', view: 'uploads' as AdminViewType },
  ];

  const quickActions = [
    { label: 'Upload CV', icon: FileDown, color: 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40', action: () => onSelectView('cv') },
    { label: 'Add Project', icon: Plus, color: 'bg-blue-600/30 text-blue-300 border-blue-500/40', action: () => onSelectView('portfolio') },
    { label: 'Upload Image', icon: Image, color: 'bg-cyan-600/30 text-cyan-300 border-cyan-500/40', action: () => onSelectView('images') },
    { label: 'Upload Video', icon: Video, color: 'bg-purple-600/30 text-purple-300 border-purple-500/40', action: () => onSelectView('videos') },
    { label: 'Add Service', icon: Settings2, color: 'bg-pink-600/30 text-pink-300 border-pink-500/40', action: () => onSelectView('services') },
    { label: 'Update Prices', icon: DollarSign, color: 'bg-amber-600/30 text-amber-300 border-amber-500/40', action: () => onSelectView('pricing') },
    { label: 'Manage Skills', icon: Sparkles, color: 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40', action: () => onSelectView('skills') },
    { label: 'Edit Content', icon: Sliders, color: 'bg-teal-600/30 text-teal-300 border-teal-500/40', action: () => onSelectView('hero') },
    { label: 'Settings', icon: Settings, color: 'bg-slate-700/40 text-slate-300 border-slate-600/40', action: () => onSelectView('overview') },
  ];

  const manageContentModules = [
    { label: 'Upload CV / Resume', desc: 'Manage portfolio CV PDF', icon: FileDown, view: 'cv' as AdminViewType, color: 'from-emerald-600 to-teal-600' },
    { label: 'Logo Manager', desc: 'Manage logos', icon: Shield, view: 'logo' as AdminViewType, color: 'from-blue-600 to-cyan-600' },
    { label: 'Portfolio Manager', desc: 'Manage projects', icon: Briefcase, view: 'portfolio' as AdminViewType, color: 'from-purple-600 to-pink-600' },
    { label: 'Image Manager', desc: 'Manage images', icon: Image, view: 'images' as AdminViewType, color: 'from-amber-600 to-orange-600' },
    { label: 'Video Manager', desc: 'Manage videos', icon: Video, view: 'videos' as AdminViewType, color: 'from-rose-600 to-pink-600' },
    { label: 'Services Manager', desc: 'Manage services', icon: Settings2, view: 'services' as AdminViewType, color: 'from-indigo-600 to-blue-600' },
    { label: 'Pricing Manager', desc: 'Manage prices', icon: DollarSign, view: 'pricing' as AdminViewType, color: 'from-red-600 to-amber-600' },
    { label: 'Skills Manager', desc: 'Manage skills', icon: Sparkles, view: 'skills' as AdminViewType, color: 'from-emerald-600 to-teal-600' },
    { label: 'Testimonials', desc: 'Manage reviews', icon: Activity, view: 'testimonials' as AdminViewType, color: 'from-blue-600 to-purple-600' },
  ];

  const recentFiles = data?.media?.slice(0, 4) || [];

  return (
    <div className="space-y-6">
      
      {/* 1. Welcome Banner Card Matching Image 2 */}
      <div className="relative rounded-3xl p-5 sm:p-8 bg-gradient-to-r from-[#0c1840]/90 via-[#0e163b]/95 to-[#160c38]/90 border border-blue-500/30 shadow-[0_0_35px_rgba(59,130,246,0.25)] backdrop-blur-xl overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
        {/* Glow ambient */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Left: Avatar + Greeting + Buttons */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-4 sm:gap-5 z-10 w-full md:w-auto">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-gradient-to-tr from-cyan-400 via-purple-500 to-amber-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] flex-shrink-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={user?.name || 'Admin'}
              className="w-full h-full object-cover rounded-xl"
            />
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[9px] font-bold text-black border border-white flex items-center gap-1 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Online
            </span>
          </div>

          <div className="min-w-0">
            <h2 className="text-xl sm:text-3xl font-display font-bold text-white tracking-tight flex items-center gap-2">
              <span>Welcome Back, {user?.name || 'Zakirullah'}!</span>
              <span>👋</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Manage your website content, portfolio, services and more from here.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4">
              <button
                onClick={onNavigateToPortfolio}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all min-h-[38px] cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                <span>View Website</span>
              </button>

              <button
                onClick={onOpenLivePreview}
                className="px-3.5 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/40 text-blue-200 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all min-h-[38px] cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-300" />
                <span>Live Preview</span>
              </button>

              <button
                onClick={() => publishChanges()}
                disabled={isSaving}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all min-h-[38px] cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Publish Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Glowing 3D Golden/Purple ZK Emblem Shield */}
        <div className="hidden lg:flex items-center justify-center pr-4 z-10">
          <div className="relative group">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-amber-500/30 via-purple-600/30 to-blue-600/30 border-2 border-amber-400/60 p-2 shadow-[0_0_40px_rgba(234,179,8,0.4)] flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <span className="text-xl text-amber-300">👑</span>
              <span className="font-display font-black text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 -mt-1">
                ZK
              </span>
              <span className="text-[8px] font-mono text-cyan-300 uppercase tracking-widest mt-1">
                Studio
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Six Metric Cards Row Matching Image 2 */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={idx}
              onClick={() => onSelectView(st.view)}
              className="p-3.5 sm:p-4 rounded-2xl bg-[#090e24]/90 hover:bg-[#0d1433] border border-blue-500/20 hover:border-purple-400/50 shadow-md transition-all duration-200 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr ${st.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-emerald-400 font-medium">
                  {st.change}
                </span>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-display font-black text-white">
                  {st.value}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 truncate">
                  {st.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Middle Row: Website Analytics (Left) + Quick Actions (Center) + Website Status (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Website Analytics (5 cols) */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-display font-bold text-white">
                Website Analytics
              </h3>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Visitors
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  Page Views
                </span>
              </div>
            </div>

            <select
              value={analyticsRange}
              onChange={(e) => setAnalyticsRange(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </div>

          {/* Dynamic SVG Spline Chart */}
          <div className="relative h-44 w-full pt-4">
            <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
              <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
              <line x1="0" y1="100" x2="300" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />

              {/* Area fills */}
              <path
                d="M 10,95 Q 60,60 100,75 T 190,40 T 290,25 L 290,110 L 10,110 Z"
                fill="url(#cyanGrad)"
              />
              <path
                d="M 10,105 Q 60,85 100,60 T 190,70 T 290,45 L 290,110 L 10,110 Z"
                fill="url(#pinkGrad)"
              />

              {/* Cyan Line (Visitors) */}
              <path
                d="M 10,95 Q 60,60 100,75 T 190,40 T 290,25"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2.5"
              />
              {/* Pink Line (Page Views) */}
              <path
                d="M 10,105 Q 60,85 100,60 T 190,70 T 290,45"
                fill="none"
                stroke="#ec4899"
                strokeWidth="2.5"
              />

              {/* Points */}
              <circle cx="10" cy="95" r="3.5" fill="#22d3ee" />
              <circle cx="100" cy="75" r="3.5" fill="#22d3ee" />
              <circle cx="190" cy="40" r="3.5" fill="#22d3ee" />
              <circle cx="290" cy="25" r="4.5" fill="#22d3ee" stroke="#fff" strokeWidth="1.5" />

              <circle cx="10" cy="105" r="3.5" fill="#ec4899" />
              <circle cx="100" cy="60" r="3.5" fill="#ec4899" />
              <circle cx="190" cy="70" r="3.5" fill="#ec4899" />
              <circle cx="290" cy="45" r="4.5" fill="#ec4899" stroke="#fff" strokeWidth="1.5" />
            </svg>

            {/* X-Axis labels */}
            <div className="flex justify-between text-[10px] text-slate-500 pt-2 font-mono">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Quick Actions (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 shadow-md flex flex-col justify-between">
          <h3 className="text-sm font-display font-bold text-white mb-3">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 sm:gap-2.5">
            {quickActions.map((qa, i) => {
              const Icon = qa.icon;
              return (
                <button
                  key={i}
                  onClick={qa.action}
                  className={`p-2.5 sm:p-3 rounded-2xl ${qa.color} border hover:brightness-125 transition-all flex flex-col items-center justify-center text-center group cursor-pointer min-h-[64px]`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-semibold text-white leading-tight">
                    {qa.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/5 mt-3 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Direct Website Modifications</span>
            <span className="text-amber-400 font-mono">Instant Apply</span>
          </div>
        </div>

        {/* Website Status Card (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-[#090e24]/90 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <span>Website Status</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Online
              </span>
            </div>

            {/* Checklist */}
            <div className="space-y-2 text-xs">
              {[
                'Website Working',
                'Database Connected',
                'File Storage Connected',
                'SSL Certificate Active',
                'All Systems Operational'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Server Stack Visual */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-cyan-400 flex items-center justify-center">
                <Server className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-[11px]">
                <div className="font-bold text-white">Fast Cloud Server</div>
                <div className="text-slate-400 font-mono">Latency: 18ms</div>
              </div>
            </div>
            <div className="text-emerald-400 text-xs font-mono font-bold">
              100% Uptime
            </div>
          </div>
        </div>

      </div>

      {/* 4. Bottom Grid: Recent Activities, Storage Gauge, Recent Files, Quick Settings, Admin Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Recent Activities (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-display font-bold text-white">
              Recent Activities
            </h3>
            <button
              onClick={() => onSelectView('activities')}
              className="text-[11px] text-blue-400 hover:text-blue-300"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {data?.activities?.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{act.action}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{act.details}</div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                  {act.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Storage Usage (3 cols) */}
        <div className="lg:col-span-3 p-5 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 shadow-md flex flex-col justify-between items-center text-center">
          <h3 className="text-sm font-display font-bold text-white self-start">
            Storage Usage
          </h3>

          <div className="relative w-36 h-36 flex items-center justify-center my-3">
            {/* SVG Circular Progress Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="56"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="56"
                stroke="url(#storageGrad)"
                strokeWidth="12"
                strokeDasharray={351.8}
                strokeDashoffset={351.8 * (1 - 0.68)}
                strokeLinecap="round"
                fill="transparent"
              />
              <defs>
                <linearGradient id="storageGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-display font-black text-white">68%</span>
              <span className="text-[10px] text-slate-400 font-mono">Used Space</span>
            </div>
          </div>

          <div className="text-xs text-slate-300 font-mono">
            13.6 GB / 20 GB
          </div>
        </div>

        {/* Quick Settings Toggles (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-display font-bold text-white">
              Quick Settings
            </h3>
            <span className="text-[10px] text-slate-400">Real-Time Switches</span>
          </div>

          <div className="space-y-3">
            {[
              { key: 'websiteStatus', label: 'Website Status', val: data?.system?.websiteStatus ?? true },
              { key: 'maintenanceMode', label: 'Maintenance Mode', val: data?.system?.maintenanceMode ?? false },
              { key: 'autoBackup', label: 'Auto Backup', val: data?.system?.autoBackup ?? true },
              { key: 'emailNotifications', label: 'Email Notifications', val: data?.system?.emailNotifications ?? true },
              { key: 'livePreview', label: 'Live Preview', val: data?.system?.livePreview ?? true },
            ].map((toggle) => (
              <div key={toggle.key} className="flex items-center justify-between text-xs text-slate-300">
                <span>{toggle.label}</span>
                <button
                  onClick={() => updateSystem({ [toggle.key]: !toggle.val })}
                  className={`w-11 h-6 rounded-full p-1 transition-colors ${
                    toggle.val ? 'bg-emerald-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      toggle.val ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/5 mt-3 text-[11px] text-slate-500 text-right">
            Changes save automatically
          </div>
        </div>

      </div>

      {/* 5. Manage Content Quick Navigation Grid */}
      <div className="p-5 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 shadow-md">
        <h3 className="text-sm font-display font-bold text-white mb-4">
          Manage Content Modules
        </h3>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {manageContentModules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <button
                key={i}
                onClick={() => onSelectView(mod.view)}
                className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-purple-400/40 text-left transition-all flex items-center gap-2.5 sm:gap-3 group cursor-pointer"
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr ${mod.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {mod.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {mod.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Recent Files List */}
      <div className="p-5 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-display font-bold text-white">
            Recent Media Files
          </h3>
          <button
            onClick={() => onSelectView('uploads')}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            View All Files ({data?.media?.length || 0}) &gt;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recentFiles.map((file) => (
            <div
              key={file.id}
              className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-10 h-10 rounded-xl object-cover border border-white/10 flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{file.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {(file.sizeBytes / 1024 / 1024).toFixed(1)} MB &bull; {file.format.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <a
                  href={file.url}
                  download={file.name}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => deleteFile(file.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
