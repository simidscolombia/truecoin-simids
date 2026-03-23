require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE);

async function checkRecentProfile() {
    console.log("Fetching recent profiles and wallets...");
    
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
            id, full_name, email,
            wallets (id, balance_tc)
        `)
        .order('created_at', { ascending: false })
        .limit(3);

    if (error) {
        console.error("Error finding profiles:", error.message);
        return;
    }

    console.log("Recent Profiles:", JSON.stringify(profiles, null, 2));
}

checkRecentProfile();
