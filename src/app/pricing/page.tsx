'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import PageLayout from '@/components/PageLayout'
import { Badge } from '@/components/Badge'

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    popular: false,
    description: '個人での軽い市場調査に最適',
    features: [
      '月5回の基本分析',
      'トレンドデータ閲覧',
      'コミュニティサポート',
      '基本的なレポート'
    ],
    limitations: [
      'AIレポート生成なし',
      'API アクセスなし',
      '詳細分析制限あり'
    ]
  },
  {
    id: 'premium', 
    name: 'Premium',
    price: 5000,
    popular: true,
    description: 'スタートアップ・個人事業主向け',
    features: [
      '月100回の高度分析',
      'AI powered レポート生成',
      '詳細競合分析',
      '市場予測・トレンド分析',
      'メールサポート',
      'データエクスポート機能'
    ],
    limitations: [
      'API アクセスは制限あり',
      'カスタムダッシュボードなし'
    ]
  },
  {
    id: 'professional',
    name: 'Professional', 
    price: 15000,
    popular: false,
    description: '中小企業・コンサルタント向け',
    features: [
      '無制限分析・レポート',
      'REST API フルアクセス',
      'カスタムダッシュボード',
      'ホワイトラベル機能',
      'リアルタイムデータ更新',
      '優先カスタマーサポート',
      'チーム機能（5ユーザー）'
    ],
    limitations: [
      'エンタープライズ機能は制限'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 50000,
    popular: false,
    description: '大企業・投資ファンド向け',
    features: [
      '全機能無制限アクセス',
      '専用API・カスタム統合',
      '完全ホワイトラベル',
      'SSO・セキュリティ統合',
      '専任カスタマーサクセス',
      'SLA・稼働率保証',
      'カスタム分析・レポート',
      '無制限チームユーザー'
    ],
    limitations: []
  }
]

interface PricingCardProps {
  plan: typeof pricingPlans[0]
  onSelectPlan: (planId: string) => void
  loading: boolean
}

function PricingCard({ plan, onSelectPlan, loading }: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`relative bg-white rounded-xl border-2 p-8 transition-all duration-200 ${
        plan.popular 
          ? 'border-blue-500 shadow-xl shadow-blue-100' 
          : 'border-slate-200 shadow-lg hover:shadow-xl hover:border-slate-300'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="brand">
            Most Popular
          </Badge>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          {plan.name}
        </h3>
        <p className="text-slate-600 mb-4">
          {plan.description}
        </p>
        <div className="mb-4">
          <span className="text-4xl font-bold text-slate-900">
            ¥{plan.price.toLocaleString()}
          </span>
          <span className="text-slate-500 ml-2">
            {plan.price > 0 ? '/月' : 'Forever'}
          </span>
        </div>
        {plan.price > 0 && (
          <p className="text-sm text-slate-500">
            年払いで2ヶ月分割引
          </p>
        )}
      </div>

      <div className="space-y-4 mb-8">
        <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">
          含まれる機能
        </h4>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-slate-600 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {plan.limitations.length > 0 && (
          <div className="pt-4 border-t border-slate-200">
            <h5 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              制限事項
            </h5>
            <ul className="space-y-2">
              {plan.limitations.map((limitation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center mt-0.5">
                    <svg className="w-2.5 h-2.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-slate-500 text-xs">{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={() => onSelectPlan(plan.id)}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
          plan.popular
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            : plan.price === 0
            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            : 'bg-slate-900 hover:bg-slate-800 text-white'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? '処理中...' : plan.price === 0 ? '無料で開始' : 'プランを選択'}
      </button>
    </motion.div>
  )
}

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') {
      // Redirect to signup for free plan
      router.push('/signup?plan=free')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/payment/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planId,
          success_url: `${window.location.origin}/dashboard?welcome=true`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      })

      const data = await response.json()
      
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      } else {
        throw new Error('Checkout URL not received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setError('決済処理でエラーが発生しました。しばらく後にお試しください。')
      setTimeout(() => setError(null), 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="料金プラン">
      {error && (
        <div role="alert" className="fixed top-4 right-4 z-50 max-w-sm bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <span className="text-red-500 flex-shrink-0">⚠</span>
            <div>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 flex-shrink-0" aria-label="閉じる">
              ✕
            </button>
          </div>
        </div>
      )}
      <div className="py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              McKinsey級分析を
              <br />
              <span className="text-blue-600">1/10のコストで</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              プロフェッショナル品質の市場分析・競合調査・投資判断支援を
              <br />
              AI駆動で瞬時に提供。コンサルタント要らずの時代へ。
            </p>
          </motion.div>
        </div>

        {/* Value Proposition */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              💰 従来コストとの比較
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 text-center">
                <h3 className="text-lg font-bold text-slate-700 mb-2">McKinsey</h3>
                <div className="text-3xl font-bold text-red-600 mb-2">¥500万</div>
                <div className="text-sm text-slate-500">3ヶ月プロジェクト</div>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <h3 className="text-lg font-bold text-slate-700 mb-2">フリーランス</h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">¥50万</div>
                <div className="text-sm text-slate-500">1ヶ月調査</div>
              </div>
              <div className="bg-white rounded-lg p-6 text-center border-2 border-blue-500">
                <h3 className="text-lg font-bold text-blue-600 mb-2">Market Radar</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">¥5,000</div>
                <div className="text-sm text-slate-500">リアルタイム・無制限</div>
                <Badge variant="emerald">99%コストダウン</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onSelectPlan={handleSelectPlan}
              loading={loading}
            />
          ))}
        </div>

        {/* FAQ */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            よくある質問
          </h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-left bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">
                無料プランでどこまで使えますか？
              </h3>
              <p className="text-slate-600 text-sm">
                月5回まで基本的な市場分析が可能です。トレンドデータの閲覧や基本レポートも利用できます。
              </p>
            </div>
            <div className="text-left bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">
                いつでもプランを変更・解約できますか？
              </h3>
              <p className="text-slate-600 text-sm">
                はい、いつでも可能です。アップグレードは即座に反映され、ダウングレードは次回請求日から適用されます。
              </p>
            </div>
            <div className="text-left bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">
                データの精度はどの程度ですか？
              </h3>
              <p className="text-slate-600 text-sm">
                Product Hunt、App Store、Hacker Newsなど複数のソースから収集し、AI分析で90%以上の精度を実現しています。
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}