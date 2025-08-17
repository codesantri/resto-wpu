import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis, Legend } from 'recharts';

interface LineChartProps {
  data: { name: string; total: number }[] | undefined | null;
}

export function LineCharts({ data }: LineChartProps) {
  if (!data) return null; // biar aman kalau data null/undefined

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={300} height={100} data={data}>
        <XAxis dataKey="name" hide /> 
        <YAxis hide /> 
        <Tooltip 
          wrapperClassName="!bg-white z-20 dark:!bg-neutral-900 rounded-md" 
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="total" 
          stroke="#00bba7" 
          strokeWidth={2} 
          dot={false} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
