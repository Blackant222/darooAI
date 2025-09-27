const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testInsert = async () => {
  try {
    console.log('Testing drug insert with activeIngredients...');
    
    const testDrug = {
      brandName: 'Test Drug',
      activeIngredients: [{ name: 'Test Ingredient', dosage: '100mg' }],
      category: 'Test',
      tags: ['test'],
      summary: 'Test summary',
      sideEffects: 'Test side effects',
      isTaking: false
    };
    
    const { data, error } = await supabase
      .from('drugs')
      .insert(testDrug)
      .select();
    
    if (error) {
      console.error('❌ Insert failed:', error);
      if (error.code === 'PGRST204') {
        console.log('🔍 The activeIngredients column is still missing from the database');
        console.log('📝 Please run the SQL in your Supabase dashboard:');
        console.log('   ALTER TABLE drugs ADD COLUMN activeIngredients jsonb;');
      }
    } else {
      console.log('✅ Insert successful:', data);
      console.log('🎉 The activeIngredients column is working!');
      
      // Clean up the test record
      if (data && data[0]) {
        await supabase.from('drugs').delete().eq('id', data[0].id);
        console.log('🧹 Test record cleaned up');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testInsert();
