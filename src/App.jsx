import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Heart } from "lucide-react";
import Navbar from "./components/Navbar";
import GenreBar from "./components/GenreBar"; 
import { useMovies } from "./hooks/useMovies"; 
import MovieDetails from "./pages/MovieDetails"; 
import Watchlist from "./pages/Watchlist";
import { useWatchlist } from "./context/WatchlistContext";
import ActorDetails from "./pages/ActorDetails";
import ScrollToTop from "./components/ScrollToTop";


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

const HomePage = ({ searchTerm, setSearchTerm }) => {
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(0); 
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [decade, setDecade] = useState("");
  const [language, setLanguage] = useState("");
  const [nowPlaying, setNowPlaying] = useState([]);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=4fdd0d59a1f17e38b912e065674f80d8&language=en-US&page=1`)
      .then((res) => res.json())
      .then((data) => setNowPlaying(data.results || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedTerm !== searchTerm) {
        setDebouncedTerm(searchTerm);
        setPage(1);
        if(searchTerm) setSelectedGenre(0);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, debouncedTerm]);

  const { movies, loading, loadingMore, hasMore } = useMovies(debouncedTerm, selectedGenre, page, sortBy, decade, language);

  const handleSortChange = (e) => { setSortBy(e.target.value); setPage(1); };
  const handleDecadeChange = (e) => { setDecade(e.target.value); setPage(1); };
  const handleLanguageChange = (e) => { setLanguage(e.target.value); setPage(1); };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <header className="mb-8">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-300 dark:to-slate-500 bg-clip-text text-transparent">
            {searchTerm ? `Searching: ${searchTerm}` : "Explore Movies"}
          </h2>

          {!searchTerm && nowPlaying.length > 0 && (
            <div className="mt-12 mb-16">
              <h3 className="text-2xl font-bold mb-6 border-l-4 border-red-500 pl-3 uppercase tracking-widest text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Now Playing in Theaters
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {nowPlaying.map((movie) => (
                  <Link to={`/movie/${movie.id}`} key={movie.id} className="flex-shrink-0 w-48 group block">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 group-hover:border-red-500/50 transition-all duration-300 group-hover:-translate-y-2 relative">
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <img 
                          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"} 
                          alt={movie.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-yellow-600 dark:text-yellow-400 border border-slate-200 dark:border-white/10 shadow-sm">
                          ⭐ {movie.vote_average?.toFixed(1)}
                        </div>
                      </div>
                      <div className="p-3 absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-12">
                        <p className="font-bold text-sm truncate text-white group-hover:text-red-400 transition-colors">{movie.title}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col xl:flex-row xl:items-center gap-6 justify-between">
            <div className="flex-1 w-full overflow-hidden">
              <GenreBar 
                selectedGenre={selectedGenre} 
                setSelectedGenre={(id) => {
                  setSelectedGenre(id);
                  setPage(1);
                }} 
              />
            </div>
            
            {!searchTerm && (
              <div className="flex flex-wrap items-center gap-3">
                <select 
                  value={sortBy} 
                  onChange={handleSortChange}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 transition-colors cursor-pointer"
                >
                  <option value="popularity.desc">Popularity</option>
                  <option value="vote_average.desc">Highest Rated</option>
                  <option value="primary_release_date.desc">Release Date</option>
                </select>

                <select 
                  value={decade} 
                  onChange={handleDecadeChange}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 transition-colors cursor-pointer"
                >
                  <option value="">Any Decade</option>
                  <option value="2020">2020s</option>
                  <option value="2010">2010s</option>
                  <option value="2000">2000s</option>
                  <option value="1990">1990s</option>
                  <option value="1980">1980s</option>
                </select>

                <select 
                  value={language} 
                  onChange={handleLanguageChange}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 transition-colors cursor-pointer"
                >
                  <option value="">Any Language</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
            )}
          </div>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading ? (
            [...Array(10)].map((_, i) => <MovieSkeleton key={i} />)
          ) : movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie.id} className="relative block group">
                <Link to={`/movie/${movie.id}`}>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 border border-slate-200 dark:border-slate-800 group-hover:border-blue-500/50">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img 
                        src={movie.poster_path 
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                          : "https://via.placeholder.com/500x750?text=No+Poster"} 
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-yellow-600 dark:text-yellow-400 border border-slate-200 dark:border-white/10 shadow-sm">
                        ⭐ {movie.vote_average?.toFixed(1)}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-sm md:text-base truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {movie.title}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                          {movie.release_date ? movie.release_date.split('-')[0] : "N/A"}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          Details →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWatchlist(movie);
                  }}
                  className="absolute top-3 left-3 z-10 p-2 bg-white/90 hover:bg-white dark:bg-black/50 dark:hover:bg-black/80 backdrop-blur-md rounded-full transition-all border border-slate-200 dark:border-white/10 opacity-0 group-hover:opacity-100 shadow-sm"
                >
                  <Heart 
                    size={18} 
                    className={isInWatchlist(movie.id) ? "fill-red-500 text-red-500" : "text-slate-400 dark:text-white"} 
                  />
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl text-slate-600 dark:text-slate-400 font-medium">No movies found for this category.</h3>
              <button 
                onClick={() => {setSearchTerm(""); setSelectedGenre(0)}}
                className="mt-4 text-blue-600 dark:text-blue-500 hover:underline"
              >
                Clear all filters
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
              {loadingMore ? "Loading..." : "Load More"}
            </button>
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

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/actor/:id" element={<ActorDetails />} />
        <Route path="/watchlist" element={<Watchlist searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
      </Routes>
      <ScrollToTop />
    </>
  );
}

export default App;