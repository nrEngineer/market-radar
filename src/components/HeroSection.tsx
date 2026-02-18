'use client'

import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <div className="relative overflow-hidden px-6 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 bg-white border-b border-slate-100">
      <div className="relative mx-auto max-w-7xl">
        {/* Tagline badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 flex justify-center sm:justify-start"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#3d5a99]/15 bg-[#3d5a99]/5 px-4 py-1.5">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#3d5a99]" />
            <span className="text-[12px] font-medium text-[#2c4377]">
              リアルタイム分析中
            </span>
            <span className="text-[12px] text-[#3d5a99]/40">·</span>
            <span className="text-[12px] text-[#3d5a99]/60">v3.0</span>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center text-4xl font-bold tracking-tight text-slate-900 sm:text-left sm:text-5xl lg:text-6xl"
        >
          <span className="block">市場の脈動を</span>
          <span className="block mt-1 gradient-text">プロフェッショナル精度で捕捉</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mx-auto mt-5 max-w-xl text-center text-[15px] leading-relaxed text-slate-500 sm:mx-0 sm:text-left sm:text-base"
        >
          AI駆動のマーケットインテリジェンスで、トレンド・機会・競合の動きを
          <br className="hidden sm:inline" />
          一つのダッシュボードに集約。意思決定を加速させます。
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-8 sm:justify-start sm:gap-12"
        >
          {[
            { value: '15,847', label: 'データポイント/日' },
            { value: '4', label: 'データソース' },
            { value: '< 3min', label: '更新間隔' },
          ].map((stat, i) => (
            <div key={i} className="text-center sm:text-left">
              <p className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[12px] font-medium text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
