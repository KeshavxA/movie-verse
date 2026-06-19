import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import Navbar from "../components/Navbar";
import { useWatchlist } from "../context/WatchlistContext";

const Watchlist = ({ searchTerm, setSearchTerm }) => {
  const { watchlist, toggleWatchlist, isInWatchlist } = useWatchlist();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <header className="mb-8">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-300 dark:to-slate-500 bg-clip-text text-transparent flex items-center gap-4">
            <Heart size={40} className="text-red-500 fill-red-500" /> My Watchlist
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg">
            {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"} saved
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {watchlist.length > 0 ? (
            watchlist.map((movie) => (
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
                  title="Remove from Watchlist"
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
              <div className="text-6xl mb-4 text-slate-300 dark:text-slate-700">
                <Heart size={64} className="mx-auto text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-xl text-slate-600 dark:text-slate-400 font-medium">Your watchlist is empty.</h3>
              <Link to="/" className="mt-4 inline-block text-blue-600 dark:text-blue-500 hover:underline">
                Explore movies to add
              </Link>
            </div>
          )}
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
