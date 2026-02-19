'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-900">
          エラーが発生しました
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          問題が発生しました。もう一度お試しください。
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-[#3d5a99] px-4 py-2 text-sm font-medium text-white hover:bg-[#2c4377] transition-colors"
        >
          もう一度試す
        </button>
      </div>
    </div>
  )
}
