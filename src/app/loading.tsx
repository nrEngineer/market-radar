export default function Loading() {
  return (
    <div role="status" aria-label="読み込み中" className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#3d5a99]" />
        <p className="text-sm font-medium text-slate-400">読み込み中...</p>
      </div>
    </div>
  )
}
