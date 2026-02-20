'use client'

interface WatchlistButtonProps {
  isWatched: boolean
  onToggle: () => void
  size?: 'sm' | 'md'
  className?: string
}

export function WatchlistButton({ isWatched, onToggle, size = 'sm', className = '' }: WatchlistButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle()
      }}
      title={isWatched ? 'ウォッチリストから削除' : 'ウォッチリストに追加'}
      className={`group/watch inline-flex items-center justify-center rounded-full transition-all ${
        size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'
      } ${
        isWatched
          ? 'bg-rose-50 text-rose-500 border border-rose-200/60'
          : 'bg-white/80 text-slate-300 border border-slate-200/60 hover:text-rose-400 hover:border-rose-200/60 hover:bg-rose-50/50'
      } ${className}`}
    >
      <svg
        className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'}
        viewBox="0 0 24 24"
        fill={isWatched ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  )
}
