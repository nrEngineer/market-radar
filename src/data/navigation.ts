import type { NavItem } from '@/domain/types'

export const navItems: NavItem[] = [
  { label: 'ダッシュボード', href: '/', icon: '📊', description: '全体概要' },
  { label: 'AIリサーチ', href: '/research', icon: '🧠', badge: 'NEW', description: 'AIコンサルタントに相談' },
  { label: '事業機会', href: '/opportunities', icon: '🎯', badge: '12', description: 'スコアリング済み事業機会' },
  { label: 'トレンド', href: '/trends', icon: '📈', description: 'トレンド分析・予測' },
  { label: '競合分析', href: '/companies', icon: '🏢', description: '競合マッピング' },
  { label: 'カテゴリ', href: '/categories/ai-tools', icon: '📱', description: 'カテゴリ別深掘り' },
  { label: '収益モデル', href: '/revenue', icon: '💰', description: '収益シミュレーション' },
  { label: '分析手法', href: '/methodology', icon: '⚙️', description: '分析フレームワーク説明' },
  { label: '料金', href: '/pricing', icon: '💎', description: 'プラン・価格' },
]
