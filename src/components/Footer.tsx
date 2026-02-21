'use client'

import Link from 'next/link'
import { navItems } from '@/data'

export function Footer() {
  return (
    <footer className="relative mt-8 border-t border-slate-200/80 bg-white px-6 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#2c4377]/15 to-[#3d5a99]/10">
                <svg className="h-3.5 w-3.5 text-[#3d5a99]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="2" />
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <span className="text-[13px] font-medium text-slate-600">
                Market Radar <span className="text-slate-400">v3.0 Pro</span>
              </span>
            </div>
            <p className="text-[12px] text-slate-400 max-w-xs leading-relaxed">
              データ駆動のプロフェッショナル市場調査プラットフォーム。TAM/SAM/SOM、競合分析、リスク評価、収益予測を統合。
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">ページ</p>
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[12px] text-slate-500 hover:text-[#3d5a99] transition-colors"
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">情報</p>
            <div className="space-y-1.5">
              <p className="text-[12px] text-slate-500">データ更新: 毎日 03:00 JST</p>
              <p className="text-[12px] text-slate-500">ソース: 4つのAPI</p>
              <p className="text-[12px] text-slate-500">分析手法: スコアリングエンジン + 統計分析</p>
              <Link href="/methodology" className="text-[12px] text-[#3d5a99] hover:text-[#2c4377] transition-colors block">
                詳細手法を見る →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-[11px] text-slate-400">
            © 2026 Market Radar · Powered by OpenClaw
          </p>
          <p className="text-[11px] text-slate-400">
            データの正確性を保証するものではありません · <Link href="/methodology" className="text-slate-500 hover:text-[#3d5a99]">免責事項</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
