const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE);

async function checkKeys() {
    const { data, error } = await supabase.from('app_settings').select('*').eq('key', 'payment_api_keys').single();
    if (error) {
        console.error("Error fetching keys:", error);
    } else {
        console.log("Keys found in DB:", data.value);
    }
}

checkKeys();
