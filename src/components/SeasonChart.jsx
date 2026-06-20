import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SeasonChart = ({ seasons }) => {
  // Filter out specials (usually season_number 0) and seasons with 0 episodes
  const validSeasons = seasons?.filter(s => s.season_number > 0 && s.episode_count > 0) || [];
  
  if (validSeasons.length === 0) {
    return null;
  }

  const data = validSeasons.map(s => ({
    name: `S${s.season_number}`,
    fullName: s.name,
    episodes: s.episode_count
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-xl">
          <p className="font-bold text-slate-900 dark:text-white mb-1">{data.fullName}</p>
          <p className="text-blue-600 dark:text-blue-400 font-bold">
            {data.episodes} Episodes
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Episodes Per Season</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Episode count breakdown</p>
      </div>

      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{fill: '#334155', opacity: 0.1}} />
            <Bar dataKey="episodes" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#3b82f6" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SeasonChart;
