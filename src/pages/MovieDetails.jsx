import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Star, Clock, Calendar, DollarSign, Heart, MessageSquare, Share2, Check } from "lucide-react";
import { useWatchlist } from "../context/WatchlistContext";
import FinancialChart from "../components/FinancialChart";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [copied, setCopied] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const API_KEY = "4fdd0d59a1f17e38b912e065674f80d8"; 

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); 
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits,similar,reviews`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!movie) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
    </div>
  );

  const trailer = movie.videos?.results?.find(
    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-20 transition-colors duration-300">
      <div className="relative h-[50vh] w-full">
        <img 
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
          className="w-full h-full object-cover opacity-30 dark:opacity-30 opacity-60"
          alt="backdrop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/60 to-transparent dark:from-slate-950 dark:via-slate-950/20" />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 p-3 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-blue-600 rounded-full transition-all border border-slate-300 dark:border-slate-700 shadow-sm"
        >
          <ArrowLeft size={24} className="text-slate-900 dark:text-white" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              className="w-64 md:w-80 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"
              alt={movie.title}
            />
          </div>

          <div className="flex-1 mt-10 md:mt-20">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl md:text-6xl font-black leading-tight">{movie.title}</h1>
              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <button
                  onClick={handleShare}
                  className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                  title="Share Movie"
                >
                  {copied ? (
                    <Check size={28} className="text-green-500" />
                  ) : (
                    <Share2 size={28} className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
                  )}
                </button>
                <button
                  onClick={() => toggleWatchlist(movie)}
                  className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                  title={isInWatchlist(movie.id) ? "Remove from Watchlist" : "Add to Watchlist"}
                >
                  <Heart 
                    size={28} 
                    className={isInWatchlist(movie.id) ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-red-500 transition-colors"} 
                  />
                </button>
              </div>
            </div>
            <p className="text-blue-600 dark:text-blue-400 text-lg font-medium mb-6">{movie.tagline || "No tagline available"}</p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <Star className="text-yellow-500" size={18} fill="currentColor" />
                <span className="font-bold">{movie.vote_average?.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-sm">
                <Clock size={18} />
                <span>{movie.runtime} min</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-sm">
                <Calendar size={18} />
                <span>{movie.release_date}</span>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-xl font-bold mb-3 border-l-4 border-blue-500 pl-3 uppercase tracking-widest text-sm text-slate-900 dark:text-white">Overview</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{movie.overview}</p>
            </div>

            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-6 border-l-4 border-blue-500 pl-3 uppercase tracking-widest text-sm">Top Cast</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                  {movie.credits.cast.slice(0, 10).map((actor) => (
                    <Link to={`/actor/${actor.id}`} key={actor.id} className="flex-shrink-0 w-32 group block">
                      <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg group-hover:shadow-blue-500/20 group-hover:border-blue-500/50 transition-all duration-300 group-hover:-translate-y-2">
                        <img 
                          src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : "https://via.placeholder.com/185x278?text=No+Photo"} 
                          alt={actor.name} 
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-3">
                          <p className="font-bold text-sm truncate text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={actor.name}>{actor.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1" title={actor.character}>{actor.character}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(movie.budget > 0 || movie.revenue > 0) && (
              <div className="py-8 border-t border-slate-200 dark:border-slate-900">
                <FinancialChart budget={movie.budget} revenue={movie.revenue} />
              </div>
            )}

            {trailer && (
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-6 border-l-4 border-red-500 pl-3 uppercase tracking-widest text-sm">Official Trailer</h2>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
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
                <h2 className="text-2xl font-bold mb-6 border-l-4 border-yellow-500 pl-3 uppercase tracking-widest text-sm text-slate-900 dark:text-white">You May Also Like</h2>
                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                  {movie.similar.results.slice(0, 15).map((similarMovie) => (
                    <Link to={`/movie/${similarMovie.id}`} key={similarMovie.id} className="flex-shrink-0 w-40 group block">
                      <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 group-hover:border-blue-500/50 transition-all duration-300 group-hover:-translate-y-2 relative">
                        <img 
                          src={similarMovie.poster_path ? `https://image.tmdb.org/t/p/w300${similarMovie.poster_path}` : "https://via.placeholder.com/300x450?text=No+Poster"} 
                          alt={similarMovie.title} 
                          className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-yellow-600 dark:text-yellow-400 border border-slate-200 dark:border-white/10 shadow-sm">
                          ⭐ {similarMovie.vote_average?.toFixed(1)}
                        </div>
                        <div className="p-3 absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/60 dark:from-black dark:via-black/80 to-transparent pt-10">
                          <p className="font-bold text-sm truncate text-white group-hover:text-blue-300 dark:group-hover:text-blue-400 transition-colors">{similarMovie.title}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {movie.reviews?.results && movie.reviews.results.length > 0 && (
              <div className="mt-16 mb-10">
                <h2 className="text-2xl font-bold mb-6 border-l-4 border-green-500 pl-3 uppercase tracking-widest text-sm text-slate-900 dark:text-white">User Reviews</h2>
                <div className="space-y-6">
                  {movie.reviews.results.slice(0, 5).map((review) => (
                    <div key={review.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 bg-blue-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                          <MessageSquare size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">A review by {review.author}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {review.author_details?.rating && (
                              <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 px-2 py-0.5 rounded text-xs font-bold">
                                <Star size={12} fill="currentColor" />
                                <span>{review.author_details.rating.toFixed(1)}</span>
                              </div>
                            )}
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                        {review.content.length > 400 ? (
                          <>
                            {review.content.slice(0, 400)}...
                            <a href={review.url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 ml-2 hover:underline font-medium">Read more</a>
                          </>
                        ) : (
                          review.content
                        )}
                      </div>
                    </div>
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