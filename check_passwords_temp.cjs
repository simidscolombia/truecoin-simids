
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkPasswords() {
    const { data, error } = await supabase
        .from('profiles')
        .select('email, password')
        .in('email', ['elkindanielcastillo@gmail.com', 'juangarcia@gmail.com']);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Passwords found:', JSON.stringify(data, null, 2));
    }
}

checkPasswords();
