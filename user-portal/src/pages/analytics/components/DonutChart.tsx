import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

interface DonutChartProps {
  data: { name: string; value: number }[]
  centerLabel?: string
  centerValue?: string
}

export function DonutChart({ data, centerLabel, centerValue }: DonutChartProps) {
  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const item = payload[0]
              return (
                <div className="rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-md">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-muted-foreground">{Number(item.value).toLocaleString()}</div>
                </div>
              )
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerValue && <span className="text-lg font-bold font-mono">{centerValue}</span>}
          {centerLabel && <span className="text-[10px] text-muted-foreground">{centerLabel}</span>}
        </div>
      )}
    </div>
  )
}
