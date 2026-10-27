import React, { useState } from 'react';
import { useData } from '../../context/DataContext.tsx';
import { X, Search, Sparkles, CheckCircle2 } from 'lucide-react';

interface FullSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullSkillsModal: React.FC<FullSkillsModalProps> = ({ isOpen, onClose }) => {
  const { data } = useData();
  const skills = data?.skills || [];
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Design', '3D & Animation', 'Video & AI', 'Branding & Social'];

  const filteredSkills = skills.filter((sk) => {
    const matchesSearch = sk.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sk.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl my-auto bg-gradient-to-b from-[#101736]/95 via-[#0b1029]/98 to-[#060918] border border-purple-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-[0_0_60px_rgba(147,51,234,0.3)] backdrop-blur-2xl text-white z-10 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 sm:pb-5 border-b border-white/10 flex-shrink-0 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400 flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-lg sm:text-2xl font-display font-bold text-white">
                56+ Professional Creative Skills
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-1 sm:line-clamp-none">
              Explore Zakirullah's full spectrum of design, video post-production, 3D, and AI toolsets.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5 flex-shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Close skills modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-shrink-0">
          {/* Category Tabs: Horizontally scrollable on mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none w-full sm:w-auto -mx-1 px-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] flex-shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search skills (e.g. 3D, Reel, Logo)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 focus:border-purple-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 min-h-[40px]"
            />
          </div>
        </div>

        {/* Skills Grid - Scrollable */}
        <div className="overflow-y-auto pr-1 flex-1 py-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {filteredSkills.map((sk) => (
            <div
              key={sk.id}
              className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-purple-400/30 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {sk.title}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-amber-400 ml-2 flex-shrink-0">
                  {sk.proficiency}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${sk.proficiency}%` }}
                />
              </div>

              <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                <span>{sk.category}</span>
                <span className="text-slate-400">Expertise Level</span>
              </div>
            </div>
          ))}

          {filteredSkills.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 text-sm">
              No skills found matching "{search}".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 sm:pt-4 border-t border-white/10 flex flex-col xs:flex-row items-center justify-between gap-2.5 text-xs text-slate-400 flex-shrink-0">
          <span className="text-[11px] sm:text-xs text-center xs:text-left">Showing {filteredSkills.length} of {skills.length} specialized skills</span>
          <button
            onClick={onClose}
            className="w-full xs:w-auto px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs min-h-[40px] flex items-center justify-center cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
