import { Search, Film, X } from "lucide-react";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
      
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSearchTerm("")}>
        <Film className="text-blue-500" size={30} />
        <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter">
        <span className="text-blue-500">MOVIEVERSE</span>
        </h1>
      </div>

      <div className="relative w-1/2 md:w-1/3 group">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 text-slate-200 pl-10 pr-10 py-2 rounded-full border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-500"
        />
        
        <Search 
          className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" 
          size={20} 
        />

        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-2.5 text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="hidden md:flex items-center gap-4">
        <div className="h-8 w-[1px] bg-slate-800 mx-2"></div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          <span className="text-blue-500">Watchlist</span>
        </p>
      </div>
    </nav>
  );
};

export default Navbar;