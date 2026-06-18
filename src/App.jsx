import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import GenreBar from "./components/GenreBar"; 
import { useMovies } from "./hooks/useMovies"; 
import MovieDetails from "./pages/MovieDetails"; 


const MovieSkeleton = () => (
  <div className="bg-slate-900 rounded-2xl overflow-hidden animate-pulse border border-slate-800">
    <div className="aspect-[2/3] bg-slate-800" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-800 rounded w-3/4" />
      <div className="h-3 bg-slate-800 rounded w-1/2" />
    </div>
  </div>
);

const HomePage = ({ searchTerm, setSearchTerm }) => {
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(0); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      if(searchTerm) setSelectedGenre(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { movies, loading } = useMovies(debouncedTerm, selectedGenre);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500 selection:text-white">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <header className="mb-8">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
            {searchTerm ? `Searching: ${searchTerm}` : "Explore Movies"}
          </h2>

          <div className="mt-8">
            <GenreBar selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
          </div>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading ? (
            [...Array(10)].map((_, i) => <MovieSkeleton key={i} />)
          ) : movies.length > 0 ? (
            movies.map((movie) => (
              <Link to={`/movie/${movie.id}`} key={movie.id} className="block group">
                <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 border border-slate-800 group-hover:border-blue-500/50">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img 
                      src={movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                        : "https://via.placeholder.com/500x750?text=No+Poster"} 
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-yellow-400 border border-white/10">
                      ⭐ {movie.vote_average?.toFixed(1)}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-sm md:text-base truncate group-hover:text-blue-400 transition-colors">
                      {movie.title}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-slate-500 text-xs font-medium">
                        {movie.release_date ? movie.release_date.split('-')[0] : "N/A"}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl text-slate-400 font-medium">No movies found for this category.</h3>
              <button 
                onClick={() => {setSearchTerm(""); setSelectedGenre(0)}}
                className="mt-4 text-blue-500 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="py-10 text-center border-t border-slate-900 mt-20">
        <p className="text-slate-600 text-sm font-medium">
          © 2026 MovieVerse • Designed by Keshav Sharma
        </p>
      </footer>
    </div>
  );
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Routes>
      <Route path="/" element={<HomePage searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
    </Routes>
  );
}

export default App;