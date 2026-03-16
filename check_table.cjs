const axios = require('axios');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

async function checkMatrixTable() {
    try {
        const response = await axios.get(`${SUPABASE_URL}/rest/v1/matrix_slots?limit=1`, {
            headers: {
                'apikey': SERVICE_ROLE,
                'Authorization': `Bearer ${SERVICE_ROLE}`
            }
        });
        console.log("Matrix Table Exists!");
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log("Matrix Table DOES NOT EXIST.");
        } else {
            console.error("Error checking table:", error.response ? error.response.data : error.message);
        }
    }
}

checkMatrixTable();
