const MovieSkeleton = () => (
    <div className="bg-slate-900 rounded-2xl overflow-hidden animate-pulse border border-slate-800">
      <div className="aspect-[2/3] bg-slate-800" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-800 rounded w-1/2" />
      </div>
    </div>
  );
  
  export default MovieSkeleton;