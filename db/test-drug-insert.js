const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testDrugInsert = async () => {
  try {
    console.log('🔍 Testing drug insertion with all required fields...');
    
    // Test drug with all the fields your app uses
    const testDrug = {
      brandName: 'Test Drug - Clamox 625',
      activeIngredients: [
        { name: 'Amoxicillin', dosage: '500mg' },
        { name: 'Clavulanic Acid', dosage: '125mg' }
      ],
      category: 'Antibiotic',
      tags: ['Antibiotic', 'Infection', 'Bacteria', 'Treatment', 'Medicine'],
      summary: 'Test antibiotic for bacterial infections',
      sideEffects: 'May cause nausea, diarrhea',
      isTaking: false,
      frequency: null,
      startDate: null
    };
    
    console.log('📝 Attempting to insert test drug...');
    const { data, error } = await supabase
      .from('drugs')
      .insert(testDrug)
      .select();
    
    if (error) {
      console.error('❌ Insert failed with error:');
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      console.error('Details:', error.details);
      console.error('Hint:', error.hint);
      
      if (error.code === 'PGRST204') {
        console.log('\n🔧 This is a PostgREST schema cache issue.');
        console.log('💡 Try running: NOTIFY pgrst, "reload schema"; in your Supabase SQL editor');
      }
    } else {
      console.log('✅ SUCCESS! Drug inserted successfully:');
      console.log('ID:', data[0]?.id);
      console.log('Brand Name:', data[0]?.brandName);
      console.log('Active Ingredients:', data[0]?.activeIngredients);
      
      // Clean up the test record
      if (data && data[0]) {
        console.log('\n🧹 Cleaning up test record...');
        const { error: deleteError } = await supabase
          .from('drugs')
          .delete()
          .eq('id', data[0].id);
        
        if (deleteError) {
          console.error('⚠️ Could not clean up test record:', deleteError);
        } else {
          console.log('✅ Test record cleaned up successfully');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed with exception:', error);
  }
};

console.log('🚀 Starting comprehensive drug insertion test...\n');
testDrugInsert();
