import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Heart, Filter } from "lucide-react";
import Navbar from "./components/Navbar";
import FilterSidebar from "./components/FilterSidebar";
import { useMovies } from "./hooks/useMovies"; 
import MovieDetails from "./pages/MovieDetails"; 
import TvDetails from "./pages/TvDetails";
import Watchlist from "./pages/Watchlist";
import { useWatchlist } from "./context/WatchlistContext";
import ActorDetails from "./pages/ActorDetails";
import ScrollToTop from "./components/ScrollToTop";
import AddToPlaylistModal from "./components/AddToPlaylistModal";
import AIMatchmaker from "./components/AIMatchmaker";
import { useLanguage } from "./context/LanguageContext";
import ReleaseCalendar from "./pages/ReleaseCalendar";


const MovieSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative shadow-sm">
    <div className="absolute inset-0 z-10 w-full h-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" style={{ backgroundSize: '200% 100%' }} />
    <div className="aspect-[2/3] bg-slate-200 dark:bg-slate-800" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
    </div>
  </div>
);

const HomePage = ({ searchTerm, setSearchTerm, mediaType }) => {
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [minVotes, setMinVotes] = useState(0);
  const [language, setLanguage] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [maxRuntime, setMaxRuntime] = useState(null);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [nowPlaying, setNowPlaying] = useState([]);
  const { lang, t } = useLanguage();

  useEffect(() => {
    const endpoint = mediaType === "movie" ? "movie/now_playing" : "tv/airing_today";
    fetch(`https://api.themoviedb.org/3/${endpoint}?api_key=4fdd0d59a1f17e38b912e065674f80d8&language=${lang}&page=1`)
      .then((res) => res.json())
      .then((data) => setNowPlaying(data.results || []))
      .catch((err) => console.error(err));
  }, [mediaType, lang]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedTerm !== searchTerm) {
        setDebouncedTerm(searchTerm);
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, debouncedTerm]);

  const { movies, loading, loadingMore, hasMore } = useMovies(
    debouncedTerm,
    selectedGenres,
    page,
    sortBy,
    minYear,
    maxYear,
    minRating,
    minVotes,
    language,
    maxRuntime,
    selectedProviders,
    mediaType
  );

  const handleSortChange = (e) => { setSortBy(e.target.value); setPage(1); };
  const handleLanguageChange = (e) => { setLanguage(e.target.value); setPage(1); };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <header className="mb-8">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-300 dark:to-slate-500 bg-clip-text text-transparent">
            {searchTerm ? `${t('searching')}: ${searchTerm}` : (mediaType === "tv" ? t('exploreTv') : t('exploreMovies'))}
          </h2>

          {!searchTerm && nowPlaying.length > 0 && (
            <div className="mt-12 mb-16">
              <h3 className="text-2xl font-bold mb-6 border-l-4 border-red-500 pl-3 uppercase tracking-widest text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                {mediaType === "tv" ? t('airingToday') : t('nowPlaying')}
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {nowPlaying.map((item) => (
                  <Link to={`/${mediaType}/${item.id}`} key={item.id} className="flex-shrink-0 w-48 group block">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 group-hover:border-red-500/50 transition-all duration-300 group-hover:-translate-y-2 relative">
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <img 
                          src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"} 
                          alt={item.title || item.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-yellow-600 dark:text-yellow-400 border border-slate-200 dark:border-white/10 shadow-sm">
                          ⭐ {item.vote_average?.toFixed(1)}
                        </div>
                      </div>
                      <div className="p-3 absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-12">
                        <p className="font-bold text-sm truncate text-white group-hover:text-red-400 transition-colors">{item.title || item.name}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col xl:flex-row xl:items-center gap-6 justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
            {!searchTerm && (
              <button
                onClick={() => setIsFilterSidebarOpen(true)}
                className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-300 ml-auto"
              >
                <Filter size={20} />
                {t('filtersAndSort')}
                {(selectedGenres.length > 0 || sortBy !== "popularity.desc" || minYear || maxYear || minRating > 0 || minVotes > 0 || language || maxRuntime || selectedProviders.length > 0) && (
                  <span className="flex items-center justify-center bg-blue-600 text-white text-xs rounded-full h-5 w-5 ml-1">
                    !
                  </span>
                )}
              </button>
            )}
          </div>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading ? (
            [...Array(10)].map((_, i) => <MovieSkeleton key={i} />)
          ) : movies.length > 0 ? (
            movies.map((item) => (
              <div key={item.id} className="relative block group">
                <Link to={`/${mediaType}/${item.id}`}>
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
                        ⭐ {movie.vote_average?.toFixed(1)}
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
                    toggleWatchlist({ ...item, media_type: mediaType });
                  }}
                  className="absolute top-3 left-3 z-10 p-2 bg-white/90 hover:bg-white dark:bg-black/50 dark:hover:bg-black/80 backdrop-blur-md rounded-full transition-all border border-slate-200 dark:border-white/10 opacity-0 group-hover:opacity-100 shadow-sm"
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
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl text-slate-600 dark:text-slate-400 font-medium">{t('noMoviesFound')}</h3>
              <button 
                onClick={() => {
                  setSearchTerm(""); 
                  setSelectedGenres([]);
                  setSortBy("popularity.desc");
                  setMinYear("");
                  setMaxYear("");
                  setMinRating(0);
                  setMinVotes(0);
                  setLanguage("");
                  setMaxRuntime(null);
                  setSelectedProviders([]);
                  setPage(1);
                }}
                className="mt-4 text-blue-600 dark:text-blue-500 hover:underline"
              >
                {t('clearAllFilters')}
              </button>
            </div>
          )}
        </div>
        
        {movies.length > 0 && hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loadingMore}
              className="px-8 py-3 bg-blue-600 dark:bg-slate-800 hover:bg-blue-700 dark:hover:bg-slate-700 text-white font-bold rounded-full transition-all disabled:opacity-50 flex items-center gap-2 border border-blue-500 dark:border-slate-700 shadow-md"
            >
              {loadingMore && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loadingMore ? t('loading') : t('loadMore')}
            </button>
          </div>
        )}
      </main>

      <footer className="py-10 text-center border-t border-slate-200 dark:border-slate-900 mt-20">
        <p className="text-slate-500 dark:text-slate-600 text-sm font-medium">
          © 2026 MovieVerse • Designed by Keshav Sharma
        </p>
      </footer>
      <FilterSidebar 
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        sortBy={sortBy}
        setSortBy={setSortBy}
        minYear={minYear}
        setMinYear={setMinYear}
        maxYear={maxYear}
        setMaxYear={setMaxYear}
        minRating={minRating}
        setMinRating={setMinRating}
        minVotes={minVotes}
        setMinVotes={setMinVotes}
        language={language}
        setLanguage={setLanguage}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        maxRuntime={maxRuntime}
        setMaxRuntime={setMaxRuntime}
        selectedProviders={selectedProviders}
        setSelectedProviders={setSelectedProviders}
        setPage={setPage}
      />
    </div>
  );
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mediaType, setMediaType] = useState("movie");

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} mediaType={mediaType} setMediaType={setMediaType} />
      <Routes>
        <Route path="/" element={<HomePage searchTerm={searchTerm} setSearchTerm={setSearchTerm} mediaType={mediaType} />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<TvDetails />} />
        <Route path="/actor/:id" element={<ActorDetails />} />
        <Route path="/watchlist" element={<Watchlist searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
        <Route path="/calendar" element={<ReleaseCalendar />} />
      </Routes>
      <ScrollToTop />
      <AddToPlaylistModal />
      <AIMatchmaker />
    </>
  );
}

export default App;