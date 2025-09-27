const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const addColumn = async () => {
  try {
    console.log('Attempting to add activeIngredients column...');
    
    // Try to add the column using a direct SQL query
    const { data, error } = await supabase
      .from('drugs')
      .select('activeIngredients')
      .limit(1);
    
    if (error) {
      console.log('Column does not exist, attempting to add it...');
      
      // Since we can't directly execute DDL through the client,
      // let's try to insert a test record to see the exact error
      const testDrug = {
        brandName: 'Test Drug',
        activeIngredients: [{ name: 'Test Ingredient', dosage: '100mg' }],
        category: 'Test',
        tags: ['test'],
        summary: 'Test summary',
        sideEffects: 'Test side effects',
        isTaking: false
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('drugs')
        .insert(testDrug)
        .select();
      
      if (insertError) {
        console.error('Insert error details:', insertError);
      } else {
        console.log('Test insert successful:', insertData);
      }
    } else {
      console.log('Column exists and is accessible');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
};

addColumn();
