const axios = require('axios');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

async function checkUsers() {
    try {
        const headers = {
            'apikey': SERVICE_ROLE,
            'Authorization': `Bearer ${SERVICE_ROLE}`
        };

        const emails = ['eduardo@gmail.com', 'juliana@gmail.com', 'fernanda@gmail.com', 'randy.contreras@gmail.com'];

        for (const email of emails) {
            const res = await axios.get(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${email}`, { headers });
            console.log(`Checking ${email}:`, res.data.length > 0 ? "FOUND" : "NOT FOUND");
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

checkUsers();
