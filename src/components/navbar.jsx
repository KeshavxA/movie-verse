import { Search, Film, X, Heart, Sun, Moon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const { watchlist } = useWatchlist();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

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
          className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-200 pl-10 pr-10 py-2 rounded-full border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-500"
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
      </div>

      <div className="flex items-center gap-4">
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