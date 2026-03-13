const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkJuan() {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*, wallets(*)')
        .eq('email', 'juan@test.com')
        .single();

    if (error) {
        console.error("Error finding Juan:", error.message);
        return;
    }

    console.log("Juan Profile:", JSON.stringify(profile, null, 2));
}

checkJuan();
