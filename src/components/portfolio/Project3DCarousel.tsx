import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext.tsx';
import { Project } from '../../types/index.ts';
import { ChevronLeft, ChevronRight, Play, ExternalLink, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.tsx';

interface Project3DCarouselProps {
  onSelectProject: (project: Project) => void;
}

export const Project3DCarousel: React.FC<Project3DCarouselProps> = ({ onSelectProject }) => {
  const { data } = useData();
  const { isDark } = useTheme();
  const projects = (data?.projects || []).filter((p) => p.published);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = projects.length;
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(interval);
  }, [total, isPaused]);

  if (total === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  // Visible items: current - 1, current, current + 1
  const getCardOffset = (index: number) => {
    let diff = index - currentIndex;
    if (diff < -Math.floor(total / 2)) diff += total;
    if (diff > Math.floor(total / 2)) diff -= total;
    return diff;
  };

  return (
    <div
      className="relative py-4 sm:py-8 overflow-hidden select-none max-w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Perspective Stage Container */}
      <div className="relative h-[380px] sm:h-[480px] max-w-5xl mx-auto flex items-center justify-center perspective-1000 overflow-hidden sm:overflow-visible">
        {projects.map((project, idx) => {
          const offset = getCardOffset(idx);
          const isCenter = offset === 0;

          // On mobile, only show center and immediate 1 neighbor to prevent horizontal overflow
          if (isMobile ? Math.abs(offset) > 1 : Math.abs(offset) > 2) return null;

          // Compute 3D translation & rotation adapted for screen width
          const translateX = isMobile ? offset * 92 : offset * 260; // px
          const translateZ = isCenter ? (isMobile ? 25 : 80) : (isMobile ? -60 : -100) * Math.abs(offset);
          const rotateY = isMobile ? offset * -10 : offset * -18; // deg
          const opacity = isCenter ? 1 : Math.abs(offset) === 1 ? (isMobile ? 0.4 : 0.65) : 0.2;
          const scale = isCenter ? 1 : isMobile ? 0.78 : 0.85;

          const isVideo = !!project.videoUrl || project.category.includes('Video') || project.category.includes('Animated');

          return (
            <div
              key={project.id}
              onClick={() => {
                if (isCenter) onSelectProject(project);
                else setCurrentIndex(idx);
              }}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex: isCenter ? 30 : 20 - Math.abs(offset),
                transition: 'all 0.45s cubic-bezier(0.2, 0.9, 0.3, 1)',
                willChange: 'transform, opacity',
              }}
              className={`absolute w-[245px] xs:w-[270px] sm:w-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl border ${
                isCenter
                  ? 'border-blue-500/50 shadow-[0_20px_50px_rgba(59,130,246,0.35)]'
                  : 'border-white/10 hover:border-white/20'
              } ${isDark ? 'bg-[#090e24]' : 'bg-white'}`}
            >
              {/* Media Preview Box */}
              <div className="relative aspect-[16/10] bg-black overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Top Category Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-cyan-300 text-[11px] font-bold">
                  {project.category}
                </div>

                {/* Video Play Badge */}
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-600/90 border-2 border-white/80 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Meta Content */}
              <div className="p-4 sm:p-5">
                <h3 className={`text-sm sm:text-base font-display font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {project.title}
                </h3>
                <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {project.description}
                </p>

                <div className="pt-3.5 sm:pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium truncate max-w-[120px]">{project.client || 'Creative Studio'}</span>
                  <span className="text-blue-500 font-bold flex items-center gap-1 flex-shrink-0">
                    <span>Inspect</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 relative z-40 px-4">
        <button
          onClick={handlePrev}
          className="p-2.5 sm:p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all transform active:scale-95 shadow-md flex-shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center"
          title="Previous Project"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel Dots */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 max-w-[190px] xs:max-w-[260px] sm:max-w-none overflow-x-auto scrollbar-none">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                currentIndex === i ? 'w-6 bg-gradient-to-r from-blue-500 to-purple-500' : 'w-2 bg-slate-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all transform active:scale-95 shadow-md"
          title="Next Project"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
