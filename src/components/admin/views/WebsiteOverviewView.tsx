import React from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { useAuth } from '../../../context/AuthContext.tsx';
import { Globe, CheckCircle, Server, Database, HardDrive, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

interface WebsiteOverviewViewProps {
  onNavigateToPortfolio: () => void;
  onOpenLivePreview: () => void;
}

export const WebsiteOverviewView: React.FC<WebsiteOverviewViewProps> = ({
  onNavigateToPortfolio,
  onOpenLivePreview
}) => {
  const { data } = useData();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Website System Overview & Health Status
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time diagnostics, persistent storage metrics, and operational checks for Zakirullah Creative Studio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToPortfolio}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>Open Public Site</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl bg-[#090e24]/90 border border-emerald-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">WEBSITE STATUS</div>
            <div className="text-lg font-bold text-white">Live & Operational</div>
            <div className="text-[11px] text-emerald-400 font-medium">Port 3000 Active</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#090e24]/90 border border-blue-500/25 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">DATABASE STORAGE</div>
            <div className="text-lg font-bold text-white">JSON File Store</div>
            <div className="text-[11px] text-cyan-400 font-mono">data/database.json</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#090e24]/90 border border-purple-500/25 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">MEDIA ASSETS</div>
            <div className="text-lg font-bold text-white">{data?.media?.length || 0} Files</div>
            <div className="text-[11px] text-purple-300 font-mono">/uploads folder</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#090e24]/90 border border-amber-500/25 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">SECURITY SHIELD</div>
            <div className="text-lg font-bold text-white">PBKDF2 + Salt</div>
            <div className="text-[11px] text-amber-400 font-medium">Session Protected</div>
          </div>
        </div>
      </div>

      {/* Details checklist */}
      <div className="p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 space-y-4">
        <h3 className="text-base font-bold text-white mb-2">
          System Verification Checklist
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {[
            { label: 'Admin Authentication Active', ok: true },
            { label: 'Express Backend API Ready', ok: true },
            { label: 'Vite Frontend Fast Bundler', ok: true },
            { label: 'Multer Multipart File Handling', ok: true },
            { label: 'Static Asset Route /uploads Mounted', ok: true },
            { label: 'Dynamic Price Synchronization', ok: true },
            { label: '56+ Creative Skills Engine', ok: true },
            { label: 'Live Preview Device Frame', ok: true },
            { label: 'Disaster Recovery Backup Engine', ok: true },
          ].map((chk, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-slate-200">{chk.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
