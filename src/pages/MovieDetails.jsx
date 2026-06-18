import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Clock, Calendar, DollarSign } from "lucide-react";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const API_KEY = "4fdd0d59a1f17e38b912e065674f80d8"; 

  useEffect(() => {
    window.scrollTo(0, 0); 
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!movie) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
    </div>
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
            <h1 className="text-4xl md:text-6xl font-black mb-2 leading-tight">{movie.title}</h1>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;