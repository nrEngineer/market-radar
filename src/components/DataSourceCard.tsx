'use client'

import { motion } from './motion'

interface DataSource {
  name: string
  count: number
  active: boolean
  icon: string
}

export function DataSourceCard({ source, index }: { source: DataSource; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="glass-card group relative overflow-hidden p-5 text-center"
    >
      {/* Icon */}
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-lg transition-transform duration-300 group-hover:scale-110">
        {source.icon}
      </div>

      {/* Count */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
        className="text-2xl font-semibold tracking-tight text-slate-900"
      >
        {source.count.toLocaleString()}
      </motion.p>

      {/* Name */}
      <p className="mt-1.5 text-[13px] font-medium text-slate-500">
        {source.name}
      </p>

      {/* Status */}
      {source.active && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-medium text-emerald-600">稼働中</span>
        </div>
      )}
    </motion.div>
  )
}
