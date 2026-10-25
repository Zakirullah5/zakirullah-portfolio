import React, { useState } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { useTheme } from '../../../context/ThemeContext.tsx';
import { ThemeSettings } from '../../../types/index.ts';
import { Palette, Save, CheckCircle, Sparkles, Sun, Moon } from 'lucide-react';

export const ThemeManagerView: React.FC = () => {
  const { data, updateTheme, isSaving } = useData();
  const { theme: currentGlobalTheme, setTheme: setGlobalTheme } = useTheme();
  const [theme, setTheme] = useState<ThemeSettings>(() => ({
    primaryColor: data?.theme?.primaryColor || '#3b82f6',
    secondaryColor: data?.theme?.secondaryColor || '#8b5cf6',
    accentGold: data?.theme?.accentGold || '#eab308',
    backgroundColor: data?.theme?.backgroundColor || '#050711',
    fontFamily: data?.theme?.fontFamily || 'Plus Jakarta Sans',
    enableAnimations: data?.theme?.enableAnimations ?? true,
    soundEffects: data?.theme?.soundEffects ?? false,
    lightDarkMode: (data?.theme?.lightDarkMode as 'dark' | 'light') || (currentGlobalTheme || 'dark')
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalTheme(theme.lightDarkMode);
    await updateTheme(theme);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-400" />
            Website Appearance & Theme Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Customize branding palette, neon glows, typography, and animation physics.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Theme</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Dark & Light Mode Selection Card */}
        <div className="col-span-1 md:col-span-2 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                {theme.lightDarkMode === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                Appearance Theme Mode (Dark & Light Mode)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch website and admin interface between Dark Cyber Mode and Clean Executive Light Mode.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                ACTIVE: {theme.lightDarkMode.toUpperCase()} MODE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Dark Mode Card */}
            <div
              onClick={() => {
                setTheme({ ...theme, lightDarkMode: 'dark' });
                setGlobalTheme('dark');
              }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                theme.lightDarkMode === 'dark'
                  ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Dark Futuristic Mode</h4>
                    <p className="text-[11px] text-slate-400">Midnight space with neon cyan & royal purple</p>
                  </div>
                </div>
                {theme.lightDarkMode === 'dark' && (
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div className="h-10 rounded-xl bg-[#050711] border border-white/10 flex items-center px-3 gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"></div>
                <span className="text-[10px] text-slate-400 font-mono ml-auto">#050711 Cyber Base</span>
              </div>
            </div>

            {/* Light Mode Card */}
            <div
              onClick={() => {
                setTheme({ ...theme, lightDarkMode: 'light' });
                setGlobalTheme('light');
              }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                theme.lightDarkMode === 'light'
                  ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-600">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Executive Light Mode</h4>
                    <p className="text-[11px] text-slate-400">Crisp high-contrast modern daylight aesthetic</p>
                  </div>
                </div>
                {theme.lightDarkMode === 'light' && (
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div className="h-10 rounded-xl bg-white border border-slate-200 flex items-center px-3 gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] text-slate-600 font-mono ml-auto">#F8FAFC Light Base</span>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
            Brand Colors
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Cyan/Blue Accent</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={theme.primaryColor}
                onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary Royal Purple</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.secondaryColor}
                onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={theme.secondaryColor}
                onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Accent Imperial Gold</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.accentGold}
                onChange={(e) => setTheme({ ...theme, accentGold: e.target.value })}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={theme.accentGold}
                onChange={(e) => setTheme({ ...theme, accentGold: e.target.value })}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Dark Midnight Base</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.backgroundColor}
                onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={theme.backgroundColor}
                onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Typography & Animations */}
        <div className="p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Typography & Motion
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Font Family</label>
              <select
                value={theme.fontFamily}
                onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0e1533] border border-white/10 rounded-xl text-xs text-white"
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Default)</option>
                <option value="Space Grotesk">Space Grotesk (Futuristic)</option>
                <option value="Inter">Inter (Clean Modern)</option>
              </select>
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-center justify-between text-xs text-slate-300 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span>3D Floating & Particle Animations</span>
                <input
                  type="checkbox"
                  checked={theme.enableAnimations}
                  onChange={(e) => setTheme({ ...theme, enableAnimations: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span>Audio Clicks & Hover Sound Effects</span>
                <input
                  type="checkbox"
                  checked={theme.soundEffects}
                  onChange={(e) => setTheme({ ...theme, soundEffects: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-500"
                />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Apply Theme Settings</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
