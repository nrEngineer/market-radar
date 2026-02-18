/* ═══════════════════════════════════════════════════
   Utility Functions
   ═══════════════════════════════════════════════════ */

export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 1000000000) return `¥${(value / 1000000000).toFixed(1)}B`
    if (value >= 1000000) return `¥${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `¥${(value / 1000).toFixed(0)}K`
  }
  return `¥${value.toLocaleString()}`
}

export function formatNumber(value: number, compact = false): string {
  if (compact) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  }
  return value.toLocaleString()
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-emerald-400'
  if (score >= 75) return 'text-indigo-400'
  if (score >= 60) return 'text-amber-400'
  return 'text-rose-400'
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return '非常に高い'
  if (score >= 75) return '高い'
  if (score >= 60) return '中程度'
  if (score >= 40) return '低い'
  return '非常に低い'
}

export function getRiskColor(level: string): string {
  switch (level) {
    case 'low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    case 'high': return 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'validated': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    case 'hypothesis': return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    case 'researching': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    case 'archived': return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'validated': return '✅ 検証済み'
    case 'hypothesis': return '🔍 仮説'
    case 'researching': return '📊 調査中'
    case 'archived': return '📦 アーカイブ'
    default: return status
  }
}

export function getMomentumColor(momentum: number): string {
  if (momentum >= 80) return 'text-emerald-400'
  if (momentum >= 50) return 'text-indigo-400'
  if (momentum >= 20) return 'text-amber-400'
  return 'text-rose-400'
}

export function getAdoptionLabel(stage: string): string {
  switch (stage) {
    case 'innovators': return 'イノベーター（2.5%）'
    case 'early_adopters': return 'アーリーアダプター（13.5%）'
    case 'early_majority': return 'アーリーマジョリティ（34%）'
    case 'late_majority': return 'レイトマジョリティ（34%）'
    case 'laggards': return 'ラガード（16%）'
    default: return stage
  }
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'たった今'
  if (diffMin < 60) return `${diffMin}分前`
  if (diffHour < 24) return `${diffHour}時間前`
  if (diffDay < 7) return `${diffDay}日前`
  return date.toLocaleDateString('ja-JP')
}
