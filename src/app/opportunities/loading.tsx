export default function Loading() {
  return (
    <div role="status" aria-label="読み込み中" className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-48 shimmer rounded" />
        <div className="h-4 w-64 shimmer rounded" />
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-card h-48 shimmer rounded-xl" />
        ))}
      </div>
    </div>
  )
}
