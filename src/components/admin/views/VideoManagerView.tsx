import React, { useState, useRef } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { Video, UploadCloud, Trash2, Play, Download, Search, X } from 'lucide-react';

export const VideoManagerView: React.FC = () => {
  const { data, uploadFile, deleteFile } = useData();
  const videos = (data?.media || []).filter((m) => m.type === 'video');
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-pink-400" />
            Video Content Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Total {videos.length} videos hosted &bull; Upload MP4/WEBM, preview playback, attach to portfolio projects.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer min-h-[42px]"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload MP4 Video</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="p-4 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 flex flex-col justify-between"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black mb-3 flex items-center justify-center group">
              <video src={vid.url} className="w-full h-full object-cover" />
              <button
                onClick={() => setActiveVideo(vid.url)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white truncate mb-1">
                {vid.name}
              </h4>
              <div className="text-[10px] text-slate-400 font-mono">
                {(vid.sizeBytes / 1024 / 1024).toFixed(2)} MB &bull; {vid.format.toUpperCase()}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5">
              <a
                href={vid.url}
                download={vid.name}
                className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
              <button
                onClick={() => deleteFile(vid.id)}
                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden border border-white/20">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/70 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <video src={activeVideo} controls autoPlay className="w-full aspect-video" />
          </div>
        </div>
      )}
    </div>
  );
};
