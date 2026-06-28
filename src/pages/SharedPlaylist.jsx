import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Folder, Heart, ArrowLeft, Download, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import { useWatchlist } from "../context/WatchlistContext";
import { useLanguage } from "../context/LanguageContext";

const SharedPlaylist = ({ searchTerm, setSearchTerm }) => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  
  const { toggleWatchlist, isInAnyPlaylist, createPlaylist, addToPlaylist } = useWatchlist();
  const { lang, t } = useLanguage();
  
  const playlistName = searchParams.get('name') || "Shared Collection";
  const itemsParam = searchParams.get('items') || "";

  useEffect(() => {
    const fetchItems = async () => {
      if (!itemsParam) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const API_KEY = "4fdd0d59a1f17e38b912e065674f80d8";
        const itemIds = itemsParam.split(',');
        
        const fetchPromises = itemIds.map(async (itemStr) => {
          const [type, id] = itemStr.split(':');
          if (!type || !id) return null;
          
          const mediaType = type === 't' ? 'tv' : 'movie';
          const response = await fetch(
            `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}&language=${lang}`
          );
          
          if (!response.ok) return null;
          const data = await response.json();
          return { ...data, media_type: mediaType };
        });

        const results = await Promise.all(fetchPromises);
        setItems(results.filter(Boolean));
      } catch (err) {
        console.error("Failed to fetch shared items", err);
        setError("Failed to load the shared collection.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [itemsParam, lang]);

  const handleSaveCollection = () => {
    if (items.length === 0) return;
    
    const newPlaylistId = createPlaylist(playlistName);
    items.forEach(item => {
      addToPlaylist(item, newPlaylistId);
    });
    
    setSaved(true);
    setTimeout(() => {
      navigate('/watchlist');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <button 
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Back to Home
        </button>

        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-xs">
              <Folder size={16} /> Shared Collection
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-300 dark:to-slate-500 bg-clip-text text-transparent flex items-center gap-4">
              {playlistName}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>

          {items.length > 0 && !loading && (
            <button 
              onClick={handleSaveCollection}
              disabled={saved}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg hover:-translate-y-1 ${
                saved 
                  ? 'bg-green-500 text-white shadow-green-500/20' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'
              }`}
            >
              {saved ? (
                <><Check size={18} /> Saved to Your Collections</>
              ) : (
                <><Download size={18} /> Clone Collection</>
              )}
            </button>
          )}
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-medium">{error}</div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {items.map((item) => (
              <div key={`${item.media_type}-${item.id}`} className="relative block group">
                <Link to={`/${item.media_type}/${item.id}`}>
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
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <h3 className="text-xl text-slate-600 dark:text-slate-400 font-medium">This shared collection is empty.</h3>
          </div>
        )}
      </main>

      <footer className="py-10 text-center border-t border-slate-200 dark:border-slate-900 mt-20">
        <p className="text-slate-500 dark:text-slate-600 text-sm font-medium">
          © 2026 MovieVerse • Designed by Keshav Sharma
        </p>
      </footer>
    </div>
  );
};

export default SharedPlaylist;
