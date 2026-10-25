import React, { useState } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { Service } from '../../../types/index.ts';
import { Settings2, Plus, Edit2, Trash2, Eye, EyeOff, X, Save, ArrowRight } from 'lucide-react';

export const ServicesManagerView: React.FC = () => {
  const { data, addService, updateService, deleteService, isSaving } = useData();
  const services = data?.services || [];

  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const iconsList = ['Shield', 'Box', 'PlayCircle', 'Sparkles', 'Film', 'Palette', 'Video', 'Layout'];

  const handleStartCreate = () => {
    setEditingService({
      title: '',
      description: '',
      icon: 'Sparkles',
      price: 15,
      currency: 'USD',
      discount: 0,
      show: true,
      order: services.length + 1
    });
    setIsCreatingNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title) return;

    if (isCreatingNew) {
      await addService(editingService as any);
    } else if (editingService.id) {
      await updateService(editingService.id, editingService);
    }
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-purple-400" />
            Services Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Total {services.length} services &bull; Manage title, pricing, discounts, icons, and visibility on the public portfolio.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {services.map((service) => (
          <div
            key={service.id}
            className={`p-5 rounded-3xl bg-[#090e24]/90 border transition-all flex flex-col justify-between ${
              service.show ? 'border-blue-500/20' : 'border-red-500/30 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase font-mono">
                  From ${service.price}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateService(service.id, { show: !service.show })}
                    className={`p-1.5 rounded-lg text-xs ${
                      service.show ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}
                    title={service.show ? 'Visible' : 'Hidden'}
                  >
                    {service.show ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingService(service);
                      setIsCreatingNew(false);
                    }}
                    className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mb-1.5">
                {service.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">Icon: {service.icon}</span>
              <span className="text-blue-400 font-medium">Order #{service.order}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setEditingService(null)} />
          <div className="relative w-full max-w-lg my-auto bg-gradient-to-b from-[#111736] to-[#070b1e] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {isCreatingNew ? 'Add Service' : 'Edit Service'}
              </h3>
              <button onClick={() => setEditingService(null)} className="p-1.5 rounded-lg bg-white/5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Starting Price ($)</label>
                <input
                  type="number"
                  required
                  value={editingService.price || 10}
                  onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Description</label>
                <textarea
                  rows={3}
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Icon Design</label>
                <select
                  value={editingService.icon || 'Sparkles'}
                  onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0e1533] border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                >
                  {iconsList.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  checked={editingService.show ?? true}
                  onChange={(e) => setEditingService({ ...editingService, show: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-500"
                />
                <span className="text-xs text-slate-300">Show on public portfolio website</span>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
