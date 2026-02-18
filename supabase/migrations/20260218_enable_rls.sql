-- ═══════════════════════════════════════════════════════════════
-- Market Radar RLS (Row Level Security) 有効化
-- セキュリティ部門 Sランク達成のための必須設定
-- ═══════════════════════════════════════════════════════════════

-- 1. 全テーブルでRLSを有効化
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE trends ENABLE ROW LEVEL SECURITY; 
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collected_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_logs ENABLE ROW LEVEL SECURITY;

-- 2. 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "authenticated_read_opportunities" ON opportunities;
DROP POLICY IF EXISTS "authenticated_read_trends" ON trends;
DROP POLICY IF EXISTS "authenticated_read_categories" ON categories;
DROP POLICY IF EXISTS "service_role_all_opportunities" ON opportunities;
DROP POLICY IF EXISTS "service_role_all_trends" ON trends;
DROP POLICY IF EXISTS "service_role_all_categories" ON categories;
DROP POLICY IF EXISTS "service_role_all_collected_data" ON collected_data;
DROP POLICY IF EXISTS "service_role_all_collection_logs" ON collection_logs;

-- 3. opportunities テーブルのポリシー
-- 認証ユーザーは読み取りのみ可能
CREATE POLICY "authenticated_read_opportunities"
  ON opportunities FOR SELECT
  TO authenticated
  USING (true);

-- サービスロール（API）は全操作可能
CREATE POLICY "service_role_all_opportunities"
  ON opportunities FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4. trends テーブルのポリシー
CREATE POLICY "authenticated_read_trends"
  ON trends FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "service_role_all_trends"
  ON trends FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5. categories テーブルのポリシー
CREATE POLICY "authenticated_read_categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "service_role_all_categories"
  ON categories FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 6. collected_data テーブルのポリシー
-- データ収集は内部APIのみ
CREATE POLICY "service_role_all_collected_data"
  ON collected_data FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 7. collection_logs テーブルのポリシー
-- ログは内部APIのみ
CREATE POLICY "service_role_all_collection_logs"
  ON collection_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 8. 確認用クエリ（コメントアウト）
-- SELECT schemaname, tablename, rowsecurity, policyname, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;