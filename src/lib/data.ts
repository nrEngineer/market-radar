/* ═══════════════════════════════════════════════════════════════
   Market Radar — Pro-Grade Mock Data Store
   Real-world quality data for consultant-killer analysis
   ═══════════════════════════════════════════════════════════════ */

import type {
  OpportunityDetail,
  TrendData,
  CategoryDetail,
  CompetitiveLandscape,
  RevenueModel,
  RevenueProjection,
  AnalyticsSummary,
  MethodologySection,
  DataProvenance,
  NavItem,
} from './types'

// ── Navigation Items ──
export const navItems: NavItem[] = [
  { label: 'ダッシュボード', href: '/', icon: '📊', description: '全体概要' },
  { label: '詳細分析', href: '/analytics', icon: '📈', badge: 'NEW', description: '詳細分析ダッシュボード' },
  { label: '市場機会', href: '/opportunities', icon: '🎯', badge: '12', description: '個別機会分析' },
  { label: 'トレンド', href: '/trends', icon: '📉', description: 'トレンド分析・予測' },
  { label: '企業・競合', href: '/companies', icon: '🏢', description: '企業・競合分析' },
  { label: 'カテゴリ', href: '/categories/ai-tools', icon: '📱', description: 'カテゴリ別深掘り' },
  { label: '収益モデル', href: '/revenue', icon: '💰', description: '収益モデル・予測' },
  { label: '調査手法', href: '/methodology', icon: '⚙️', description: 'データ説明' },
]

// ── Data Provenance Template ──
export const defaultProvenance: DataProvenance = {
  sources: [
    { name: 'Product Hunt API', url: 'https://api.producthunt.com', type: 'api', lastCollected: '2026-02-18T08:00:00Z', frequency: '毎日', reliability: 92, sampleSize: 500, methodology: 'GraphQL API経由で新着・人気プロダクトを自動収集' },
    { name: 'App Store Search API', url: 'https://itunes.apple.com', type: 'api', lastCollected: '2026-02-18T07:30:00Z', frequency: '毎日', reliability: 95, sampleSize: 1200, methodology: 'iTunes Search APIで主要カテゴリのアプリを収集・分析' },
    { name: 'Hacker News Firebase API', url: 'https://hacker-news.firebaseio.com', type: 'api', lastCollected: '2026-02-18T08:15:00Z', frequency: '毎時', reliability: 98, sampleSize: 200, methodology: 'Top/New storiesを毎時取得し、テック関連を抽出' },
    { name: 'AI分析エンジン', url: '#', type: 'ai-analysis', lastCollected: '2026-02-18T08:30:00Z', frequency: '毎日', reliability: 78, methodology: 'LLMベースのマーケットシグナル解析・スコアリング' },
  ],
  collectedAt: '2026-02-18T08:30:00Z',
  updatedAt: '2026-02-18T08:30:00Z',
  confidenceScore: 82,
  qualityIndicators: { completeness: 85, accuracy: 80, timeliness: 90, consistency: 78 },
}

// ══════════════════════════════════════════════════════
//  OPPORTUNITIES DATA (Full Detail)
// ══════════════════════════════════════════════════════

