'use client'

import { PageLayout } from '@/components/PageLayout'
import { ProvenanceCard } from '@/components/ProvenanceCard'
import { AnimatedSection } from '@/components/motion'
import { methodology, defaultProvenance } from '@/data'

export default function MethodologyPage() {
  return (
    <PageLayout
      title="調査手法 & データ説明"
      subtitle="Market Radarのデータ収集・分析方法論の透明な開示"
      icon="⚙️"
      breadcrumbs={[{ label: '調査手法' }]}
    >
      {/* Overview */}
      <AnimatedSection className="mb-8">
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">📋 {methodology.title}</h3>
          </div>
          <div className="p-6">
            <p className="text-[14px] leading-relaxed text-slate-300">{methodology.description}</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Process Steps */}
      <AnimatedSection className="mb-8" delay={0.05}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">🔄 分析プロセス（6ステップ）</h3>
          </div>
          <div className="p-6">
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 via-indigo-500/20 to-transparent" />
              <div className="space-y-8">
                {methodology.steps.map((step) => (
                  <div key={step.step} className="relative ml-12">
                    <div className="absolute -left-[1.9rem] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#3d5a99]/8 border-2 border-indigo-500/30 text-[12px] font-bold text-[#3d5a99]">
                      {step.step}
                    </div>
                    <div className="rounded-xl bg-slate-50/50 border border-slate-100 p-5">
                      <h4 className="text-[15px] font-semibold text-slate-900 mb-2">{step.name}</h4>
                      <p className="text-[13px] leading-relaxed text-slate-400 mb-3">{step.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {step.tools.map((tool) => (
                          <span key={tool} className="rounded-full bg-[#3d5a99]/8 px-2.5 py-0.5 text-[11px] font-medium text-[#3d5a99] border border-[#3d5a99]/15">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Data Quality Framework */}
      <AnimatedSection className="mb-8" delay={0.1}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">🔬 データ品質フレームワーク</h3>
          </div>
          <div className="p-6">
            <p className="text-[13px] leading-relaxed text-slate-300">{methodology.dataQualityFramework}</p>
            
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: '完全性', desc: 'データの欠損がないか', icon: '📊' },
                { label: '正確性', desc: '実際の値との一致度', icon: '🎯' },
                { label: '適時性', desc: 'データの鮮度・更新頻度', icon: '⏰' },
                { label: '一貫性', desc: '異なるソース間の整合性', icon: '🔗' },
              ].map((q) => (
                <div key={q.label} className="rounded-xl bg-slate-50/50 border border-slate-100 p-4 text-center">
                  <span className="text-2xl">{q.icon}</span>
                  <p className="mt-2 text-[13px] font-semibold text-slate-900">{q.label}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{q.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Update Frequency */}
      <AnimatedSection className="mb-8" delay={0.12}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">⏱ 更新頻度</h3>
          </div>
          <div className="p-6">
            <p className="text-[14px] text-slate-300 mb-4">{methodology.updateFrequency}</p>
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                { label: 'データ収集', freq: '毎日 03:00 JST', color: 'emerald' },
                { label: 'スコアリング', freq: '毎日', color: 'indigo' },
                { label: 'トレンド分析', freq: '週次', color: 'amber' },
                { label: '市場規模', freq: '月次', color: 'violet' },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/15 p-4 text-center`}>
                  <p className={`text-[13px] font-semibold text-${item.color}-400`}>{item.freq}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Limitations */}
      <AnimatedSection className="mb-8" delay={0.15}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">⚠️ 制限事項 & 免責事項</h3>
            <p className="text-[12px] text-slate-400">データの限界を透明に開示します</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {methodology.limitations.map((limitation, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-amber-500/5 border border-amber-500/10 p-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-[11px] font-bold text-amber-600 flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-[13px] text-slate-300">{limitation}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-slate-50/50 p-4 border border-slate-100">
              <p className="text-[12px] text-slate-400">
                <span className="font-semibold text-slate-300">📌 免責事項:</span> Market Radarが提供する情報は、参考情報としての利用を想定しています。
                投資判断や事業判断は、必ず追加の調査・専門家への相談を行った上で実施してください。
                データの正確性について最善を尽くしていますが、完全な正確性を保証するものではありません。
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Data Sources Detail */}
      <AnimatedSection delay={0.2}>
        <ProvenanceCard data={defaultProvenance} />
      </AnimatedSection>
    </PageLayout>
  )
}
