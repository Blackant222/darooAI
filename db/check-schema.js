const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const checkSchema = async () => {
  try {
    // Check if the drugs table exists and get its structure
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'drugs')
      .eq('table_schema', 'public');
    
    if (error) {
      console.error('Error checking schema:', error);
      return;
    }
    
    console.log('Current drugs table structure:');
    console.table(data);
    
    // Check if activeIngredients column exists
    const hasActiveIngredients = data?.some(col => col.column_name === 'activeIngredients');
    console.log(`\nactiveIngredients column exists: ${hasActiveIngredients}`);
    
    if (!hasActiveIngredients) {
      console.log('\nAdding activeIngredients column...');
      const { error: alterError } = await supabase.rpc('exec_sql', { 
        sql: 'ALTER TABLE drugs ADD COLUMN IF NOT EXISTS activeIngredients jsonb;' 
      });
      
      if (alterError) {
        console.error('Error adding column:', alterError);
      } else {
        console.log('activeIngredients column added successfully');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
};

checkSchema();
