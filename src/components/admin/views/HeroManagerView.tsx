import React, { useState } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { HeroSettings } from '../../../types/index.ts';
import { Save, UploadCloud, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';

export const HeroManagerView: React.FC = () => {
  const { data, updateHero, uploadFile, isSaving } = useData();
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
    freelanceStatusText: data?.hero?.freelanceStatusText || 'Available for Freelance'
  }));

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Hero Section Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Customize top hero typography, dynamic titles, portrait photo, buttons, and freelance status.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
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
