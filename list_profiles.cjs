const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

async function list() {
    const { data, error } = await supabase.from('profiles').select('email, password').limit(5);
    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
}
list();
