'use client'

import { useState } from 'react'

// 🔍 Custom Research Interface - Maximum Freedom
export default function CustomResearchPage() {
  const [query, setQuery] = useState('')
  const [researchType, setResearchType] = useState('market')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const researchTypes = [
    { id: 'market', name: '市場調査', icon: '📊' },
    { id: 'competitor', name: '競合分析', icon: '🏢' },
    { id: 'trend', name: 'トレンド分析', icon: '📈' },
    { id: 'pricing', name: '価格分析', icon: '💰' },
    { id: 'customer', name: '顧客分析', icon: '👥' },
    { id: 'technology', name: '技術分析', icon: '🔬' },
    { id: 'regulation', name: '規制分析', icon: '⚖️' },
    { id: 'custom', name: 'カスタム', icon: '🎯' }
  ]

  const executeResearch = async () => {
    setLoading(true)
    
    try {
      // Call custom research API
      const response = await fetch('/api/custom-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          type: researchType,
          timestamp: new Date().toISOString()
        })
      })
      
      const data = await response.json()
      setResults(data)
      
    } catch (error) {
      console.error('Research failed:', error)
      setResults({ error: 'Research failed', details: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔍 自由調査システム
          </h1>
          <p className="text-xl text-gray-300">
            何でも調べる。制約なし。リアルタイム分析。
          </p>
        </div>

        {/* Research Interface */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          
          {/* Research Type Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">調査タイプ選択</h3>
            <div className="grid grid-cols-4 gap-4">
              {researchTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setResearchType(type.id)}
                  className={`p-4 rounded-lg text-center transition-all ${
                    researchType === type.id 
                      ? 'bg-blue-500 text-white shadow-lg scale-105' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="text-sm font-medium">{type.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Query Input */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-white mb-4">
              調査したいこと（自由入力）
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="例: 日本のSaaS市場で月額5000円の競合を調べて、価格戦略を分析してください。具体的な企業名、料金プラン、強み・弱み、市場シェア、成長率も知りたいです。"
              className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Research Button */}
          <div className="text-center">
            <button
              onClick={executeResearch}
              disabled={!query || loading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  調査実行中...
                </>
              ) : (
                <>🚀 調査開始</>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              📊 調査結果
              <span className="ml-3 text-sm bg-green-500 px-2 py-1 rounded">
                完了
              </span>
            </h3>
            
            {results.error ? (
              <div className="text-red-400 p-4 bg-red-900/30 rounded-lg">
                エラー: {results.error}
                <br />
                詳細: {results.details}
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Executive Summary */}
                {results.summary && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">🎯 要約</h4>
                    <p className="text-gray-300 leading-relaxed">{results.summary}</p>
                  </div>
                )}

                {/* Key Findings */}
                {results.findings && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">🔍 主要発見</h4>
                    <div className="grid gap-4">
                      {results.findings.map((finding, index) => (
                        <div key={index} className="bg-white/5 p-4 rounded-lg">
                          <h5 className="font-semibold text-blue-300 mb-2">{finding.title}</h5>
                          <p className="text-gray-300 text-sm">{finding.description}</p>
                          {finding.confidence && (
                            <div className="mt-2 flex items-center">
                              <span className="text-xs text-gray-400 mr-2">信頼度:</span>
                              <div className="bg-gray-700 rounded-full h-2 w-24">
                                <div 
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${finding.confidence}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400 ml-2">{finding.confidence}%</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actionable Insights */}
                {results.insights && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">💡 実行可能な洞察</h4>
                    <ul className="space-y-2">
                      {results.insights.map((insight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-400 mr-2">•</span>
                          <span className="text-gray-300">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Data Sources */}
                <div className="text-xs text-gray-500 pt-4 border-t border-white/10">
                  調査実行時間: {new Date().toLocaleString('ja-JP')} | 
                  データソース: Market Radar Intelligence Engine | 
                  分析手法: McKinsey 5W1H Framework
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}