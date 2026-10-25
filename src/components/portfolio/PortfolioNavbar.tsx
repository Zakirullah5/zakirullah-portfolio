import React, { useState, useEffect } from 'react';
import { ZKLogo } from '../common/ZKLogo.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { Menu, X, Moon, Sun, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

interface PortfolioNavbarProps {
  onOpenAdminModal?: () => void;
  onNavigateToAdmin?: () => void;
}

export const PortfolioNavbar: React.FC<PortfolioNavbarProps> = ({
  onOpenAdminModal,
  onNavigateToAdmin
}) => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const { data } = useData();
  const { theme, isDark, toggleTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = ['home', 'about', 'services', 'portfolio', 'testimonials', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Portfolio', href: '#portfolio', id: 'portfolio' },
    { label: 'Testimonials', href: '#testimonials', id: 'testimonials' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const whatsappNumber = data?.contact?.whatsappNumber || '03439179353';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? isDark
            ? 'bg-[#050711]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-3'
            : 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)] py-3'
          : 'bg-transparent py-4 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo with hover glow */}
        <a href="#home" className="hover:opacity-90 transition-opacity transform hover:scale-[1.02]">
          <ZKLogo size="md" />
        </a>

        {/* Desktop Navigation Links with animated indicator */}
        <div
          className={`hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-colors ${
            isDark ? 'bg-white/[0.04] border-white/5' : 'bg-slate-100/80 border-slate-200'
          }`}
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`relative px-3.5 py-1.5 text-xs xl:text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? isDark
                      ? 'text-white font-semibold'
                      : 'text-blue-600 font-semibold'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {link.label}

                {/* Active Indicator Underline Glow */}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                )}
              </a>
            );
          })}
        </div>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Admin Quick Entry if Authenticated */}
          {isAuthenticated && (
            <button
              onClick={onNavigateToAdmin}
              className="px-3.5 py-1.5 rounded-full bg-purple-600/30 border border-purple-500/50 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* Dynamic Theme Toggle Button (Works!) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all transform hover:scale-105 ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-amber-400'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-blue-600 shadow-sm'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Dark and Light Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Hire Me CTA Button */}
          <a
            href={`https://wa.me/92${cleanNumber.startsWith('0') ? cleanNumber.slice(1) : cleanNumber}?text=Hello%20Zakirullah,%20I%20am%20interested%20in%20hiring%20you%20for%20a%20project!`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-all transform active:scale-95"
          >
            <span>Hire Me</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Menu & Theme Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10 text-amber-400' : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isAuthenticated && (
            <button
              onClick={onNavigateToAdmin}
              className="p-2 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs flex items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-b px-5 py-6 space-y-3 backdrop-blur-2xl animate-in slide-in-from-top duration-300 ${
            isDark
              ? 'bg-[#090e24]/98 border-white/10 text-white'
              : 'bg-white/98 border-slate-200 text-slate-900 shadow-xl'
          }`}
        >
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm rounded-xl transition-colors ${
                  activeSection === link.id
                    ? isDark
                      ? 'bg-blue-600/30 text-cyan-300 font-semibold border border-blue-500/30'
                      : 'bg-blue-50 text-blue-600 font-semibold border border-blue-200'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <a
              href={`https://wa.me/92${cleanNumber.startsWith('0') ? cleanNumber.slice(1) : cleanNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-center text-sm font-semibold text-white shadow-lg flex items-center justify-center gap-2"
            >
              <span>Hire Me on WhatsApp</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigateToAdmin) onNavigateToAdmin();
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Go to Admin Panel</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAdminModal) onOpenAdminModal();
                  else openLoginModal();
                }}
                className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
