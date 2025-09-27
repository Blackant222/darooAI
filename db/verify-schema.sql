-- Verification script to check the current state of the drugs table
-- Run this in your Supabase SQL Editor to see what's happening

-- 1. Check if the drugs table exists
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'drugs' AND table_schema = 'public';

-- 2. Check all columns in the drugs table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'drugs' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check if activeIngredients column exists specifically
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'drugs' 
  AND table_schema = 'public' 
  AND column_name = 'activeIngredients';

-- 4. If the column doesn't exist, add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drugs' 
          AND table_schema = 'public' 
          AND column_name = 'activeIngredients'
    ) THEN
        ALTER TABLE drugs ADD COLUMN activeIngredients jsonb;
        RAISE NOTICE 'Added activeIngredients column to drugs table';
    ELSE
        RAISE NOTICE 'activeIngredients column already exists';
    END IF;
END $$;

-- 5. Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'drugs' 
  AND table_schema = 'public' 
  AND column_name = 'activeIngredients';
