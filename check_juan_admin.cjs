const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

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
