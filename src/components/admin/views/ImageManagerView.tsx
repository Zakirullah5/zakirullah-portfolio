import React, { useState, useRef } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { Image, UploadCloud, Trash2, Eye, Download, Search, Sparkles } from 'lucide-react';

export const ImageManagerView: React.FC = () => {
  const { data, uploadFile, deleteFile } = useData();
  const images = (data?.media || []).filter((m) => m.type === 'image' || m.type === 'logo');
  const [search, setSearch] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i]);
    }
  };

  const filtered = images.filter((img) => img.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Image className="w-5 h-5 text-amber-400" />
            Image & Graphics Gallery Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Total {images.length} image assets &bull; Upload, replace, inspect dimensions, and delete images safely.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Images</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((img) => (
          <div
            key={img.id}
            className="p-3 rounded-2xl bg-[#090e24]/90 border border-blue-500/20 flex flex-col justify-between group"
          >
            <div
              onClick={() => setPreviewImage(img.url)}
              className="relative aspect-square rounded-xl overflow-hidden bg-black/50 mb-2 cursor-pointer flex items-center justify-center"
            >
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Eye className="w-6 h-6" />
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-white truncate" title={img.name}>
                {img.name}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {(img.sizeBytes / 1024 / 1024).toFixed(2)} MB &bull; {img.format.toUpperCase()}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/5">
              <a
                href={img.url}
                download={img.name}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </a>
              <button
                onClick={() => deleteFile(img.id)}
                className="p-1 rounded text-red-400 hover:bg-red-500/20"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Preview */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" onClick={() => setPreviewImage(null)}>
          <div className="max-w-3xl max-h-[85vh] p-2 bg-[#0d1430] border border-white/20 rounded-2xl overflow-hidden">
            <img src={previewImage} alt="Preview" className="w-full h-full object-contain max-h-[80vh] rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
};
