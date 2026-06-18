import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Star, Clock, Calendar, DollarSign, Heart } from "lucide-react";
import { useWatchlist } from "../context/WatchlistContext";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const API_KEY = "4fdd0d59a1f17e38b912e065674f80d8"; 

  useEffect(() => {
    window.scrollTo(0, 0); 
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits,similar`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!movie) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
    </div>
  );

  const trailer = movie.videos?.results?.find(
    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <div className="relative h-[50vh] w-full">
        <img 
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
          className="w-full h-full object-cover opacity-30"
          alt="backdrop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 p-3 bg-slate-900/80 hover:bg-blue-600 rounded-full transition-all border border-slate-700"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              className="w-64 md:w-80 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800"
              alt={movie.title}
            />
          </div>

          <div className="flex-1 mt-10 md:mt-20">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl md:text-6xl font-black leading-tight">{movie.title}</h1>
              <button
                onClick={() => toggleWatchlist(movie)}
                className="ml-4 p-3 bg-slate-900 hover:bg-slate-800 rounded-full transition-all border border-slate-700 flex-shrink-0"
                title={isInWatchlist(movie.id) ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                <Heart 
                  size={28} 
                  className={isInWatchlist(movie.id) ? "fill-red-500 text-red-500" : "text-slate-400"} 
                />
              </button>
            </div>
            <p className="text-blue-400 text-lg font-medium mb-6">{movie.tagline || "No tagline available"}</p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                <Star className="text-yellow-500" size={18} fill="currentColor" />
                <span className="font-bold">{movie.vote_average?.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-slate-300">
                <Clock size={18} />
                <span>{movie.runtime} min</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-slate-300">
                <Calendar size={18} />
                <span>{movie.release_date}</span>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-xl font-bold mb-3 border-l-4 border-blue-500 pl-3 uppercase tracking-widest text-sm">Overview</h2>
              <p className="text-slate-400 text-lg leading-relaxed">{movie.overview}</p>
            </div>

            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-6 border-l-4 border-blue-500 pl-3 uppercase tracking-widest text-sm">Top Cast</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
                  {movie.credits.cast.slice(0, 10).map((actor) => (
                    <div key={actor.id} className="flex-shrink-0 w-32 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-lg">
                      <img 
                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : "https://via.placeholder.com/185x278?text=No+Photo"} 
                        alt={actor.name} 
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3">
                        <p className="font-bold text-sm truncate text-white" title={actor.name}>{actor.name}</p>
                        <p className="text-xs text-slate-400 truncate mt-1" title={actor.character}>{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-8 py-8 border-t border-slate-900">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase mb-1">Budget</p>
                <p className="text-2xl font-mono text-green-500">${movie.budget?.toLocaleString() || "N/A"}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase mb-1">Revenue</p>
                <p className="text-2xl font-mono text-blue-500">${movie.revenue?.toLocaleString() || "N/A"}</p>
              </div>
            </div>

            {trailer && (
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-6 border-l-4 border-red-500 pl-3 uppercase tracking-widest text-sm">Official Trailer</h2>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0`}
                    title={`${movie.title} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {movie.similar?.results && movie.similar.results.length > 0 && (
              <div className="mt-16 mb-10">
                <h2 className="text-2xl font-bold mb-6 border-l-4 border-yellow-500 pl-3 uppercase tracking-widest text-sm">You May Also Like</h2>
                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
                  {movie.similar.results.slice(0, 15).map((similarMovie) => (
                    <Link to={`/movie/${similarMovie.id}`} key={similarMovie.id} className="flex-shrink-0 w-40 group block">
                      <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800 group-hover:border-blue-500/50 transition-all duration-300 group-hover:-translate-y-2 relative">
                        <img 
                          src={similarMovie.poster_path ? `https://image.tmdb.org/t/p/w300${similarMovie.poster_path}` : "https://via.placeholder.com/300x450?text=No+Poster"} 
                          alt={similarMovie.title} 
                          className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-yellow-400 border border-white/10">
                          ⭐ {similarMovie.vote_average?.toFixed(1)}
                        </div>
                        <div className="p-3 absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-10">
                          <p className="font-bold text-sm truncate text-white group-hover:text-blue-400 transition-colors">{similarMovie.title}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;