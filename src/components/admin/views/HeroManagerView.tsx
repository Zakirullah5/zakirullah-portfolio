import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { HeroSettings } from '../../../types/index.ts';
import {
  Save,
  UploadCloud,
  Sparkles,
  CheckCircle,
  FileText,
  Download,
  Trash2,
  ExternalLink,
  FileCheck,
  AlertCircle,
  FileDown,
  RefreshCw
} from 'lucide-react';

export const HeroManagerView: React.FC = () => {
  const { data, updateHero, uploadFile, uploadCV, removeCV, isSaving } = useData();
  const cvFileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<HeroSettings>(() => ({
    greeting: data?.hero?.greeting || "Hello, I'm",
    name: data?.hero?.name || 'ZAKIRULLAH',
    professionalTitle: data?.hero?.professionalTitle || 'Graphic Designer | Logo Creator | 3D Animator | AI Video Creator | Video Editor',
    creativeSlogan: data?.hero?.creativeSlogan || 'Turning Imagination Into Extraordinary Digital Experiences.',
    description: data?.hero?.description || 'I create stunning designs, 3D logos, engaging videos and modern branding solutions that help your business grow and stand out.',
    profileImageUrl: data?.hero?.profileImageUrl || '',
    backgroundImageUrl: data?.hero?.backgroundImageUrl || '',
    threeDLogoUrl: data?.hero?.threeDLogoUrl || '',
    primaryButtonText: data?.hero?.primaryButtonText || 'Explore Portfolio',
    primaryButtonLink: data?.hero?.primaryButtonLink || '#portfolio',
    secondaryButtonText: data?.hero?.secondaryButtonText || 'Contact Me',
    secondaryButtonLink: data?.hero?.secondaryButtonLink || '#contact',
    whatsappNumber: data?.hero?.whatsappNumber || '03439179353',
    freelanceStatusText: data?.hero?.freelanceStatusText || 'Available for Freelance',
    cvPdfUrl: data?.hero?.cvPdfUrl || '',
    cvFileName: data?.hero?.cvFileName || '',
    cvFileSize: data?.hero?.cvFileSize || '',
    cvLastUpdated: data?.hero?.cvLastUpdated || '',
    cvButtonText: data?.hero?.cvButtonText || 'Download CV / PDF'
  }));

  // Sync state when database updates
  useEffect(() => {
    if (data?.hero) {
      setForm((prev) => ({
        ...prev,
        ...data.hero,
        cvPdfUrl: data.hero.cvPdfUrl || '',
        cvFileName: data.hero.cvFileName || '',
        cvFileSize: data.hero.cvFileSize || '',
        cvLastUpdated: data.hero.cvLastUpdated || '',
        cvButtonText: data.hero.cvButtonText || 'Download CV / PDF'
      }));
    }
  }, [data?.hero]);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [cvSuccessMessage, setCvSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await updateHero(form);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const res = await uploadFile(file);
    if (res.success && res.url) {
      setForm((prev) => ({ ...prev, profileImageUrl: res.url! }));
    }
    setUploadingImage(false);
  };

  // Dedicated CV File Upload Handler
  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
      alert('Please upload a PDF or DOC document file.');
      return;
    }

    setUploadingCV(true);
    setCvSuccessMessage(null);
    const res = await uploadCV(file);
    if (res.success && res.hero) {
      setForm((prev) => ({
        ...prev,
        cvPdfUrl: res.hero?.cvPdfUrl || '',
        cvFileName: res.hero?.cvFileName || file.name,
        cvFileSize: res.hero?.cvFileSize || '',
        cvLastUpdated: res.hero?.cvLastUpdated || ''
      }));
      setCvSuccessMessage(`CV updated successfully: ${file.name}`);
      setTimeout(() => setCvSuccessMessage(null), 4000);
    }
    setUploadingCV(false);
    if (cvFileInputRef.current) cvFileInputRef.current.value = '';
  };

  const handleRemoveCV = async () => {
    if (confirm('Are you sure you want to reset the CV download button to the default browser print mode?')) {
      const ok = await removeCV();
      if (ok) {
        setForm((prev) => ({
          ...prev,
          cvPdfUrl: '',
          cvFileName: '',
          cvFileSize: '',
          cvLastUpdated: ''
        }));
        setCvSuccessMessage('CV reset to default print format');
        setTimeout(() => setCvSuccessMessage(null), 3000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Hero Section & CV Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Customize top hero typography, dynamic titles, portrait photo, buttons, and upload/replace your CV / PDF document.
          </p>
        </div>

        <button
          onClick={() => handleSubmit()}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all cursor-pointer min-h-[42px]"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* FEATURE: DEDICATED CV / PDF DOCUMENT MANAGEMENT CARD */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c153b] via-[#090f2b] to-[#060a1e] border-2 border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.15)] relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center flex-shrink-0 shadow-inner">
              <FileDown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-display font-bold text-white">
                  Download CV / PDF Document Management
                </h3>
                {form.cvPdfUrl ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <FileCheck className="w-3 h-3" />
                    Custom CV Active
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                    Browser Print Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Upload your latest resume or CV (PDF). When visitors click the <strong className="text-cyan-300">"{form.cvButtonText || 'Download CV / PDF'}"</strong> button in the Hero section, this document will be instantly downloaded. You can replace it at any time.
              </p>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              ref={cvFileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleCVUpload}
              disabled={uploadingCV}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => cvFileInputRef.current?.click()}
              disabled={uploadingCV}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all transform active:scale-95 cursor-pointer min-h-[42px]"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{uploadingCV ? 'Uploading CV...' : form.cvPdfUrl ? 'Replace CV File' : 'Upload CV File (PDF)'}</span>
            </button>

            {form.cvPdfUrl && (
              <>
                <a
                  href={form.cvPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[42px]"
                  title="Preview / Download active CV"
                >
                  <ExternalLink className="w-4 h-4 text-cyan-300" />
                  <span>Preview CV</span>
                </a>

                <button
                  type="button"
                  onClick={handleRemoveCV}
                  className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition-all min-h-[42px] flex items-center justify-center cursor-pointer"
                  title="Remove CV and revert to browser print"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Success message banner */}
        {cvSuccessMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{cvSuccessMessage}</span>
          </div>
        )}

        {/* Current Active File Info Card */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 mt-6">
          <div className="md:col-span-7 p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {form.cvFileName || (form.cvPdfUrl ? 'Portfolio_CV.pdf' : 'No custom CV file uploaded')}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  {form.cvPdfUrl ? (
                    <>
                      <span>{form.cvFileSize || 'Server Stored'}</span>
                      {form.cvLastUpdated && (
                        <span> &bull; Updated: {new Date(form.cvLastUpdated).toLocaleDateString()}</span>
                      )}
                    </>
                  ) : (
                    <span>Default fallback: Automatically opens printer/PDF dialog (window.print)</span>
                  )}
                </div>
              </div>
            </div>

            {form.cvPdfUrl && (
              <a
                href={form.cvPdfUrl}
                download={form.cvFileName || 'Zakirullah_Portfolio_CV.pdf'}
                className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors flex-shrink-0"
                title="Direct Download"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Button Text Customization */}
          <div className="md:col-span-5 p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Hero Button Label
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.cvButtonText || 'Download CV / PDF'}
                onChange={(e) => setForm({ ...form, cvButtonText: e.target.value })}
                placeholder="Download CV / PDF"
                className="w-full px-3 py-1.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
              />
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/40 text-cyan-200 text-xs font-semibold whitespace-nowrap cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Direct Link Input (e.g., Google Drive or Cloud link) */}
        <div className="relative z-10 mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap uppercase tracking-wider">
            Direct CV Link / URL:
          </span>
          <input
            type="text"
            value={form.cvPdfUrl || ''}
            onChange={(e) =>
              setForm({
                ...form,
                cvPdfUrl: e.target.value,
                cvFileName: e.target.value.split('/').pop() || 'Custom_CV.pdf'
              })
            }
            placeholder="Paste relative path (/uploads/...) or external URL (https://drive.google.com/...)"
            className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
          />
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            Save Link
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Text & Headings (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Greeting</label>
              <input
                type="text"
                value={form.greeting}
                onChange={(e) => setForm({ ...form, greeting: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Large Display Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400 font-display font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Professional Title</label>
            <input
              type="text"
              value={form.professionalTitle}
              onChange={(e) => setForm({ ...form, professionalTitle: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Creative Cursive Slogan</label>
            <input
              type="text"
              value={form.creativeSlogan}
              onChange={(e) => setForm({ ...form, creativeSlogan: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-amber-300 font-cursive text-xl focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Hero Description Paragraph</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Buttons Settings */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Primary Button Label</label>
              <input
                type="text"
                value={form.primaryButtonText}
                onChange={(e) => setForm({ ...form, primaryButtonText: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Primary Button Link</label>
              <input
                type="text"
                value={form.primaryButtonLink}
                onChange={(e) => setForm({ ...form, primaryButtonLink: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Secondary Button Label</label>
              <input
                type="text"
                value={form.secondaryButtonText}
                onChange={(e) => setForm({ ...form, secondaryButtonText: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Freelance Badge Text</label>
              <input
                type="text"
                value={form.freelanceStatusText}
                onChange={(e) => setForm({ ...form, freelanceStatusText: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Avatar Portrait & Media (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 space-y-4 flex flex-col justify-between">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase">Hero Portrait Image</label>
            
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10 mb-3 flex items-center justify-center group">
              <img
                src={form.profileImageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'}
                alt="Hero Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                <UploadCloud className="w-8 h-8 text-cyan-400 mb-1" />
                <span className="text-xs text-white font-medium">Click button below to replace</span>
              </div>
            </div>

            <label className="w-full py-2.5 px-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all">
              <UploadCloud className="w-4 h-4" />
              <span>{uploadingImage ? 'Uploading Image...' : 'Upload New Portrait'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Direct Image URL</label>
              <input
                type="text"
                value={form.profileImageUrl}
                onChange={(e) => setForm({ ...form, profileImageUrl: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Apply Hero Changes</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
