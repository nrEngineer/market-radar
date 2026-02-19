import type { RevenueModel, RevenueProjection } from '@/domain/types'

export const revenueModels: RevenueModel[] = [
  {
    type: 'Freemium + Subscription',
    description: '基本機能無料、プレミアム機能を月額/年額課金。最も一般的なSaaSモデル',
    avgArpu: '¥1,200/月', conversionRate: '3-8%', churnRate: '5-12%/月',
    ltv: '¥14,400', cac: '¥3,000', ltvCacRatio: 4.8,
    examples: ['Notion', 'Spotify', 'Dropbox'],
    pros: ['低い参入障壁', '広いファネル', 'ネットワーク効果'],
    cons: ['低い転換率', '無料ユーザーのコスト', '価値の線引きが難しい'],
  },
  {
    type: 'Usage-based (従量課金)',
    description: '使用量に応じた課金。API呼び出し数、ストレージ量、処理回数等',
    avgArpu: '¥2,500/月（変動大）', conversionRate: '15-25%', churnRate: '3-8%/月',
    ltv: '¥45,000', cac: '¥5,000', ltvCacRatio: 9.0,
    examples: ['AWS', 'Stripe', 'OpenAI API'],
    pros: ['収益と価値提供が連動', '高い顧客満足度', 'アップセル自然'],
    cons: ['収益予測が困難', '価格設計が複雑', '少額ユーザー管理コスト'],
  },
  {
    type: 'B2B SaaS (シート課金)',
    description: 'ユーザー数（シート数）に応じた月額課金。チーム・企業向け',
    avgArpu: '¥5,000/シート/月', conversionRate: '10-20%', churnRate: '2-5%/月',
    ltv: '¥180,000', cac: '¥20,000', ltvCacRatio: 9.0,
    examples: ['Slack', 'Figma', 'Linear'],
    pros: ['予測可能な収益', '高いLTV', 'チーム拡大で自然増'],
    cons: ['長い営業サイクル', '高いCAC', 'エンタープライズ対応コスト'],
  },
]

export const revenueProjections: RevenueProjection[] = [
  {
    scenario: '楽観シナリオ',
    months: [
      { month: '2026-03', mrr: 100000, users: 200, churn: 5, growth: 30 },
      { month: '2026-04', mrr: 250000, users: 500, churn: 4, growth: 25 },
      { month: '2026-05', mrr: 450000, users: 900, churn: 4, growth: 22 },
      { month: '2026-06', mrr: 700000, users: 1400, churn: 3, growth: 20 },
      { month: '2026-07', mrr: 950000, users: 1900, churn: 3, growth: 18 },
      { month: '2026-08', mrr: 1200000, users: 2400, churn: 3, growth: 15 },
    ],
    annualRevenue: 14400000,
    assumptions: ['Product Huntで#1 Day獲得', 'バイラル係数1.3以上', '月次成長率15%以上維持'],
  },
  {
    scenario: '基本シナリオ',
    months: [
      { month: '2026-03', mrr: 50000, users: 100, churn: 8, growth: 20 },
      { month: '2026-04', mrr: 120000, users: 240, churn: 7, growth: 18 },
      { month: '2026-05', mrr: 220000, users: 440, churn: 6, growth: 15 },
      { month: '2026-06', mrr: 350000, users: 700, churn: 5, growth: 12 },
      { month: '2026-07', mrr: 450000, users: 900, churn: 5, growth: 10 },
      { month: '2026-08', mrr: 550000, users: 1100, churn: 5, growth: 8 },
    ],
    annualRevenue: 6600000,
    assumptions: ['安定的な有機成長', 'コンバージョン率5%', '月次チャーン5%'],
  },
  {
    scenario: '悲観シナリオ',
    months: [
      { month: '2026-03', mrr: 20000, users: 40, churn: 12, growth: 10 },
      { month: '2026-04', mrr: 40000, users: 80, churn: 10, growth: 8 },
      { month: '2026-05', mrr: 60000, users: 120, churn: 10, growth: 6 },
      { month: '2026-06', mrr: 80000, users: 160, churn: 8, growth: 5 },
      { month: '2026-07', mrr: 90000, users: 180, churn: 8, growth: 4 },
      { month: '2026-08', mrr: 100000, users: 200, churn: 8, growth: 3 },
    ],
    annualRevenue: 1200000,
    assumptions: ['競合の激化', '低いバイラル係数', '高チャーン率'],
  },
]
