import React, { useState } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { ContactSettings } from '../../../types/index.ts';
import { PhoneCall, Save, CheckCircle, MessageSquare } from 'lucide-react';

export const ContactManagerView: React.FC = () => {
  const { data, updateContact, isSaving } = useData();
  const [form, setForm] = useState<ContactSettings>(() => ({
    whatsappNumber: data?.contact?.whatsappNumber || '03439179353',
    whatsappLink: data?.contact?.whatsappLink || 'https://wa.me/923439179353',
    email: data?.contact?.email || 'zakir1kb@gmail.com',
    alternativeEmail: data?.contact?.alternativeEmail || 'zakirullah5@gmail.com',
    location: data?.contact?.location || 'Tangi, Charsadda, Pakistan',
    country: data?.contact?.country || 'Pakistan',
    socialLinks: {
      facebook: data?.contact?.socialLinks?.facebook || 'https://facebook.com',
      instagram: data?.contact?.socialLinks?.instagram || 'https://instagram.com',
      youtube: data?.contact?.socialLinks?.youtube || 'https://youtube.com',
      tiktok: data?.contact?.socialLinks?.tiktok || 'https://tiktok.com',
      linkedin: data?.contact?.socialLinks?.linkedin || 'https://linkedin.com'
    }
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateContact(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-emerald-400" />
            Contact & Social Media Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Update WhatsApp numbers, official email addresses, physical studio address, and external profiles.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Contact Info</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Contact Coordinates */}
        <div className="p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
            Primary Channels
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Primary WhatsApp Number</label>
            <input
              type="text"
              required
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">WhatsApp Direct API Link</label>
            <input
              type="text"
              value={form.whatsappLink}
              onChange={(e) => setForm({ ...form, whatsappLink: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Primary Business Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Secondary Email</label>
            <input
              type="email"
              value={form.alternativeEmail}
              onChange={(e) => setForm({ ...form, alternativeEmail: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Physical Address / City</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Social Media Links
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Facebook URL</label>
                <input
                  type="text"
                  value={form.socialLinks.facebook}
                  onChange={(e) =>
                    setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={form.socialLinks.instagram}
                  onChange={(e) =>
                    setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">YouTube Channel URL</label>
                <input
                  type="text"
                  value={form.socialLinks.youtube}
                  onChange={(e) =>
                    setForm({ ...form, socialLinks: { ...form.socialLinks, youtube: e.target.value } })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">TikTok Profile URL</label>
                <input
                  type="text"
                  value={form.socialLinks.tiktok}
                  onChange={(e) =>
                    setForm({ ...form, socialLinks: { ...form.socialLinks, tiktok: e.target.value } })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={form.socialLinks.linkedin}
                  onChange={(e) =>
                    setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Apply Contact Changes</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
