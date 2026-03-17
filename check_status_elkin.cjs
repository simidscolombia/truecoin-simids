const axios = require('axios');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

async function checkStatus() {
    try {
        const headers = { 'apikey': SERVICE_ROLE, 'Authorization': `Bearer ${SERVICE_ROLE}` };

        // Check Elkin
        const elkinRes = await axios.get(`${SUPABASE_URL}/rest/v1/profiles?email=eq.elkindanielcastillo@gmail.com`, { headers });
        console.log("Elkin Profile:", elkinRes.data[0]);

        // Check matrix_slots
        try {
            const matrixRes = await axios.get(`${SUPABASE_URL}/rest/v1/matrix_slots?matrix_owner_id=eq.${elkinRes.data[0].id}`, { headers });
            console.log("Matrix Slots for Elkin:", matrixRes.data);
        } catch (e) {
            console.log("⚠️ matrix_slots table probably DOES NOT EXIST YET.");
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

checkStatus();
