import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Market Radar — プロフェッショナル市場調査プラットフォーム',
    template: '%s | Market Radar',
  },
  description: 'AI駆動のリアルタイム市場分析。TAM/SAM/SOM、競合分析、トレンド予測、収益モデリングを一つのプラットフォームに集約。',
  keywords: ['market analysis', 'AI', 'trends', 'market intelligence', 'TAM SAM SOM', 'competitive analysis', 'market sizing'],
  openGraph: {
    title: 'Market Radar — プロフェッショナル市場調査プラットフォーム',
    description: 'AI駆動のリアルタイム市場分析。コンサルティングファーム品質の情報密度。',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="font-sans bg-[#f8f9fb]">
        {/* Content */}
        <div className="relative min-h-screen flex flex-col">
          {/* Global Header */}
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
                    Pro Market Intelligence Platform
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

          {/* Navigation */}
          <Navigation />

          {/* Main */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  )
}
