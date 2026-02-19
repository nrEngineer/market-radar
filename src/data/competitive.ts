import type { CompetitiveLandscape } from '@/domain/types'

export const competitiveLandscape: CompetitiveLandscape = {
  totalPlayers: 1234,
  topPlayers: [
    {
      id: 'pl-1', name: 'Notion', logo: '', description: 'All-in-one workspace', founded: 2013, funding: '$343M',
      employees: '500+', revenue: '$250M/年', marketShare: 18,
      strengths: ['ブランド力', '拡張性', 'コミュニティ'],
      weaknesses: ['パフォーマンス', 'オフライン機能', '学習コスト'],
      positioning: { x: 50, y: 80 },
      products: ['Notion Personal', 'Notion Team', 'Notion Enterprise'],
      regions: ['Global'],
      recentMoves: ['AI統合強化', 'Notion Calendar統合', 'API v2リリース'],
    },
    {
      id: 'pl-2', name: 'Linear', logo: '', description: 'モダンプロジェクト管理', founded: 2019, funding: '$52M',
      employees: '50-100', revenue: '$30M/年', marketShare: 5,
      strengths: ['UX品質', 'スピード', '開発者体験'],
      weaknesses: ['限定的な機能', '価格', 'エンタープライズ機能不足'],
      positioning: { x: 70, y: 90 },
      products: ['Linear Free', 'Linear Pro', 'Linear Enterprise'],
      regions: ['US', 'EU'],
      recentMoves: ['Linear Asks発表', 'CyclesUI改善'],
    },
    {
      id: 'pl-3', name: 'Todoist', logo: '', description: 'シンプルタスク管理', founded: 2007, funding: 'Bootstrapped',
      employees: '100-200', revenue: '$50M/年', marketShare: 8,
      strengths: ['シンプルさ', '多プラットフォーム', '長い実績'],
      weaknesses: ['AI機能なし', 'コラボ機能弱い', '停滞感'],
      positioning: { x: -10, y: 20 },
      products: ['Todoist Free', 'Todoist Pro', 'Todoist Business'],
      regions: ['Global'],
      recentMoves: ['ボード表示追加', 'Filterリニューアル'],
    },
  ],
  marketConcentration: 'fragmented',
  herfindahlIndex: 680,
  entryBarriers: [
    { factor: 'ネットワーク効果', level: 'medium', description: 'コラボツールではチーム単位の乗り換えコストが発生' },
    { factor: '技術的優位性', level: 'low', description: '基本的なSaaS技術で参入可能。AI統合がやや高い壁' },
    { factor: 'ブランド認知', level: 'high', description: 'Notion等の強いブランドに対抗するマーケコストが必要' },
    { factor: '資本要件', level: 'low', description: 'Micro-SaaSなら個人でも参入可能。¥50万〜' },
  ],
  keySuccessFactors: ['UX品質', 'AI統合', 'パフォーマンス', 'プラットフォーム対応', 'コミュニティ構築'],
}
