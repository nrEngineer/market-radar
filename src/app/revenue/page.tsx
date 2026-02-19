'use client'

import { PageLayout } from '@/components/PageLayout'
import { MiniBarChart } from '@/components/MiniChart'
import { AnimatedSection } from '@/components/motion'
import { revenueModels, revenueProjections } from '@/data'
import { formatCurrency } from '@/domain/formatting'

export default function RevenuePage() {
  return (
    <PageLayout
      title="収益モデル & 財務予測"
      subtitle="主要収益モデルの比較分析と3シナリオ収益予測"
      icon="💰"
      breadcrumbs={[{ label: '収益モデル' }]}
    >
      {/* Revenue Models Comparison */}
      <AnimatedSection className="mb-8">
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">📊 収益モデル比較</h3>
            <p className="text-[12px] text-slate-400">主要SaaSモデルの特性・メトリクス比較</p>
          </div>
          <div className="divide-y divide-slate-50">
            {revenueModels.map((model) => (
              <div key={model.type} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-[16px] font-semibold text-slate-900">{model.type}</h4>
                    <p className="mt-1 text-[13px] text-slate-400">{model.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-[11px] text-slate-400">LTV/CAC比</p>
                    <p className={`text-2xl font-bold ${
                      model.ltvCacRatio >= 5 ? 'text-emerald-600' : model.ltvCacRatio >= 3 ? 'text-[#3d5a99]' : 'text-amber-600'
                    }`}>{model.ltvCacRatio}x</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 mb-4">
                  <div className="rounded-lg bg-slate-50/50 p-3 border border-slate-100">
                    <p className="text-[10px] text-slate-400">ARPU</p>
                    <p className="text-[13px] font-semibold text-slate-900">{model.avgArpu}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50/50 p-3 border border-slate-100">
                    <p className="text-[10px] text-slate-400">CVR</p>
                    <p className="text-[13px] font-semibold text-[#3d5a99]">{model.conversionRate}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50/50 p-3 border border-slate-100">
                    <p className="text-[10px] text-slate-400">Churn</p>
                    <p className="text-[13px] font-semibold text-rose-600">{model.churnRate}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50/50 p-3 border border-slate-100">
                    <p className="text-[10px] text-slate-400">LTV</p>
                    <p className="text-[13px] font-semibold text-emerald-600">{model.ltv}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50/50 p-3 border border-slate-100">
                    <p className="text-[10px] text-slate-400">CAC</p>
                    <p className="text-[13px] font-semibold text-amber-600">{model.cac}</p>
                  </div>
                </div>

                {/* Pros / Cons / Examples */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[11px] font-medium text-emerald-600 mb-1.5">✅ メリット</p>
                    <ul className="space-y-1">
                      {model.pros.map((p, pi) => (
                        <li key={pi} className="text-[12px] text-slate-400">• {p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-rose-600 mb-1.5">⚠️ デメリット</p>
                    <ul className="space-y-1">
                      {model.cons.map((c, ci) => (
                        <li key={ci} className="text-[12px] text-slate-400">• {c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#3d5a99] mb-1.5">🏢 事例</p>
                    <div className="flex flex-wrap gap-1">
                      {model.examples.map(e => (
                        <span key={e} className="rounded bg-[#3d5a99]/8 px-2 py-0.5 text-[11px] text-[#3d5a99]">{e}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Revenue Projections */}
      <AnimatedSection className="mb-8" delay={0.1}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">📈 収益予測シミュレーション</h3>
            <p className="text-[12px] text-slate-400">3シナリオの6ヶ月収益予測</p>
          </div>
          
          {revenueProjections.map((proj, pi) => (
            <div key={proj.scenario} className={`p-6 ${pi < revenueProjections.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className={`text-[15px] font-semibold ${
                    pi === 0 ? 'text-emerald-600' : pi === 1 ? 'text-[#3d5a99]' : 'text-rose-600'
                  }`}>{pi === 0 ? '🚀' : pi === 1 ? '📊' : '⚡'} {proj.scenario}</h4>
                  <p className="text-[12px] text-slate-400">年間収益予測: {formatCurrency(proj.annualRevenue, true)}</p>
                </div>
              </div>

              {/* MRR Chart */}
              <MiniBarChart
                data={proj.months.map(m => ({ label: m.month.slice(5), value: m.mrr }))}
                height={80}
                color={pi === 0 ? 'emerald' : pi === 1 ? 'indigo' : 'rose'}
              />

              {/* Monthly Details */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-2 text-[10px] font-medium text-slate-400">月</th>
                      <th className="pb-2 text-[10px] font-medium text-slate-400">MRR</th>
                      <th className="pb-2 text-[10px] font-medium text-slate-400">ユーザー</th>
                      <th className="pb-2 text-[10px] font-medium text-slate-400">Churn</th>
                      <th className="pb-2 text-[10px] font-medium text-slate-400 text-right">月次成長</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {proj.months.map((m) => (
                      <tr key={m.month}>
                        <td className="py-2 text-[12px] text-slate-400">{m.month.slice(5)}月</td>
                        <td className="py-2 text-[12px] font-semibold text-slate-900">{formatCurrency(m.mrr, true)}</td>
                        <td className="py-2 text-[12px] text-slate-300">{m.users.toLocaleString()}</td>
                        <td className="py-2 text-[12px] text-rose-600">{m.churn}%</td>
                        <td className="py-2 text-[12px] font-semibold text-emerald-600 text-right">+{m.growth}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Assumptions */}
              <div className="mt-3 rounded-lg bg-slate-50/50 p-3 border border-slate-100">
                <p className="text-[10px] font-medium text-slate-400 mb-1">📋 前提条件</p>
                <ul className="space-y-0.5">
                  {proj.assumptions.map((a, ai) => (
                    <li key={ai} className="text-[11px] text-slate-400">• {a}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Unit Economics Summary */}
      <AnimatedSection delay={0.15}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">💡 ユニットエコノミクス ベンチマーク</h3>
          </div>
          <div className="grid gap-px sm:grid-cols-3">
            <div className="p-5">
              <p className="text-[11px] text-slate-400 mb-1">健全なLTV/CAC比</p>
              <p className="text-2xl font-bold text-emerald-600">3.0x 以上</p>
              <p className="text-[11px] text-slate-400 mt-1">SaaS業界の黄金律。3x未満は収益性に懸念あり</p>
            </div>
            <div className="p-5">
              <p className="text-[11px] text-slate-400 mb-1">目標月次チャーン</p>
              <p className="text-2xl font-bold text-[#3d5a99]">≤ 5%</p>
              <p className="text-[11px] text-slate-400 mt-1">B2C SaaSの場合。B2Bは2%以下を目指す</p>
            </div>
            <div className="p-5">
              <p className="text-[11px] text-slate-400 mb-1">CAC回収期間</p>
              <p className="text-2xl font-bold text-amber-600">≤ 12ヶ月</p>
              <p className="text-[11px] text-slate-400 mt-1">12ヶ月以内にCACを回収するのが理想</p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </PageLayout>
  )
}
