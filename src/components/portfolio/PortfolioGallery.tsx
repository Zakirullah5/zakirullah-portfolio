import React, { useState } from 'react';
import { useData } from '../../context/DataContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { Project } from '../../types/index.ts';
import { Project3DCarousel } from './Project3DCarousel.tsx';
import { TiltCard } from '../common/TiltCard.tsx';
import { Play, Eye, ExternalLink, X, Sparkles, Filter, Film } from 'lucide-react';

export const PortfolioGallery: React.FC = () => {
  const { data } = useData();
  const { isDark } = useTheme();
  const projects = data?.projects || [];
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const filterTabs = [
    'All',
    'Logo Designs',
    '3D Logos',
    'Animated Logos',
    'AI Videos',
    'Ads Videos',
    'Banners',
    'CV Designs',
    'Image Editing'
  ];

  const matchesCategory = (proj: Project, filter: string) => {
    if (filter === 'All') return true;
    if (filter === 'Logo Designs' && proj.category === 'Logo Design') return true;
    if (filter === '3D Logos' && proj.category === '3D Logo') return true;
    if (filter === 'Animated Logos' && proj.category === 'Animated Logo') return true;
    if (filter === 'AI Videos' && proj.category === 'AI Video') return true;
    if (filter === 'Ads Videos' && (proj.category === 'Advertisement Video' || proj.category === 'Video Editing')) return true;
    if (filter === 'Banners' && proj.category === 'Banner Design') return true;
    if (filter === 'CV Designs' && proj.category === 'CV Design') return true;
    if (filter === 'Image Editing' && proj.category === 'Image Editing') return true;
    return proj.category.toLowerCase().includes(filter.toLowerCase().replace('s', ''));
  };

  const filteredProjects = projects.filter((p) => p.published && matchesCategory(p, selectedFilter));

  return (
    <section id="portfolio" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold mb-2 ${
              isDark ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Showcase of Excellence</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              My Portfolio
            </h2>
          </div>

          <p className={`text-xs sm:text-sm max-w-md ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Explore our curated 3D slider and filtered gallery. Click on any project to view high-resolution details or video playback.
          </p>
        </div>

        {/* 1. 3D Project Slider / Carousel Component */}
        <div className="mb-12">
          <Project3DCarousel onSelectProject={(p) => setActiveProject(p)} />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedFilter === tab
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/50'
                  : isDark
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/5'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Portfolio Cards Grid with TiltCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isVideo = !!project.videoUrl || project.category.includes('Video') || project.category.includes('Animated');

            return (
              <TiltCard
                key={project.id}
                maxTilt={6}
                scale={1.03}
                onClick={() => setActiveProject(project)}
                className={`rounded-3xl overflow-hidden border shadow-xl transition-all duration-300 cursor-pointer flex flex-col ${
                  isDark
                    ? 'bg-gradient-to-b from-[#0e1633] to-[#070b1e] border-blue-500/20 hover:border-purple-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                    : 'bg-white border-slate-200 hover:border-blue-400 shadow-lg'
                }`}
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  {/* Video Play Badge if Video */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-blue-600/80 border-2 border-white/80 text-white flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.7)] group-hover:scale-125 transition-transform backdrop-blur-sm">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Top Category Badge */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-cyan-300 text-[11px] font-semibold tracking-wide">
                    {project.category}
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className={`text-base font-display font-bold transition-colors ${
                      isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-blue-600'
                    }`}>
                      {project.title}
                    </h3>
                    <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {project.description}
                    </p>
                  </div>

                  {/* Footer Meta */}
                  <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
                    <span>{project.client || 'Creative Studio'}</span>
                    <span className="text-blue-500 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-sm">
            No projects in this category yet.
          </div>
        )}
      </div>

      {/* Project Lightbox & Video Player Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-xl"
            onClick={() => setActiveProject(null)}
          />

          <div className={`relative w-full max-w-3xl my-auto rounded-3xl overflow-hidden shadow-2xl z-10 border ${
            isDark ? 'bg-gradient-to-b from-[#101736] to-[#070b1e] border-purple-500/30' : 'bg-white border-slate-200'
          }`}>
            {/* Close Button */}
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Area */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {activeProject.videoUrl ? (
                <video
                  src={activeProject.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={activeProject.imageUrl}
                  alt={activeProject.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Details Area */}
            <div className="p-6">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 text-xs font-semibold mb-2">
                {activeProject.category}
              </div>
              <h3 className={`text-2xl font-display font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {activeProject.title}
              </h3>
              <p className={`text-sm mt-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {activeProject.description}
              </p>

              {activeProject.tags && activeProject.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                  {activeProject.tags.map((tag, i) => (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded-lg text-xs ${
                        isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
