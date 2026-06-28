import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Folder, Trash2, List, Share2, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import { useWatchlist } from "../context/WatchlistContext";
import { useLanguage } from "../context/LanguageContext";

const Watchlist = ({ searchTerm, setSearchTerm }) => {
  const { playlists, toggleWatchlist, isInAnyPlaylist, deletePlaylist } = useWatchlist();
  const [activePlaylistId, setActivePlaylistId] = useState('default');
  const [copiedShare, setCopiedShare] = useState(false);
  const { t } = useLanguage();

  const activePlaylist = playlists.find(p => p.id === activePlaylistId) || playlists[0];

  const handleDeletePlaylist = (id) => {
    if (confirm("Are you sure you want to delete this collection?")) {
      deletePlaylist(id);
      if (activePlaylistId === id) {
        setActivePlaylistId('default');
      }
    }
  };

  const handleShareCollection = async () => {
    if (!activePlaylist || activePlaylist.items.length === 0) return;
    const itemsParam = activePlaylist.items
      .map(item => `${item.media_type === 'tv' ? 't' : 'm'}:${item.id}`)
      .join(',');
    
    const url = new URL(window.location.origin + '/shared');
    url.searchParams.set('name', activePlaylist.name);
    url.searchParams.set('items', itemsParam);
    
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="max-w-7xl mx-auto p-6 md:p-10 flex flex-col md:flex-row gap-8">

        <div className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Folder size={20} className="text-blue-500" /> {t('collections')}
          </h2>
          <div className="space-y-2">
            {playlists.map(playlist => (
              <div
                key={playlist.id}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${activePlaylistId === playlist.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400'
                  }`}
                onClick={() => setActivePlaylistId(playlist.id)}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <List size={16} />
                  <span className="font-medium truncate">{playlist.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${activePlaylistId === playlist.id ? 'bg-blue-700/50' : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                    {playlist.items.length}
                  </span>
                  {playlist.id !== 'default' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(playlist.id); }}
                      className={`p-1 rounded transition-colors ${activePlaylistId === playlist.id ? 'hover:bg-red-500/80 text-white' : 'hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-500/20 text-slate-400'
                        }`}
                      title="Delete Collection"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <header className="mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-300 dark:to-slate-500 bg-clip-text text-transparent flex items-center gap-4">
                {activePlaylist?.name}
              </h2>
              {activePlaylist?.items.length > 0 && (
                <button 
                  onClick={handleShareCollection}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full font-bold text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  {copiedShare ? (
                    <><Check size={16} className="text-green-500" /> Copied Link</>
                  ) : (
                    <><Share2 size={16} /> Share Collection</>
                  )}
                </button>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg">
              {activePlaylist?.items.length} {activePlaylist?.items.length === 1 ? "item" : "items"} saved
            </p>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {activePlaylist?.items.length > 0 ? (
              activePlaylist.items.map((item) => (
                <div key={`${item.media_type || 'movie'}-${item.id}`} className="relative block group">
                  <Link to={`/${item.media_type || 'movie'}/${item.id}`}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 border border-slate-200 dark:border-slate-800 group-hover:border-blue-500/50">
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <img
                          src={item.poster_path
                            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                            : "https://via.placeholder.com/500x750?text=No+Poster"}
                          alt={item.title || item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-yellow-600 dark:text-yellow-400 border border-slate-200 dark:border-white/10 shadow-sm">
                          ⭐ {item.vote_average?.toFixed(1)}
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-sm md:text-base truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.title || item.name}
                        </h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                            {(item.release_date || item.first_air_date) ? (item.release_date || item.first_air_date).split('-')[0] : "N/A"}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            {t('details')} →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWatchlist(item);
                    }}
                    className="absolute top-3 left-3 z-10 p-2 bg-white/90 hover:bg-white dark:bg-black/50 dark:hover:bg-black/80 backdrop-blur-md rounded-full transition-all border border-slate-200 dark:border-white/10 opacity-0 group-hover:opacity-100 shadow-sm"
                    title="Manage Collections"
                  >
                    <Heart
                      size={18}
                      className={isInAnyPlaylist(item.id) ? "fill-red-500 text-red-500" : "text-slate-400 dark:text-white"}
                    />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
                <div className="text-6xl mb-4 text-slate-300 dark:text-slate-700">
                  <Folder size={64} className="mx-auto text-slate-300 dark:text-slate-700" />
                </div>
                <h3 className="text-xl text-slate-600 dark:text-slate-400 font-medium">{t('yourWatchlistIsEmpty')}</h3>
                <Link to="/" className="mt-4 inline-block text-blue-600 dark:text-blue-500 hover:underline">
                  {t('exploreToAdd')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-10 text-center border-t border-slate-200 dark:border-slate-900 mt-20">
        <p className="text-slate-500 dark:text-slate-600 text-sm font-medium">
          © 2026 MovieVerse • Designed by Keshav Sharma
        </p>
      </footer>
    </div>
  );
};

export default Watchlist;
