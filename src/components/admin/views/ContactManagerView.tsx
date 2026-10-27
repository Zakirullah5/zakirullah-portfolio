import React, { useState } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { ContactSettings } from '../../../types/index.ts';
import { PhoneCall, Save, CheckCircle, MessageSquare, Mail, Phone, ExternalLink, Clock, User, Inbox } from 'lucide-react';

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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Apply Contact Changes</span>
            </button>
          </div>
        </div>

      </form>

      {/* Received Client Inquiries & Messages */}
      <div className="p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-white">
                Client Inquiries & Direct Messages
              </h3>
              <p className="text-xs text-slate-400">
                Messages submitted through the portfolio contact form & service requests.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold">
            {data?.inquiries?.length || 0} Total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {data?.inquiries && data.inquiries.length > 0 ? (
            data.inquiries.map((inq) => {
              const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
              const whatsappUrl = cleanPhone
                ? `https://wa.me/92${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}?text=Hello%20${encodeURIComponent(inq.name)}!%20Thank%20you%20for%20contacting%20Zakirullah.`
                : null;

              return (
                <div
                  key={inq.id}
                  className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-300 font-bold text-xs flex items-center justify-center">
                          {inq.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-white truncate">{inq.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-cyan-300 font-medium mb-2.5 inline-block">
                      Service: {inq.service || 'General Inquiry'}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5 line-clamp-3">
                      "{inq.message || 'Interested in discussing a project.'}"
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-400 text-[11px] truncate">
                      {inq.email || inq.phone || 'Website Lead'}
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {inq.email && (
                        <a
                          href={`mailto:${inq.email}?subject=Response%20from%20Zakirullah%20Portfolio`}
                          className="px-2.5 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-400/30 text-[11px] font-semibold flex items-center gap-1"
                          title="Reply by Email"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Email</span>
                        </a>
                      )}
                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 text-[11px] font-semibold flex items-center gap-1"
                          title="Reply on WhatsApp"
                        >
                          <Phone className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center text-slate-400 text-xs">
              No inquiries received yet. New inquiries will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