export const opportunities: OpportunityDetail[] = [
  {
    id: 'opp-001',
    title: 'AI習慣化・生産性アプリ',
    subtitle: 'ゲーミフィケーション×AIパーソナライズで日本市場No.1を狙う',
    category: 'Mobile App',
    subcategory: 'Productivity & Habit',
    status: 'validated',
    revenue: {
      estimated: '¥450K/月',
      range: { min: 280000, max: 650000 },
      model: 'Freemium + Subscription',
      projections: [
        { month: '2026-03', value: 50000 },
        { month: '2026-04', value: 120000 },
        { month: '2026-05', value: 220000 },
        { month: '2026-06', value: 310000 },
        { month: '2026-07', value: 380000 },
        { month: '2026-08', value: 450000 },
        { month: '2026-09', value: 520000 },
        { month: '2026-10', value: 580000 },
        { month: '2026-11', value: 630000 },
        { month: '2026-12', value: 700000 },
      ],
      breakEven: '4ヶ月目',
      margins: { gross: 85, net: 42 },
    },
    market: {
      sizing: {
        tam: { value: 15000000000, unit: '円', description: '日本の生産性アプリ市場全体', year: 2026 },
        sam: { value: 3200000000, unit: '円', description: 'AI搭載生産性アプリ（日本語対応）', year: 2026 },
        som: { value: 160000000, unit: '円', description: '初年度獲得可能市場（5%シェア）', year: 2026 },
        cagr: 23.4,
        methodology: 'Top-down: 総務省統計データ + App Store公開データから推計。Bottom-up: DAU×ARPU×365で検証',
        sources: ['Statista Digital Market Outlook 2025', 'App Annie State of Mobile 2025', 'IDC Japan Software Market Report'],
      },
      growth: '+23%',
      maturity: 'growing',
      competitiveIntensity: 65,
    },
    scores: { overall: 92, marketSize: 88, growth: 95, competition: 72, feasibility: 90, timing: 94, moat: 78 },
    risks: {
      level: 'low',
      factors: [
        { name: '大手参入リスク', probability: 30, impact: 70, mitigation: 'ニッチ特化・日本語UX最適化で差別化。大手が対応しにくいローカライズ深度を実現' },
        { name: 'ユーザー離脱', probability: 40, impact: 50, mitigation: 'ゲーミフィケーション・コミュニティ機能でリテンション強化。D7 retention 40%以上を目標' },
        { name: '技術的障壁', probability: 15, impact: 30, mitigation: '既存のAI APIを活用し自社開発コストを最小化。OpenAI/Claude API連携' },
        { name: '規制リスク', probability: 10, impact: 20, mitigation: '個人情報保護法準拠。ヘルスケア領域への過度な踏み込みを回避' },
      ],
      scenarios: {
        best: { description: 'バイラル成長でDAU 50K達成。App Store特集掲載', revenue: '¥1.2M/月', probability: 20 },
        base: { description: '着実な成長でDAU 15K。安定的なサブスク収益', revenue: '¥450K/月', probability: 55 },
        worst: { description: '競合激化でDAU 3K停滞。ピボット検討', revenue: '¥80K/月', probability: 25 },
      },
    },
    implementation: {
      timeframe: '2-3ヶ月',
      phases: [
        { name: 'MVP開発', duration: '4週間', tasks: ['コア機能設計', 'UI/UXデザイン', 'Flutter実装', 'AI API連携'], cost: '¥200K' },
        { name: 'クローズドβ', duration: '2週間', tasks: ['テスター50名招待', 'フィードバック収集', 'バグ修正', 'A/Bテスト'], cost: '¥50K' },
        { name: 'パブリックローンチ', duration: '2週間', tasks: ['App Store申請', 'ASO最適化', 'PR/SNS展開', 'Product Huntローンチ'], cost: '¥100K' },
        { name: 'グロース施策', duration: '4週間', tasks: ['リファラル実装', '広告運用開始', 'コンテンツマーケ', 'パートナーシップ'], cost: '¥150K' },
      ],
      techStack: ['Flutter', 'Firebase', 'OpenAI API', 'RevenueCat', 'Amplitude'],
      teamSize: '2-3名',
      totalCost: '¥500K',
    },
    competitors: [
      {
        id: 'comp-1', name: 'Habitica', logo: '', description: 'ゲーミフィケーション習慣アプリの先駆者', founded: 2013, funding: '$3.5M',
        employees: '10-20', revenue: '$2M/年', marketShare: 8,
        strengths: ['ブランド認知度', 'コミュニティ基盤', 'RPG要素の深さ'],
        weaknesses: ['日本語対応不十分', 'UI/UXが古い', 'AIなし'],
        positioning: { x: -20, y: 60 },
        products: ['Habitica Mobile', 'Habitica Web'], regions: ['US', 'EU'],
        recentMoves: ['新UIリデザイン発表（2025Q4）'],
      },
      {
        id: 'comp-2', name: 'Streaks', logo: '', description: 'Apple Design Award受賞の習慣トラッカー', founded: 2015, funding: 'Bootstrapped',
        employees: '1-5', revenue: '$500K/年', marketShare: 3,
        strengths: ['Apple推奨', 'シンプルUI', 'Apple Watch対応'],
        weaknesses: ['iOS限定', '機能が少ない', 'コミュニティなし'],
        positioning: { x: 30, y: -20 },
        products: ['Streaks iOS', 'Streaks Workout'], regions: ['Global'],
        recentMoves: ['visionOS対応（2025）'],
      },
    ],
    targetSegments: [
      {
        id: 'seg-1', name: '若手ビジネスパーソン', size: '約400万人', percentage: 35,
        characteristics: ['25-35歳', '都市部在住', 'スマホヘビーユーザー', '自己投資に積極的'],
        painPoints: ['三日坊主になりがち', '生産性向上への焦り', '適切なツールが見つからない'],
        willingness: 75, acquisitionCost: '¥800', ltv: '¥12,000', channels: ['Twitter/X', 'Instagram', 'App Store Search'],
        persona: { name: '田中 翔太', age: '28歳', role: 'IT企業マーケター', goals: ['朝活を習慣化したい', '英語学習を継続したい'], frustrations: ['既存アプリは英語UIで使いにくい', 'モチベーション維持が難しい'], quote: '「続けられる仕組みがほしい。ゲームみたいに楽しく習慣化できたら最高」' },
      },
      {
        id: 'seg-2', name: '学生', size: '約700万人', percentage: 25,
        characteristics: ['18-24歳', '価格敏感', 'SNSアクティブ', '友人の推薦に影響される'],
        painPoints: ['勉強の習慣化', '時間管理', 'モチベーション不足'],
        willingness: 45, acquisitionCost: '¥400', ltv: '¥6,000', channels: ['TikTok', 'Instagram', '口コミ'],
        persona: { name: '佐藤 美咲', age: '21歳', role: '大学3年生', goals: ['TOEIC勉強を毎日続けたい', '就活準備を計画的に進めたい'], frustrations: ['友達と比較して焦る', 'やることが多すぎて優先順位がつかない'], quote: '「友達と一緒に頑張れるアプリがあればいいのに」' },
      },
    ],
    evidence: {
      productHunt: { upvotes: 342, rank: 5, date: '2026-01-15' },
      appStore: { rating: 4.6, reviews: 1234, rank: 28 },
      searchTrend: { volume: 12000, growth: '+45%' },
      socialSignals: { mentions: 2340, sentiment: 78 },
    },
    fiveW1H: {
      what: 'AI搭載ゲーミフィケーション習慣化アプリ。日本語ネイティブ対応で、パーソナライズされた習慣形成支援を提供。機械学習で最適な習慣提案・リマインドタイミングを自動調整',
      who: '25-35歳の日本在住ビジネスパーソン・学生。自己投資に積極的だが三日坊主になりやすい層。サブスク月額¥480-980の価格帯を許容',
      when: '2026年2月時点の分析。市場データは2025Q4-2026Q1。予測期間は2026年末まで。週次更新',
      where: '日本市場（iOS/Android）。初期は東京・大阪の都市部。将来的にアジア展開（韓国・台湾）',
      why: '生産性アプリ市場はCAGR 23%で急成長中。日本語特化の競合が少なく、AIパーソナライズで差別化可能。サブスクモデルで安定収益が見込める',
      how: 'Step1: MVP開発（4週間）→ Step2: クローズドβ（2週間）→ Step3: ローンチ → Step4: グロースハック。初期投資¥500Kで4ヶ月目にBEP達成を目指す',
    },
    provenance: defaultProvenance,
    nextSteps: [
      { priority: 1, action: 'ユーザーインタビュー実施（10名）', deadline: '2026-03-01', owner: 'プロダクト担当' },
      { priority: 2, action: 'MVP要件定義・ワイヤーフレーム作成', deadline: '2026-03-07', owner: 'デザイナー' },
      { priority: 3, action: 'Flutter開発環境セットアップ', deadline: '2026-03-10', owner: 'エンジニア' },
      { priority: 4, action: '競合アプリ詳細分析レポート作成', deadline: '2026-03-05', owner: 'アナリスト' },
    ],
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-02-18T08:30:00Z',
    tags: ['AI', 'productivity', 'gamification', 'mobile', 'subscription'],
  },
  {
    id: 'opp-002',
    title: 'AI写真編集プラットフォーム',
    subtitle: 'SNSクリエイター向けワンタップAI画像生成・編集SaaS',
    category: 'Web Platform',
    subcategory: 'Creative Tools',
    status: 'validated',
    revenue: {
      estimated: '¥320K/月',
      range: { min: 180000, max: 500000 },
      model: 'Freemium + Usage-based',
      projections: [
        { month: '2026-03', value: 30000 },
        { month: '2026-04', value: 80000 },
        { month: '2026-05', value: 150000 },
        { month: '2026-06', value: 220000 },
        { month: '2026-07', value: 280000 },
        { month: '2026-08', value: 320000 },
        { month: '2026-09', value: 380000 },
        { month: '2026-10', value: 420000 },
        { month: '2026-11', value: 460000 },
        { month: '2026-12', value: 500000 },
      ],
      breakEven: '5ヶ月目',
      margins: { gross: 70, net: 35 },
    },
    market: {
      sizing: {
        tam: { value: 25000000000, unit: '円', description: '日本のクリエイティブツール市場', year: 2026 },
        sam: { value: 5000000000, unit: '円', description: 'AI画像編集ツール市場', year: 2026 },
        som: { value: 100000000, unit: '円', description: '初年度獲得可能市場', year: 2026 },
        cagr: 31.2,
        methodology: 'Bottom-up: クリエイター人口×ツール課金率×ARPU',
        sources: ['Adobe Digital Economy Index', 'Statista', 'App Annie'],
      },
      growth: '+18%',
      maturity: 'emerging',
      competitiveIntensity: 55,
    },
    scores: { overall: 89, marketSize: 85, growth: 92, competition: 68, feasibility: 82, timing: 90, moat: 65 },
    risks: {
      level: 'medium',
      factors: [
        { name: 'AI技術の急速進化', probability: 60, impact: 60, mitigation: 'API依存を最小化し、独自モデルを段階的に構築' },
        { name: 'APIコスト変動', probability: 50, impact: 40, mitigation: '複数API並行利用・キャッシュ戦略・自社モデル開発' },
        { name: 'Adobe等大手の参入', probability: 70, impact: 80, mitigation: 'SMBクリエイター特化・価格優位性・日本語コミュニティ' },
      ],
      scenarios: {
        best: { description: 'SNSバイラルでクリエイター間に拡散', revenue: '¥800K/月', probability: 15 },
        base: { description: '着実にクリエイターコミュニティを構築', revenue: '¥320K/月', probability: 50 },
        worst: { description: '大手ツールに価格競争で敗退', revenue: '¥60K/月', probability: 35 },
      },
    },
    implementation: {
      timeframe: '3-4ヶ月',
      phases: [
        { name: 'プロトタイプ', duration: '6週間', tasks: ['API選定', 'コアエディタ開発', 'AI連携'], cost: '¥300K' },
        { name: 'ベータテスト', duration: '3週間', tasks: ['クリエイター招待', 'UXテスト', '課金テスト'], cost: '¥100K' },
        { name: 'ローンチ', duration: '2週間', tasks: ['マーケティング', 'PR', 'パートナーシップ'], cost: '¥150K' },
      ],
      techStack: ['Next.js', 'Vercel', 'Replicate API', 'Stripe', 'Supabase'],
      teamSize: '2-4名',
      totalCost: '¥550K',
    },
    competitors: [
      {
        id: 'comp-3', name: 'Canva AI', logo: '', description: 'オンラインデザインツール最大手のAI機能', founded: 2012, funding: '$572M',
        employees: '3,000+', revenue: '$2.3B/年', marketShare: 35,
        strengths: ['圧倒的ブランド', 'テンプレート数', 'チーム機能'],
        weaknesses: ['AI機能は後付け', '日本クリエイター特化弱い', '重い'],
        positioning: { x: 60, y: 80 },
        products: ['Canva Free', 'Canva Pro', 'Canva Teams'], regions: ['Global'],
        recentMoves: ['AI画像生成機能強化（2025Q3）', 'Affinity買収（2024）'],
      },
    ],
    targetSegments: [
      {
        id: 'seg-3', name: 'SNSクリエイター', size: '約50万人', percentage: 45,
        characteristics: ['20-35歳', 'Instagram/TikTokアクティブ', '副業・個人事業主'],
        painPoints: ['Photoshopが高い・難しい', 'AI編集の品質がバラバラ', '日本語フォント対応が少ない'],
        willingness: 65, acquisitionCost: '¥1,200', ltv: '¥18,000', channels: ['Instagram', 'YouTube', 'Twitter/X'],
        persona: { name: '鈴木 あやか', age: '26歳', role: 'インスタグラマー（フォロワー1.2万）', goals: ['投稿画像のクオリティ向上', '編集時間の短縮'], frustrations: ['Canvaはテンプレ感が出る', 'Photoshopは月額高すぎる'], quote: '「AIでプロ並みの画像が作れるなら月1,000円は安い」' },
      },
    ],
    evidence: {
      productHunt: { upvotes: 256, rank: 12, date: '2026-01-22' },
      appStore: null,
      searchTrend: { volume: 8500, growth: '+62%' },
      socialSignals: { mentions: 1800, sentiment: 72 },
    },
    fiveW1H: {
      what: 'AI駆動の写真・画像編集Webプラットフォーム。ワンタップでプロ品質の編集。背景除去、スタイル転送、テキスト追加、AI画像生成を統合',
      who: '日本のSNSクリエイター・個人事業主・小規模ECショップオーナー。月額¥980-2,980の価格帯。技術スキルは中〜低',
      when: '2026年2月分析。AI画像生成市場は2025年から急成長。予測2026年末まで',
      where: '日本市場・Webプラットフォーム（モバイルレスポンシブ）。将来的にネイティブアプリ',
      why: 'AI画像編集市場CAGR 31%。日本語完全対応の競合が少ない。クリエイターエコノミー拡大中',
      how: 'Next.js + AI API連携で3ヶ月でMVP。Freemiumモデルでクリエイターコミュニティ構築→有料転換',
    },
    provenance: defaultProvenance,
    nextSteps: [
      { priority: 1, action: 'AI API比較検証（Replicate vs RunwayML）', deadline: '2026-03-05', owner: 'CTO' },
      { priority: 2, action: 'クリエイター5名へのデプスインタビュー', deadline: '2026-03-10', owner: 'プロダクト' },
    ],
    createdAt: '2026-02-12T10:00:00Z',
    updatedAt: '2026-02-18T08:30:00Z',
    tags: ['AI', 'creative', 'photo-editing', 'web', 'freemium'],
  },
  {
    id: 'opp-003',
    title: 'ヘルスケアIoTプラットフォーム',
    subtitle: 'ウェアラブル連携×ソーシャルフィットネスで健康習慣を定着',
    category: 'IoT / Health',
    subcategory: 'Fitness & Wellness',
    status: 'researching',
    revenue: {
      estimated: '¥280K/月',
      range: { min: 150000, max: 400000 },
      model: 'Subscription + B2B License',
      projections: [
        { month: '2026-03', value: 20000 },
        { month: '2026-04', value: 60000 },
        { month: '2026-05', value: 120000 },
        { month: '2026-06', value: 180000 },
        { month: '2026-07', value: 230000 },
        { month: '2026-08', value: 280000 },
        { month: '2026-09', value: 320000 },
        { month: '2026-10', value: 350000 },
        { month: '2026-11', value: 380000 },
        { month: '2026-12', value: 420000 },
      ],
      breakEven: '6ヶ月目',
      margins: { gross: 80, net: 38 },
    },
    market: {
      sizing: {
        tam: { value: 45000000000, unit: '円', description: '日本のデジタルヘルス市場全体', year: 2026 },
        sam: { value: 8000000000, unit: '円', description: 'フィットネスアプリ・ウェアラブル連携市場', year: 2026 },
        som: { value: 80000000, unit: '円', description: '初年度獲得可能市場', year: 2026 },
        cagr: 18.7,
        methodology: 'Top-down: 経産省ヘルスケア産業レポートベース',
        sources: ['経産省「次世代ヘルスケア産業」', 'Deloitte Digital Health Report', 'Grand View Research'],
      },
      growth: '+15%',
      maturity: 'growing',
      competitiveIntensity: 70,
    },
    scores: { overall: 82, marketSize: 90, growth: 80, competition: 60, feasibility: 75, timing: 85, moat: 70 },
    risks: {
      level: 'medium',
      factors: [
        { name: 'ウェアラブルAPI制約', probability: 40, impact: 50, mitigation: 'Apple HealthKit/Google Fit標準APIに集中' },
        { name: 'ヘルスケア規制', probability: 35, impact: 70, mitigation: '医療機器認定が不要な範囲に機能を限定' },
        { name: 'プライバシー懸念', probability: 50, impact: 60, mitigation: 'データの匿名化・端末内処理を優先' },
      ],
      scenarios: {
        best: { description: '法人契約獲得でB2B展開', revenue: '¥600K/月', probability: 20 },
        base: { description: 'B2C中心の着実成長', revenue: '¥280K/月', probability: 50 },
        worst: { description: '大手フィットネスアプリに吸収', revenue: '¥50K/月', probability: 30 },
      },
    },
    implementation: {
      timeframe: '1-2ヶ月',
      phases: [
        { name: 'コア開発', duration: '3週間', tasks: ['HealthKit連携', 'ソーシャル機能', 'チャレンジ機能'], cost: '¥180K' },
        { name: 'テスト&ローンチ', duration: '2週間', tasks: ['β テスト', 'App Store申請', 'マーケティング'], cost: '¥120K' },
      ],
      techStack: ['React Native', 'Firebase', 'HealthKit', 'Google Fit API'],
      teamSize: '2名',
      totalCost: '¥300K',
    },
    competitors: [],
    targetSegments: [],
    evidence: {
      productHunt: null,
      appStore: { rating: 4.2, reviews: 567, rank: 45 },
      searchTrend: { volume: 6200, growth: '+28%' },
      socialSignals: { mentions: 890, sentiment: 70 },
    },
    fiveW1H: {
      what: 'ウェアラブルデバイス連携フィットネストラッキングアプリ。友人との競争・協力機能でモチベーション維持',
      who: '30-50歳の健康意識の高いビジネスパーソン。Apple Watch/Fitbitユーザー',
      when: '2026年2月分析。ヘルスケア市場は安定成長',
      where: '日本市場（iOS優先）。将来的に企業向け展開',
      why: 'デジタルヘルス市場拡大、企業の健康経営需要増。ウェアラブル普及率上昇',
      how: 'React Native MVP → βテスト → ローンチ。最短1ヶ月で市場投入可能',
    },
    provenance: defaultProvenance,
    nextSteps: [
      { priority: 1, action: 'HealthKit API調査・プロトタイプ', deadline: '2026-03-01', owner: 'エンジニア' },
    ],
    createdAt: '2026-02-14T11:00:00Z',
    updatedAt: '2026-02-18T08:30:00Z',
    tags: ['health', 'IoT', 'wearable', 'social', 'B2B'],
  },
]

