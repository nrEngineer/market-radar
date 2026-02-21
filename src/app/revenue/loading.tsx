export default function Loading() {
  return (
    <div role="status" aria-label="読み込み中" className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-48 shimmer rounded" />
        <div className="h-4 w-64 shimmer rounded" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card h-28 shimmer rounded-xl" />
        ))}
      </div>
      <div className="glass-card h-64 shimmer rounded-xl" />
    </div>
  )
}
