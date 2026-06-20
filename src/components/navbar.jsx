import { useState, useEffect, useRef } from "react";
import { Search, Film, X, Heart, Sun, Moon, History, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = ({ searchTerm, setSearchTerm, mediaType, setMediaType }) => {
  const { watchlist } = useWatchlist();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [searchHistory, setSearchHistory] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("movieverse_search_history");
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse search history");
      }
    }
  }, []);

  const saveSearch = (term) => {
    if (!term.trim()) return;
    
    setSearchHistory(prev => {
      const newHistory = [term.trim(), ...prev.filter(item => item !== term.trim())].slice(0, 5);
      localStorage.setItem("movieverse_search_history", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("movieverse_search_history");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveSearch(searchTerm);
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
      
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
        setSearchTerm("");
        navigate("/");
      }}>
        <Film className="text-blue-600 dark:text-blue-500" size={30} />
        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
        <span className="text-blue-600 dark:text-blue-500">MOVIEVERSE</span>
        </h1>
      </div>

      <div className="relative w-1/2 md:w-1/3 group">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if(window.location.pathname !== "/") {
              navigate("/");
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-200 pl-10 pr-10 py-2 rounded-full border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-500 shadow-inner"
        />
        
        <Search 
          className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" 
          size={20} 
        />

        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}

        {isFocused && searchHistory.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="flex justify-between items-center px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recent Searches</span>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); clearHistory(); }}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <Trash2 size={12} /> Clear
              </button>
            </div>
            <ul>
              {searchHistory.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      setSearchTerm(item);
                      if(window.location.pathname !== "/") {
                        navigate("/");
                      }
                    }}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-slate-700 dark:text-slate-300 border-b border-slate-50 dark:border-slate-800 last:border-0"
                  >
                    <History size={16} className="text-slate-400" />
                    <span className="truncate">{item}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {setMediaType && (
          <div className="hidden md:flex bg-slate-100 dark:bg-slate-900 rounded-full p-1 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => { setMediaType("movie"); if (window.location.pathname !== "/") navigate("/"); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mediaType === "movie" ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
            >
              Movies
            </button>
            <button
              onClick={() => { setMediaType("tv"); if (window.location.pathname !== "/") navigate("/"); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mediaType === "tv" ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
            >
              TV Shows
            </button>
          </div>
        )}

        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        <div className="hidden md:block h-8 w-[1px] bg-slate-300 dark:bg-slate-800 mx-2"></div>
        <Link to="/watchlist" className="flex items-center gap-2 group hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
          <div className="relative">
            <Heart size={24} className="text-slate-500 dark:text-slate-400 group-hover:text-red-500 transition-colors" />
            {watchlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                {watchlist.length}
              </span>
            )}
          </div>
          <p className="hidden md:block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-widest group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Watchlist
          </p>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;