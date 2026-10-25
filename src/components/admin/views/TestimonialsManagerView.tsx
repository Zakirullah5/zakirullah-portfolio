import React, { useState } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { Testimonial } from '../../../types/index.ts';
import { MessageSquare, Plus, Edit2, Trash2, Eye, EyeOff, Star, X } from 'lucide-react';

export const TestimonialsManagerView: React.FC = () => {
  const { data, addTestimonial, updateTestimonial, deleteTestimonial, isSaving } = useData();
  const testimonials = data?.testimonials || [];

  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const handleStartCreate = () => {
    setEditing({
      name: '',
      role: 'Business Owner',
      company: 'Client Brand',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      review: '',
      rating: 5,
      show: true,
      date: new Date().toISOString().split('T')[0]
    });
    setIsNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !editing.name) return;
    if (isNew) {
      await addTestimonial(editing as any);
    } else if (editing.id) {
      await updateTestimonial(editing.id, editing);
    }
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-pink-400" />
            Client Testimonials Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Add client reviews, ratings, company names, avatars, and control their visibility on the public site.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((test) => (
          <div
            key={test.id}
            className={`p-5 rounded-3xl bg-[#090e24]/90 border transition-all flex flex-col justify-between ${
              test.show ? 'border-blue-500/20' : 'border-red-500/30 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-amber-400 text-xs">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateTestimonial(test.id, { show: !test.show })}
                    className={`p-1.5 rounded-lg text-xs ${
                      test.show ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {test.show ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(test);
                      setIsNew(false);
                    }}
                    className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTestimonial(test.id)}
                    className="p-1.5 rounded-lg bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic mb-4 leading-relaxed">
                "{test.review}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-white/5">
              <img
                src={test.avatar}
                alt={test.name}
                className="w-10 h-10 rounded-full object-cover border border-white/10"
              />
              <div>
                <div className="text-xs font-bold text-white">{test.name}</div>
                <div className="text-[10px] text-slate-400">{test.role} &bull; {test.company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-md my-auto bg-[#0d1433] border border-purple-500/40 rounded-3xl p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white">
                {isNew ? 'Add Testimonial' : 'Edit Testimonial'}
              </h3>
              <button onClick={() => setEditing(null)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Client Name</label>
                <input
                  type="text"
                  required
                  value={editing.name || ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Role</label>
                  <input
                    type="text"
                    value={editing.role || ''}
                    onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Company</label>
                  <input
                    type="text"
                    value={editing.company || ''}
                    onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Review Text</label>
                <textarea
                  rows={3}
                  required
                  value={editing.review || ''}
                  onChange={(e) => setEditing({ ...editing, review: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Avatar Image URL</label>
                <input
                  type="text"
                  value={editing.avatar || ''}
                  onChange={(e) => setEditing({ ...editing, avatar: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
