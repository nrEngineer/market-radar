interface AnalysisSummaryProps {
  dataPoints: number
  cost: string
  analysisTime: string
}

export function AnalysisSummaryPanel({ dataPoints, cost, analysisTime }: AnalysisSummaryProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-4">分析サマリー</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">{dataPoints}</div>
          <div className="text-sm text-gray-300">データポイント</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">{cost}</div>
          <div className="text-sm text-gray-300">分析コスト</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400">{analysisTime}</div>
          <div className="text-sm text-gray-300">分析時間</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400">McKinsey級</div>
          <div className="text-sm text-gray-300">分析品質</div>
        </div>
      </div>
    </div>
  )
}
