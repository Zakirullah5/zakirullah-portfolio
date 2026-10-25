import React, { useState } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { Skill } from '../../../types/index.ts';
import { Sparkles, Plus, Edit2, Trash2, Eye, EyeOff, X, Save, Search } from 'lucide-react';

export const SkillsManagerView: React.FC = () => {
  const { data, addSkill, updateSkill, deleteSkill, isSaving } = useData();
  const skills = data?.skills || [];

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const categories: Skill['category'][] = [
    'Design',
    '3D & Animation',
    'Video & AI',
    'Branding & Social',
    'Other'
  ];

  const handleStartCreate = () => {
    setEditingSkill({
      title: '',
      category: 'Design',
      icon: 'Sparkles',
      proficiency: 95,
      visible: true,
      order: skills.length + 1
    });
    setIsCreatingNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.title) return;

    if (isCreatingNew) {
      await addSkill(editingSkill as any);
    } else if (editingSkill.id) {
      await updateSkill(editingSkill.id, editingSkill);
    }
    setEditingSkill(null);
  };

  const filteredSkills = skills.filter((sk) => {
    const matchesSearch = sk.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'All' || sk.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Skills Management (Unlimited Skills Engine)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Total {skills.length} skills registered &bull; Manage proficiency percentages, 3D cards, and display order.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCat === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSkills.map((sk) => (
          <div
            key={sk.id}
            className={`p-4 rounded-2xl bg-[#090e24]/90 border transition-all flex flex-col justify-between ${
              sk.visible ? 'border-blue-500/20' : 'border-red-500/30 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase">
                  {sk.category}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateSkill(sk.id, { visible: !sk.visible })}
                    className={`p-1 rounded-lg text-xs ${
                      sk.visible ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {sk.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingSkill(sk);
                      setIsCreatingNew(false);
                    }}
                    className="p-1 rounded-lg text-blue-300 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteSkill(sk.id)}
                    className="p-1 rounded-lg text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mb-2">
                {sk.title}
              </h4>

              {/* Progress */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-amber-400 rounded-full"
                  style={{ width: `${sk.proficiency}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5 mt-2">
              <span>Proficiency</span>
              <span className="text-amber-400 font-mono font-bold">{sk.proficiency}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setEditingSkill(null)} />
          <div className="relative w-full max-w-md my-auto bg-[#0d1433] border border-purple-500/40 rounded-3xl p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white">
                {isCreatingNew ? 'Add New Skill' : 'Edit Skill'}
              </h3>
              <button onClick={() => setEditingSkill(null)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Skill Name</label>
                <input
                  type="text"
                  required
                  value={editingSkill.title || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Category</label>
                <select
                  value={editingSkill.category || 'Design'}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#0a0f29] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span className="uppercase font-semibold">Proficiency Rating</span>
                  <span className="font-mono text-amber-400 font-bold">{editingSkill.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={editingSkill.proficiency || 90}
                  onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: Number(e.target.value) })}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
