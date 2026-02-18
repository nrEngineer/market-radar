'use client'

import { motion } from './motion'

interface ScoreBarProps {
  score: number
  maxScore?: number
  showLabel?: boolean
  size?: 'sm' | 'md'
  variant?: 'brand' | 'emerald' | 'gradient'
}

const barVariants = {
  brand: 'bg-gradient-to-r from-[#2c4377] via-[#3d5a99] to-[#607db4]',
  emerald: 'bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-400',
  gradient: 'bg-gradient-to-r from-[#2c4377] via-[#3d5a99] to-[#8da3cc]',
}

const trackSizes = {
  sm: 'h-1.5',
  md: 'h-2',
}

export function ScoreBar({
  score,
  maxScore = 100,
  showLabel = true,
  size = 'sm',
  variant = 'brand',
}: ScoreBarProps) {
  const percentage = Math.min((score / maxScore) * 100, 100)

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 rounded-full bg-slate-100 ${trackSizes[size]}`}>
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: `${percentage}%`, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`${trackSizes[size]} rounded-full ${barVariants[variant]}`}
        />
      </div>
      {showLabel && (
        <span className="w-8 text-right text-xs font-medium tabular-nums text-slate-500">
          {score}
        </span>
      )}
    </div>
  )
}
