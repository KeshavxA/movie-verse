import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CareerChart = ({ credits }) => {
  const chartData = useMemo(() => {
    if (!credits || credits.length === 0) return [];

    const yearData = {};

    credits.forEach(item => {
      const dateString = item.release_date || item.first_air_date;
      const rating = item.vote_average;
      
      // Only include items that have a valid date and a rating greater than 0
      if (dateString && rating > 0) {
        const year = dateString.split('-')[0];
        if (!yearData[year]) {
          yearData[year] = { year, totalRating: 0, count: 0, projects: [] };
        }
        yearData[year].totalRating += rating;
        yearData[year].count += 1;
        yearData[year].projects.push(item.title || item.name);
      }
    });

    return Object.values(yearData)
      .map(data => ({
        year: data.year,
        rating: Number((data.totalRating / data.count).toFixed(1)),
        count: data.count,
        topProject: data.projects[0] // Simple reference for tooltip
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [credits]);

  if (chartData.length === 0) {
    return null;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-xl">
          <p className="font-bold text-slate-900 dark:text-white mb-1">{label}</p>
          <p className="text-blue-600 dark:text-blue-400 font-bold">
            Avg Rating: ⭐ {payload[0].value}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {payload[0].payload.count} Project(s)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
          <XAxis 
            dataKey="year" 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
            minTickGap={20}
          />
          <YAxis 
            domain={[0, 10]} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="rating" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRating)" 
            activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CareerChart;
