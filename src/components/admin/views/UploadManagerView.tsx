import React, { useState, useRef } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { MediaFile } from '../../../types/index.ts';
import {
  UploadCloud,
  FileBox,
  Image,
  Video,
  FileText,
  Trash2,
  Download,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';

export const UploadManagerView: React.FC = () => {
  const { data, uploadFile, deleteFile } = useData();
  const media = data?.media || [];

  const [isDragging, setIsDragging] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadProgress(10);
    setUploadStatus(`Uploading ${files.length} file(s)...`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Size check (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 100MB size limit.`);
        continue;
      }
      setUploadProgress(Math.round(((i + 0.5) / files.length) * 100));
      await uploadFile(file);
    }

    setUploadProgress(100);
    setUploadStatus('Upload complete!');
    setTimeout(() => {
      setUploadProgress(null);
      setUploadStatus(null);
    }, 3000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const copyUrl = (url: string, id: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredMedia = media
    .filter((m) => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'all' || m.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return b.sizeBytes - a.sizeBytes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-cyan-400" />
            Upload Manager & Persistent Asset Storage
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Total {media.length} files stored &bull; Supports PNG, JPG, JPEG, WEBP, SVG, MP4, WEBM, and PDF (Max 100MB).
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Files</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
          isDragging
            ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
            : 'border-white/10 hover:border-blue-500/50 bg-[#090e24]/60'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-cyan-400">
          <UploadCloud className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">
          Drag & Drop Assets Here or Click to Browse
        </h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Files are permanently stored on server disk storage at <code className="text-cyan-300">/uploads</code>.
        </p>

        {/* Upload Progress Indicator */}
        {uploadProgress !== null && (
          <div className="w-full max-w-md mt-4">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>{uploadStatus}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {['all', 'image', 'video', 'logo', 'document'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                filterType === t
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-[#0d1433] border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none"
          >
            <option value="date">Sort: Recent</option>
            <option value="name">Sort: Name</option>
            <option value="size">Sort: Size</option>
          </select>
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredMedia.map((file) => (
          <div
            key={file.id}
            className="p-4 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 hover:border-purple-400/40 shadow-md transition-all flex flex-col justify-between group"
          >
            {/* File Preview Thumbnail */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 mb-3 flex items-center justify-center">
              {file.type === 'video' ? (
                <video src={file.url} className="w-full h-full object-cover" muted />
              ) : file.type === 'document' ? (
                <FileText className="w-12 h-12 text-blue-400" />
              ) : (
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
              )}

              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-cyan-300 uppercase">
                {file.format}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white truncate mb-0.5" title={file.name}>
                {file.name}
              </h4>
              <div className="text-[10px] text-slate-400 font-mono">
                {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB &bull; {file.type.toUpperCase()}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => copyUrl(file.url, file.id)}
                className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                title="Copy relative or absolute URL"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedId === file.id ? 'Copied!' : 'Copy URL'}</span>
              </button>

              <div className="flex items-center gap-1.5">
                <a
                  href={file.url}
                  download={file.name}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => deleteFile(file.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  title="Delete File"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredMedia.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm">
            No files found matching criteria.
          </div>
        )}
      </div>

    </div>
  );
};
