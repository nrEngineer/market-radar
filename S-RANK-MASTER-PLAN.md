# 🏆 全10事業部 Sランク達成マスタープラン

> **作成日**: 2026-02-18  
> **目標**: 全10部署 → Sランク (90/100以上)  
> **期間**: 12週間 (Week 1-12)  
> **現在の総合評価**: C+ → 目標: **S (全部署90+)**

---

## 📊 エグゼクティブサマリー

### 現状 → 目標マッピング

| # | 部署 | 現在 | 目標 | Gap | 優先度 |
|---|------|------|------|-----|--------|
| 1 | フロントエンド開発部 | B+(78) | S(95) | +17 | 🟡 Medium |
| 2 | バックエンド開発部 | D+(38) | S(90) | +52 | 🔴 High |
| 3 | データエンジニアリング部 | D(32) | S(92) | +60 | 🔴 High |
| 4 | AI・分析エンジン部 | C+(55) | S(94) | +39 | 🔴 High |
| 5 | インフラストラクチャ部 | C(50) | S(91) | +41 | 🔴 High |
| 6 | セキュリティ部 ★ | F(15) | S(96) | +81 | 🔴🔴 Critical |
| 7 | 運用・保守部 ★ | F(12) | S(93) | +81 | 🔴🔴 Critical |
| 8 | 品質保証部 ★ | F(8) | S(95) | +87 | 🔴🔴 Critical |
| 9 | 競合・市場分析部 | C-(42) | S(90) | +48 | 🟡 Medium |
| 10 | 戦略・プロダクト部 | B-(65) | S(92) | +27 | 🟡 Medium |

### 総合スコア推移目標

```
Week 0 (現在): C+  (平均 39.5/100)
Week 2:        C   (平均 55/100)   — セキュリティ緊急修復完了
Week 4:        B-  (平均 65/100)   — データパイプライン稼働
Week 6:        B+  (平均 75/100)   — テスト・監視基盤完成
Week 8:        A-  (平均 82/100)   — AI実用化・品質ゲート完成
Week 10:       A   (平均 88/100)   — 全機能リアルデータ化
Week 12:       S   (平均 92+/100)  — Sランク達成 🏆
```

---

## 🔥 Phase 0: 緊急対応 (今日中 — 2026-02-18)

### P0-1: ハードコード認証トークン除去

**現状**: `src/app/api/collect/route.ts` と `src/app/api/data/route.ts` に `'Bearer ***REMOVED***'` がハードコード

**対応手順**:
1. 環境変数 `CRON_SECRET` を `.env.local` に追加
2. 両APIルートのハードコードトークンを `process.env.CRON_SECRET` に置換
3. Vercel環境変数にも `CRON_SECRET` を設定
4. GitHub履歴からトークンを削除 (BFG Repo Cleaner)

**実装コード**:
```typescript
// Before (DANGEROUS)
if (authToken !== 'Bearer ***REMOVED***') {

// After (SECURE)
const cronSecret = process.env.CRON_SECRET
if (!cronSecret || authToken !== `Bearer ${cronSecret}`) {
```

### P0-2: Supabase RLS有効化

**現状**: スキーマファイルでRLSがコメントアウト状態

**対応手順**:
1. Supabaseダッシュボードで全テーブルにRLS有効化
2. 読み取りポリシー: `anon`ロールに`SELECT`許可
3. 書き込みポリシー: `service_role`のみ`INSERT/UPDATE/DELETE`許可
4. `collected_data`と`collection_logs`はサーバーサイドのみ

**SQLポリシー**:
```sql
-- opportunities: 誰でも読める、service_roleのみ書ける
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Service write" ON opportunities FOR ALL USING (auth.role() = 'service_role');

-- collected_data: service_roleのみ
ALTER TABLE collected_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service only" ON collected_data FOR ALL USING (auth.role() = 'service_role');
```

### P0-3: npm audit脆弱性修正

**対応**: `npm audit fix --force` 実行 + eslint関連の互換性確認

---

## 📋 部署別Sランク達成詳細プラン

---