// ══════════════════════════════════════════════════════
//  TREND DATA
// ══════════════════════════════════════════════════════

export const trends: TrendData[] = [
  {
    id: 'trend-001',
    name: 'AIエージェント（Agentic AI）',
    category: 'AI / Machine Learning',
    status: 'emerging',
    momentum: 92,
    searchVolume: [
      { month: '2025-09', value: 3200 }, { month: '2025-10', value: 5400 }, { month: '2025-11', value: 8100 },
      { month: '2025-12', value: 12300 }, { month: '2026-01', value: 18500 }, { month: '2026-02', value: 24000 },
    ],
    adoptionCurve: 'early_adopters',
    impact: 'transformative',
    timeframe: '6-18ヶ月で主流化',
    relatedTrends: ['LLM', 'Workflow Automation', 'No-Code'],
    signals: [
      { source: 'Product Hunt', signal: 'AIエージェント系プロダクトが週間Top5に3件', date: '2026-02-15', strength: 95 },
      { source: 'Hacker News', signal: 'Agentic AI関連記事がフロントページ常連化', date: '2026-02-17', strength: 88 },
      { source: 'App Store', signal: 'AIアシスタントカテゴリの新規参入が前月比+40%', date: '2026-02-10', strength: 82 },
      { source: 'VC Funding', signal: 'AI Agent関連のシード投資が前年比3倍', date: '2026-02-01', strength: 90 },
    ],
    prediction: {
      shortTerm: '開発者・テック企業での採用加速。Coding Agent、Data Agentが先行',
      midTerm: '一般消費者向けAIエージェント製品の普及。パーソナルアシスタント市場が再定義',
      longTerm: '企業のワークフロー自動化の標準に。RPA市場を吸収・置換',
    },
    fiveW1H: {
      what: '自律的にタスクを計画・実行するAIシステム。従来のチャットボットを超え、複数ツールを連携して目標を達成',
      who: 'テック企業の開発者・プロダクトマネージャー、業務効率化を求める企業',
      when: '2024年後半から急速に注目度上昇。2026年がtipping point',
      where: 'グローバル、特にUS・日本・EU。SaaS/エンタープライズ市場',
      why: 'GPT-4レベルのLLMがツール使用能力を獲得し、実用的なエージェントが可能に',
      how: 'AIエージェントプラットフォーム構築 or 既存SaaSへのエージェント機能統合',
    },
    provenance: defaultProvenance,
  },
  {
    id: 'trend-002',
    name: 'バーティカルSaaS 2.0',
    category: 'SaaS / Enterprise',
    status: 'growing',
    momentum: 78,
    searchVolume: [
      { month: '2025-09', value: 4500 }, { month: '2025-10', value: 5200 }, { month: '2025-11', value: 6100 },
      { month: '2025-12', value: 7200 }, { month: '2026-01', value: 8400 }, { month: '2026-02', value: 9800 },
    ],
    adoptionCurve: 'early_majority',
    impact: 'high',
    timeframe: '既に成長中、今後3年で成熟',
    relatedTrends: ['Embedded Finance', 'Industry-specific AI', 'Micro-SaaS'],
    signals: [
      { source: 'Product Hunt', signal: '業界特化型SaaSのローンチ数が前年比+35%', date: '2026-02-12', strength: 80 },
      { source: 'Crunchbase', signal: 'バーティカルSaaSのシリーズA調達額が過去最高', date: '2026-01-28', strength: 85 },
    ],
    prediction: {
      shortTerm: '医療・不動産・飲食業界での新規プレイヤー増加',
      midTerm: 'AI統合によるバーティカルSaaSの機能拡張が加速',
      longTerm: '各業界で2-3社に集約。M&A活発化',
    },
    fiveW1H: {
      what: '特定業界に特化したSaaS。汎用ツールでは満たせない業界固有のニーズに対応',
      who: '特定業界の中小企業経営者・現場マネージャー',
      when: '2023年から第2波。AI統合が差別化要因に',
      where: '日本市場は特に飲食・医療・不動産で余地あり',
      why: '汎用SaaSの成熟に伴い、業界特化の需要が顕在化',
      how: '業界知識 × SaaS開発。ドメインエキスパートとのco-creation',
    },
    provenance: defaultProvenance,
  },
  {
    id: 'trend-003',
    name: 'クリエイターエコノミー3.0',
    category: 'Platform / Creator',
    status: 'growing',
    momentum: 72,
    searchVolume: [
      { month: '2025-09', value: 6800 }, { month: '2025-10', value: 7200 }, { month: '2025-11', value: 7800 },
      { month: '2025-12', value: 8500 }, { month: '2026-01', value: 9200 }, { month: '2026-02', value: 10100 },
    ],
    adoptionCurve: 'early_majority',
    impact: 'high',
    timeframe: '進行中、2027年に成熟予測',
    relatedTrends: ['AI Content Creation', 'Digital Products', 'Community Platforms'],
    signals: [
      { source: 'App Store', signal: 'クリエイターツールカテゴリの売上+22%', date: '2026-02-08', strength: 75 },
    ],
    prediction: {
      shortTerm: 'AIツール活用で個人クリエイターの生産性が3倍に',
      midTerm: '中間プラットフォーム不要の直接マネタイズモデルが主流に',
      longTerm: 'クリエイター=起業家の時代。従来型メディアとの融合',
    },
    fiveW1H: {
      what: 'AIツール活用によるクリエイターの生産性向上と直接マネタイズの拡大',
      who: '個人クリエイター・インフルエンサー・副業者',
      when: '2024年から加速。2026年が転換点',
      where: '日本を含むグローバル。YouTube/TikTok/Instagram',
      why: 'AI により制作コスト低下、マネタイズ手段の多様化',
      how: 'クリエイター向けツール・プラットフォーム開発',
    },
    provenance: defaultProvenance,
  },
]

