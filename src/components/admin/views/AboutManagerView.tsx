import React, { useState } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { AboutSettings } from '../../../types/index.ts';
import { Save, UploadCloud, User, CheckCircle } from 'lucide-react';

export const AboutManagerView: React.FC = () => {
  const { data, updateAbout, uploadFile, isSaving } = useData();
  const [form, setForm] = useState<AboutSettings>(() => ({
    bioParagraph1: data?.about?.bioParagraph1 || '',
    bioParagraph2: data?.about?.bioParagraph2 || '',
    profileImageUrl: data?.about?.profileImageUrl || '',
    name: data?.about?.name || 'Zakirullah',
    location: data?.about?.location || 'Tangi, Charsadda, Pakistan',
    experience: data?.about?.experience || '3+ Years',
    availability: data?.about?.availability || 'Available',
    signatureImageUrl: data?.about?.signatureImageUrl || ''
  }));

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAbout(form);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            About Me Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Update personal biography, professional experience years, location, availability, and signature.
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
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Primary Biography</label>
            <textarea
              rows={4}
              value={form.bioParagraph1}
              onChange={(e) => setForm({ ...form, bioParagraph1: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Secondary Biography Paragraph</label>
            <textarea
              rows={3}
              value={form.bioParagraph2}
              onChange={(e) => setForm({ ...form, bioParagraph2: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400 leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Experience Level</label>
              <input
                type="text"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Availability Status</label>
              <input
                type="text"
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 space-y-4 flex flex-col justify-between">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase">About Profile Portrait</label>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10 mb-3 flex items-center justify-center group">
              <img
                src={form.profileImageUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'}
                alt="About Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <label className="w-full py-2.5 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all">
              <UploadCloud className="w-4 h-4" />
              <span>{uploadingImage ? 'Uploading Image...' : 'Replace Photo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Apply About Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
