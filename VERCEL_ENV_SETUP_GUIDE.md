# 🌐 Vercel環境変数設定ガイド

## 🚀 必須環境変数一覧

### 📊 Supabase Database (必須)
```
Variable Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://zualceyvwvvijxcbfsco.supabase.co

Variable Name: NEXT_PUBLIC_SUPABASE_ANON_KEY  
Value: REDACTED_JWT_TOKEN

Variable Name: SUPABASE_SERVICE_ROLE_KEY
Value: REDACTED_JWT_TOKEN
```

### 🔐 Authentication & Security (必須)
```
Variable Name: CRON_SECRET_TOKEN
Value: <REDACTED_CRON_SECRET>
```

### 🎯 API Integration (オプション - 将来機能用)
```
Variable Name: GITHUB_TOKEN
Value: your_github_token_here
(GitHub API制限緩和・追加データ取得用)

Variable Name: PRODUCT_HUNT_TOKEN  
Value: your_ph_token_here
(Product Hunt API統合用)
```

---

## ⚙️ Vercel Dashboard設定手順

### 1. 🌐 Vercelダッシュボードにログイン
- https://vercel.com/dashboard
- market-radar プロジェクト選択

### 2. ⚙️ Settings → Environment Variables
- 左サイドバー「Settings」クリック
- 「Environment Variables」タブ選択

### 3. ➕ 環境変数追加
各変数について以下実行：
```
1. "Add New" ボタンクリック
2. "Key" に変数名入力（例: NEXT_PUBLIC_SUPABASE_URL）
3. "Value" に値ペースト
4. Environment: Production, Preview, Development 全選択
5. "Save" ボタンクリック
```

### 4. 🔄 デプロイ実行
- 「Deployments」タブに移動
- 「Redeploy」ボタンでEnvironment Variables反映

---

## ✅ 設定確認方法

### 🔍 デプロイ後確認URL
```
Health Check: https://market-radar-rho.vercel.app/api/health
Data API: https://market-radar-rho.vercel.app/api/data
Research: https://market-radar-rho.vercel.app/research
```

### 📊 正常動作確認項目
- [ ] Health Check: `{"status":"healthy"}` 返却
- [ ] Data API: 実データ取得成功（opportunities, trends）  
- [ ] Database: Supabase接続成功（latency <100ms）
- [ ] Research: カスタム調査機能動作

---

## 🚨 トラブルシューティング

### Database Connection Error
**症状**: `{"status":"error", "error":"Database connection failed"}`
**解決**: SUPABASE_SERVICE_ROLE_KEY設定確認

### Build Error
**症状**: Vercelビルド失敗
**解決**: NEXT_PUBLIC_* 変数がPublic設定になっているか確認

### CRON API 403 Error  
**症状**: `/api/collect` が403エラー
**解決**: CRON_SECRET_TOKEN設定確認・認証ヘッダー送信

---

## 🎯 設定優先度

### 🔥 Priority 1 (今すぐ設定)
1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
3. `SUPABASE_SERVICE_ROLE_KEY`
4. `CRON_SECRET_TOKEN`

### 📈 Priority 2 (機能拡張時)
5. `GITHUB_TOKEN`
6. `PRODUCT_HUNT_TOKEN`

---

**🎉 設定完了後**: Market Radar完全稼働・収益化準備完了！**