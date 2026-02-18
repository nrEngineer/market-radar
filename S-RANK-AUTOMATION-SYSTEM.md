# 🤖 継続的品質向上 自動化システム設計

> **目的**: 品質の維持・向上を人手に頼らず自動化する  
> **原則**: 「自動化できるものは全て自動化する」  
> **目標自動化率**: 80%以上

---

## 1. 自動化システム全体アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                    自動化オーケストレーター                        │
│                   (GitHub Actions + Vercel)                  │
├─────────────┬─────────────┬─────────────┬───────────────────┤
│  品質ゲート   │  監視・アラート │  データ収集   │  レポート生成     │
│  CI/CD       │  Sentry       │  Cron Jobs   │  Weekly Report   │
│  ESLint      │  UptimeRobot  │  ETL         │  Score Tracking  │
│  Vitest      │  Vercel       │  Validation  │  Slack通知        │
│  Lighthouse  │  Health Check │  Cleanup     │  PDF Export      │
└─────────────┴─────────────┴─────────────┴───────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Supabase (データ層)                       │
│  opportunities │ trends │ collected_data │ quality_metrics   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. CI/CD パイプライン自動化

### 2.1 完全自動化パイプライン

```yaml
# .github/workflows/s-rank-pipeline.yml
name: S-Rank Quality Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  # ── Stage 1: 静的解析 ──
  static-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      
      - name: TypeScript Check
        run: npx tsc --noEmit
      
      - name: ESLint (Zero Tolerance)
        run: npx eslint . --max-warnings 0
      
      - name: Security Audit
        run: npm audit --audit-level=moderate
      
      - name: Secret Scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          extra_args: --only-verified

  # ── Stage 2: テスト ──
  test:
    runs-on: ubuntu-latest
    needs: static-analysis
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      
      - name: Unit Tests + Coverage
        run: npx vitest run --coverage
      
      - name: Coverage Check (≥80%)
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          echo "Coverage: $COVERAGE%"
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "❌ Coverage below 80%"
            exit 1
          fi
      
      - name: Upload Coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  # ── Stage 3: ビルド ──
  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Build Time Check
        run: |
          echo "Build completed successfully"
          # Build time is tracked by GitHub Actions automatically

  # ── Stage 4: E2E テスト ──
  e2e:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E Tests
        run: npx playwright test
      
      - name: Upload E2E Report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/

  # ── Stage 5: パフォーマンス ──
  lighthouse:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          uploadArtifacts: true
          temporaryPublicStorage: true
          configPath: './lighthouse.json'

  # ── Stage 6: スコア記録 ──
  record-quality-score:
    runs-on: ubuntu-latest
    needs: [static-analysis, test, build]
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Record Quality Metrics
        run: |
          # ここでSupabaseのquality_metricsテーブルにスコアを記録
          echo "Recording quality metrics..."
```

### 2.2 品質メトリクス自動記録

```typescript
// scripts/record-quality-metrics.ts
import { supabaseAdmin } from '../src/lib/supabase'

interface QualityMetrics {
  date: string
  eslint_errors: number
  eslint_warnings: number
  typescript_errors: number
  test_coverage: number
  test_count: number
  test_pass: number
  test_fail: number
  build_time_ms: number
  npm_vulnerabilities: number
  lighthouse_performance: number
  lighthouse_accessibility: number
  lighthouse_best_practices: number
  lighthouse_seo: number
  bundle_size_kb: number
}

async function recordMetrics(metrics: QualityMetrics) {
  const { error } = await supabaseAdmin
    .from('quality_metrics')
    .insert(metrics)
  
  if (error) {
    console.error('Failed to record metrics:', error)
    process.exit(1)
  }
  
  console.log('✅ Quality metrics recorded:', metrics.date)
}
```

---

## 3. 監視・アラート自動化

### 3.1 ヘルスチェック自動化

```typescript
// src/app/api/health/route.ts (拡張版)
// UptimeRobotから1分間隔でポーリング
// 異常検知時: Slack webhook → #alerts チャンネル
// 自動復旧: Vercel自動リデプロイトリガー
```

### 3.2 アラートルール

```yaml
# monitoring/alert-rules.yml
alerts:
  - name: API Error Rate High
    condition: error_rate > 1%
    window: 5m
    severity: critical
    action: slack_notify + pagerduty
    
  - name: Response Time Degraded
    condition: p95_latency > 1000ms
    window: 10m
    severity: warning
    action: slack_notify
    
  - name: Database Connection Failed
    condition: health_check.database == 'error'
    window: 1m
    severity: critical
    action: slack_notify + auto_restart
    
  - name: Data Collection Failed
    condition: collection_logs.status == 'error'
    window: 1h
    severity: warning
    action: slack_notify + retry(3)
    
  - name: Test Coverage Dropped
    condition: test_coverage < 80%
    window: per_commit
    severity: warning
    action: block_merge + slack_notify
    
  - name: Security Vulnerability Detected
    condition: npm_audit.moderate > 0
    window: per_commit
    severity: critical
    action: block_merge + slack_notify + create_issue
```

