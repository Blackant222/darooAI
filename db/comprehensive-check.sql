-- Comprehensive Database Health Check
-- Run this in your Supabase SQL Editor to diagnose all issues

-- 1. Force PostgREST schema refresh
NOTIFY pgrst, 'reload schema';

-- 2. Check profiles table structure
SELECT 'PROFILES TABLE STRUCTURE:' as check_type;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY column_name;

-- 3. Check if any profiles exist
SELECT 'PROFILE COUNT:' as check_type;
SELECT COUNT(*) as profile_count FROM profiles;

-- 4. Check recent users in auth.users
SELECT 'RECENT USERS:' as check_type;
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 5. Check drugs table structure (final verification)
SELECT 'DRUGS TABLE STRUCTURE:' as check_type;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'drugs' 
  AND table_schema = 'public'
ORDER BY column_name;

-- 6. Check RLS policies on drugs table
SELECT 'DRUGS RLS POLICIES:' as check_type;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'drugs' AND schemaname = 'public';

-- 7. Check if realtime is enabled for drugs
SELECT 'REALTIME STATUS:' as check_type;
SELECT schemaname, tablename, hasreplication 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' AND tablename = 'drugs';

-- 8. Test if we can insert a test record (this will show any remaining column issues)
SELECT 'TESTING INSERT PERMISSIONS:' as check_type;
-- This is just a test - we won't actually insert
SELECT 'Ready to test drug insertion...' as status;