// ══════════════════════════════════════════════════════
//  CATEGORY DATA
// ══════════════════════════════════════════════════════

export const categories: CategoryDetail[] = [
  {
    id: 'cat-ai', name: 'AI Tools', slug: 'ai-tools', description: 'AIを活用したツール・アプリケーション',
    icon: '🤖', color: 'violet',
    totalApps: 234, totalRevenue: '¥2.8B', avgRevenue: '¥12M', medianRevenue: '¥3.2M',
    growth: '+23%', yoyGrowth: '+156%',
    sizing: {
      tam: { value: 120000000000, unit: '円', description: '日本AI市場全体', year: 2026 },
      sam: { value: 25000000000, unit: '円', description: 'AI B2Cツール市場', year: 2026 },
      som: { value: 500000000, unit: '円', description: '参入可能セグメント', year: 2026 },
      cagr: 34.5, methodology: 'IDC Japan AI Market Report + 独自推計',
      sources: ['IDC Japan', 'Gartner Magic Quadrant', 'CB Insights'],
    },
    monthlyData: [
      { month: '2025-09', apps: 180, revenue: 1800000000, growth: 18 },
      { month: '2025-10', apps: 192, revenue: 2000000000, growth: 20 },
      { month: '2025-11', apps: 205, revenue: 2200000000, growth: 22 },
      { month: '2025-12', apps: 218, revenue: 2500000000, growth: 24 },
      { month: '2026-01', apps: 226, revenue: 2650000000, growth: 23 },
      { month: '2026-02', apps: 234, revenue: 2800000000, growth: 23 },
    ],
    topApps: [
      { name: 'ChatGPT', revenue: '¥500M/月', downloads: '2M/月', rating: 4.8, growth: '+12%' },
      { name: 'Notion AI', revenue: '¥200M/月', downloads: '800K/月', rating: 4.6, growth: '+18%' },
      { name: 'Perplexity', revenue: '¥120M/月', downloads: '500K/月', rating: 4.7, growth: '+45%' },
      { name: 'Jasper', revenue: '¥80M/月', downloads: '200K/月', rating: 4.3, growth: '+8%' },
    ],
    subcategories: [
      { name: 'AI Writing', count: 45, growth: '+28%', avgRevenue: '¥8M' },
      { name: 'AI Image', count: 38, growth: '+42%', avgRevenue: '¥15M' },
      { name: 'AI Code', count: 32, growth: '+55%', avgRevenue: '¥20M' },
      { name: 'AI Chat', count: 28, growth: '+35%', avgRevenue: '¥12M' },
      { name: 'AI Video', count: 22, growth: '+68%', avgRevenue: '¥18M' },
    ],
    regions: [
      { name: '北米', marketShare: 42, growth: '+25%', revenue: '¥52B' },
      { name: 'アジア太平洋', marketShare: 28, growth: '+38%', revenue: '¥35B' },
      { name: '欧州', marketShare: 22, growth: '+20%', revenue: '¥27B' },
      { name: 'その他', marketShare: 8, growth: '+15%', revenue: '¥10B' },
    ],
    fiveW1H: {
      what: 'AIツール市場の包括的分析。234アプリの収益・成長・ポジショニングデータ',
      who: 'AI市場への参入を検討する起業家・投資家・プロダクトマネージャー',
      when: '2026年2月時点。6ヶ月間の時系列データ含む',
      where: 'グローバル市場（日本フォーカス）',
      why: 'CAGR 34.5%の急成長市場。参入タイミングが成功の鍵',
      how: 'ニッチ特化 or AI APIラッパー型での低コスト参入を推奨',
    },
    provenance: defaultProvenance,
  },
  {
    id: 'cat-prod', name: 'Productivity', slug: 'productivity', description: '生産性向上ツール・タスク管理',
    icon: '⚡', color: 'cyan',
    totalApps: 189, totalRevenue: '¥1.9B', avgRevenue: '¥10M', medianRevenue: '¥2.8M',
    growth: '+18%', yoyGrowth: '+45%',
    sizing: {
      tam: { value: 80000000000, unit: '円', description: '日本の生産性ツール市場', year: 2026 },
      sam: { value: 15000000000, unit: '円', description: 'クラウド型生産性SaaS', year: 2026 },
      som: { value: 300000000, unit: '円', description: '参入可能セグメント', year: 2026 },
      cagr: 18.2, methodology: '業界レポート + App Store公開データ分析',
      sources: ['Gartner', 'Forrester', 'App Annie'],
    },
    monthlyData: [
      { month: '2025-09', apps: 155, revenue: 1400000000, growth: 14 },
      { month: '2025-10', apps: 162, revenue: 1500000000, growth: 15 },
      { month: '2025-11', apps: 170, revenue: 1600000000, growth: 16 },
      { month: '2025-12', apps: 178, revenue: 1750000000, growth: 17 },
      { month: '2026-01', apps: 184, revenue: 1800000000, growth: 18 },
      { month: '2026-02', apps: 189, revenue: 1900000000, growth: 18 },
    ],
    topApps: [
      { name: 'Notion', revenue: '¥350M/月', downloads: '1.5M/月', rating: 4.7, growth: '+15%' },
      { name: 'Todoist', revenue: '¥80M/月', downloads: '400K/月', rating: 4.5, growth: '+10%' },
      { name: 'TickTick', revenue: '¥50M/月', downloads: '300K/月', rating: 4.6, growth: '+22%' },
    ],
    subcategories: [
      { name: 'Task Management', count: 52, growth: '+15%', avgRevenue: '¥9M' },
      { name: 'Note Taking', count: 38, growth: '+20%', avgRevenue: '¥12M' },
      { name: 'Time Tracking', count: 30, growth: '+12%', avgRevenue: '¥6M' },
      { name: 'Calendar', count: 25, growth: '+18%', avgRevenue: '¥8M' },
    ],
    regions: [
      { name: '北米', marketShare: 38, growth: '+18%', revenue: '¥30B' },
      { name: 'アジア太平洋', marketShare: 30, growth: '+25%', revenue: '¥24B' },
      { name: '欧州', marketShare: 25, growth: '+15%', revenue: '¥20B' },
      { name: 'その他', marketShare: 7, growth: '+10%', revenue: '¥6B' },
    ],
    fiveW1H: {
      what: '生産性ツール市場の詳細分析。189アプリの動向',
      who: 'プロダクティビティ市場参入者、投資判断者',
      when: '2026年2月。過去6ヶ月推移含む',
      where: 'グローバル（日本フォーカス）',
      why: '安定成長でリスク低。AI統合が差別化ポイント',
      how: 'AI + 日本語特化でニッチを掘る',
    },
    provenance: defaultProvenance,
  },
]

