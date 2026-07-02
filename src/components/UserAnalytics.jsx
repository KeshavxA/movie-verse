import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adv", 10762: "Kids", 10763: "News", 10764: "Reality",
  10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics"
};

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'];

const UserAnalytics = ({ playlists }) => {
  // Compute analytics data
  const { genreData, decadeData } = useMemo(() => {
    const uniqueItems = new Map();
    if (playlists) {
      playlists.forEach(playlist => {
        playlist.items?.forEach(item => {
          if (!uniqueItems.has(item.id)) {
            uniqueItems.set(item.id, item);
          }
        });
      });
    }

    const items = Array.from(uniqueItems.values());
    
    // Genre Counts
    const genreCounts = {};
    const decadeCounts = {};

    items.forEach(item => {
      // Genres
      if (item.genre_ids) {
        item.genre_ids.forEach(id => {
          const name = GENRE_MAP[id] || "Other";
          genreCounts[name] = (genreCounts[name] || 0) + 1;
        });
      }

      // Decades
      const dateStr = item.release_date || item.first_air_date;
      if (dateStr) {
        const year = parseInt(dateStr.split('-')[0], 10);
        if (!isNaN(year)) {
          const decade = Math.floor(year / 10) * 10;
          const decadeLabel = `${decade}s`;
          decadeCounts[decadeLabel] = (decadeCounts[decadeLabel] || 0) + 1;
        }
      }
    });

    // Format for Recharts
    const sortedGenres = Object.entries(genreCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7); // Top 7 genres

    const sortedDecades = Object.entries(decadeCounts)
      .map(([decade, count]) => ({ decade, count }))
      .sort((a, b) => parseInt(a.decade) - parseInt(b.decade)); // Chronological

    return { genreData: sortedGenres, decadeData: sortedDecades };
  }, [playlists]);

  if (genreData.length === 0 && decadeData.length === 0) {
    return (
      <div className="text-center py-12 mt-10 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
        <p className="text-slate-500 font-medium">Add movies or TV shows to your playlists to see your analytics!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md transition-all hover:shadow-lg">
        <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
          Top Genres
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genreData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {genreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md transition-all hover:shadow-lg">
        <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
          Release Decades
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={decadeData}
              margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="decade" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Titles" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
