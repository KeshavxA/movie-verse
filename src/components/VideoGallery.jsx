import { useState, useEffect } from "react";
import { PlayCircle } from "lucide-react";

const VideoGallery = ({ videos }) => {
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    if (videos && videos.length > 0) {

      const trailer = videos.find(v => v.type === "Trailer") || videos[0];
      setActiveVideo(trailer);
    }
  }, [videos]);

  if (!videos || videos.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-6 border-l-4 border-red-500 pl-3 uppercase tracking-widest text-sm">
        Videos & Trailers
      </h2>

      {activeVideo && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-black mb-6">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${activeVideo.key}?autoplay=0`}
            title={activeVideo.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {videos.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {videos.map((video) => (
            <button
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className={`flex-shrink-0 w-48 relative group rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeVideo?.id === video.id
                  ? "border-blue-500 scale-105 shadow-lg shadow-blue-500/20"
                  : "border-transparent hover:border-slate-400 dark:hover:border-slate-600 opacity-70 hover:opacity-100"
                }`}
            >
              <img
                src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                alt={video.name}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <PlayCircle
                  size={36}
                  className={`text-white transition-transform ${activeVideo?.id === video.id ? "scale-110" : "opacity-80 group-hover:opacity-100 group-hover:scale-110"}`}
                />
              </div>
              <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                {video.type}
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black to-transparent p-2 pt-6">
                <p className="text-white text-xs font-medium truncate">{video.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