// ══════════════════════════════════════════════════════
//  COMPETITIVE LANDSCAPE
// ══════════════════════════════════════════════════════

export const competitiveLandscape: CompetitiveLandscape = {
  totalPlayers: 1234,
  topPlayers: [
    {
      id: 'pl-1', name: 'Notion', logo: '', description: 'All-in-one workspace', founded: 2013, funding: '$343M',
      employees: '500+', revenue: '$250M/年', marketShare: 18,
      strengths: ['ブランド力', '拡張性', 'コミュニティ'],
      weaknesses: ['パフォーマンス', 'オフライン機能', '学習コスト'],
      positioning: { x: 50, y: 80 },
      products: ['Notion Personal', 'Notion Team', 'Notion Enterprise'],
      regions: ['Global'],
      recentMoves: ['AI統合強化', 'Notion Calendar統合', 'API v2リリース'],
    },
    {
      id: 'pl-2', name: 'Linear', logo: '', description: 'モダンプロジェクト管理', founded: 2019, funding: '$52M',
      employees: '50-100', revenue: '$30M/年', marketShare: 5,
      strengths: ['UX品質', 'スピード', '開発者体験'],
      weaknesses: ['限定的な機能', '価格', 'エンタープライズ機能不足'],
      positioning: { x: 70, y: 90 },
      products: ['Linear Free', 'Linear Pro', 'Linear Enterprise'],
      regions: ['US', 'EU'],
      recentMoves: ['Linear Asks発表', 'CyclesUI改善'],
    },
    {
      id: 'pl-3', name: 'Todoist', logo: '', description: 'シンプルタスク管理', founded: 2007, funding: 'Bootstrapped',
      employees: '100-200', revenue: '$50M/年', marketShare: 8,
      strengths: ['シンプルさ', '多プラットフォーム', '長い実績'],
      weaknesses: ['AI機能なし', 'コラボ機能弱い', '停滞感'],
      positioning: { x: -10, y: 20 },
      products: ['Todoist Free', 'Todoist Pro', 'Todoist Business'],
      regions: ['Global'],
      recentMoves: ['ボード表示追加', 'Filterリニューアル'],
    },
  ],
  marketConcentration: 'fragmented',
  herfindahlIndex: 680,
  entryBarriers: [
    { factor: 'ネットワーク効果', level: 'medium', description: 'コラボツールではチーム単位の乗り換えコストが発生' },
    { factor: '技術的優位性', level: 'low', description: '基本的なSaaS技術で参入可能。AI統合がやや高い壁' },
    { factor: 'ブランド認知', level: 'high', description: 'Notion等の強いブランドに対抗するマーケコストが必要' },
    { factor: '資本要件', level: 'low', description: 'Micro-SaaSなら個人でも参入可能。¥50万〜' },
  ],
  keySuccessFactors: ['UX品質', 'AI統合', 'パフォーマンス', 'プラットフォーム対応', 'コミュニティ構築'],
}

