import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, TrendingUp, Filter } from "lucide-react";
import CareerChart from "../components/CareerChart";
import { useLanguage } from "../context/LanguageContext";

const ActorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actor, setActor] = useState(null);
  const [filterRole, setFilterRole] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [visibleCount, setVisibleCount] = useState(24);
  const { lang, t } = useLanguage();
  const API_KEY = "4fdd0d59a1f17e38b912e065674f80d8";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&append_to_response=combined_credits&language=${lang}`)
      .then((res) => res.json())
      .then((data) => setActor(data))
      .catch((err) => console.error(err));
  }, [id, lang]);

  if (!actor) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
    </div>
  );

  const allCredits = [];
  if (actor.combined_credits?.cast) {
    allCredits.push(...actor.combined_credits.cast.map(c => ({ ...c, customRole: "Actor" })));
  }
  if (actor.combined_credits?.crew) {

    allCredits.push(...actor.combined_credits.crew.map(c => ({ ...c, customRole: c.job })));
  }
  const uniqueCreditsMap = new Map();
  allCredits.forEach(c => {
    uniqueCreditsMap.set(`${c.id}-${c.customRole}`, c);
  });
  const uniqueCredits = Array.from(uniqueCreditsMap.values());

  const availableRoles = ["All", ...new Set(uniqueCredits.map(c => c.customRole))].sort();

  let filteredCredits = uniqueCredits;
  if (filterRole !== "All") {
    filteredCredits = filteredCredits.filter(c => c.customRole === filterRole);
  }


  const displayCreditsMap = new Map();
  filteredCredits.forEach(c => {
    if (!displayCreditsMap.has(c.id)) {
      displayCreditsMap.set(c.id, c);
    } else {

      const existing = displayCreditsMap.get(c.id);
      if (!existing.customRole.includes(c.customRole)) {
        existing.customRole += `, ${c.customRole}`;
      }
    }
  });
  let finalCredits = Array.from(displayCreditsMap.values());

  finalCredits.sort((a, b) => {
    if (sortBy === "popularity") return (b.popularity || 0) - (a.popularity || 0);
    if (sortBy === "rating") return (b.vote_average || 0) - (a.vote_average || 0);

    const dateA = new Date(a.release_date || a.first_air_date || '1900-01-01').getTime();
    const dateB = new Date(b.release_date || b.first_air_date || '1900-01-01').getTime();

    if (sortBy === "newest") return dateB - dateA;
    if (sortBy === "oldest") return dateA - dateB;
    return 0;
  });

  const visibleCredits = finalCredits.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-20 transition-colors duration-300">

      <div className="p-6 md:p-10">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-blue-600 rounded-full transition-all border border-slate-300 dark:border-slate-800 shadow-sm"
        >
          <ArrowLeft size={24} className="text-slate-900 dark:text-white" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left Sidebar: Photo & Info */}
          <div className="flex-shrink-0 mx-auto md:mx-0 w-64 md:w-80">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
              <img
                src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : "https://via.placeholder.com/500x750?text=No+Photo"}
                className="w-full rounded-2xl object-cover mb-6"
                alt={actor.name}
              />
              <h2 className="text-2xl font-black mb-4 text-center md:hidden">{actor.name}</h2>

              <div className="space-y-4">
                <h3 className="text-lg font-bold border-b border-slate-200 dark:border-slate-800 pb-2">Personal Info</h3>

                <div>
                  <p className="text-sm text-slate-500 font-bold uppercase">{t('knownFor')}</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{actor.known_for_department || "Acting"}</p>
                </div>

                {actor.birthday && (
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase flex items-center gap-1"><Calendar size={14} /> Born</p>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {new Date(actor.birthday).toLocaleDateString()}
                      {actor.deathday && ` - ${new Date(actor.deathday).toLocaleDateString()}`}
                    </p>
                  </div>
                )}

                {actor.place_of_birth && (
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase flex items-center gap-1"><MapPin size={14} /> Place of Birth</p>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{actor.place_of_birth}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Main Content: Bio & Movies */}
          <div className="flex-1">
            <h1 className="hidden md:block text-5xl md:text-6xl font-black leading-tight mb-8">{actor.name}</h1>

            {actor.biography && (
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-4 border-l-4 border-blue-500 pl-3 uppercase tracking-widest text-sm">{t('biography')}</h2>
                <div className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed space-y-4">
                  {actor.biography.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {actor.combined_credits?.cast && actor.combined_credits.cast.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-4 border-l-4 border-green-500 pl-3 uppercase tracking-widest text-sm flex items-center gap-2">
                  <TrendingUp size={18} /> {t('careerTrajectory')}
                </h2>
                <p className="text-slate-500 text-sm mb-2">Average project rating by year</p>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-md">
                  <CareerChart credits={actor.combined_credits.cast} />
                </div>
              </div>
            )}

            {finalCredits.length > 0 && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 border-l-4 border-yellow-500 pl-3">
                  <h2 className="text-xl font-bold uppercase tracking-widest text-sm">Filmography</h2>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={filterRole}
                      onChange={(e) => { setFilterRole(e.target.value); setVisibleCount(24); }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {availableRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => { setSortBy(e.target.value); setVisibleCount(24); }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="popularity">Highest Popularity</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {visibleCredits.map((media) => (
                    <Link to={`/${media.media_type}/${media.id}`} key={`${media.media_type}-${media.id}`} className="relative block group">
                      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 border border-slate-200 dark:border-slate-800 group-hover:border-blue-500/50">
                        <div className="relative aspect-[2/3] overflow-hidden">
                          <img
                            src={media.poster_path
                              ? `https://image.tmdb.org/t/p/w300${media.poster_path}`
                              : "https://via.placeholder.com/300x450?text=No+Poster"}
                            alt={media.title || media.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-yellow-600 dark:text-yellow-400 border border-slate-200 dark:border-white/10 shadow-sm">
                            ⭐ {media.vote_average?.toFixed(1)}
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-bold text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {media.title || media.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                            {media.customRole === "Actor" ? (media.character ? `as ${media.character}` : "Actor") : media.customRole}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                            {(media.release_date || media.first_air_date)?.split('-')[0] || "Upcoming"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {finalCredits.length > visibleCount && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 24)}
                      className="px-6 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-full transition-all text-sm"
                    >
                      Show More ({finalCredits.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorDetails;
