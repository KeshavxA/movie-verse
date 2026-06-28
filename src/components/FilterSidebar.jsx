import { X, FilterX } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const genresList = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const providersList = [
  { id: 8, name: "Netflix", logo: "https://image.tmdb.org/t/p/original/t2yyOv40HZeVlLjVrCsPhnqZ3lU.jpg" },
  { id: 119, name: "Prime Video", logo: "https://image.tmdb.org/t/p/original/emthp39XA2YScoYL1p0srx81wK6.jpg" },
  { id: 337, name: "Disney+", logo: "https://image.tmdb.org/t/p/original/7rwgEs15tFwyR9NPQ5vlvtQ7vKX.jpg" },
  { id: 15, name: "Hulu", logo: "https://image.tmdb.org/t/p/original/zxrVdFjIjLxxOhuWAWVpvCPSKxa.jpg" },
  { id: 384, name: "Max", logo: "https://image.tmdb.org/t/p/original/rYXKxZngN8oY5U2a08zE21mUioQ.jpg" },
  { id: 2, name: "Apple TV", logo: "https://image.tmdb.org/t/p/original/q6tl6Ib6X5FT80RMlcDbexIo4St.jpg" },
];

const FilterSidebar = ({
  isOpen,
  onClose,
  sortBy,
  setSortBy,
  minYear,
  setMinYear,
  maxYear,
  setMaxYear,
  minRating,
  setMinRating,
  minVotes,
  setMinVotes,
  language,
  setLanguage,
  selectedGenres,
  setSelectedGenres,
  maxRuntime,
  setMaxRuntime,
  selectedProviders,
  setSelectedProviders,
  setPage
}) => {
  const { t } = useLanguage();
  const toggleGenre = (id) => {
    setSelectedGenres(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
    setPage(1);
  };

  const toggleProvider = (id) => {
    setSelectedProviders(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSortBy("popularity.desc");
    setMinYear("");
    setMaxYear("");
    setMinRating(0);
    setMinVotes(0);
    setLanguage("");
    setSelectedGenres([]);
    setMaxRuntime(null);
    setSelectedProviders([]);
    setPage(1);
  };

  const hasActiveFilters = 
    sortBy !== "popularity.desc" || 
    minYear !== "" || 
    maxYear !== "" || 
    minRating > 0 ||
    minVotes > 0 ||
    language !== "" || 
    selectedGenres.length > 0 || 
    maxRuntime !== null || 
    selectedProviders.length > 0;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-slate-950 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('filtersSort')}</h2>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button 
                  onClick={clearFilters}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                  title="Clear all filters"
                >
                  <FilterX size={20} />
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-2 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Sort Section */}
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider text-xs">Sort By</h3>
              <select 
                value={sortBy} 
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer appearance-none"
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="primary_release_date.desc">Newest Releases</option>
                <option value="primary_release_date.asc">Oldest Releases</option>
                <option value="revenue.desc">Highest Grossing</option>
              </select>
            </div>

            {/* Streaming Providers */}
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider text-xs">Available On (US)</h3>
              <div className="flex flex-wrap gap-3">
                {providersList.map(provider => (
                  <button
                    key={provider.id}
                    onClick={() => toggleProvider(provider.id)}
                    className={`relative rounded-xl overflow-hidden transition-all duration-200 border-2 ${
                      selectedProviders.includes(provider.id) 
                        ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/20' 
                        : 'border-transparent hover:scale-105 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={provider.logo} alt={provider.name} className="w-12 h-12 rounded-lg" title={provider.name} />
                  </button>
                ))}
              </div>
            </div>

            {/* Genres */}
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider text-xs">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {genresList.map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      selectedGenres.includes(genre.id)
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500/50 hover:text-blue-500 dark:hover:text-blue-400'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Runtime */}
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider text-xs">Runtime</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setMaxRuntime(null); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    maxRuntime === null
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500/50'
                  }`}
                >
                  Any
                </button>
                <button
                  onClick={() => { setMaxRuntime(90); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    maxRuntime === 90
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500/50'
                  }`}
                >
                  &lt; 90 mins
                </button>
                <button
                  onClick={() => { setMaxRuntime(120); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    maxRuntime === 120
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500/50'
                  }`}
                >
                  &lt; 2 hours
                </button>
                <button
                  onClick={() => { setMaxRuntime(150); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    maxRuntime === 150
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500/50'
                  }`}
                >
                  &lt; 2.5 hours
                </button>
              </div>
            </div>

            {/* Release Year Range */}
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider text-xs">Release Year</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="From (e.g. 2010)"
                  value={minYear}
                  onChange={(e) => { setMinYear(e.target.value); setPage(1); }}
                  className="w-full bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <span className="text-slate-500 font-bold">-</span>
                <input 
                  type="number" 
                  placeholder="To (e.g. 2024)"
                  value={maxYear}
                  onChange={(e) => { setMaxYear(e.target.value); setPage(1); }}
                  className="w-full bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">Minimum Rating</h3>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{minRating > 0 ? `${minRating}+ Stars` : 'Any'}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="0.5"
                value={minRating}
                onChange={(e) => { setMinRating(parseFloat(e.target.value)); setPage(1); }}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-800"
              />
            </div>

            {/* Minimum Votes */}
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider text-xs">Minimum Votes</h3>
              <select 
                value={minVotes} 
                onChange={(e) => { setMinVotes(parseInt(e.target.value)); setPage(1); }}
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer appearance-none"
              >
                <option value="0">Any Amount</option>
                <option value="100">100+ Votes</option>
                <option value="500">500+ Votes</option>
                <option value="1000">1000+ Votes</option>
                <option value="5000">5000+ Votes</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider text-xs">Language</h3>
              <select 
                value={language} 
                onChange={(e) => { setLanguage(e.target.value); setPage(1); }}
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer appearance-none mb-12"
              >
                <option value="">Any Language</option>
                <option value="en">English</option>
                <option value="ko">Korean</option>
                <option value="ja">Japanese</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
