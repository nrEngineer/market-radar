import type { NavItem } from '@/domain/types'

export const navItems: NavItem[] = [
  { label: 'ダッシュボード', href: '/', icon: '📊', description: '全体概要' },
  { label: '詳細分析', href: '/analytics', icon: '📈', badge: 'NEW', description: '詳細分析ダッシュボード' },
  { label: '市場機会', href: '/opportunities', icon: '🎯', badge: '12', description: '個別機会分析' },
  { label: 'トレンド', href: '/trends', icon: '📉', description: 'トレンド分析・予測' },
  { label: '企業・競合', href: '/companies', icon: '🏢', description: '企業・競合分析' },
  { label: 'カテゴリ', href: '/categories/ai-tools', icon: '📱', description: 'カテゴリ別深掘り' },
  { label: '収益モデル', href: '/revenue', icon: '💰', description: '収益モデル・予測' },
  { label: '調査手法', href: '/methodology', icon: '⚙️', description: 'データ説明' },
]
