import React from 'react';
import { ZKLogo } from '../common/ZKLogo.tsx';
import { useData } from '../../context/DataContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import {
  ChevronUp,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Download,
  MessageCircle,
  FileDown
} from 'lucide-react';

export const PortfolioFooter: React.FC = () => {
  const { data } = useData();
  const { isDark } = useTheme();
  const contact = data?.contact;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappNumber = contact?.whatsappNumber || '03439179353';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <footer className={`relative pt-16 pb-12 border-t overflow-hidden transition-colors ${
      isDark ? 'border-white/10 bg-[#04060f]' : 'border-slate-200 bg-slate-50 text-slate-800'
    }`}>
      {/* Animated Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 via-purple-500 to-transparent opacity-75" />

      {/* Background glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-32 blur-[100px] pointer-events-none ${
        isDark ? 'bg-blue-600/10' : 'bg-blue-300/15'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-white/10">
          <div>
            <ZKLogo size="lg" />
            <div className="font-cursive text-amber-500 text-xl mt-2 tracking-wide">
              Your Vision, My Creativity.
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
            <a href="#home" className="hover:text-amber-500 transition-colors">Home</a>
            <a href="#about" className="hover:text-amber-500 transition-colors">About</a>
            <a href="#services" className="hover:text-amber-500 transition-colors">Services</a>
            <a href="#portfolio" className="hover:text-amber-500 transition-colors">Portfolio</a>
            <a href="#testimonials" className="hover:text-amber-500 transition-colors">Testimonials</a>
            <a href="#contact" className="hover:text-amber-500 transition-colors">Contact</a>
          </div>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className={`px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all transform hover:-translate-y-1 shadow-sm ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            <span>Back to Top</span>
            <ChevronUp className="w-4 h-4 text-amber-500" />
          </button>
        </div>

        {/* Bottom Footer Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Zakirullah Creative Studio. All Rights Reserved.
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[
              { icon: Facebook, href: contact?.socialLinks.facebook || 'https://facebook.com' },
              { icon: Instagram, href: contact?.socialLinks.instagram || 'https://instagram.com' },
              { icon: Youtube, href: contact?.socialLinks.youtube || 'https://youtube.com' },
              { icon: Linkedin, href: contact?.socialLinks.linkedin || 'https://linkedin.com' },
            ].map((soc, i) => {
              const Icon = soc.icon;
              return (
                <a
                  key={i}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/30'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 font-cursive text-amber-500 text-lg">
            <span>Your Vision</span>
            <span>&bull;</span>
            <span>My Creativity</span>
            <span className="text-sm">👑</span>
          </div>
        </div>
      </div>

      {/* Floating Action Badge at bottom right: WhatsApp and Download Portfolio PDF */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3 pointer-events-auto">
        {/* Download Portfolio PDF Badge */}
        <button
          onClick={handleDownloadPDF}
          className={`hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-semibold shadow-xl backdrop-blur-xl transition-all transform hover:scale-105 group ${
            isDark
              ? 'bg-[#091129]/90 hover:bg-[#0e1b40] border-blue-500/40 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
              : 'bg-white/95 hover:bg-slate-50 border-slate-300 text-slate-800 shadow-md'
          }`}
          title="Download Portfolio PDF"
        >
          <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileDown className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-[10px] text-slate-400 uppercase leading-none font-bold">Download</div>
            <div className="text-xs font-bold leading-tight">Portfolio PDF</div>
          </div>
        </button>

        {/* Floating WhatsApp Bubble */}
        <a
          href={`https://wa.me/92${cleanNumber.startsWith('0') ? cleanNumber.slice(1) : cleanNumber}?text=Hello%20Zakirullah!`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)] border-2 border-white/40 transition-all transform hover:scale-110 active:scale-95"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
        </a>
      </div>
    </footer>
  );
};
