export default function Loading() {
  return (
    <div role="status" aria-label="読み込み中" className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-48 shimmer rounded" />
        <div className="h-4 w-72 shimmer rounded" />
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card h-80 shimmer rounded-xl" />
        ))}
      </div>
    </div>
  )
}
