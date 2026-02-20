'use client'

import { useState, useRef } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { AnimatedSection } from '@/components/motion'
import { Badge } from '@/components/Badge'
import { ScoreBar } from '@/components/ScoreBar'

interface Finding {
  title: string
  description: string
  confidence?: number
}

interface ResearchResults {
  error?: string
  details?: string
  summary?: string
  findings?: Finding[]
  insights?: string[]
}

const suggestedQueries = [
  { icon: '📊', label: '市場調査', query: '日本のSaaS市場でまだ競合が少ないニッチを見つけてください。月額5,000円以下で、個人開発者が3ヶ月で作れるスケールのもの。' },
  { icon: '🏢', label: '競合分析', query: 'プロジェクト管理ツール（Notion、Asana、Linear）の価格・機能・弱点を比較分析してください。差別化ポイントと参入余地を教えてください。' },
  { icon: '💰', label: '価格戦略', query: 'B2B SaaSの価格設定で、月額3,000円〜10,000円のレンジが最適な市場セグメントと、フリーミアムからの転換率の業界平均を分析してください。' },
  { icon: '📈', label: 'GTM 戦略', query: '個人開発のSaaSを最初の100ユーザーに届けるためのGo-to-Market戦略を提案してください。広告費ゼロの前提で。' },
  { icon: '🔍', label: '顧客ペイン', query: 'フリーランスエンジニアが請求書・契約管理で感じている具体的なペインポイントを分析してください。既存ツールの不満点も含めて。' },
  { icon: '🛡️', label: 'モート分析', query: '個人開発者がSaaSで競合優位性（モート）を築く方法を分析してください。ネットワーク効果・データ蓄積・スイッチングコストの観点から。' },
]

const researchTypes = [
  { id: 'market', name: '市場調査', icon: '📊', desc: '市場規模・成長率・セグメント分析' },
  { id: 'competitor', name: '競合分析', icon: '🏢', desc: '競合の強み弱み・シェア・差別化' },
  { id: 'trend', name: 'トレンド', icon: '📈', desc: '技術・消費者トレンドの分析' },
  { id: 'pricing', name: '価格戦略', icon: '💰', desc: '価格設定・収益モデルの最適化' },
  { id: 'customer', name: '顧客分析', icon: '👥', desc: 'ペルソナ・ペインポイント・ニーズ' },
  { id: 'technology', name: '技術分析', icon: '🔬', desc: '技術スタック・実装コスト・実現性' },
  { id: 'regulation', name: '規制調査', icon: '⚖️', desc: '法規制・コンプライアンス要件' },
  { id: 'custom', name: 'カスタム', icon: '🎯', desc: '何でも自由に質問' },
]

