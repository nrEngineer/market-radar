# 🌍 言語分離設計 - 英語・日本語完全分離システム

## 🎯 問題解決

**現在の問題**: 英語・日本語混在でユーザビリティ低下  
**解決策**: 完全分離・i18n国際化システム実装

---

## 🏗️ システム設計

### 📁 ディレクトリ構造
```
src/
├── app/
│   ├── [locale]/          # 動的言語ルーティング
│   │   ├── ja/           # 日本語版
│   │   │   ├── page.tsx  # トップページ（日本語）
│   │   │   ├── pricing/  # 料金ページ（日本語）
│   │   │   └── analysis/ # 分析ページ（日本語）
│   │   ├── en/           # English版
│   │   │   ├── page.tsx  # Top Page (English)
│   │   │   ├── pricing/  # Pricing (English)
│   │   │   └── analysis/ # Analysis (English)
│   └── api/              # API（言語非依存）
├── locales/              # 翻訳ファイル
│   ├── ja.json          # 日本語翻訳
│   └── en.json          # English翻訳
├── components/
│   ├── ui/              # UI（多言語対応）
│   └── LanguageToggle.tsx # 言語切り替え
└── lib/
    └── i18n.ts          # 国際化設定
```

### 🔄 URL構造
```
日本語版:
https://market-radar-rho.vercel.app/ja
https://market-radar-rho.vercel.app/ja/pricing  
https://market-radar-rho.vercel.app/ja/analysis

English版:
https://market-radar-rho.vercel.app/en
https://market-radar-rho.vercel.app/en/pricing
https://market-radar-rho.vercel.app/en/analysis

自動リダイレクト:
https://market-radar-rho.vercel.app → /ja (Japan IP)
https://market-radar-rho.vercel.app → /en (Other IP)
```

---

## 💻 実装コード

### 1. Next.js国際化設定
```typescript
// next.config.js
const nextConfig = {
  i18n: {
    locales: ['ja', 'en'],
    defaultLocale: 'ja',
    localeDetection: true,
  }
}
```

### 2. 翻訳ファイル
```json
// locales/ja.json
{
  "nav": {
    "home": "ホーム",
    "pricing": "料金",  
    "analysis": "分析",
    "dashboard": "ダッシュボード"
  },
  "hero": {
    "title": "市場分析ツール Market Radar",
    "subtitle": "McKinsey級分析を月額5,000円で。24時間365日自動PDCA。",
    "cta": "無料で始める"
  },
  "features": {
    "realtime": "リアルタイム市場分析",
    "automation": "完全自動化PDCA", 
    "intelligence": "AI市場インテリジェンス"
  }
}

// locales/en.json  
{
  "nav": {
    "home": "Home",
    "pricing": "Pricing",
    "analysis": "Analysis", 
    "dashboard": "Dashboard"
  },
  "hero": {
    "title": "Market Radar - AI Market Intelligence",
    "subtitle": "McKinsey-grade analysis at $45/month. 24/7 automated PDCA.",
    "cta": "Start Free Trial"
  },
  "features": {
    "realtime": "Real-time Market Analysis",
    "automation": "Full Automation PDCA",
    "intelligence": "AI Market Intelligence"
  }
}
```

### 3. 言語切り替えコンポーネント
```typescript
// components/LanguageToggle.tsx
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function LanguageToggle() {
  const router = useRouter()
  const { locale, pathname, asPath, query } = router

  const switchLanguage = (newLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: newLocale })
  }

  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={() => switchLanguage('ja')}
        className={`px-3 py-1 rounded ${locale === 'ja' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        🇯🇵 日本語
      </button>
      <button
        onClick={() => switchLanguage('en')} 
        className={`px-3 py-1 rounded ${locale === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        🇺🇸 English  
      </button>
    </div>
  )
}
```

### 4. 翻訳Hook
```typescript
// lib/useTranslation.ts
import { useRouter } from 'next/router'
import ja from '../locales/ja.json'
import en from '../locales/en.json'

const translations = { ja, en }

export function useTranslation() {
  const { locale = 'ja' } = useRouter()
  const t = translations[locale as keyof typeof translations]
  
  return { t, locale }
}
```

---

## 🎨 UI/UX分離戦略

### 🇯🇵 日本語版特化
- **色使い**: 日本の企業好み（紺・グレー基調）
- **レイアウト**: 縦書き対応、詳細情報重視
- **コンテンツ**: 日本企業事例、日本法規制対応
- **料金**: 円表記、日本の予算感に合わせた価格帯

### 🇺🇸 English版特化  
- **色使い**: 国際的（青・緑基調）
- **レイアウト**: シンプル、CTA強調
- **コンテンツ**: Global case studies, English market focus
- **料金**: USD表記、海外SaaS標準価格帯

---

## 📊 データ・分析結果分離

### 🇯🇵 日本語データ重視
```javascript
const jaMarketData = {
  focus: ['日本企業', '東証上場企業', 'Japanese startups'],
  sources: ['日経', '東洋経済', 'Japan Times'],
  categories: ['製造業', 'IT', 'サービス業'],
  regulations: ['日本法準拠', 'GDPR対応']
}
```

### 🇺🇸 English Global Data
```javascript
const enMarketData = {
  focus: ['Fortune 500', 'Y Combinator', 'Global unicorns'],
  sources: ['TechCrunch', 'Product Hunt', 'Forbes'],
  categories: ['SaaS', 'FinTech', 'HealthTech'],
  regulations: ['GDPR', 'CCPA', 'SOX compliance']
}
```

---

## 🚀 実装優先度

### ⚡ Phase 1（今日実装）
- [x] 設計完了
- [ ] 基本i18n設定
- [ ] 言語切り替えボタン
- [ ] 主要ページ翻訳

### 📊 Phase 2（今週実装）  
- [ ] 全ページ翻訳完了
- [ ] 言語別データソース分離
- [ ] SEO最適化（言語別）
- [ ] 言語別Analytics設定

### 🌍 Phase 3（来週実装）
- [ ] 追加言語対応（中国語・韓国語）
- [ ] 言語別A/Bテスト
- [ ] 地域別料金設定
- [ ] カスタマーサポート多言語化

---

**🎯 Result**: 完全言語分離により、日本企業は日本語版、海外企業はEnglish版で最適化されたUXを提供**