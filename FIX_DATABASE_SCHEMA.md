# Fix Database Schema Issue

## Problems
1. **Missing Column**: The `activeIngredients` column is missing from the `drugs` table in the Supabase database, causing the error:
   ```
   Could not find the 'activeIngredients' column of 'drugs' in the schema cache
   ```

2. **Realtime Subscription Error**: The drug subscription channel is failing with:
   ```
   Drug subscription channel error: undefined
   ```

## Solution
You need to add the missing column and enable realtime for your Supabase database. Here are the steps:

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/ndtrawjkztybdzkkcrgg
2. Navigate to the SQL Editor
3. Run the following SQL:

```sql
-- Add the activeIngredients column to the drugs table
ALTER TABLE drugs ADD COLUMN IF NOT EXISTS activeIngredients jsonb;

-- Update any existing records that might have null activeIngredients
UPDATE drugs 
SET activeIngredients = '[]'::jsonb 
WHERE activeIngredients IS NULL;

-- Add a comment to document the column
COMMENT ON COLUMN drugs.activeIngredients IS 'Array of active ingredients with name and dosage information';

-- Enable realtime for the drugs table (fixes subscription errors)
ALTER PUBLICATION supabase_realtime ADD TABLE drugs;
```

### Option 2: Using Supabase CLI (if you have proper permissions)
```bash
cd /Users/ashtehrani/Projects/ZeeSet/Ibn
supabase db push
```

## Verification
After applying the fix, you can verify it works by:
1. Going to your app and trying to scan a drug again
2. The drug should now be successfully added to your pharmacy

## Files Created
- `db/migration-add-active-ingredients.sql` - SQL migration file
- `supabase/migrations/20250127000001_add_active_ingredients_column.sql` - Supabase migration file
- `db/check-schema.js` - Script to verify the column exists
- `db/add-column.js` - Script to test the column functionality
