const axios = require('axios');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

async function listUsers() {
    try {
        const response = await axios.get(`${SUPABASE_URL}/rest/v1/profiles?select=id,email,full_name,referred_by`, {
            headers: {
                'apikey': SERVICE_ROLE,
                'Authorization': `Bearer ${SERVICE_ROLE}`
            }
        });
        console.log("USERS IN DATABASE:");
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Error fetching users:", error.response ? error.response.data : error.message);
    }
}

listUsers();
