import React, { useState } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { Database, Download, UploadCloud, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

export const BackupRestoreView: React.FC = () => {
  const { data, restoreBackup, isSaving } = useData();
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);

  const handleDownloadBackup = () => {
    if (!data) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `zakirullah_creative_studio_backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (confirm('Warning: Restoring will overwrite all current website content. Do you want to proceed?')) {
          setRestoreStatus('Restoring database...');
          const success = await restoreBackup(parsed);
          if (success) {
            setRestoreStatus('Restore completed successfully!');
          } else {
            setRestoreStatus('Restore failed: invalid backup structure.');
          }
        }
      } catch (err) {
        setRestoreStatus('Error parsing JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-400" />
          Backup & Disaster Recovery
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Export full site metadata, rates, portfolio items, and settings as JSON. Restore previous snapshots at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Backup Card */}
        <div className="p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Download Full Website Backup
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates a verified, human-readable JSON snapshot containing:
            </p>
            <ul className="text-xs text-slate-300 mt-3 space-y-1.5 list-disc list-inside">
              <li>{data?.projects?.length || 0} Portfolio Projects & Media links</li>
              <li>{data?.services?.length || 0} Professional Services & Rate configurations</li>
              <li>{data?.skills?.length || 0} Creative skills & proficiencies</li>
              <li>{data?.testimonials?.length || 0} Client reviews & testimonials</li>
              <li>Hero, About, Contact & Social coordinates</li>
            </ul>
          </div>

          <button
            onClick={handleDownloadBackup}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON Snapshot</span>
          </button>
        </div>

        {/* Restore Backup Card */}
        <div className="p-6 rounded-3xl bg-[#090e24]/90 border border-amber-500/25 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Restore from JSON Backup
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload a previously downloaded JSON backup file to instantly rollback or restore your portfolio state.
            </p>

            {restoreStatus && (
              <div className="mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-cyan-300">
                {restoreStatus}
              </div>
            )}
          </div>

          <label className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all">
            <UploadCloud className="w-4 h-4" />
            <span>Select JSON Backup to Restore</span>
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreFile}
              className="hidden"
            />
          </label>
        </div>

      </div>
    </div>
  );
};
