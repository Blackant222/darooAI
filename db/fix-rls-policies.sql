-- Fix RLS Policies for drugs table
-- Run this in your Supabase SQL Editor

-- 1. Check current RLS policies
SELECT 'CURRENT RLS POLICIES:' as check_type;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'drugs' AND schemaname = 'public';

-- 2. Drop existing policies (if they exist)
DROP POLICY IF EXISTS "Users can view their own drugs." ON drugs;
DROP POLICY IF EXISTS "Users can insert their own drugs." ON drugs;
DROP POLICY IF EXISTS "Users can update their own drugs." ON drugs;
DROP POLICY IF EXISTS "Users can delete their own drugs." ON drugs;

-- 3. Create correct RLS policies
CREATE POLICY "Users can view their own drugs." ON drugs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drugs." ON drugs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drugs." ON drugs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drugs." ON drugs
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Verify policies were created
SELECT 'NEW RLS POLICIES:' as check_type;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'drugs' AND schemaname = 'public';

-- 5. Test RLS is working
SELECT 'RLS STATUS:' as check_type;
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'drugs' AND schemaname = 'public';
