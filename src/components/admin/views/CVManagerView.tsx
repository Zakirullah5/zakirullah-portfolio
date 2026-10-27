import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import {
  FileDown,
  UploadCloud,
  FileCheck,
  FileText,
  Download,
  Trash2,
  ExternalLink,
  Copy,
  CheckCircle,
  Sparkles,
  AlertCircle,
  Eye,
  RefreshCw,
  Printer
} from 'lucide-react';

export const CVManagerView: React.FC = () => {
  const { data, updateHero, uploadCV, removeCV, isSaving } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hero = data?.hero;
  const [cvPdfUrl, setCvPdfUrl] = useState(hero?.cvPdfUrl || '');
  const [cvFileName, setCvFileName] = useState(hero?.cvFileName || '');
  const [cvFileSize, setCvFileSize] = useState(hero?.cvFileSize || '');
  const [cvLastUpdated, setCvLastUpdated] = useState(hero?.cvLastUpdated || '');
  const [cvButtonText, setCvButtonText] = useState(hero?.cvButtonText || 'Download CV / PDF');

  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (hero) {
      setCvPdfUrl(hero.cvPdfUrl || '');
      setCvFileName(hero.cvFileName || '');
      setCvFileSize(hero.cvFileSize || '');
      setCvLastUpdated(hero.cvLastUpdated || '');
      setCvButtonText(hero.cvButtonText || 'Download CV / PDF');
    }
  }, [hero]);

  const handleFileUpload = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
      alert('Please select a valid PDF or DOC document file.');
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);
    const res = await uploadCV(file);
    if (res.success && res.hero) {
      setCvPdfUrl(res.hero.cvPdfUrl || '');
      setCvFileName(res.hero.cvFileName || file.name);
      setCvFileSize(res.hero.cvFileSize || '');
      setCvLastUpdated(res.hero.cvLastUpdated || new Date().toISOString());
      setStatusMessage(`CV document "${file.name}" uploaded and activated successfully!`);
      setTimeout(() => setStatusMessage(null), 4000);
    } else {
      alert(res.error || 'Failed to upload CV');
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSaveButtonSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await updateHero({
      cvButtonText,
      cvPdfUrl,
      cvFileName: cvFileName || cvPdfUrl.split('/').pop() || 'Custom_CV.pdf',
      cvLastUpdated: new Date().toISOString()
    });
    setStatusMessage('CV button settings saved successfully!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleResetCV = async () => {
    if (confirm('Are you sure you want to reset the portfolio CV download button to default browser print mode?')) {
      const ok = await removeCV();
      if (ok) {
        setCvPdfUrl('');
        setCvFileName('');
        setCvFileSize('');
        setCvLastUpdated('');
        setStatusMessage('CV download reset to browser print mode');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    }
  };

  const copyCvLink = () => {
    if (!cvPdfUrl) return;
    const fullUrl = cvPdfUrl.startsWith('http') ? cvPdfUrl : window.location.origin + cvPdfUrl;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const testDownload = () => {
    if (cvPdfUrl) {
      const link = document.createElement('a');
      link.href = cvPdfUrl;
      link.download = cvFileName || 'Zakirullah_Portfolio_CV.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0c1840]/90 via-[#0e163b]/95 to-[#160c38]/90 border border-blue-500/30 shadow-[0_0_35px_rgba(59,130,246,0.25)] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 border-2 border-cyan-400/50 text-cyan-300 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <FileDown className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-display font-bold text-white">
                Upload CV & Resume Document Manager
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                Direct Portfolio Download
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Upload, replace, and configure your official CV / Resume PDF. When website visitors click the Download CV / PDF button on your portfolio, this exact file is provided.
            </p>
          </div>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform active:scale-95 cursor-pointer whitespace-nowrap min-h-[42px]"
        >
          <UploadCloud className="w-4 h-4" />
          <span>{isUploading ? 'Uploading...' : cvPdfUrl ? 'Replace Current CV' : 'Upload CV File'}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          className="hidden"
        />
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="font-medium">{statusMessage}</span>
        </div>
      )}

      {/* Main Grid: Upload Zone + Active Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Interactive Drag & Drop Area */}
        <div className="lg:col-span-7 space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-10 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[260px] ${
              isDragging
                ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_40px_rgba(6,182,212,0.35)]'
                : 'border-white/15 hover:border-cyan-400/60 bg-[#090e24]/80 hover:bg-[#0c1436]'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center mb-4 text-cyan-300 shadow-inner group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-white mb-1.5">
              Drag & Drop Your CV / Resume (PDF) Here
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
              Click to browse from your device. Supported formats: <strong className="text-cyan-300">.PDF</strong>, <strong className="text-cyan-300">.DOC</strong>, <strong className="text-cyan-300">.DOCX</strong> (Up to 100MB).
            </p>

            <span className="px-4 py-2 rounded-xl bg-cyan-600/30 border border-cyan-400/40 text-cyan-200 text-xs font-semibold flex items-center gap-2">
              <FileDown className="w-4 h-4" />
              <span>Select File from Computer / Phone</span>
            </span>
          </div>

          {/* Button Text & Direct Link Configuration */}
          <div className="p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 space-y-4">
            <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Portfolio Button Label & External URL
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                  Button Text On Portfolio
                </label>
                <input
                  type="text"
                  value={cvButtonText}
                  onChange={(e) => setCvButtonText(e.target.value)}
                  placeholder="Download CV / PDF"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                  Direct / External CV Link
                </label>
                <input
                  type="text"
                  value={cvPdfUrl}
                  onChange={(e) => setCvPdfUrl(e.target.value)}
                  placeholder="/uploads/... or https://drive.google.com/..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleSaveButtonSettings()}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Current Active CV Card & Live Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Current Status
                </span>
                {cvPdfUrl ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5" />
                    Custom CV Active
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                    <Printer className="w-3.5 h-3.5" />
                    Browser Print Mode
                  </span>
                )}
              </div>

              {/* Document Visual Box */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate" title={cvFileName || 'Portfolio_CV.pdf'}>
                      {cvFileName || (cvPdfUrl ? cvPdfUrl.split('/').pop() : 'No CV Uploaded Yet')}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {cvPdfUrl ? `${cvFileSize || 'Uploaded File'} • Active on website` : 'Default: Opens browser PDF printer'}
                    </p>
                  </div>
                </div>

                {cvLastUpdated && (
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-white/5 flex justify-between">
                    <span>Last Updated:</span>
                    <span className="font-mono text-slate-300">
                      {new Date(cvLastUpdated).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions for Current CV */}
            <div className="space-y-2.5 pt-2">
              {cvPdfUrl ? (
                <>
                  <button
                    type="button"
                    onClick={testDownload}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer min-h-[44px]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Test Download Active CV</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={cvPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-h-[40px]"
                    >
                      <Eye className="w-4 h-4 text-cyan-300" />
                      <span>Preview File</span>
                    </a>

                    <button
                      type="button"
                      onClick={copyCvLink}
                      className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[40px]"
                    >
                      <Copy className="w-4 h-4 text-amber-300" />
                      <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetCV}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 hover:text-red-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[40px]"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                    <span>Reset to Default Browser Print</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer min-h-[44px]"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Your CV / PDF Now</span>
                </button>
              )}
            </div>

            {/* Explanatory Help Card */}
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 leading-relaxed">
              <span className="font-bold block mb-1 text-cyan-300">How it works:</span>
              Whenever a visitor on your live portfolio clicks the <strong>"{cvButtonText}"</strong> button, their browser will immediately download this document. If you have updated credentials, simply click <strong>"Replace Current CV"</strong> and upload your new file!
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
