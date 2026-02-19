import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppHeader } from '@/components/AppHeader'
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
    locale: 'ja_JP',
    siteName: 'Market Radar',
    url: 'https://market-radar-rho.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Market Radar — プロフェッショナル市場調査プラットフォーム',
    description: 'AI駆動のリアルタイム市場分析。TAM/SAM/SOM、競合分析、トレンド予測を一つのプラットフォームに。',
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
          <AppHeader />

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
