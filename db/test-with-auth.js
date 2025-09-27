const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testWithAuth = async () => {
  try {
    console.log('🔍 Testing authentication and drug insertion...');
    
    // First, try to sign up a test user
    console.log('📝 Creating test user...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123',
    });
    
    if (authError) {
      console.error('❌ Auth signup failed:', authError.message);
      
      // If user already exists, try to sign in
      if (authError.message.includes('already registered')) {
        console.log('🔄 User exists, trying to sign in...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'testpassword123',
        });
        
        if (signInError) {
          console.error('❌ Sign in failed:', signInError.message);
          return;
        }
        
        console.log('✅ Signed in successfully');
      } else {
        return;
      }
    } else {
      console.log('✅ User created successfully');
    }
    
    // Now try to insert a drug
    console.log('📝 Attempting to insert test drug...');
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
      startDate: null,
      addedAt: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('drugs')
      .insert(testDrug)
      .select();
    
    if (error) {
      console.error('❌ Insert failed with error:');
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      console.error('Details:', error.details);
    } else {
      console.log('✅ SUCCESS! Drug inserted successfully:');
      console.log('ID:', data[0]?.id);
      console.log('Brand Name:', data[0]?.brandName);
      
      // Clean up
      if (data && data[0]) {
        console.log('\n🧹 Cleaning up test record...');
        await supabase.from('drugs').delete().eq('id', data[0].id);
        console.log('✅ Test record cleaned up');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed with exception:', error);
  }
};

console.log('🚀 Starting authentication test...\n');
testWithAuth();
