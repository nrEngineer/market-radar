'use client'

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="text-4xl mb-4">⚠</div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          エラーが発生しました
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          ページの読み込み中にエラーが発生しました。再度お試しください。
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-[#3d5a99] text-white rounded-lg text-sm font-medium hover:bg-[#2c4377] transition-colors"
        >
          再試行
        </button>
      </div>
    </div>
  )
}
