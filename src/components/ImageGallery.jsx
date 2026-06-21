import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ImageGallery = ({ images }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('backdrops');
  const [fullscreenImage, setFullscreenImage] = useState(null);

  if (!images || (!images.backdrops?.length && !images.posters?.length)) {
    return null;
  }

  const hasBackdrops = images.backdrops && images.backdrops.length > 0;
  const hasPosters = images.posters && images.posters.length > 0;

  // If the active tab has no images, fallback to the other
  const currentTab = (activeTab === 'backdrops' && !hasBackdrops) ? 'posters' : 
                     (activeTab === 'posters' && !hasPosters) ? 'backdrops' : activeTab;

  const currentImages = currentTab === 'backdrops' ? images.backdrops : images.posters;

  return (
    <div className="mt-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold border-l-4 border-blue-500 pl-3 uppercase tracking-widest text-sm flex items-center gap-2">
          <ImageIcon size={20} /> {t('imageGallery')}
        </h2>
        
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 self-start">
          {hasBackdrops && (
            <button
              onClick={() => setActiveTab('backdrops')}
              className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                currentTab === 'backdrops' 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('backdrops')} ({images.backdrops.length})
            </button>
          )}
          {hasPosters && (
            <button
              onClick={() => setActiveTab('posters')}
              className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                currentTab === 'posters' 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('posters')} ({images.posters.length})
            </button>
          )}
        </div>
      </div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {currentImages.slice(0, 20).map((img, index) => (
          <div 
            key={index} 
            className="break-inside-avoid cursor-pointer group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800"
            onClick={() => setFullscreenImage(`https://image.tmdb.org/t/p/original${img.file_path}`)}
          >
            <img 
              src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            </div>
          </div>
        ))}
      </div>

      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          onClick={() => setFullscreenImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenImage(null);
            }}
          >
            <X size={32} />
          </button>
          <img 
            src={fullscreenImage} 
            alt="Fullscreen view" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