### 3.3 Slack通知テンプレート

```typescript
// src/lib/notifications.ts
export async function sendSlackAlert(alert: {
  severity: 'info' | 'warning' | 'critical'
  title: string
  message: string
  department: string
  metrics?: Record<string, string | number>
}) {
  const color = {
    info: '#36a64f',
    warning: '#ff9900',
    critical: '#ff0000'
  }[alert.severity]

  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attachments: [{
        color,
        title: `${alert.severity === 'critical' ? '🚨' : '⚠️'} [${alert.department}] ${alert.title}`,
        text: alert.message,
        fields: Object.entries(alert.metrics || {}).map(([k, v]) => ({
          title: k,
          value: String(v),
          short: true
        })),
        footer: 'Market Radar Quality Monitor',
        ts: Math.floor(Date.now() / 1000)
      }]
    })
  })
}
```

---

## 4. データ収集自動化

### 4.1 Cron Job スケジュール

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/collect?source=appstore",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/collect?source=hackernews",
      "schedule": "0 */3 * * *"
    },
    {
      "path": "/api/collect?source=producthunt",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/quality/check",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/reports/weekly",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

### 4.2 データ品質自動チェック

```typescript
// src/lib/data-quality.ts
export async function runDataQualityCheck(): Promise<DataQualityReport> {
  const checks: DataQualityCheck[] = []

  // 1. 鮮度チェック
  const { data: latestLogs } = await supabaseAdmin
    .from('collection_logs')
    .select('source, timestamp')
    .order('timestamp', { ascending: false })
    .limit(10)

  for (const log of latestLogs || []) {
    const hoursAgo = (Date.now() - new Date(log.timestamp).getTime()) / 3600000
    checks.push({
      name: `Data Freshness: ${log.source}`,
      status: hoursAgo < 24 ? 'pass' : hoursAgo < 48 ? 'warning' : 'fail',
      value: `${hoursAgo.toFixed(1)} hours ago`,
      threshold: '< 24 hours'
    })
  }

  // 2. 欠損率チェック
  const { count: totalRecords } = await supabaseAdmin
    .from('collected_data')
    .select('id', { count: 'exact', head: true })
  
  const { count: errorRecords } = await supabaseAdmin
    .from('collected_data')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'error')

  const missingRate = totalRecords ? ((errorRecords || 0) / totalRecords) * 100 : 100
  checks.push({
    name: 'Data Missing Rate',
    status: missingRate < 1 ? 'pass' : missingRate < 5 ? 'warning' : 'fail',
    value: `${missingRate.toFixed(2)}%`,
    threshold: '< 1%'
  })

  // 3. 重複チェック
  // 4. スキーマバリデーション
  // 5. 異常値検出

  return {
    timestamp: new Date().toISOString(),
    overallStatus: checks.every(c => c.status === 'pass') ? 'healthy' : 'degraded',
    checks,
    score: Math.round((checks.filter(c => c.status === 'pass').length / checks.length) * 100)
  }
}
```

---

## 5. レポート自動生成

### 5.1 週次品質レポート自動生成

```typescript
// src/app/api/reports/weekly/route.ts
export async function GET() {
  // 1. 各部署のスコアを集計
  const scores = await calculateDepartmentScores()
  
  // 2. 前週比を計算
  const previousScores = await getPreviousWeekScores()
  const deltas = calculateDeltas(scores, previousScores)
  
  // 3. マークダウンレポート生成
  const report = generateWeeklyReport(scores, deltas)
  
  // 4. Supabaseに保存
  await saveReport(report)
  
  // 5. Slack通知
  await sendSlackReport(report)
  
  return NextResponse.json({ status: 'ok', report })
}
```

### 5.2 スコア自動計測ロジック

```typescript
// src/lib/quality-scoring.ts
export async function calculateDepartmentScores(): Promise<DepartmentScores> {
  return {
    frontend: await scoreFrontend(),      // Lighthouse + コンポーネント数
    backend: await scoreBackend(),        // API応答率 + DB接続
    data: await scoreDataEngineering(),   // 収集率 + 欠損率
    ai: await scoreAI(),                  // 分析精度 + 予測精度
    infra: await scoreInfra(),            // CI/CD成功率 + ビルド時間
    security: await scoreSecurity(),      // 脆弱性数 + RLS状態
    operations: await scoreOperations(),  // 稼働率 + MTTR
    qa: await scoreQA(),                  // テストカバレッジ + ESLintエラー
    competitive: await scoreCompetitive(),// データ鮮度 + ソース数
    strategy: await scoreStrategy(),      // KPI計測率 + タスク完了率
  }
}

async function scoreQA(): Promise<number> {
  // 自動計測項目:
  // 1. テストカバレッジ (coverage-summary.json)
  // 2. ESLintエラー数 (eslint --format json)
  // 3. TypeScriptエラー数 (tsc --noEmit)
  // 4. npm audit脆弱性数
  // 5. any型使用箇所数
  
  const coverage = await getTestCoverage()        // 0-100
  const eslintErrors = await getESLintErrors()     // 0件=100, 10件以上=0
  const tsErrors = await getTypeScriptErrors()     // 0件=100
  const vulns = await getNpmVulnerabilities()      // 0件=100
  
  return Math.round(
    coverage * 0.35 +
    Math.max(0, 100 - eslintErrors * 3) * 0.25 +
    (tsErrors === 0 ? 100 : 0) * 0.20 +
    Math.max(0, 100 - vulns * 10) * 0.20
  )
}
```

---

## 6. 自動化ダッシュボード

### 6.1 品質メトリクスDBスキーマ

```sql
-- quality_metrics テーブル (新規追加)
CREATE TABLE IF NOT EXISTS quality_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  
  -- コード品質
  eslint_errors INTEGER NOT NULL DEFAULT 0,
  eslint_warnings INTEGER NOT NULL DEFAULT 0,
  typescript_errors INTEGER NOT NULL DEFAULT 0,
  any_type_count INTEGER NOT NULL DEFAULT 0,
  
  -- テスト
  test_coverage NUMERIC(5,2) NOT NULL DEFAULT 0,
  test_count INTEGER NOT NULL DEFAULT 0,
  test_pass INTEGER NOT NULL DEFAULT 0,
  test_fail INTEGER NOT NULL DEFAULT 0,
  
  -- ビルド
  build_time_ms INTEGER NOT NULL DEFAULT 0,
  build_success BOOLEAN NOT NULL DEFAULT true,
  bundle_size_kb INTEGER NOT NULL DEFAULT 0,
  
  -- セキュリティ
  npm_vulnerabilities INTEGER NOT NULL DEFAULT 0,
  secrets_found INTEGER NOT NULL DEFAULT 0,
  
  -- パフォーマンス
  lighthouse_performance INTEGER DEFAULT NULL,
  lighthouse_accessibility INTEGER DEFAULT NULL,
  lighthouse_best_practices INTEGER DEFAULT NULL,
  lighthouse_seo INTEGER DEFAULT NULL,
  
  -- データ品質
  data_freshness_hours NUMERIC(5,1) DEFAULT NULL,
  data_missing_rate NUMERIC(5,2) DEFAULT NULL,
  collection_success_rate NUMERIC(5,2) DEFAULT NULL,
  
  -- 部署スコア
  score_frontend INTEGER DEFAULT NULL,
  score_backend INTEGER DEFAULT NULL,
  score_data INTEGER DEFAULT NULL,
  score_ai INTEGER DEFAULT NULL,
  score_infra INTEGER DEFAULT NULL,
  score_security INTEGER DEFAULT NULL,
  score_operations INTEGER DEFAULT NULL,
  score_qa INTEGER DEFAULT NULL,
  score_competitive INTEGER DEFAULT NULL,
  score_strategy INTEGER DEFAULT NULL,
  score_overall INTEGER DEFAULT NULL,
  
  -- メタデータ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(date)
);

CREATE INDEX IF NOT EXISTS quality_metrics_date_idx ON quality_metrics(date DESC);
```

---

## 7. 自動化達成ロードマップ

| Week | 自動化項目 | 自動化率 |
|------|-----------|---------|
| 1 | CI/CD基本パイプライン (lint + build) | 20% |
| 2 | テスト自動実行 + カバレッジ計測 | 30% |
| 3 | セキュリティスキャン自動化 | 40% |
| 4 | データ収集Cron自動化 + DB保存 | 50% |
| 5 | 監視・アラート自動化 | 60% |
| 6 | 品質スコア自動計測・記録 | 65% |
| 7 | E2Eテスト自動化 | 70% |
| 8 | 週次レポート自動生成 | 75% |
| 10 | Lighthouse CI + パフォーマンス自動監視 | 80% |
| 12 | 全自動化完成 + ダッシュボード | **82%** ✅ |

---

## 8. 自動化コスト・ツール一覧

| ツール | 用途 | コスト | 代替案 |
|--------|------|--------|--------|
| GitHub Actions | CI/CD | 無料 (2000min/月) | — |
| Vercel | ホスティング + Cron | Hobby無料 / Pro $20/月 | — |
| Sentry | エラートラッキング | Free (5K events/月) | Bugsnag |
| UptimeRobot | 稼働率監視 | Free (50モニター) | Better Uptime |
| Vercel Analytics | パフォーマンス | Free (基本) | — |
| Dependabot | 脆弱性アラート | 無料 | Renovate |
| Semgrep | SAST | 無料 (OSS) | CodeQL |
| Slack | 通知 | 無料 | Discord |

**月額コスト見積**: $0〜$20 (Vercel Pro選択時)