### 🎨 Dept.1 フロントエンド開発部: B+(78) → S(95)

**Gap**: +17点 | **難易度**: ★★☆☆☆ | **所要週数**: 6週

#### Sランク達成条件 (95/100)
- [ ] Lighthouse Performance ≥ 95
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] WCAG 2.1 AAA準拠
- [ ] 全ブレークポイントレスポンシブ完全対応
- [ ] Core Web Vitals全項目グリーン
- [ ] デザインシステム完全文書化
- [ ] i18n基盤構築 (日英)
- [ ] コンポーネントStorybook化

#### 週次タスク

| Week | タスク | 成功指標 | スコア寄与 |
|------|--------|---------|-----------|
| 2 | Lighthouse全項目テスト + aria-label修正 | Acc ≥ 90 | +5 |
| 3 | next/image最適化 + LCP改善 | LCP < 2.5s | +3 |
| 4 | デザイントークン分離 (tokens.css) | CSS30%削減 | +2 |
| 5 | レスポンシブ完全対応テスト | 全BP動作確認 | +3 |
| 6 | react-intl i18n基盤 | 日英切替可能 | +2 |
| 8 | Storybook導入 + コンポーネント文書化 | 全19コンポーネント | +2 |

#### 具体的改善コード例

**アクセシビリティ改善**:
```tsx
// Before
<div onClick={handleClick}>クリック</div>

// After (S-Rank)
<button
  onClick={handleClick}
  aria-label="市場データを更新"
  role="button"
  tabIndex={0}
>
  クリック
</button>
```

**next/image最適化**:
```tsx
// Before
<img src="/hero.png" alt="hero" />

// After (S-Rank)
import Image from 'next/image'
<Image 
  src="/hero.png" 
  alt="Market Radarダッシュボード" 
  width={1200} 
  height={630}
  priority
  placeholder="blur"
/>
```

---

### ⚙️ Dept.2 バックエンド開発部: D+(38) → S(90)

**Gap**: +52点 | **難易度**: ★★★★☆ | **所要週数**: 8週

#### Sランク達成条件 (90/100)
- [ ] 全APIがSupabase DB接続 (模擬データ完全排除)
- [ ] JWT認証実装 (Supabase Auth)
- [ ] Rate Limiting (100req/min/IP)
- [ ] APIレスポンス標準化 (RFC 7807 Problem Details)
- [ ] OpenAPI (Swagger) ドキュメント自動生成
- [ ] APIレスポンスP95 < 500ms
- [ ] エラーハンドリング100%カバー
- [ ] DB接続プーリング最適化
- [ ] APIバージョニング (v1)

#### 週次タスク

| Week | タスク | 成功指標 | スコア寄与 |
|------|--------|---------|-----------|
| 1 | `/api/data` をSupabase接続に移行 | DB実データ返却 | +15 |
| 1 | 認証トークン環境変数化 | ハードコード0件 | +10 |
| 2 | `/api/collect` にDB保存処理追加 | INSERT成功 | +8 |
| 3 | Rate Limiting middleware実装 | 100req/min制限 | +5 |
| 4 | APIレスポンス標準化 (error types) | 統一エラー型 | +4 |
| 5 | Supabase Auth JWT認証統合 | 認証フロー完成 | +5 |
| 6 | OpenAPI spec自動生成 | Swagger UI動作 | +3 |
| 8 | パフォーマンス最適化 | P95 < 500ms | +2 |

