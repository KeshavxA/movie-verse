const genres = [
    { id: 0, name: "All" },
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 53, name: "Thriller" },
  ];
  
  const GenreBar = ({ selectedGenre, setSelectedGenre }) => {
    return (
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre.id)}
            className={`px-5 py-2 rounded-full whitespace-nowrap transition-all duration-300 font-medium border ${
              selectedGenre === genre.id
                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500 dark:hover:border-slate-600 hover:text-blue-600 dark:hover:text-white"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    );
  };
  
  export default GenreBar;