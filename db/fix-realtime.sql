-- Fix realtime subscription for drugs table
-- This should be run in the Supabase SQL editor

-- Enable realtime for the drugs table
ALTER PUBLICATION supabase_realtime ADD TABLE drugs;

-- Verify that realtime is enabled
SELECT schemaname, tablename, hasreplication 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' AND tablename = 'drugs';
