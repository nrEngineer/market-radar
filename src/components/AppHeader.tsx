import Link from 'next/link'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2c4377] to-[#3d5a99]">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="2" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-[17px] font-semibold tracking-tight text-slate-900 group-hover:text-[#3d5a99] transition-colors">
              Market Radar
            </h1>
            <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
              SaaS ビルダーのための AI コンサルタント
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 border border-emerald-200/60">
            <span className="live-dot h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold tracking-wider text-emerald-700 uppercase">Live</span>
          </div>
        </div>
      </div>
    </header>
  )
}
