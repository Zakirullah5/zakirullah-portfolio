import React, { useState } from 'react';
import { useData } from '../../context/DataContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { TiltCard } from '../common/TiltCard.tsx';
import {
  Shield,
  Box,
  Sparkles,
  Video,
  Film,
  Palette,
  Layout,
  FileText,
  Image,
  Share2,
  Crown,
  Plus,
  MapPin,
  Clock,
  CheckCircle2,
  User,
  ArrowRight
} from 'lucide-react';
import { FullSkillsModal } from './FullSkillsModal.tsx';

export const AboutAndSkillsSection: React.FC = () => {
  const { data } = useData();
  const { isDark } = useTheme();
  const about = data?.about;
  const skills = data?.skills || [];
  const [isFullSkillsModalOpen, setIsFullSkillsModalOpen] = useState(false);

  const getSkillIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'shield': return <Shield className="w-5 h-5 text-blue-400" />;
      case 'box': return <Box className="w-5 h-5 text-cyan-400" />;
      case 'sparkles': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'video': return <Video className="w-5 h-5 text-blue-400" />;
      case 'film': return <Film className="w-5 h-5 text-purple-400" />;
      case 'palette': return <Palette className="w-5 h-5 text-pink-400" />;
      case 'layout': return <Layout className="w-5 h-5 text-indigo-400" />;
      case 'filetext': return <FileText className="w-5 h-5 text-sky-400" />;
      case 'image': return <Image className="w-5 h-5 text-emerald-400" />;
      case 'share2': return <Share2 className="w-5 h-5 text-cyan-400" />;
      case 'crown': return <Crown className="w-5 h-5 text-amber-400" />;
      default: return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  const featuredSkills = skills.slice(0, 11);

  return (
    <section id="about" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Card: About Me */}
          <TiltCard
            maxTilt={4}
            className={`lg:col-span-5 flex flex-col justify-between p-5 sm:p-8 rounded-[28px] sm:rounded-[32px] border shadow-2xl backdrop-blur-xl relative overflow-hidden ${
              isDark
                ? 'bg-gradient-to-b from-[#0e1633]/90 via-[#0a0f26]/95 to-[#060919] border-blue-500/25 shadow-[0_0_35px_rgba(59,130,246,0.15)]'
                : 'bg-white/95 border-slate-200 shadow-xl'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <h2 className={`text-2xl sm:text-3xl font-display font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  About Me
                </h2>
              </div>

              <p className={`text-sm leading-relaxed font-normal mb-4 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {about?.bioParagraph1 ||
                  "Hi, I'm Zakirullah, a passionate Graphic Designer, Video Editor and Creative Artist from Pakistan. I have years of experience in designing logos, banners, videos and branding solutions. I love turning ideas into creative and professional visuals that make an impact."}
              </p>

              {about?.bioParagraph2 && (
                <p className={`text-xs leading-relaxed font-normal mb-6 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {about.bioParagraph2}
                </p>
              )}

              {/* 4 Details Grid */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3 my-6">
                <div className={`p-3 rounded-2xl border flex items-center gap-2.5 min-w-0 ${
                  isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Name</div>
                    <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{about?.name || 'Zakirullah'}</div>
                  </div>
                </div>

                <div className={`p-3 rounded-2xl border flex items-center gap-2.5 min-w-0 ${
                  isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Location</div>
                    <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{about?.location || 'Tangi, Charsadda'}</div>
                  </div>
                </div>

                <div className={`p-3 rounded-2xl border flex items-center gap-2.5 min-w-0 ${
                  isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Experience</div>
                    <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{about?.experience || '3+ Years'}</div>
                  </div>
                </div>

                <div className={`p-3 rounded-2xl border flex items-center gap-2.5 min-w-0 ${
                  isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Freelance</div>
                    <div className="text-xs font-bold text-emerald-500 truncate">{about?.availability || 'Available'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Signature & Portrait Frame */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Creative Signature
                </div>
                <div className="font-cursive text-2xl sm:text-4xl text-amber-500 tracking-wider mt-1 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                  Zakirullah
                </div>
              </div>

              {/* Glowing Profile Portrait Mini-Frame */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-cyan-400 to-purple-600 shadow-md flex-shrink-0">
                <img
                  src={about?.profileImageUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'}
                  alt="Zakirullah"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center border border-white">
                  ZK
                </span>
              </div>
            </div>

          </TiltCard>

          {/* Right Card: My Skills (56+ Professional Skills) */}
          <TiltCard
            maxTilt={4}
            className={`lg:col-span-7 flex flex-col justify-between p-5 sm:p-8 rounded-[28px] sm:rounded-[32px] border shadow-2xl backdrop-blur-xl relative overflow-hidden ${
              isDark
                ? 'bg-gradient-to-b from-[#0e1633]/90 via-[#0a0f26]/95 to-[#060919] border-purple-500/25 shadow-[0_0_35px_rgba(168,85,247,0.15)]'
                : 'bg-white/95 border-slate-200 shadow-xl'
            }`}
          >
            <div>
              {/* Header with 56+ Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className={`text-2xl sm:text-3xl font-display font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    My Skills
                  </h2>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Mastery across graphic design, 3D, and video production
                  </p>
                </div>

                <div className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/40 text-cyan-400 text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>56+ Professional Skills</span>
                </div>
              </div>

              {/* 3D Skills Grid (11 Featured + 1 More Skills Trigger) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {featuredSkills.map((sk) => (
                  <TiltCard
                    key={sk.id}
                    maxTilt={12}
                    scale={1.04}
                    onClick={() => setIsFullSkillsModalOpen(true)}
                    className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center cursor-pointer ${
                      isDark
                        ? 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5 hover:border-blue-400/40'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-blue-300 shadow-sm'
                    }`}
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                      {getSkillIcon(sk.icon || sk.title)}
                    </div>
                    <span className={`text-xs font-semibold line-clamp-1 ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {sk.title}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      {sk.proficiency}%
                    </span>
                  </TiltCard>
                ))}

                {/* Card 12: "+ More Skills" Button */}
                <TiltCard
                  maxTilt={12}
                  scale={1.04}
                  onClick={() => setIsFullSkillsModalOpen(true)}
                  className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-purple-400/40 hover:border-purple-300 text-center flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-md group/btn"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center mb-2 group-hover/btn:rotate-90 transition-transform">
                    <Plus className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover/btn:text-amber-300 transition-colors">
                    + More Skills
                  </span>
                  <span className="text-[10px] text-purple-300/80 mt-0.5">
                    View All 56+
                  </span>
                </TiltCard>
              </div>
            </div>

            {/* Bottom Summary Bar */}
            <div className="pt-4 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-slate-400">
              <span>Includes 2D/3D Logo Animation, VFX, Reels, and AI Prompts</span>
              <button
                onClick={() => setIsFullSkillsModalOpen(true)}
                className="text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-1 transition-colors min-h-[36px]"
              >
                <span>Full Skill Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </TiltCard>

        </div>
      </div>

      {/* 56+ Skills Modal */}
      <FullSkillsModal
        isOpen={isFullSkillsModalOpen}
        onClose={() => setIsFullSkillsModalOpen(false)}
      />
    </section>
  );
};