// ══════════════════════════════════════════════════════
//  REVENUE MODELS
// ══════════════════════════════════════════════════════

export const revenueModels: RevenueModel[] = [
  {
    type: 'Freemium + Subscription',
    description: '基本機能無料、プレミアム機能を月額/年額課金。最も一般的なSaaSモデル',
    avgArpu: '¥1,200/月', conversionRate: '3-8%', churnRate: '5-12%/月',
    ltv: '¥14,400', cac: '¥3,000', ltvCacRatio: 4.8,
    examples: ['Notion', 'Spotify', 'Dropbox'],
    pros: ['低い参入障壁', '広いファネル', 'ネットワーク効果'],
    cons: ['低い転換率', '無料ユーザーのコスト', '価値の線引きが難しい'],
  },
  {
    type: 'Usage-based (従量課金)',
    description: '使用量に応じた課金。API呼び出し数、ストレージ量、処理回数等',
    avgArpu: '¥2,500/月（変動大）', conversionRate: '15-25%', churnRate: '3-8%/月',
    ltv: '¥45,000', cac: '¥5,000', ltvCacRatio: 9.0,
    examples: ['AWS', 'Stripe', 'OpenAI API'],
    pros: ['収益と価値提供が連動', '高い顧客満足度', 'アップセル自然'],
    cons: ['収益予測が困難', '価格設計が複雑', '少額ユーザー管理コスト'],
  },
  {
    type: 'B2B SaaS (シート課金)',
    description: 'ユーザー数（シート数）に応じた月額課金。チーム・企業向け',
    avgArpu: '¥5,000/シート/月', conversionRate: '10-20%', churnRate: '2-5%/月',
    ltv: '¥180,000', cac: '¥20,000', ltvCacRatio: 9.0,
    examples: ['Slack', 'Figma', 'Linear'],
    pros: ['予測可能な収益', '高いLTV', 'チーム拡大で自然増'],
    cons: ['長い営業サイクル', '高いCAC', 'エンタープライズ対応コスト'],
  },
]

