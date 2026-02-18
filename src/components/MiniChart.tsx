'use client'

interface MiniChartProps {
  data: { label: string; value: number }[]
  height?: number
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan'
  type?: 'bar' | 'area'
  showLabels?: boolean
}

const colorMap = {
  indigo: { fill: 'bg-[#3d5a99]', gradient: 'from-[#3d5a99]/20 to-[#3d5a99]/0', text: 'text-[#3d5a99]' },
  emerald: { fill: 'bg-emerald-500', gradient: 'from-emerald-500/20 to-emerald-500/0', text: 'text-emerald-600' },
  amber: { fill: 'bg-amber-500', gradient: 'from-amber-500/20 to-amber-500/0', text: 'text-amber-600' },
  rose: { fill: 'bg-rose-500', gradient: 'from-rose-500/20 to-rose-500/0', text: 'text-rose-600' },
  cyan: { fill: 'bg-cyan-500', gradient: 'from-cyan-500/20 to-cyan-500/0', text: 'text-cyan-600' },
}

export function MiniBarChart({ data, height = 80, color = 'indigo', showLabels = true }: MiniChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))
  const colors = colorMap[color]

  return (
    <div>
      <div className="flex items-end gap-1" style={{ height }}>
        {data.map((d, i) => {
          const barHeight = maxValue > 0 ? (d.value / maxValue) * 100 : 0
          return (
            <div key={i} className="group relative flex-1 flex flex-col items-center justify-end">
              <div
                className={`w-full rounded-t ${colors.fill} opacity-60 group-hover:opacity-100 transition-opacity cursor-default min-h-[2px]`}
                style={{ height: `${barHeight}%` }}
              />
              {/* Tooltip */}
              <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {d.value.toLocaleString()}
              </div>
            </div>
          )
        })}
      </div>
      {showLabels && (
        <div className="mt-1.5 flex gap-1">
          {data.map((d, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-[9px] text-slate-400 truncate block">{d.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function SparkLine({ data, color = 'indigo' }: { data: number[]; color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' }) {
  if (data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const h = 32
  const w = 80
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  })

  const strokeColor = color === 'emerald' ? '#0d9668' : color === 'amber' ? '#d97706' : color === 'rose' ? '#dc2626' : color === 'cyan' ? '#0891b2' : '#3d5a99'

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={points[points.length - 1].split(',')[0]}
        cy={points[points.length - 1].split(',')[1]}
        r="3"
        fill={strokeColor}
      />
    </svg>
  )
}
