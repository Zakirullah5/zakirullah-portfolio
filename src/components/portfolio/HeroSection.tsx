import React, { useState } from 'react';
import { useData } from '../../context/DataContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { Hero3DCanvas } from '../3d/Hero3DCanvas.tsx';
import { AnimatedCounter } from './AnimatedCounter.tsx';
import { TiltCard } from '../common/TiltCard.tsx';
import {
  Sparkles,
  ArrowRight,
  Phone,
  MessageCircle,
  FileDown,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  ChevronDown,
  Layers,
  Box,
  UserCheck
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { data } = useData();
  const { isDark } = useTheme();
  const hero = data?.hero;
  const contact = data?.contact;

  const [activeTab, setActiveTab] = useState<'3d' | 'photo'>('3d');

  const whatsappNumber = contact?.whatsappNumber || '03439179353';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const stats = [
    { label: 'Years Experience', value: 3, suffix: '+' },
    { label: 'Completed Projects', value: 100, suffix: '+' },
    { label: 'Creative Skills', value: 56, suffix: '+' },
    { label: 'Client Satisfaction', value: 100, suffix: '%' },
  ];

  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background Lighting Gradients */}
      <div className={`absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[130px] pointer-events-none transition-colors ${
        isDark ? 'bg-blue-600/15' : 'bg-blue-400/10'
      }`} />
      <div className={`absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-colors ${
        isDark ? 'bg-purple-600/15' : 'bg-purple-400/10'
      }`} />
      <div className={`absolute top-2/3 right-1/3 w-80 h-80 rounded-full blur-[110px] pointer-events-none transition-colors ${
        isDark ? 'bg-amber-500/10' : 'bg-amber-400/10'
      }`} />

      {/* Cyber Grid Subtle Background */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none ${
        isDark ? 'opacity-80' : 'opacity-30'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Subtitles, CTAs, Socials */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Greeting Pill */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold tracking-wide ${
              isDark
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
            }`}>
              <span className="font-cursive text-lg text-amber-500">Hello, I'm</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            </div>

            {/* Giant 3D Metallic Name */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-display font-black tracking-tight leading-none">
              <span className={`text-transparent bg-clip-text ${
                isDark
                  ? 'bg-gradient-to-r from-white via-cyan-200 to-blue-400 drop-shadow-[0_0_35px_rgba(56,189,248,0.45)]'
                  : 'bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950'
              }`}>
                {hero?.name || 'ZAKIRULLAH'}
              </span>
            </h1>

            {/* Professional Title Multi-Badge */}
            <div className={`text-sm sm:text-base md:text-lg font-medium flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <span className="text-cyan-500 font-semibold">Graphic Designer</span>
              <span className="text-slate-400">|</span>
              <span className="text-purple-500 font-semibold">Logo Creator</span>
              <span className="text-slate-400">|</span>
              <span className="text-amber-500 font-semibold">3D Animator</span>
              <span className="text-slate-400">|</span>
              <span className="text-blue-500 font-semibold">AI Video Creator</span>
              <span className="text-slate-400">|</span>
              <span className="text-emerald-500 font-semibold">Video Editor</span>
            </div>

            {/* Cursive Golden Slogan */}
            <p className="font-cursive text-2xl sm:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 tracking-wide drop-shadow-[0_0_12px_rgba(234,179,8,0.4)]">
              "{hero?.creativeSlogan || 'Turning Imagination Into Extraordinary Digital Experiences.'}"
            </p>

            {/* Bio Description */}
            <p className={`text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {hero?.description ||
                'I create stunning designs, 3D logos, engaging videos and modern branding solutions that help your business grow and stand out.'}
            </p>

            {/* 3 CTA Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href={hero?.primaryButtonLink || '#portfolio'}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-[0_0_30px_rgba(59,130,246,0.45)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                <span>{hero?.primaryButtonText || 'Explore Portfolio'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => window.print()}
                className={`px-6 py-3 rounded-full border text-xs sm:text-sm font-semibold flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 transition-all ${
                  isDark
                    ? 'bg-white/[0.05] hover:bg-white/10 border-white/15 text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-sm'
                }`}
              >
                <FileDown className="w-4 h-4 text-cyan-500" />
                <span>Download CV / PDF</span>
              </button>

              <a
                href={hero?.secondaryButtonLink || '#contact'}
                className={`px-6 py-3 rounded-full border text-xs sm:text-sm font-semibold flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 transition-all ${
                  isDark
                    ? 'bg-white/[0.03] hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-amber-500" />
                <span>{hero?.secondaryButtonText || 'Contact Me'}</span>
              </a>
            </div>

            {/* Social Icons & Status Pill */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
              <div className="flex items-center gap-2.5">
                {[
                  { icon: Facebook, href: contact?.socialLinks.facebook || 'https://facebook.com', label: 'Facebook' },
                  { icon: Instagram, href: contact?.socialLinks.instagram || 'https://instagram.com', label: 'Instagram' },
                  { icon: Youtube, href: contact?.socialLinks.youtube || 'https://youtube.com', label: 'YouTube' },
                  { icon: Linkedin, href: contact?.socialLinks.linkedin || 'https://linkedin.com', label: 'LinkedIn' },
                ].map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <a
                      key={idx}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-cyan-400/50'
                          : 'bg-white border-slate-200 text-slate-700 hover:text-blue-600 shadow-sm'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>

              {/* Freelance Status Badge */}
              <a
                href={`https://wa.me/92${cleanNumber.startsWith('0') ? cleanNumber.slice(1) : cleanNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all transform hover:scale-105 ${
                  isDark
                    ? 'bg-[#0a1128]/90 border-emerald-500/40 text-slate-200 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{hero?.freelanceStatusText || 'Available for Freelance'}</span>
              </a>
            </div>

            {/* Counter Statistics Row */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              {stats.map((st, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500">
                    <AnimatedCounter target={st.value} suffix={st.suffix} />
                  </div>
                  <div className={`text-[11px] font-medium uppercase tracking-wider mt-0.5 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {st.label}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: 3D Core Visual & Interactive Experience */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            
            {/* View Mode Switcher (Interactive 3D Engine vs Official Portrait) */}
            <div className={`inline-flex items-center gap-1.5 p-1 rounded-full border mb-4 shadow-md ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setActiveTab('3d')}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === '3d'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Box className="w-3.5 h-3.5 text-cyan-300" />
                <span>3D Interactive Core</span>
              </button>
              <button
                onClick={() => setActiveTab('photo')}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'photo'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Artist Profile</span>
              </button>
            </div>

            {/* Interactive Showcase Card */}
            <TiltCard
              maxTilt={8}
              className={`w-full max-w-[420px] aspect-[4/5] rounded-[36px] p-2 border shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden group ${
                isDark
                  ? 'bg-gradient-to-tr from-blue-600/25 via-purple-600/20 to-amber-500/20 border-blue-500/40 shadow-[0_0_60px_rgba(59,130,246,0.3)]'
                  : 'bg-white/95 border-slate-200 shadow-2xl'
              }`}
            >
              {/* Inner ambient card background */}
              <div className={`absolute inset-0 rounded-[32px] overflow-hidden ${
                isDark
                  ? 'bg-gradient-to-b from-[#0e1738]/90 via-[#070b1f]/95 to-[#050714]'
                  : 'bg-gradient-to-b from-slate-50 via-white to-slate-100'
              }`} />

              {/* Floating Adobe Badges (Ps, Ai, Pr, Ae) */}
              <div className="absolute top-6 left-6 z-20 w-10 h-10 rounded-xl bg-[#001e36]/90 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center font-bold text-cyan-300 text-sm animate-float-slow">
                Ps
              </div>
              <div className="absolute top-6 right-6 z-20 w-10 h-10 rounded-xl bg-[#330000]/90 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center justify-center font-bold text-amber-300 text-sm animate-float-slow [animation-delay:1s]">
                Ai
              </div>
              <div className="absolute top-24 right-4 z-20 w-10 h-10 rounded-xl bg-[#330066]/90 border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center font-bold text-purple-300 text-sm animate-float-slow [animation-delay:2s]">
                Pr
              </div>

              {/* Top Crown & ZK 3D Emblem Halo */}
              <div className="relative z-10 pt-4 flex flex-col items-center">
                <div className="relative">
                  <div className="text-2xl text-amber-300 drop-shadow-[0_0_12px_rgba(234,179,8,0.8)]">👑</div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-purple-600/30 border-2 border-amber-400/60 p-1 shadow-[0_0_25px_rgba(234,179,8,0.5)] flex items-center justify-center my-1">
                    <span className="font-display font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">
                      ZK
                    </span>
                  </div>
                </div>

                <div className="font-cursive text-amber-400 text-lg mt-1 tracking-wider drop-shadow-md">
                  Design &bull; Edit &bull; Create &bull; Grow
                </div>
              </div>

              {/* Center Dynamic Area: Three.js Canvas OR Avatar Photo */}
              <div className="relative z-10 flex-1 flex items-center justify-center px-4 overflow-hidden">
                {activeTab === '3d' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Hero3DCanvas />
                  </div>
                ) : (
                  <div className="relative w-56 h-56 rounded-full p-1.5 bg-gradient-to-tr from-cyan-400 via-purple-500 to-amber-400 shadow-[0_0_35px_rgba(147,51,234,0.4)] group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={hero?.profileImageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'}
                      alt="Zakirullah"
                      className="w-full h-full object-cover rounded-full filter brightness-105 contrast-105"
                    />
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-ping opacity-20 pointer-events-none" />
                  </div>
                )}
              </div>

              {/* Bottom Badge: WhatsApp Contact Coordinate */}
              <div className="relative z-10 pb-5 px-4 flex justify-center">
                <a
                  href={`https://wa.me/92${cleanNumber.startsWith('0') ? cleanNumber.slice(1) : cleanNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all transform hover:scale-105 ${
                    isDark
                      ? 'bg-[#0a1128]/90 border-emerald-500/50 text-slate-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'bg-white border-emerald-300 text-slate-800 shadow-md'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-500 font-mono font-bold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {whatsappNumber}
                  </span>
                </a>
              </div>

            </TiltCard>
          </div>

        </div>

        {/* Scroll Indicator Arrow */}
        <div className="mt-12 flex flex-col items-center justify-center">
          <a
            href="#about"
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors animate-bounce"
          >
            <span className="text-[10px] uppercase font-mono tracking-widest">Scroll To Explore</span>
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
