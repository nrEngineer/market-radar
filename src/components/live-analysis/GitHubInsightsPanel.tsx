import { Badge } from '@/components/Badge'
import { ScoreBar } from '@/components/ScoreBar'

export interface LiveInsight {
  trend: string
  momentum: number
  evidence: string
  impact: string
  timeframe: string
  examples: string
}

interface GitHubInsightsPanelProps {
  insights: LiveInsight[]
}

export function GitHubInsightsPanel({ insights }: GitHubInsightsPanelProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">GitHub Market Intelligence</h2>
      <div className="space-y-4">
        {insights.map((insight, i) => (
          <div key={i} className="border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{insight.trend}</h3>
              <Badge variant={insight.momentum > 80 ? 'emerald' : insight.momentum > 60 ? 'amber' : 'ghost'}>
                {Math.round(insight.momentum)}/100 momentum
              </Badge>
            </div>
            <div className="mb-3">
              <ScoreBar score={insight.momentum} maxScore={100} />
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-blue-200"><strong>証拠:</strong> {insight.evidence}</p>
              <p className="text-green-200"><strong>市場影響:</strong> {insight.impact}</p>
              <p className="text-purple-200"><strong>時間軸:</strong> {insight.timeframe}</p>
              <p className="text-yellow-200"><strong>例:</strong> {insight.examples}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
