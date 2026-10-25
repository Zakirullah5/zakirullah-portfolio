import React, { useState } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { Project } from '../../../types/index.ts';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  UploadCloud,
  Check,
  X,
  Play,
  Film,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export const PortfolioManagerView: React.FC = () => {
  const { data, addProject, updateProject, deleteProject, uploadFile, isSaving } = useData();
  const projects = data?.projects || [];

  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const categories: Project['category'][] = [
    'Logo Design',
    '3D Logo',
    'Animated Logo',
    'AI Video',
    'Advertisement Video',
    'Graphic Design',
    'Banner Design',
    'CV Design',
    'Image Editing',
    'Video Editing',
    'Other Projects'
  ];

  const handleStartCreate = () => {
    setEditingProject({
      title: '',
      category: 'Logo Design',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
      videoUrl: '',
      client: 'Creative Client',
      order: projects.length + 1,
      published: true,
      featured: false,
      tags: ['Design', 'Creative']
    });
    setIsCreatingNew(true);
  };

  const handleStartEdit = (proj: Project) => {
    setEditingProject({ ...proj });
    setIsCreatingNew(false);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) return;

    if (isCreatingNew) {
      await addProject(editingProject as any);
    } else if (editingProject.id) {
      await updateProject(editingProject.id, editingProject);
    }

    setEditingProject(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isVideo = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    const res = await uploadFile(file);
    if (res.success && res.url) {
      if (isVideo) {
        setEditingProject((prev) => ({ ...prev, videoUrl: res.url }));
      } else {
        setEditingProject((prev) => ({ ...prev, imageUrl: res.url }));
      }
    }
    setUploadingMedia(false);
  };

  const filteredProjects = projects.filter((p) => {
    if (selectedCategoryFilter === 'All') return true;
    return p.category === selectedCategoryFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            Portfolio Projects Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Total {projects.length} projects live &bull; Complete control over images, videos, descriptions, and publication status.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategoryFilter('All')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategoryFilter === 'All'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          All ({projects.length})
        </button>
        {categories.map((cat) => {
          const count = projects.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={`rounded-3xl overflow-hidden bg-[#090e24]/90 border transition-all flex flex-col justify-between ${
              project.published ? 'border-blue-500/20' : 'border-red-500/30 opacity-70'
            }`}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-black overflow-hidden group">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              {project.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-blue-600/80 text-white flex items-center justify-center">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
              )}
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-cyan-300 font-bold">
                {project.category}
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={() => updateProject(project.id, { published: !project.published })}
                  className={`p-1.5 rounded-lg text-xs ${
                    project.published ? 'bg-emerald-500/80 text-white' : 'bg-red-500/80 text-white'
                  }`}
                  title={project.published ? 'Published' : 'Hidden'}
                >
                  {project.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1 line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  Order #{project.order}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(project)}
                    className="p-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
            onClick={() => setEditingProject(null)}
          />

          <div className="relative w-full max-w-2xl my-auto bg-gradient-to-b from-[#111736] via-[#0c122e] to-[#070b1e] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-xl font-display font-bold text-white">
                {isCreatingNew ? 'Add New Project' : 'Edit Project Details'}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="overflow-y-auto pr-1 py-4 space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Project Title</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400"
                  placeholder="e.g. 3D Gold ZK Crown Emblem"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Category</label>
                  <select
                    value={editingProject.category || 'Logo Design'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-[#0e1533] border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Client / Brand</label>
                  <input
                    type="text"
                    value={editingProject.client || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                    placeholder="e.g. Apex Gaming"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Project Description</label>
                <textarea
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                  placeholder="Describe the aesthetic, tools, and technical delivery..."
                />
              </div>

              {/* Image Upload / URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Project Image / Thumbnail</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingProject.imageUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                    placeholder="Image URL"
                  />
                  <label className="px-4 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Video Upload / URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Project Video URL (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingProject.videoUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value })}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                    placeholder="https://...mp4 or YouTube / Vimeo"
                  />
                  <label className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                    <Film className="w-4 h-4" />
                    <span>Upload Video</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Publication Status & Featured */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingProject.published ?? true}
                    onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-500"
                  />
                  <span>Publish to live website immediately</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingProject.featured ?? false}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-amber-500"
                  />
                  <span>Mark as Featured Project</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || uploadingMedia}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs shadow-lg"
                >
                  {isCreatingNew ? 'Create Project' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
