const axios = require('axios');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

async function checkRandy() {
    try {
        const headers = {
            'apikey': SERVICE_ROLE,
            'Authorization': `Bearer ${SERVICE_ROLE}`
        };

        const res = await axios.get(`${SUPABASE_URL}/rest/v1/profiles?email=eq.randy.contreras@gmail.com`, { headers });
        console.log("Randy Profile:", JSON.stringify(res.data, null, 2));
    } catch (error) {
        console.error("Error:", error.message);
    }
}

checkRandy();
