-- Add activeIngredients column to drugs table
-- This migration adds the missing activeIngredients column that is referenced in the application

-- Add the activeIngredients column if it doesn't exist
ALTER TABLE drugs ADD COLUMN IF NOT EXISTS activeIngredients jsonb;

-- Update any existing records that might have null activeIngredients
UPDATE drugs 
SET activeIngredients = '[]'::jsonb 
WHERE activeIngredients IS NULL;

-- Add a comment to document the column
COMMENT ON COLUMN drugs.activeIngredients IS 'Array of active ingredients with name and dosage information';
