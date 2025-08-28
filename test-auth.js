import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqavbdmepjbapcjzhxel.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxYXZiZG1lcGpiYXBjanpoeGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzOTQ5MzMsImV4cCI6MjA3MTk3MDkzM30.kWy4iNOE_6yqEL91dd0VNe8jZ8BSG2JBe-g2Plsh7as';

console.log('Testing Supabase connection...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Session error:', error.message);
    } else {
      console.log('✅ Basic connection successful!');
      console.log('Session found:', data.session ? 'Yes' : 'No');
    }

    console.log('\n2. Testing database connection...');
    const { data: tables, error: dbError } = await supabase
      .from('notes')
      .select('*')
      .limit(1);
    
    if (dbError) {
      console.log('❌ Database error:', dbError.message);
      console.log('Error details:', dbError);
    } else {
      console.log('✅ Database connection successful!');
    }

    console.log('\n3. Testing authentication methods...');
    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: 'test@example.com',
        options: { shouldCreateUser: false }
      });
      
      if (signInError && signInError.message.includes('not allowed')) {
        console.log('✅ Auth endpoint accessible (signup disabled as expected)');
      } else if (signInError) {
        console.log('⚠️ Auth error:', signInError.message);
      } else {
        console.log('✅ Auth test completed successfully');
      }
    } catch (authError) {
      console.log('❌ Auth test failed:', authError.message);
    }

  } catch (error) {
    console.log('❌ General error:', error.message);
  }
}

testConnection();
