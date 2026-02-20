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
    default: 'Market Radar — SaaS ビルダーのためのマーケットインテリジェンス',
    template: '%s | Market Radar',
  },
  description: 'コンサルなしで事業判断。市場分析・競合調査・TAM/SAM/SOM・Go-to-Market 戦略データをリアルタイムに提供。インディーハッカー・SaaS ビルダー向け。',
  keywords: ['SaaS', 'indie hacker', 'market analysis', 'market intelligence', 'TAM SAM SOM', 'competitive analysis', 'go to market', 'startup'],
  openGraph: {
    title: 'Market Radar — SaaS ビルダーのためのマーケットインテリジェンス',
    description: 'コンサルなしで事業判断。市場分析・競合調査・収益予測データをリアルタイムに提供。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'Market Radar',
    url: 'https://market-radar-rho.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Market Radar — SaaS ビルダーのためのマーケットインテリジェンス',
    description: 'コンサルなしで事業判断。市場分析・競合調査・Go-to-Market 戦略データを瞬時に提供。',
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
