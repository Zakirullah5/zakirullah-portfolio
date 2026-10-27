import React, { useState } from 'react';
import { useData } from '../../context/DataContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { TiltCard } from '../common/TiltCard.tsx';
import {
  Sparkles,
  Clock,
  ThumbsUp,
  DollarSign,
  Star,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Lock,
  ArrowRight,
  ShieldCheck,
  Send,
  CheckCircle2
} from 'lucide-react';

interface BottomSectionsProps {
  onOpenAdminModal: () => void;
  onNavigateToAdmin?: () => void;
}

export const BottomSections: React.FC<BottomSectionsProps> = ({
  onOpenAdminModal,
  onNavigateToAdmin
}) => {
  const { data } = useData();
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const contact = data?.contact;
  const testimonials = data?.testimonials?.filter((t) => t.show) || [];

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const whatsappNumber = contact?.whatsappNumber || '03439179353';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName) {
      fetch('/api/contact/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMsg })
      }).catch(() => {});
    }
    const encoded = encodeURIComponent(
      `Hello Zakirullah! Name: ${contactName}, Email: ${contactEmail}, Message: ${contactMsg}`
    );
    window.open(
      `https://wa.me/92${cleanNumber.startsWith('0') ? cleanNumber.slice(1) : cleanNumber}?text=${encoded}`,
      '_blank'
    );
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 5000);
  };

  return (
    <div className="py-12 space-y-12">
      {/* 3-Column Grid Matching: Why Choose Me | Client Testimonials | Get In Touch */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: Why Choose Me? (4 cols) */}
          <TiltCard
            maxTilt={4}
            className={`lg:col-span-4 p-5 sm:p-7 rounded-[28px] sm:rounded-[32px] border shadow-xl backdrop-blur-xl flex flex-col justify-between ${
              isDark
                ? 'bg-gradient-to-b from-[#0e1633]/90 via-[#0a0f26]/95 to-[#050818] border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]'
                : 'bg-white/95 border-slate-200 shadow-lg'
            }`}
          >
            <div>
              <h3 className={`text-xl font-display font-bold mb-6 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                Why Choose Me?
              </h3>

              <div className="space-y-3 sm:space-y-4">
                <div className={`flex items-start gap-3 p-3 rounded-2xl border ${
                  isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Creative Ideas</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Unique & Modern Designs</div>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-3 rounded-2xl border ${
                  isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>On-Time Delivery</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Always On Schedule</div>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-3 rounded-2xl border ${
                  isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>100% Satisfaction</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Client First Priority</div>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-3 rounded-2xl border ${
                  isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Affordable Prices</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Best Value for Money</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400 text-center">
              Dedicated to high-end design perfection and 24/7 client support.
            </div>
          </TiltCard>

          {/* Column 2: Client Testimonials (4 cols) */}
          <TiltCard
            maxTilt={4}
            className={`lg:col-span-4 p-5 sm:p-7 rounded-[28px] sm:rounded-[32px] border shadow-xl backdrop-blur-xl flex flex-col justify-between ${
              isDark
                ? 'bg-gradient-to-b from-[#0e1633]/90 via-[#0a0f26]/95 to-[#050818] border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]'
                : 'bg-white/95 border-slate-200 shadow-lg'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-display font-bold flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  Client Testimonials
                </h3>
                <span className="text-[11px] text-amber-500 font-semibold">5.0 Star Rated</span>
              </div>

              {testimonials.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {testimonials.slice(0, 2).map((test) => (
                    <div
                      key={test.id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between ${
                        isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <p className={`text-xs italic mb-4 leading-relaxed ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        "{test.review}"
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={test.avatar}
                            alt={test.name}
                            className="w-8 h-8 rounded-full object-cover border border-amber-400/40 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{test.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{test.role}</div>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex text-amber-400 text-xs flex-shrink-0 ml-2">
                          {Array.from({ length: test.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 py-8 text-center">No reviews yet.</div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>Trusted by 100+ clients globally</span>
              <span className="text-amber-500 font-bold">★★★★★</span>
            </div>
          </TiltCard>

          {/* Column 3: Get In Touch (4 cols) with ADMIN LOGIN button at bottom */}
          <TiltCard
            maxTilt={4}
            className={`lg:col-span-4 p-5 sm:p-7 rounded-[28px] sm:rounded-[32px] border shadow-xl backdrop-blur-xl flex flex-col justify-between ${
              isDark
                ? 'bg-gradient-to-b from-[#0e1633]/90 via-[#0a0f26]/95 to-[#050818] border-blue-500/25 shadow-[0_0_30px_rgba(59,130,246,0.2)]'
                : 'bg-white/95 border-slate-200 shadow-lg'
            }`}
          >
            <div>
              <h3 className={`text-xl font-display font-bold mb-2 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Get In Touch
              </h3>
              <p className={`text-xs mb-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Let's work together on your next project.
              </p>

              {/* Contact list */}
              <div className="space-y-3 mb-5">
                <div className={`flex items-center gap-2.5 text-xs ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono">{contact?.whatsappNumber || '03439179353'}</span>
                </div>

                <div className={`flex items-center gap-2.5 text-xs ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{contact?.email || 'zakir1kb@gmail.com'}</span>
                </div>

                <div className={`flex items-center gap-2.5 text-xs ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{contact?.location || 'Tangi, Charsadda, Pakistan'}</span>
                </div>
              </div>

              {/* Chat on WhatsApp Button */}
              <a
                href={`https://wa.me/92${cleanNumber.startsWith('0') ? cleanNumber.slice(1) : cleanNumber}?text=Hello%20Zakirullah,%20I%20would%20like%20to%20discuss%20a%20project.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all transform active:scale-95 mb-6 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* MANDATORY REQUIREMENT: ADMIN LOGIN BUTTON AT BOTTOM OF CONTACT */}
            <div className="pt-4 border-t border-white/10">
              <div className="text-[10px] uppercase font-bold text-slate-400 text-center tracking-wider mb-2">
                Authorized Owner Access
              </div>

              {isAuthenticated ? (
                <button
                  onClick={onNavigateToAdmin}
                  className="w-full min-h-[44px] py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(147,51,234,0.4)] border border-purple-400/40 transition-all transform active:scale-95 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>OPEN ZK CONTROL CENTER</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={onOpenAdminModal}
                  className={`w-full min-h-[44px] py-3 px-4 rounded-2xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border shadow-md transition-all transform active:scale-95 group cursor-pointer ${
                    isDark
                      ? 'bg-gradient-to-r from-[#172042] to-[#121936] hover:from-[#1e2a56] hover:to-[#172248] text-slate-200 hover:text-white border-blue-500/30 hover:border-amber-400/60 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                      : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800 hover:border-amber-400 shadow-md'
                  }`}
                >
                  <Lock className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span>ADMIN LOGIN</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

          </TiltCard>

        </div>
      </div>
    </div>
  );
};
