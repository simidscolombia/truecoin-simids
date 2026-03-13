const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkJuan() {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'juan@test.com')
        .single();

    if (error) {
        console.error("Error finding Juan:", error.message);
        return;
    }

    console.log("Juan Profile (Password Check):", profile.password ? "Has Password" : "No Password");
}

checkJuan();
