import React, { useState } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import {
  Eye,
  CheckCircle,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  RefreshCw,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface LivePreviewViewProps {
  onNavigateToPortfolio: () => void;
}

export const LivePreviewView: React.FC<LivePreviewViewProps> = ({ onNavigateToPortfolio }) => {
  const { data, publishChanges, isSaving, refreshData } = useData();
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const deviceWidths = {
    desktop: 'w-full',
    tablet: 'max-w-[768px]',
    mobile: 'max-w-[390px]'
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              Live Interactive Website Preview
            </h2>
            {data?.isDraft ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Unpublished Draft Changes Pending
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Live In Sync
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate your portfolio across Desktop, Tablet, and Mobile viewports with real draft modifications.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Device Switcher */}
          <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                deviceMode === 'desktop' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                deviceMode === 'tablet' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                deviceMode === 'mobile' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => refreshData()}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
            title="Refresh Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => publishChanges()}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Publish To Live</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex justify-center p-4 rounded-3xl bg-black/50 border border-white/10 overflow-hidden min-h-[700px]">
        <div
          className={`${deviceWidths[deviceMode]} transition-all duration-300 rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#050711] flex flex-col`}
        >
          {/* Mock Browser URL Bar */}
          <div className="px-4 py-2 bg-[#0a0f26] border-b border-white/10 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>

            <div className="px-6 py-1 rounded-full bg-white/5 border border-white/5 text-[11px] font-mono text-slate-300 flex items-center gap-2">
              <span className="text-emerald-400">🔒</span>
              <span>zakirullah.creative.site</span>
            </div>

            <button
              onClick={onNavigateToPortfolio}
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Full Screen</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Embedded Preview Frame (iframe or direct router) */}
          <iframe
            src="/#home"
            title="Portfolio Live Preview"
            className="w-full h-[700px] border-0"
          />
        </div>
      </div>
    </div>
  );
};