#### `/api/data` Supabase接続実装

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { 
  getOpportunitiesFromDB, 
  getTrendsFromDB, 
  getCategoriesFromDB,
  getLatestCollectedData 
} from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    switch (type) {
      case 'opportunities':
        const opportunities = await getOpportunitiesFromDB()
        return NextResponse.json({ data: opportunities, count: opportunities.length })
      
      case 'trends':
        const trends = await getTrendsFromDB()
        return NextResponse.json({ data: trends, count: trends.length })
      
      case 'categories':
        const categories = await getCategoriesFromDB()
        return NextResponse.json({ data: categories, count: categories.length })
      
      case 'collection-status':
        const logs = await getLatestCollectedData()
        return NextResponse.json({ data: logs })
      
      case 'stats':
        // Aggregate stats from DB
        const { data: oppCount } = await supabase
          .from('opportunities').select('id', { count: 'exact', head: true })
        const { data: trendCount } = await supabase
          .from('trends').select('id', { count: 'exact', head: true })
        return NextResponse.json({
          totalOpportunities: oppCount?.length ?? 0,
          totalTrends: trendCount?.length ?? 0,
          lastUpdate: new Date().toISOString()
        })
      
      default:
        const allData = {
          opportunities: await getOpportunitiesFromDB(),
          trends: await getTrendsFromDB(),
          categories: await getCategoriesFromDB(),
          lastUpdate: new Date().toISOString()
        }
        return NextResponse.json(allData)
    }
  } catch (error) {
    console.error('Data API error:', error)
    return NextResponse.json(
      { 
        type: 'https://market-radar.dev/errors/internal',
        title: 'Internal Server Error',
        status: 500,
        detail: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
```

---

### 📊 Dept.3 データエンジニアリング部: D(32) → S(92)

**Gap**: +60点 | **難易度**: ★★★★☆ | **所要週数**: 8週

#### Sランク達成条件 (92/100)
- [ ] 4データソース全て実API接続
- [ ] 全収集データがSupabaseに自動保存
- [ ] Vercel Cron Job (毎日3:00 JST自動収集)
- [ ] ETLパイプライン (raw → processed)
- [ ] データバリデーション + 重複排除
- [ ] データ欠損率 < 1%
- [ ] 収集ログの完全記録
- [ ] データ鮮度 < 24時間
- [ ] バックフィル機能

#### 週次タスク

| Week | タスク | 成功指標 | スコア寄与 |
|------|--------|---------|-----------|
| 1 | 収集データSupabase保存実装 | collected_dataテーブルINSERT | +15 |
| 2 | Product Hunt GraphQL API実装 | 実データ取得 | +10 |
| 2 | Vercel Cron Job設定 | 自動収集動作 | +8 |
| 3 | ETLパイプライン構築 | raw→processed変換 | +8 |
| 4 | データバリデーション層 | 欠損率<5% | +6 |
| 5 | 重複排除ロジック | 重複0% | +5 |
| 6 | Google Trends API統合 | 4番目のソース | +5 |
| 8 | バックフィル + データ品質ダッシュボード | 欠損率<1% | +3 |

#### 収集→DB保存 実装コード

```typescript
// src/lib/data-pipeline.ts
import { supabaseAdmin } from './supabase'

export async function saveCollectionResult(result: CollectionResult): Promise<void> {
  const startTime = Date.now()
  
  try {
    // 1. collected_data テーブルに保存
    const { error: dataError } = await supabaseAdmin
      .from('collected_data')
      .insert({
        source: result.source,
        raw_data: result.data,
        data_count: result.dataCount,
        status: result.status,
        error: result.error || null,
        metadata: { timestamp: result.timestamp }
      })

    if (dataError) throw dataError

    // 2. collection_logs に記録
    const executionTime = Date.now() - startTime
    await supabaseAdmin
      .from('collection_logs')
      .insert({
        source: result.source,
        status: result.status,
        data_count: result.dataCount,
        error: result.error || null,
        execution_time_ms: executionTime,
        metadata: { version: '1.0' }
      })

    console.log(`[Pipeline] Saved ${result.dataCount} items from ${result.source} in ${executionTime}ms`)
  } catch (error) {
    console.error(`[Pipeline] Failed to save ${result.source}:`, error)
    throw error
  }
}
```

#### Vercel Cron設定

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/collect",
      "schedule": "0 18 * * *"
    }
  ]
}
```

---

### 🤖 Dept.4 AI・分析エンジン部: C+(55) → S(94)

**Gap**: +39点 | **難易度**: ★★★★☆ | **所要週数**: 10週

#### Sランク達成条件 (94/100)
- [ ] OpenAI/Claude API統合による洞察生成
- [ ] スコアリングエンジンがリアルデータで動作
- [ ] 時系列予測モデル (基本回帰分析)
- [ ] 感情分析モジュール
- [ ] モデル精度評価基盤 (MAPE計測)
- [ ] A/Bテストフレームワーク
- [ ] 予測精度 ≥ 70%
- [ ] 分析レポート自動生成

#### 週次タスク

| Week | タスク | 成功指標 | スコア寄与 |
|------|--------|---------|-----------|
| 2 | スコアリングエンジンDB接続 | DBデータでスコア計算 | +8 |
| 3 | OpenAI API統合 (洞察生成) | GPT-4分析テキスト出力 | +10 |
| 4 | インサイトのDB保存・表示連携 | ダッシュボード反映 | +5 |
| 6 | 時系列予測プロトタイプ | 基本回帰分析動作 | +6 |
| 8 | 感情分析モジュール | レビュー感情分類 | +5 |
| 10 | モデル評価・バックテスト基盤 | MAPE計測自動化 | +3 |
| 10 | 分析レポート自動生成 | 週次レポートPDF | +2 |

#### OpenAI統合実装

```typescript
// src/lib/analysis/ai-insights.ts
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateMarketInsight(data: {
  trends: TrendData[]
  opportunities: OpportunityDetail[]
  recentData: DatabaseCollectedData[]
}): Promise<string> {
  const prompt = `あなたは一流の市場アナリストです。以下のデータから重要な洞察を3つ抽出してください。

## トレンドデータ
${JSON.stringify(data.trends.slice(0, 5), null, 2)}

## 機会データ
${JSON.stringify(data.opportunities.slice(0, 3), null, 2)}

## 最新収集データ概要
ソース数: ${data.recentData.length}
データポイント: ${data.recentData.reduce((sum, d) => sum + d.data_count, 0)}

JSON形式で回答:
[{"insight": "...", "impact": "positive|negative|neutral", "confidence": 0-100, "actionable": "..."}]`

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  })

  return response.choices[0].message.content || '[]'
}
```

---

### 🏗️ Dept.5 インフラストラクチャ部: C(50) → S(91)

**Gap**: +41点 | **難易度**: ★★★☆☆ | **所要週数**: 8週

#### Sランク達成条件 (91/100)
- [ ] CI/CDパイプライン全グリーン (ESLintエラー0件)
- [ ] デプロイ時間 < 5分
- [ ] PR→本番 24時間以内
- [ ] Preview Deploy (PRごと)
- [ ] ステージング環境構築
- [ ] Supabaseバックアップ設定
- [ ] CDN最適化
- [ ] 環境変数管理 (Vercel + dotenv-vault)
- [ ] Infrastructure as Code

#### 週次タスク

| Week | タスク | 成功指標 | スコア寄与 |
|------|--------|---------|-----------|
| 1 | ESLintエラー全修正 → CI復旧 | CI全グリーン | +12 |
| 2 | Vercel Preview Deploy有効化 | PRプレビュー動作 | +5 |
| 3 | ステージング環境構築 | staging.market-radar.app | +6 |
| 4 | Supabaseバックアップ確認 | RPO/RTO定義 | +4 |
| 5 | 環境変数管理改善 | dotenv-vault導入 | +4 |
| 6 | CDN最適化 + Edge Functions | レスポンス改善 | +4 |
| 8 | CI/CDにテスト必須化 | PRマージ条件設定 | +3 |
| 10 | GitHub Actionsパイプライン最適化 | ビルド < 3分 | +3 |

---

### 🛡️ Dept.6 セキュリティ部: F(15) → S(96) ★最重要

**Gap**: +81点 | **難易度**: ★★★★★ | **所要週数**: 10週

#### Sランク達成条件 (96/100)
- [ ] ハードコードシークレット 0件
- [ ] RLS全テーブル有効
- [ ] CSP (Content Security Policy) 設定
- [ ] Rate Limiting全APIに適用
- [ ] npm脆弱性 0件
- [ ] OWASP Top 10全項目対応
- [ ] Dependabot + GitGuardian有効
- [ ] SAST (静的解析) CI統合
- [ ] シークレットローテーション手順
- [ ] セキュリティインシデント対応計画
- [ ] 四半期ペネトレーションテスト計画
- [ ] データ暗号化 (at rest + in transit)

#### 週次タスク

| Week | タスク | 成功指標 | スコア寄与 |
|------|--------|---------|-----------|
| 0 (今日) | ハードコードトークン除去 | シークレット0件 | +15 |
| 0 (今日) | npm audit fix | 脆弱性0件 | +5 |
| 1 | Supabase RLS有効化 | 不正アクセス遮断 | +12 |
| 1 | .env.local gitignore確認 | 漏洩リスク排除 | +3 |
| 2 | CSPヘッダー設定 | XSS防御 | +8 |
| 2 | Rate Limiting実装 | DoS防御 | +5 |
| 3 | Dependabot有効化 | 自動脆弱性アラート | +4 |
| 4 | OWASP Top 10チェックリスト | 全10項目レビュー | +6 |
| 5 | GitGuardian / git-secrets | シークレット自動検知 | +4 |
| 6 | SAST導入 (Semgrep) | CI統合 | +5 |
| 8 | シークレットローテーション手順 | 手順書完成 | +4 |
| 10 | インシデント対応計画 | Runbook完成 | +5 |

#### CSP設定実装

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co",
      "frame-ancestors 'none'",
    ].join('; ')
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

export default {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  }
}
```

---

### 📡 Dept.7 運用・保守部: F(12) → S(93) ★最重要

**Gap**: +81点 | **難易度**: ★★★★☆ | **所要週数**: 10週

#### Sランク達成条件 (93/100)
- [ ] `/api/health` ヘルスチェック (DB + 外部API疎通)
- [ ] Sentry導入 (エラー自動キャッチ)
- [ ] 稼働率監視 (UptimeRobot)
- [ ] 構造化ログ (pino)
- [ ] SLI/SLO定義・計測
- [ ] アラートルール (エラー率 > 1% → Slack通知)
- [ ] 監視ダッシュボード (Vercel Analytics)
- [ ] Runbook (障害パターン5種)
- [ ] ポストモーテムテンプレート
- [ ] 定期メンテナンスカレンダー
- [ ] 稼働率 ≥ 99.9%

#### 週次タスク

| Week | タスク | 成功指標 | スコア寄与 |
|------|--------|---------|-----------|
| 1 | `/api/health` エンドポイント作成 | 200 OK + DB疎通 | +10 |
| 1 | Vercel Logs基本確認 | エラーログ閲覧可能 | +3 |
| 2 | Sentry導入 | エラー自動キャッチ | +10 |
| 2 | UptimeRobot設定 | 稼働率計測開始 | +8 |
| 3 | 構造化ログ (pino) 導入 | JSON形式ログ | +6 |
| 3 | SLI/SLO定義文書 | 可用性99.9%目標 | +5 |
| 4 | アラートルール設定 | Slack通知テスト | +6 |
| 5 | インシデント対応フロー | エスカレーション定義 | +5 |
| 6 | Runbook作成 (5パターン) | 障害対応手順 | +6 |
| 8 | 監視ダッシュボード | Grafana/Vercel Analytics | +6 |
| 10 | ポストモーテムテンプレート | テンプレート完成 | +4 |
| 12 | 定期メンテナンスカレンダー | 月次メンテ計画 | +4 |

#### ヘルスチェック実装

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  checks: {
    database: { status: string; latencyMs: number }
    api: { status: string }
    memory: { usedMB: number; totalMB: number }
  }
  version: string
  uptime: number
}

export async function GET() {
  const startTime = Date.now()
  const checks: HealthStatus['checks'] = {
    database: { status: 'unknown', latencyMs: 0 },
    api: { status: 'ok' },
    memory: { usedMB: 0, totalMB: 0 }
  }

  // DB Check
  try {
    const dbStart = Date.now()
    const { error } = await supabase.from('collection_logs').select('id').limit(1)
    checks.database = {
      status: error ? 'error' : 'ok',
      latencyMs: Date.now() - dbStart
    }
  } catch {
    checks.database = { status: 'error', latencyMs: -1 }
  }

  // Memory Check
  if (typeof process !== 'undefined') {
    const mem = process.memoryUsage()
    checks.memory = {
      usedMB: Math.round(mem.heapUsed / 1024 / 1024),
      totalMB: Math.round(mem.heapTotal / 1024 / 1024)
    }
  }

  const allOk = checks.database.status === 'ok' && checks.api.status === 'ok'
  
  return NextResponse.json({
    status: allOk ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
    version: process.env.npm_package_version || '0.1.0',
    responseTimeMs: Date.now() - startTime
  }, { status: allOk ? 200 : 503 })
}
```

---

### ✅ Dept.8 品質保証部: F(8) → S(95) ★最重要

**Gap**: +87点 | **難易度**: ★★★★★ | **所要週数**: 10週

#### Sランク達成条件 (95/100)
- [ ] Vitest導入 + ユニットテスト50件+
- [ ] Playwright E2Eテスト (主要フロー5件)
- [ ] テストカバレッジ ≥ 90%
- [ ] ESLintエラー 0件
- [ ] TypeScript strict mode違反 0件
- [ ] `any`型 0件
- [ ] CI必須テスト (PRマージ条件)
- [ ] Lighthouse CIスコア閾値
- [ ] パフォーマンスベンチマーク
- [ ] コードレビューガイドライン

#### 週次タスク

| Week | タスク | 成功指標 | スコア寄与 |
|------|--------|---------|-----------|
| 1 | Vitest導入 + 設定 | テストランナー動作 | +5 |
| 1 | `any`型→proper types修正 | ESLintエラー0件 | +10 |
| 2 | スコアリングエンジンテスト (10件) | 全パス | +8 |
| 3 | API Routeテスト (10件) | 全パス | +8 |
| 4 | Playwright E2E基盤 | 3ページスモークテスト | +8 |
| 5 | コンポーネントテスト (10件) | 全パス | +6 |
| 6 | テストカバレッジ50%達成 | Vitest coverage | +8 |
| 7 | CI必須テスト設定 | PRマージ条件 | +6 |
| 8 | Lighthouse CI閾値設定 | スコア自動チェック | +5 |
| 10 | テストカバレッジ90%達成 | 全関数カバー | +10 |
| 12 | コードレビューガイドライン | 文書完成 | +4 |

#### Vitest設定

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

#### スコアリングエンジンテスト例

```typescript
// src/lib/analysis/__tests__/scoring.test.ts
import { describe, it, expect } from 'vitest'
import { calculateScore, ScoringInput, SCORING_WEIGHTS } from '../scoring'

describe('Scoring Engine', () => {
  const baseInput: ScoringInput = {
    samValue: 10_000_000_000, // 10B JPY
    cagr: 25,
    herfindahlIndex: 1500,
    competitorCount: 15,
    techComplexity: 70,
    costFeasibility: 60,
    teamFit: 80,
    adoptionStage: 'early_adopters',
    trendMomentum: 75,
    networkEffects: 60,
    switchingCosts: 50,
    dataAdvantage: 70,
    brandValue: 40,
  }

  it('should calculate overall score between 0 and 100', () => {
    const result = calculateScore(baseInput)
    expect(result.overall).toBeGreaterThanOrEqual(0)
    expect(result.overall).toBeLessThanOrEqual(100)
  })

  it('should return all 6 component scores', () => {
    const result = calculateScore(baseInput)
    expect(result.marketSize).toBeDefined()
    expect(result.growth).toBeDefined()
    expect(result.competition).toBeDefined()
    expect(result.feasibility).toBeDefined()
    expect(result.timing).toBeDefined()
    expect(result.moat).toBeDefined()
  })

  it('should have weights that sum to 1.0', () => {
    const total = Object.values(SCORING_WEIGHTS).reduce((a, b) => a + b, 0)
    expect(total).toBeCloseTo(1.0)
  })

  it('should give higher score for larger SAM', () => {
    const smallSam = calculateScore({ ...baseInput, samValue: 1_000_000 })
    const largeSam = calculateScore({ ...baseInput, samValue: 50_000_000_000 })
    expect(largeSam.marketSize).toBeGreaterThan(smallSam.marketSize)
  })

  it('should give score of 0 for SAM of 0', () => {
    const result = calculateScore({ ...baseInput, samValue: 0 })
    expect(result.marketSize).toBe(0)
  })

  it('should cap growth score at 100 for very high CAGR', () => {
    const result = calculateScore({ ...baseInput, cagr: 200 })
    expect(result.growth).toBeLessThanOrEqual(100)
  })

  it('should provide complete breakdown with formulas', () => {
    const result = calculateScore(baseInput)
    expect(result.breakdown.marketSize.formula).toBeTruthy()
    expect(result.breakdown.marketSize.calculation).toBeTruthy()
    expect(result.breakdown.marketSize.weight).toBe(SCORING_WEIGHTS.marketSize)
  })

  it('should penalize concentrated markets', () => {
    const fragmented = calculateScore({ ...baseInput, herfindahlIndex: 500 })
    const concentrated = calculateScore({ ...baseInput, herfindahlIndex: 8000 })
    expect(fragmented.competition).toBeGreaterThan(concentrated.competition)
  })

  it('should favor early_adopters timing', () => {
    const early = calculateScore({ ...baseInput, adoptionStage: 'early_adopters' })
    const late = calculateScore({ ...baseInput, adoptionStage: 'laggards' })
    expect(early.timing).toBeGreaterThan(late.timing)
  })

  it('should be reproducible (same input → same output)', () => {
    const result1 = calculateScore(baseInput)
    const result2 = calculateScore(baseInput)
    expect(result1.overall).toBe(result2.overall)
    expect(result1.breakdown).toEqual(result2.breakdown)
  })
})
```

---

### 🔍 Dept.9 競合・市場分析部: C-(42) → S(90)

**Gap**: +48点 | **難易度**: ★★★☆☆ | **所要週数**: 10週

#### Sランク達成条件 (90/100)
- [ ] モックデータ→DB実データ完全移行
- [ ] 競合自動検出パイプライン
- [ ] 日次競合更新
- [ ] Google Trends実データ統合
- [ ] 競合ベンチマークダッシュボード
- [ ] PEST分析機能
- [ ] 週次自動レポート生成 (Slack通知)
- [ ] 市場データ鮮度 < 24時間

#### 週次タスク

| Week | タスク | 成功指標 | スコア寄与 |
|------|--------|---------|-----------|
| 2 | モックデータ→DB移行 | DB動的取得 | +12 |
| 4 | 競合自動分類パイプライン | 日次競合更新 | +10 |
| 6 | Google Trends統合 | リアルデータ反映 | +8 |
| 8 | 競合ベンチマークダッシュボード | 比較チャート | +8 |
| 9 | PEST分析機能 | 4要素分析表示 | +5 |
| 10 | 週次自動レポート | Slack通知 | +5 |

---

### 📈 Dept.10 戦略・プロダクト部: B-(65) → S(92)

**Gap**: +27点 | **難易度**: ★★★☆☆ | **所要週数**: 10週

#### Sランク達成条件 (92/100)
- [ ] KPI計測ダッシュボード (主要5KPI自動計測)
- [ ] GitHub Projectsタスク管理
- [ ] ユーザーフィードバック機構
- [ ] GTM戦略具体化 (チャネル別CAC)
- [ ] 収益化ロードマップ (Stripe統合計画)
- [ ] NPS調査基盤
- [ ] プロダクトロードマップ可視化
- [ ] OKR設定・トラッキング

#### 週次タスク

| Week | タスク | 成功指標 | スコア寄与 |
|------|--------|---------|-----------|
| 1 | GitHub Projects設定 | 全タスク可視化 | +5 |
| 4 | KPI計測ダッシュボード | 5KPI自動計測 | +8 |
| 6 | フィードバックフォーム実装 | ユーザーFB収集 | +4 |
| 8 | GTM戦略具体化 | チャネル別CAC | +4 |
| 8 | 収益化ロードマップ | Stripe計画 | +3 |
| 10 | NPS調査基盤 | 初回調査実施 | +3 |

---

## 🗺️ 12週間 統合ロードマップ (ガントチャート)

```
Week:  1   2   3   4   5   6   7   8   9   10  11  12
       ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ───
D1 FE  │▓▓▓│▓▓▓│▒▒▒│▒▒▒│▒▒▒│▒▒▒│░░░│░░░│   │   │   │   │ 78→95
D2 BE  │▓▓▓│▓▓▓│▓▓▓│▒▒▒│▒▒▒│▒▒▒│░░░│░░░│   │   │░░░│░░░│ 38→90
D3 DE  │▓▓▓│▓▓▓│▒▒▒│▒▒▒│▒▒▒│▒▒▒│░░░│░░░│   │   │   │   │ 32→92
D4 AI  │   │▓▓▓│▓▓▓│▒▒▒│   │▒▒▒│   │▒▒▒│   │░░░│   │   │ 55→94
D5 IF  │▓▓▓│▓▓▓│▒▒▒│▒▒▒│▒▒▒│▒▒▒│   │░░░│   │░░░│   │   │ 50→91
D6 SC  │▓▓▓│▓▓▓│▓▓▓│▒▒▒│▒▒▒│▒▒▒│   │▒▒▒│   │░░░│   │   │ 15→96
D7 OP  │▓▓▓│▓▓▓│▒▒▒│▒▒▒│▒▒▒│▒▒▒│   │▒▒▒│   │░░░│   │░░░│ 12→93
D8 QA  │▓▓▓│▓▓▓│▓▓▓│▒▒▒│▒▒▒│▒▒▒│▒▒▒│▒▒▒│   │░░░│   │░░░│ 8→95
D9 MA  │   │▓▓▓│   │▒▒▒│   │▒▒▒│   │▒▒▒│▒▒▒│░░░│   │   │ 42→90
D10 SP │▓▓▓│   │   │▒▒▒│   │▒▒▒│   │▒▒▒│   │░░░│   │   │ 65→92

▓ = Critical (P0/P1)  ▒ = Important (P2)  ░ = Enhancement (P3)
```

---

## 📊 週次スコア推移予測

| Week | D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 | D9 | D10 | 平均 | 評価 |
|------|----|----|----|----|----|----|----|----|----|----|------|------|
| 0 | 78 | 38 | 32 | 55 | 50 | 15 | 12 | 8 | 42 | 65 | **39.5** | C+ |
| 2 | 83 | 61 | 57 | 63 | 67 | 50 | 43 | 31 | 42 | 70 | **56.7** | C |
| 4 | 86 | 73 | 72 | 76 | 75 | 68 | 60 | 57 | 54 | 78 | **69.9** | B- |
| 6 | 90 | 80 | 82 | 82 | 82 | 78 | 71 | 73 | 65 | 82 | **78.5** | B+ |
| 8 | 92 | 85 | 87 | 88 | 86 | 86 | 82 | 83 | 78 | 87 | **85.4** | A- |
| 10 | 94 | 88 | 90 | 92 | 89 | 92 | 88 | 90 | 85 | 90 | **89.8** | A |
| 12 | **95** | **90** | **92** | **94** | **91** | **96** | **93** | **95** | **90** | **92** | **92.8** | **S** 🏆 |

---

## 次のドキュメント

1. ✅ **S-RANK-MASTER-PLAN.md** (本ドキュメント) — 全10部署のSランク達成プラン
2. → **S-RANK-QUALITY-STANDARDS.md** — SaaS開発プロ企業品質基準
3. → **S-RANK-AUTOMATION-SYSTEM.md** — 継続的品質向上の自動化システム設計
4. → **S-RANK-KNOWLEDGE-SYSTEM.md** — 全プロセスの記録・ナレッジ化システム
5. → **S-RANK-WEEKLY-REPORT-TEMPLATE.md** — 週次Sランク進捗レポートフォーマット
