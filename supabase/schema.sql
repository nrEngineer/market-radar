-- ═══════════════════════════════════════════════════════════════
-- Market Radar Database Schema
-- Production-ready schema for market intelligence system
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable timestamps
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ── Opportunities Table ──
-- Core market opportunities with comprehensive analysis
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'hypothesis' 
    CHECK (status IN ('validated', 'hypothesis', 'researching', 'archived')),
  
  -- JSON columns for complex structured data
  five_w1h JSONB NOT NULL DEFAULT '{}',
  scores JSONB NOT NULL DEFAULT '{}',
  risks JSONB NOT NULL DEFAULT '{}',
  revenue JSONB NOT NULL DEFAULT '{}',
  market JSONB NOT NULL DEFAULT '{}',
  implementation JSONB NOT NULL DEFAULT '{}',
  competitors JSONB NOT NULL DEFAULT '[]',
  target_segments JSONB NOT NULL DEFAULT '[]',
  evidence JSONB NOT NULL DEFAULT '{}',
  provenance JSONB NOT NULL DEFAULT '{}',
  next_steps JSONB NOT NULL DEFAULT '[]',
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for opportunities
CREATE INDEX IF NOT EXISTS opportunities_category_idx ON opportunities(category);
CREATE INDEX IF NOT EXISTS opportunities_status_idx ON opportunities(status);
CREATE INDEX IF NOT EXISTS opportunities_updated_at_idx ON opportunities(updated_at DESC);
CREATE INDEX IF NOT EXISTS opportunities_scores_gin_idx ON opportunities USING GIN (scores);
CREATE INDEX IF NOT EXISTS opportunities_tags_gin_idx ON opportunities USING GIN (tags);

-- ── Trends Table ──
-- Market trends analysis and predictions
CREATE TABLE IF NOT EXISTS trends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'emerging'
    CHECK (status IN ('emerging', 'growing', 'mature', 'declining')),
  momentum INTEGER NOT NULL DEFAULT 0 CHECK (momentum >= -100 AND momentum <= 100),
  
  -- JSON columns for complex data
  search_volume JSONB NOT NULL DEFAULT '[]',
  adoption_curve TEXT NOT NULL DEFAULT 'innovators',
  impact TEXT NOT NULL DEFAULT 'low'
    CHECK (impact IN ('low', 'medium', 'high', 'transformative')),
  timeframe TEXT NOT NULL DEFAULT '',
  related_trends TEXT[] DEFAULT '{}',
  signals JSONB NOT NULL DEFAULT '[]',
  prediction JSONB NOT NULL DEFAULT '{}',
  five_w1h JSONB NOT NULL DEFAULT '{}',
  provenance JSONB NOT NULL DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for trends
CREATE INDEX IF NOT EXISTS trends_category_idx ON trends(category);
CREATE INDEX IF NOT EXISTS trends_status_idx ON trends(status);
CREATE INDEX IF NOT EXISTS trends_momentum_idx ON trends(momentum DESC);
CREATE INDEX IF NOT EXISTS trends_updated_at_idx ON trends(updated_at DESC);
CREATE INDEX IF NOT EXISTS trends_search_volume_gin_idx ON trends USING GIN (search_volume);

-- ── Categories Table ──
-- Market category deep-dive analysis
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '📱',
  color TEXT NOT NULL DEFAULT '#6366f1',
  
  -- Market metrics
  total_apps INTEGER NOT NULL DEFAULT 0,
  total_revenue TEXT NOT NULL DEFAULT '¥0',
  avg_revenue TEXT NOT NULL DEFAULT '¥0',
  median_revenue TEXT NOT NULL DEFAULT '¥0',
  growth TEXT NOT NULL DEFAULT '0%',
  yoy_growth TEXT NOT NULL DEFAULT '0%',
  
  -- JSON columns for complex analysis
  sizing JSONB NOT NULL DEFAULT '{}',
  monthly_data JSONB NOT NULL DEFAULT '[]',
  top_apps JSONB NOT NULL DEFAULT '[]',
  subcategories JSONB NOT NULL DEFAULT '[]',
  regions JSONB NOT NULL DEFAULT '[]',
  five_w1h JSONB NOT NULL DEFAULT '{}',
  provenance JSONB NOT NULL DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for categories
CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);
CREATE INDEX IF NOT EXISTS categories_name_idx ON categories(name);
CREATE INDEX IF NOT EXISTS categories_total_apps_idx ON categories(total_apps DESC);

-- ── Collected Data Table ──
-- Raw data from external sources (App Store, Hacker News, etc.)
CREATE TABLE IF NOT EXISTS collected_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL, -- 'appstore', 'hackernews', 'producthunt', etc.
  raw_data JSONB NOT NULL, -- Original API response
  processed_data JSONB DEFAULT NULL, -- Processed/cleaned data
  collected_at TIMESTAMPTZ DEFAULT NOW(),
  data_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'success'
    CHECK (status IN ('success', 'error', 'partial')),
  error TEXT DEFAULT NULL,
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for collected_data
CREATE INDEX IF NOT EXISTS collected_data_source_idx ON collected_data(source);
CREATE INDEX IF NOT EXISTS collected_data_collected_at_idx ON collected_data(collected_at DESC);
CREATE INDEX IF NOT EXISTS collected_data_status_idx ON collected_data(status);
CREATE INDEX IF NOT EXISTS collected_data_source_date_idx ON collected_data(source, collected_at DESC);

-- ── Collection Logs Table ──
-- Execution logs for data collection processes
CREATE TABLE IF NOT EXISTS collection_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL,
  status TEXT NOT NULL
    CHECK (status IN ('success', 'error', 'partial')),
  data_count INTEGER NOT NULL DEFAULT 0,
  error TEXT DEFAULT NULL,
  execution_time_ms INTEGER NOT NULL DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for collection_logs
CREATE INDEX IF NOT EXISTS collection_logs_source_idx ON collection_logs(source);
CREATE INDEX IF NOT EXISTS collection_logs_timestamp_idx ON collection_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS collection_logs_status_idx ON collection_logs(status);
CREATE INDEX IF NOT EXISTS collection_logs_source_timestamp_idx ON collection_logs(source, timestamp DESC);

-- ── Automatic timestamp updates ──
-- Function to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_opportunities_updated_at 
  BEFORE UPDATE ON opportunities 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trends_updated_at 
  BEFORE UPDATE ON trends 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ── Views for common queries ──

-- Latest collection status by source
CREATE OR REPLACE VIEW latest_collection_status AS
SELECT DISTINCT ON (source) 
  source,
  status,
  data_count,
  timestamp,
  error,
  execution_time_ms
FROM collection_logs
ORDER BY source, timestamp DESC;

-- Daily collection summary
CREATE OR REPLACE VIEW daily_collection_summary AS
SELECT 
  DATE(timestamp) as collection_date,
  source,
  COUNT(*) as runs,
  SUM(data_count) as total_items,
  AVG(execution_time_ms) as avg_execution_time,
  COUNT(*) FILTER (WHERE status = 'success') as successful_runs,
  COUNT(*) FILTER (WHERE status = 'error') as failed_runs
FROM collection_logs
GROUP BY DATE(timestamp), source
ORDER BY collection_date DESC, source;

-- Recent opportunities with scores
CREATE OR REPLACE VIEW recent_opportunities AS
SELECT 
  id,
  title,
  subtitle,
  category,
  subcategory,
  status,
  (scores->>'overall')::INTEGER as overall_score,
  (scores->>'marketSize')::INTEGER as market_size_score,
  (scores->>'growth')::INTEGER as growth_score,
  (scores->>'competition')::INTEGER as competition_score,
  tags,
  created_at,
  updated_at
FROM opportunities
WHERE status != 'archived'
ORDER BY updated_at DESC;

-- ── Sample data comments ──
-- Tables are ready for seeding with migrate/seed scripts
-- Use the seed.ts script to populate with initial mock data

-- ── Security ──
-- Enable Row Level Security (RLS) if needed
-- ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Anyone can read opportunities" ON opportunities FOR SELECT USING (true);

-- Note: For this project, we're using service role key for API access
-- In production, implement proper authentication and RLS policies