import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6fm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

async function check() {
    console.log("Checking profiles...");
    const { data: profiles, error } = await supabase.from('profiles').select('id, email, full_name, referrer_id, referral_code');
    if (error) {
        console.error("Error:", error);
    } else {
        console.table(profiles);
    }
}

check();
