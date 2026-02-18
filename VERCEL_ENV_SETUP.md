# 🔧 Vercel Environment Variables Setup Guide

## 🎯 Required Environment Variables

Market Radarが正常に動作するために、以下の環境変数をVercelに設定する必要があります：

### 必須環境変数
```
NEXT_PUBLIC_SUPABASE_URL=https://zualceyvwvvijxcbfsco.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED_JWT_TOKEN
SUPABASE_SERVICE_ROLE_KEY=REDACTED_JWT_TOKEN
CRON_SECRET_TOKEN=market-radar-cron-2026
```

## 📋 設定手順

### Method 1: Vercel Dashboard (推奨)

1. **Vercel Dashboard にアクセス**
   ```
   https://vercel.com/dashboard
   ```

2. **プロジェクト選択**
   - "market-radar" プロジェクトをクリック

3. **Settings タブ**
   - 上部メニューから "Settings" をクリック

4. **Environment Variables**
   - 左サイドバーから "Environment Variables" をクリック

5. **環境変数を追加**
   以下の形式で1つずつ追加：
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://zualceyvwvvijxcbfsco.supabase.co
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

### Method 2: Vercel CLI

```bash
# プロジェクトにリンク
vercel link

# 環境変数を追加
vercel env add NEXT_PUBLIC_SUPABASE_URL
# → https://zualceyvwvvijxcbfsco.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY  
# → [anon key]

vercel env add SUPABASE_SERVICE_ROLE_KEY
# → [service key]

vercel env add CRON_SECRET_TOKEN
# → market-radar-cron-2026
```

## ⚡ 設定完了後

1. **再デプロイ実行**
   - 環境変数設定後、自動で再デプロイが実行されます
   - または手動で "Redeploy" ボタンをクリック

2. **動作確認**
   ```
   ✅ Site: https://market-radar-rho.vercel.app
   ✅ Health: https://market-radar-rho.vercel.app/api/health
   ✅ Data: https://market-radar-rho.vercel.app/api/data
   ```

3. **期待される結果**
   - Health API: `{"status":"healthy"}` (database: "ok")
   - Data API: Real Supabase data returned
   - Site: Full functionality with real data

## 🔍 確認方法

### Health Check
```bash
curl https://market-radar-rho.vercel.app/api/health
```

**期待される応答:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-18T14:30:00.000Z",
  "version": "0.1.0", 
  "checks": {
    "database": {
      "status": "ok",
      "latencyMs": 150
    },
    "api": {
      "status": "ok"
    }
  },
  "responseTimeMs": 200
}
```

### Data API Check
```bash  
curl https://market-radar-rho.vercel.app/api/data
```

**期待される応答:**
```json
{
  "lastUpdate": "2026-02-18T14:30:00.000Z",
  "stats": {
    "totalOpportunities": 1,
    "totalTrends": 1,
    "totalCategories": 1,
    "avgScore": 85
  },
  "highlights": [...],
  "categories": [...],
  "recentCollection": {
    "timestamp": "2026-02-18T14:30:00.000Z",
    "sources": [...]
  }
}
```

## 🚨 注意事項

1. **秘密鍵の取り扱い**
   - SERVICE_ROLE_KEYは非常に強力な権限を持ちます
   - 絶対に公開リポジトリにコミットしないでください

2. **環境の統一**
   - Development/Preview/Production すべてに同じ値を設定
   - 本番用とテスト用を分ける場合は別のSupabaseプロジェクトを作成

3. **設定確認**
   - 環境変数設定後、必ず再デプロイを実行
   - Health APIで接続状況を確認

---

**🎯 設定完了後、Market Radarが完全に動作し、Supabaseからのリアルデータでの市場分析が可能になります！**