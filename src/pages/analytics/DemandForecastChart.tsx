import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { DemandForecast } from '../../features/analytics/forecastService';

interface Props {
  data: DemandForecast[];
}

export function DemandForecastChart({ data }: Props) {
  // Transform data for recharts
  // We want to group by month (forecast_period_start) and have a line for each product
  const chartData = useMemo(() => {
    const grouped = data.reduce((acc, curr) => {
      const month = new Date(curr.forecast_period_start).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { month };
      }
      const productName = curr.products?.name || 'Unknown';
      acc[month][productName] = curr.predicted_quantity;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  }, [data]);

  // Extract unique product names to generate areas dynamically
  const products = useMemo(() => {
    const set = new Set<string>();
    data.forEach(d => {
      if (d.products?.name) set.add(d.products.name);
    });
    return Array.from(set);
  }, [data]);

  const colors = ['#166534', '#D97706', '#2563EB', '#9333EA'];

  if (data.length === 0) return <div>No forecast data available.</div>;

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            {products.map((p, i) => (
              <linearGradient key={p} id={`color${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend />
          {products.map((p, i) => (
            <Area 
              key={p} 
              type="monotone" 
              dataKey={p} 
              stroke={colors[i % colors.length]} 
              fillOpacity={1} 
              fill={`url(#color${i})`} 
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
