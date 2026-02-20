import type { MethodologySection } from '@/domain/types'

export const methodology: MethodologySection = {
  title: 'Market Radar 調査方法論',
  description: 'Market Radarは、複数の公開データソースからリアルタイムに情報を収集し、キーワードマッチング・多次元スコアリングで分析する市場調査プラットフォームです。',
  steps: [
    { step: 1, name: 'データ収集', description: 'Product Hunt API、App Store Search API、Hacker News Firebase APIから毎日自動収集。各ソースの特性に応じた最適なクエリ設計', tools: ['Node.js', 'Next.js API Routes', 'cron'] },
    { step: 2, name: 'データクレンジング', description: '重複排除、欠損値処理、正規化。カテゴリの統一マッピング', tools: ['TypeScript', 'Custom ETL Pipeline'] },
    { step: 3, name: 'スコアリング', description: '多次元スコアリングモデル（市場規模、成長率、競合強度、実現可能性、タイミング、参入障壁）で各機会を0-100で評価', tools: ['重み付けアルゴリズム', 'TypeScript'] },
    { step: 4, name: 'トレンド分析', description: '時系列データの移動平均・季節調整。検索ボリュームとPH投稿数の相関分析', tools: ['統計分析', '公開データ集計'] },
    { step: 5, name: '市場規模推計', description: 'Top-down（公開統計からの推計）とBottom-up（ユーザー数×ARPU）の両面からTAM/SAM/SOMを算出', tools: ['公開統計データ', '推計モデル'] },
    { step: 6, name: 'レポート生成', description: '分析結果をダッシュボード形式で可視化。5W1Hフレームワークで情報を構造化', tools: ['Next.js', 'Tailwind CSS', 'Framer Motion'] },
  ],
  dataQualityFramework: '各データポイントに信頼性スコア（0-100）を付与。複数ソースからの裏付けがある情報は高スコア、単一ソースの場合は減点。推計値は出典を明記し透明性を確保。',
  limitations: [
    'Product Hunt掲載製品は英語圏バイアスがある（日本発プロダクトが過小評価される傾向）',
    'App Store Revenue推計は公開データベースのため、実際の収益と±30%の誤差がある可能性',
    'リアルタイムデータは最大15分の遅延が発生',
    '市場規模推計は公開データベースの推計で、実際とのズレが生じる場合あり',
    '小規模アプリ（DL数1,000未満）はデータ不足で分析精度が低下',
    'B2Bプロダクトの収益データは限定的（公開情報ベース）',
  ],
  updateFrequency: 'データ収集: 毎日（03:00 JST）/ スコアリング: 毎日 / トレンド分析: 週次 / 市場規模: 月次',
}
