import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const email = 'kaitoluismiropo@gmail.com';
const password = 'Reset123!';
const fullName = 'Kaito Luis Miropo';

console.log('🚀 Creating user:', email);

const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName }
});

if (authError) {
    console.error('❌ Auth error:', authError.message);
    process.exit(1);
}

console.log('✅ User created:', authData.user.id);

await supabase.from('profiles').update({
    payment_status: 'paid',
    full_name: fullName
}).eq('id', authData.user.id);

console.log('✅ Payment status: PAID');

console.log('\n🎉 Success!');
console.log('📧 Email:', email);
console.log('🔑 Password:', password);
console.log('\n👉 Login at http://localhost:3000/signin\n');
