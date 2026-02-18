'use client'

import { motion } from './motion'
import { Badge } from './Badge'
import { ScoreBar } from './ScoreBar'

interface Opportunity {
  id: string
  title: string
  category: string
  revenue: string
  growth: string
  confidence: number
  risk: 'low' | 'medium' | 'high'
  timeframe: string
  description: string
}

const riskConfig = {
  low: { variant: 'emerald' as const, label: '低リスク' },
  medium: { variant: 'amber' as const, label: '中リスク' },
  high: { variant: 'rose' as const, label: '高リスク' },
}

export function OpportunityCard({ opp, index }: { opp: Opportunity; index: number }) {
  const risk = riskConfig[opp.risk]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -3, transition: { duration: 0.25 } }}
      className="premium-card group relative overflow-hidden p-6 sm:p-7"
    >
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Rank indicator */}
      <div className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.03] text-sm font-semibold text-slate-500">
        #{index + 1}
      </div>

      {/* Header */}
      <div className="pr-12">
        <h3 className="text-[17px] font-semibold tracking-tight text-white group-hover:text-indigo-100 transition-colors duration-300">
          {opp.title}
        </h3>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <Badge variant="brand" size="md">{opp.category}</Badge>
          <Badge variant={risk.variant} size="md" dot>{risk.label}</Badge>
          <Badge variant="ghost" size="md">⏱ {opp.timeframe}</Badge>
        </div>
      </div>

      {/* Revenue & Growth */}
      <div className="mt-5 flex items-baseline gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">予想収益</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
            {opp.revenue}
          </p>
        </div>
        <div className="rounded-lg bg-emerald-500/10 px-2.5 py-1">
          <span className="text-sm font-semibold text-emerald-400">{opp.growth}</span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-[14px] leading-relaxed text-slate-400/90">
        {opp.description}
      </p>

      {/* Confidence bar */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            信頼度スコア
          </span>
          <span className="text-xs font-semibold tabular-nums text-indigo-300">
            {opp.confidence}%
          </span>
        </div>
        <ScoreBar
          score={opp.confidence}
          showLabel={false}
          size="md"
          variant="gradient"
        />
      </div>
    </motion.div>
  )
}
