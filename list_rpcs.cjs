const axios = require('axios');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

async function listRpcs() {
    try {
        const headers = {
            'apikey': SERVICE_ROLE,
            'Authorization': `Bearer ${SERVICE_ROLE}`
        };

        const res = await axios.get(`${SUPABASE_URL}/rest/v1/`, { headers });
        console.log("RPCs found in API:");
        console.log(Object.keys(res.data.paths)
            .filter(path => path.includes('rpc/'))
            .map(path => path.replace('/rpc/', '')));
    } catch (error) {
        console.error("Error:", error.message);
    }
}

listRpcs();
