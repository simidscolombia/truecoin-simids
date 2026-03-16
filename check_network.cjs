const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
// Use the service role key to bypass RLS for administrative tasks
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

async function checkNetwork() {
    console.log("--- PROFILES ---");
    const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('id, full_name, email, referral_code, referrer_id, is_vip');

    if (pError) {
        console.error("Error fetching profiles:", pError);
        return;
    }
    console.log(JSON.stringify(profiles, null, 2));

    console.log("\n--- CURRENT MATRIX STATE ---");
    // I need to find if there is a table for the matrix slots.
    // Let's check table names first if possible, or try common ones.
    const { data: tables, error: tError } = await supabase.rpc('get_tables');
    // Usually rpc might not exist, but let's try reading standard referral info.

    const { data: referrals, error: rError } = await supabase
        .from('profiles')
        .select('id, referrer_id')
        .not('referrer_id', 'is', null);

    if (!rError) {
        console.log("Direct Referral Links:");
        console.log(JSON.stringify(referrals, null, 2));
    }
}

checkNetwork();