export const revenueProjections: RevenueProjection[] = [
  {
    scenario: '楽観シナリオ',
    months: [
      { month: '2026-03', mrr: 100000, users: 200, churn: 5, growth: 30 },
      { month: '2026-04', mrr: 250000, users: 500, churn: 4, growth: 25 },
      { month: '2026-05', mrr: 450000, users: 900, churn: 4, growth: 22 },
      { month: '2026-06', mrr: 700000, users: 1400, churn: 3, growth: 20 },
      { month: '2026-07', mrr: 950000, users: 1900, churn: 3, growth: 18 },
      { month: '2026-08', mrr: 1200000, users: 2400, churn: 3, growth: 15 },
    ],
    annualRevenue: 14400000,
    assumptions: ['Product Huntで#1 Day獲得', 'バイラル係数1.3以上', '月次成長率15%以上維持'],
  },
  {
    scenario: '基本シナリオ',
    months: [
      { month: '2026-03', mrr: 50000, users: 100, churn: 8, growth: 20 },
      { month: '2026-04', mrr: 120000, users: 240, churn: 7, growth: 18 },
      { month: '2026-05', mrr: 220000, users: 440, churn: 6, growth: 15 },
      { month: '2026-06', mrr: 350000, users: 700, churn: 5, growth: 12 },
      { month: '2026-07', mrr: 450000, users: 900, churn: 5, growth: 10 },
      { month: '2026-08', mrr: 550000, users: 1100, churn: 5, growth: 8 },
    ],
    annualRevenue: 6600000,
    assumptions: ['安定的な有機成長', 'コンバージョン率5%', '月次チャーン5%'],
  },
  {
    scenario: '悲観シナリオ',
    months: [
      { month: '2026-03', mrr: 20000, users: 40, churn: 12, growth: 10 },
      { month: '2026-04', mrr: 40000, users: 80, churn: 10, growth: 8 },
      { month: '2026-05', mrr: 60000, users: 120, churn: 10, growth: 6 },
      { month: '2026-06', mrr: 80000, users: 160, churn: 8, growth: 5 },
      { month: '2026-07', mrr: 90000, users: 180, churn: 8, growth: 4 },
      { month: '2026-08', mrr: 100000, users: 200, churn: 8, growth: 3 },
    ],
    annualRevenue: 1200000,
    assumptions: ['競合の激化', '低いバイラル係数', '高チャーン率'],
  },
]

