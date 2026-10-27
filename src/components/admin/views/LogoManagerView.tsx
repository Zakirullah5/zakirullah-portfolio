import React, { useState } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { LogoSettings } from '../../../types/index.ts';
import { ZKLogo } from '../../common/ZKLogo.tsx';
import { Shield, UploadCloud, Save, Trash2, Eye, Video, CheckCircle, Sparkles } from 'lucide-react';

export const LogoManagerView: React.FC = () => {
  const { data, updateLogos, uploadFile, isSaving } = useData();
  const [logos, setLogos] = useState<LogoSettings>(() => ({
    headerLogoUrl: data?.logos?.headerLogoUrl || '',
    footerLogoUrl: data?.logos?.footerLogoUrl || '',
    faviconUrl: data?.logos?.faviconUrl || '',
    threeDLogoUrl: data?.logos?.threeDLogoUrl || '',
    animatedLogoUrl: data?.logos?.animatedLogoUrl || '',
    introVideoUrl: data?.logos?.introVideoUrl || '',
    logoDimensions: data?.logos?.logoDimensions || { width: 180, height: 50 }
  }));

  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  const handleFileUpload = async (field: keyof LogoSettings, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadTarget(field);
    const res = await uploadFile(file);
    if (res.success && res.url) {
      setLogos((prev) => ({ ...prev, [field]: res.url! }));
    }
    setUploadTarget(null);
  };

  const handleSave = async () => {
    await updateLogos(logos);
  };

  const clearLogo = (field: keyof LogoSettings) => {
    setLogos((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            Logo & Brand Asset Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload, replace, and configure 2D, 3D, Animated Logos, Intro Videos, Favicon, and Header/Footer branding.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all cursor-pointer min-h-[42px]"
        >
          <Save className="w-4 h-4" />
          <span>Save Logo Settings</span>
        </button>
      </div>

      {/* Grid of Logo Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Website Header Logo */}
        <div className="p-5 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Header Logo</span>
              <span className="text-[10px] text-cyan-400 font-mono">PNG / SVG / WEBP</span>
            </div>

            <div className="h-32 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center p-4 mb-4 relative overflow-hidden">
              {logos.headerLogoUrl ? (
                <img src={logos.headerLogoUrl} alt="Header Logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <ZKLogo size="md" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex-1 py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{uploadTarget === 'headerLogoUrl' ? 'Uploading...' : 'Upload Header Logo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('headerLogoUrl', e)}
                disabled={uploadTarget !== null}
                className="hidden"
              />
            </label>
            {logos.headerLogoUrl && (
              <button
                onClick={() => clearLogo('headerLogoUrl')}
                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
                title="Remove Logo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 2. 3D Metallic Logo Asset */}
        <div className="p-5 rounded-3xl bg-[#090e24]/90 border border-amber-500/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">3D Metallic Logo</span>
              <span className="text-[10px] text-amber-400 font-mono">3D Render</span>
            </div>

            <div className="h-32 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center p-4 mb-4 relative overflow-hidden">
              {logos.threeDLogoUrl ? (
                <img src={logos.threeDLogoUrl} alt="3D Logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-xl">👑</span>
                  <span className="font-display font-black text-2xl text-amber-400">ZK 3D</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{uploadTarget === 'threeDLogoUrl' ? 'Uploading...' : 'Upload 3D Logo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('threeDLogoUrl', e)}
                disabled={uploadTarget !== null}
                className="hidden"
              />
            </label>
            {logos.threeDLogoUrl && (
              <button
                onClick={() => clearLogo('threeDLogoUrl')}
                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Animated Logo Asset (GIF/WebM/MP4) */}
        <div className="p-5 rounded-3xl bg-[#090e24]/90 border border-purple-500/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Animated Logo</span>
              <span className="text-[10px] text-purple-400 font-mono">Loop Animation</span>
            </div>

            <div className="h-32 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center p-4 mb-4 relative overflow-hidden">
              {logos.animatedLogoUrl ? (
                <img src={logos.animatedLogoUrl} alt="Animated Logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-purple-400/60 animate-spin flex items-center justify-center text-xs font-bold text-purple-300">
                  ZK
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex-1 py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{uploadTarget === 'animatedLogoUrl' ? 'Uploading...' : 'Upload Animated Logo'}</span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleFileUpload('animatedLogoUrl', e)}
                disabled={uploadTarget !== null}
                className="hidden"
              />
            </label>
            {logos.animatedLogoUrl && (
              <button
                onClick={() => clearLogo('animatedLogoUrl')}
                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 4. Logo Intro Video */}
        <div className="p-5 rounded-3xl bg-[#090e24]/90 border border-pink-500/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Logo Intro Video</span>
              <span className="text-[10px] text-pink-400 font-mono">MP4 / WEBM</span>
            </div>

            <div className="h-32 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center p-2 mb-4 relative overflow-hidden">
              {logos.introVideoUrl ? (
                <video src={logos.introVideoUrl} controls className="max-h-full max-w-full rounded-xl" />
              ) : (
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Video className="w-5 h-5 text-pink-400" />
                  <span>No intro video loaded</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex-1 py-2 px-3 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{uploadTarget === 'introVideoUrl' ? 'Uploading Video...' : 'Upload Intro Video'}</span>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload('introVideoUrl', e)}
                disabled={uploadTarget !== null}
                className="hidden"
              />
            </label>
            {logos.introVideoUrl && (
              <button
                onClick={() => clearLogo('introVideoUrl')}
                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 5. Favicon */}
        <div className="p-5 rounded-3xl bg-[#090e24]/90 border border-cyan-500/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Browser Favicon</span>
              <span className="text-[10px] text-cyan-400 font-mono">ICO / PNG</span>
            </div>

            <div className="h-32 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center p-4 mb-4 relative overflow-hidden">
              {logos.faviconUrl ? (
                <img src={logos.faviconUrl} alt="Favicon" className="w-12 h-12 object-contain" />
              ) : (
                <span className="text-xs text-slate-400 font-mono">Default ZK Crown Favicon</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex-1 py-2 px-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Favicon</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('faviconUrl', e)}
                className="hidden"
              />
            </label>
            {logos.faviconUrl && (
              <button
                onClick={() => clearLogo('faviconUrl')}
                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 6. Logo Dimensions & Scale */}
        <div className="p-5 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Dimensions & Sizing</span>
              <span className="text-[10px] text-slate-400 font-mono">px</span>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Max Display Width (px)</label>
                <input
                  type="number"
                  value={logos.logoDimensions.width}
                  onChange={(e) =>
                    setLogos({
                      ...logos,
                      logoDimensions: { ...logos.logoDimensions, width: Number(e.target.value) }
                    })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Max Display Height (px)</label>
                <input
                  type="number"
                  value={logos.logoDimensions.height}
                  onChange={(e) =>
                    setLogos({
                      ...logos,
                      logoDimensions: { ...logos.logoDimensions, height: Number(e.target.value) }
                    })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 text-[11px] text-slate-400 text-center">
            Applies responsive vector constraints
          </div>
        </div>

      </div>
    </div>
  );
};
