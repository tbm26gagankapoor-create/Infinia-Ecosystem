import { AreaChart, Area, ResponsiveContainer } from 'recharts'

interface SparkChartProps {
  data: number[]
  color?: string
  height?: number
  showGradient?: boolean
}

export function SparkChart({ data, color = 'var(--chart-1)', height = 32, showGradient = true }: SparkChartProps) {
  const chartData = data.map((value, i) => ({ i, v: value }))
  const id = `spark-${Math.random().toString(36).slice(2, 8)}`

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        {showGradient && (
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
        )}
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={showGradient ? `url(#${id})` : 'none'}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
