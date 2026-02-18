'use client'

import { motion } from './motion'
import { type ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  accentColor?: 'brand' | 'emerald' | 'amber' | 'cyan' | 'rose'
}

const accentStyles = {
  brand: {
    iconBg: 'bg-[#3d5a99]/8',
    iconText: 'text-[#3d5a99]',
    borderHover: 'hover:border-[#3d5a99]/20',
  },
  emerald: {
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-600',
    borderHover: 'hover:border-emerald-200',
  },
  amber: {
    iconBg: 'bg-amber-50',
    iconText: 'text-amber-600',
    borderHover: 'hover:border-amber-200',
  },
  cyan: {
    iconBg: 'bg-cyan-50',
    iconText: 'text-cyan-600',
    borderHover: 'hover:border-cyan-200',
  },
  rose: {
    iconBg: 'bg-rose-50',
    iconText: 'text-rose-600',
    borderHover: 'hover:border-rose-200',
  },
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  accentColor = 'brand',
}: StatCardProps) {
  const accent = accentStyles[accentColor]

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`glass-card group relative overflow-hidden p-6 ${accent.borderHover}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-[13px] font-medium tracking-wide text-slate-400 uppercase">
            {label}
          </p>
          <p className="text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
          {sub && (
            <p className="text-sm text-slate-500">
              {sub}
            </p>
          )}
        </div>

        {icon && (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.iconBg} ${accent.iconText} transition-transform duration-300 group-hover:scale-110`}
          >
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  )
}
