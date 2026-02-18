'use client'

import { motion } from './motion'

interface CategoryData {
  name: string
  apps: number
  growth: string
}

const categoryIcons: Record<string, string> = {
  'AI Tools': '🤖',
  'Productivity': '⚡',
  'Health & Fitness': '💪',
  'Finance': '💰',
}

const categoryAccents: Record<string, string> = {
  'AI Tools': 'from-[#3d5a99]/10 to-[#3d5a99]/3',
  'Productivity': 'from-cyan-100/80 to-cyan-50/30',
  'Health & Fitness': 'from-emerald-100/80 to-emerald-50/30',
  'Finance': 'from-amber-100/80 to-amber-50/30',
}

export function CategoryCard({ category, index }: { category: CategoryData; index: number }) {
  const icon = categoryIcons[category.name] || '📊'
  const gradient = categoryAccents[category.name] || 'from-[#3d5a99]/10 to-[#3d5a99]/3'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ x: 4, transition: { duration: 0.2 } }}
      className="glass-card group relative flex items-center gap-5 overflow-hidden px-6 py-5"
    >
      {/* Left accent bar */}
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#3d5a99] to-[#8da3cc] opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-r" />

      {/* Icon container */}
      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-xl transition-transform duration-300 group-hover:scale-105`}>
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold tracking-tight text-slate-800">
          {category.name}
        </p>
        <p className="mt-0.5 text-[13px] text-slate-400">
          {category.apps.toLocaleString()} アプリ
        </p>
      </div>

      {/* Growth */}
      <div className="flex-shrink-0 text-right">
        <p className="text-lg font-semibold tracking-tight gradient-text-emerald">
          {category.growth}
        </p>
        <p className="text-[11px] font-medium text-slate-400">成長率</p>
      </div>

      {/* Chevron */}
      <svg
        className="h-4 w-4 flex-shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-slate-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </motion.div>
  )
}