export default function CustomResearchPage() {
  const [query, setQuery] = useState('')
  const [researchType, setResearchType] = useState('market')
  const [results, setResults] = useState<ResearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const executeResearch = async () => {
    if (!query.trim()) return
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setLoading(true)

    try {
      const response = await fetch('/api/custom-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          type: researchType,
          timestamp: new Date().toISOString()
        }),
        signal: abortRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`Research API error: ${response.status}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      console.error('Research failed:', error)
      setResults({ error: '調査に失敗しました', details: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout
      title="AI コンサルタント"
      subtitle="コンサルに聞くように、何でも質問。市場分析・競合調査・戦略立案を AI がサポート"
      icon="🧠"
      breadcrumbs={[{ label: 'AI リサーチ' }]}
    >
      {/* Research Type Selection */}
      <AnimatedSection className="mb-6">
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">調査タイプを選択</h3>
            <p className="text-[12px] text-slate-400">コンサルタントの専門分野を選ぶように</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {researchTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setResearchType(type.id)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    researchType === type.id
                      ? 'border-[#3d5a99]/30 bg-[#3d5a99]/5 shadow-sm'
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{type.icon}</span>
                  <p className={`mt-1.5 text-[13px] font-semibold ${
                    researchType === type.id ? 'text-[#2c4377]' : 'text-slate-700'
                  }`}>{type.name}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Query Input */}
      <AnimatedSection className="mb-6" delay={0.05}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">質問を入力</h3>
            <p className="text-[12px] text-slate-400">コンサルタントに聞くように、具体的に書くほど精度が上がります</p>
          </div>
          <div className="p-6">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="例: 日本のフリーランス向け請求管理SaaSの市場規模、主要競合、差別化ポイントを分析してください。月額3,000円の価格帯で個人開発者が参入する余地はありますか？"
              className="w-full rounded-xl border border-slate-200 bg-white p-4 text-[14px] text-slate-700 placeholder-slate-300 focus:border-[#3d5a99] focus:outline-none focus:ring-1 focus:ring-[#3d5a99]/20 transition-colors"
              rows={4}
            />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[11px] text-slate-400">
                {query.length > 0 ? `${query.length}文字` : 'テンプレートから選んで編集することもできます'}
              </p>
              <button
                onClick={executeResearch}
                disabled={!query.trim() || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2c4377] px-6 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-[#2c4377]/20 hover:bg-[#1e3461] disabled:opacity-40 disabled:shadow-none transition-all"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                    </svg>
                    分析中...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    </svg>
                    調査開始
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Suggested Queries */}
      {!results && (
        <AnimatedSection className="mb-6" delay={0.1}>
          <div className="glass-card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-[15px] font-semibold text-slate-900">テンプレートから始める</h3>
              <p className="text-[12px] text-slate-400">SaaS ビルダーがよく聞く質問。クリックして編集できます</p>
            </div>
            <div className="p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {suggestedQueries.map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuery(sq.query); setResearchType(researchTypes.find(t => t.name === sq.label)?.id ?? 'market') }}
                    className="group rounded-xl border border-slate-100 bg-white p-4 text-left hover:border-[#3d5a99]/20 hover:bg-[#3d5a99]/3 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{sq.icon}</span>
                      <Badge variant="ghost" size="sm">{sq.label}</Badge>
                    </div>
                    <p className="text-[12px] leading-relaxed text-slate-500 group-hover:text-slate-700 transition-colors line-clamp-2">
                      {sq.query}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Results */}
      {results && (
        <AnimatedSection className="mb-6" delay={0.05}>
          <div className="glass-card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900">調査結果</h3>
                  <p className="text-[12px] text-slate-400">{new Date().toLocaleString('ja-JP')}</p>
                </div>
                <Badge variant={results.error ? 'rose' : 'emerald'}>
                  {results.error ? 'エラー' : '完了'}
                </Badge>
              </div>
            </div>

            {results.error ? (
              <div className="p-6">
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                  <p className="text-[13px] font-medium text-rose-700">{results.error}</p>
                  {results.details && (
                    <p className="mt-1 text-[12px] text-rose-500">{results.details}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {/* Executive Summary */}
                {results.summary && (
                  <div className="p-6">
                    <h4 className="text-[13px] font-semibold text-slate-500 mb-3">エグゼクティブサマリー</h4>
                    <p className="text-[14px] leading-relaxed text-slate-700">{results.summary}</p>
                  </div>
                )}

                {/* Key Findings */}
                {results.findings && results.findings.length > 0 && (
                  <div className="p-6">
                    <h4 className="text-[13px] font-semibold text-slate-500 mb-3">主要発見事項</h4>
                    <div className="space-y-3">
                      {results.findings.map((finding, index) => (
                        <div key={index} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <h5 className="text-[13px] font-semibold text-slate-800 mb-1">{finding.title}</h5>
                          <p className="text-[12px] leading-relaxed text-slate-600">{finding.description}</p>
                          {finding.confidence && (
                            <div className="mt-3">
                              <ScoreBar score={finding.confidence} size="sm" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actionable Insights */}
                {results.insights && results.insights.length > 0 && (
                  <div className="p-6">
                    <h4 className="text-[13px] font-semibold text-slate-500 mb-3">アクションアイテム</h4>
                    <div className="space-y-2">
                      {results.insights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 rounded-lg bg-emerald-50 border border-emerald-100 p-3">
                          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                            {index + 1}
                          </span>
                          <p className="text-[12px] leading-relaxed text-slate-700">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source Attribution */}
                <div className="px-6 py-3 bg-slate-50">
                  <p className="text-[11px] text-slate-400">
                    Market Radar AI 分析エンジン · データソース: 5W1H Framework
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* New Research Button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => { setResults(null); setQuery('') }}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-[#3d5a99] hover:text-[#2c4377] transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              新しい調査を始める
            </button>
          </div>
        </AnimatedSection>
      )}
    </PageLayout>
  )
}
