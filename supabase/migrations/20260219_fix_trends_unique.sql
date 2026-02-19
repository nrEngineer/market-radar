-- Fix trends table to support ON CONFLICT operations
-- Add UNIQUE constraint to name column for upsert operations

ALTER TABLE trends 
ADD CONSTRAINT trends_name_unique UNIQUE (name);

-- Also add a composite unique constraint for category+name if needed for better data integrity
-- ALTER TABLE trends 
-- ADD CONSTRAINT trends_name_category_unique UNIQUE (name, category);