import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const FinancialChart = ({ budget, revenue }) => {
  // If we don't have both, or if they're 0, it doesn't make sense to show the chart
  if (!budget || !revenue || budget === 0 || revenue === 0) {
    return null;
  }

  const data = [
    { name: 'Budget', value: budget, fill: '#ef4444' }, // Red-ish for budget
    { name: 'Revenue', value: revenue, fill: '#3b82f6' } // Blue for revenue
  ];

  const formatCurrency = (value) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-xl">
          <p className="font-bold text-slate-900 dark:text-white mb-1">{data.name}</p>
          <p className="font-mono font-bold" style={{ color: data.fill }}>
            ${data.value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const profit = revenue - budget;
  const isProfitable = profit > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Financial Performance</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Budget vs. Worldwide Box Office</p>
        </div>
        <div className={`text-right ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
          <p className="text-xs font-bold uppercase tracking-wider mb-1">{isProfitable ? 'Profit' : 'Loss'}</p>
          <p className="text-xl font-mono font-bold">
            {isProfitable ? '+' : ''}${Math.abs(profit).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis 
              type="number" 
              tickFormatter={formatCurrency}
              tick={{ fill: '#64748b', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} 
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialChart;
