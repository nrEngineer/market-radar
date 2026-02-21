export interface PlanConfig {
  name: string
  price: number
  stripe_price_id?: string
  limits: { analyses: number; reports: number; api_calls: number }
  features: string[]
}

export const PRICING_PLANS: Record<string, PlanConfig> = {
  free: {
    name: 'Free',
    price: 0,
    limits: { analyses: 5, reports: 0, api_calls: 0 },
    features: ['基本市場分析', '月5回まで', 'コミュニティサポート'],
  },
  premium: {
    name: 'Premium',
    price: 5000,
    stripe_price_id: 'price_premium_monthly',
    limits: { analyses: 100, reports: 10, api_calls: 1000 },
    features: ['AIレポート生成', '月100回分析', '詳細トレンド分析', 'メールサポート'],
  },
  professional: {
    name: 'Professional',
    price: 15000,
    stripe_price_id: 'price_professional_monthly',
    limits: { analyses: -1, reports: -1, api_calls: 10000 },
    features: ['無制限分析', 'API アクセス', 'カスタムダッシュボード', '優先サポート'],
  },
  enterprise: {
    name: 'Enterprise',
    price: 50000,
    stripe_price_id: 'price_enterprise_monthly',
    limits: { analyses: -1, reports: -1, api_calls: 100000 },
    features: ['全機能アクセス', 'ホワイトラベル', '専用サポート', 'SLA保証'],
  },
}