// ══════════════════════════════════════════════════════
//  ANALYTICS SUMMARY
// ══════════════════════════════════════════════════════

export const analyticsSummary: AnalyticsSummary = {
  period: '2026年2月',
  totalOpportunities: 89,
  newOpportunities: 12,
  validatedOpportunities: 23,
  avgScore: 76,
  topCategory: 'AI Tools',
  topGrowthArea: 'AIエージェント',
  dataPointsCollected: 15847,
  sourcesActive: 4,
  marketInsights: [
    { insight: 'AIエージェント関連プロダクトのPH投稿数が前月比+65%。早期参入の窓が開いている', impact: 'positive', confidence: 88, source: 'Product Hunt API' },
    { insight: '生産性アプリのApp Store課金額が前年比+23%増。日本市場の成長が加速', impact: 'positive', confidence: 92, source: 'App Store Connect' },
    { insight: '汎用チャットボットのユーザー評価が低下傾向（4.2→3.8）。品質差別化の余地あり', impact: 'neutral', confidence: 75, source: 'App Store Reviews分析' },
    { insight: 'ノーコード/ローコード市場の成長が鈍化（+12%→+8%）。成熟フェーズ突入', impact: 'negative', confidence: 80, source: 'Hacker News/PH複合分析' },
  ],
  weeklyTrend: [
    { week: 'W1', opportunities: 18, avgScore: 72 },
    { week: 'W2', opportunities: 22, avgScore: 75 },
    { week: 'W3', opportunities: 25, avgScore: 78 },
    { week: 'W4', opportunities: 24, avgScore: 76 },
  ],
  categoryDistribution: [
    { category: 'AI Tools', count: 34, avgScore: 82 },
    { category: 'Productivity', count: 22, avgScore: 75 },
    { category: 'Health & Fitness', count: 15, avgScore: 70 },
    { category: 'Finance', count: 10, avgScore: 68 },
    { category: 'Education', count: 8, avgScore: 72 },
  ],
  riskDistribution: [
    { level: '低リスク', count: 28, percentage: 31 },
    { level: '中リスク', count: 42, percentage: 47 },
    { level: '高リスク', count: 19, percentage: 22 },
  ],
}

// ══════════════════════════════════════════════════════
//  METHODOLOGY
// ══════════════════════════════════════════════════════

export const methodology: MethodologySection = {
  title: 'Market Radar 調査方法論',
  description: 'Market Radarは、複数のデータソースからリアルタイムに情報を収集・分析し、AI駆動のインサイトを生成する市場調査プラットフォームです。',
  steps: [
    { step: 1, name: 'データ収集', description: 'Product Hunt API、App Store Search API、Hacker News Firebase APIから毎日自動収集。各ソースの特性に応じた最適なクエリ設計', tools: ['Node.js', 'Next.js API Routes', 'cron'] },
    { step: 2, name: 'データクレンジング', description: '重複排除、欠損値処理、正規化。カテゴリの統一マッピング', tools: ['TypeScript', 'Custom ETL Pipeline'] },
    { step: 3, name: 'スコアリング', description: '多次元スコアリングモデル（市場規模、成長率、競合強度、実現可能性、タイミング、参入障壁）で各機会を0-100で評価', tools: ['AI分析エンジン', '重み付けアルゴリズム'] },
    { step: 4, name: 'トレンド分析', description: '時系列データの移動平均・季節調整。検索ボリュームとPH投稿数の相関分析', tools: ['統計分析', 'LLMベース要約'] },
    { step: 5, name: '市場規模推計', description: 'Top-down（公開統計からの推計）とBottom-up（ユーザー数×ARPU）の両面からTAM/SAM/SOMを算出', tools: ['公開統計データ', 'AI推計モデル'] },
    { step: 6, name: 'レポート生成', description: '分析結果をダッシュボード形式で可視化。5W1Hフレームワークで情報を構造化', tools: ['Next.js', 'Tailwind CSS', 'Framer Motion'] },
  ],
  dataQualityFramework: '各データポイントに信頼性スコア（0-100）を付与。複数ソースからの裏付けがある情報は高スコア、単一ソースの場合は減点。AI推計値は人間レビューを経て品質保証。',
  limitations: [
    'Product Hunt掲載製品は英語圏バイアスがある（日本発プロダクトが過小評価される傾向）',
    'App Store Revenue推計は公開データベースのため、実際の収益と±30%の誤差がある可能性',
    'リアルタイムデータは最大15分の遅延が発生',
    'AI推計モデルの予測精度は過去データで75-85%の的中率（MAE基準）',
    '小規模アプリ（DL数1,000未満）はデータ不足で分析精度が低下',
    'B2Bプロダクトの収益データは限定的（公開情報ベース）',
  ],
  updateFrequency: 'データ収集: 毎日（03:00 JST）/ スコアリング: 毎日 / トレンド分析: 週次 / 市場規模: 月次',
}
