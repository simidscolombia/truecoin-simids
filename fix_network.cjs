const axios = require('axios');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

const ELKIN_ID = '31bd200a-0dab-4f65-b7bd-ad27980982d5';

async function fixNetwork() {
    try {
        const headers = {
            'apikey': SERVICE_ROLE,
            'Authorization': `Bearer ${SERVICE_ROLE}`,
            'Content-Type': 'application/json'
        };

        // 1. Vincular a Randy si no lo está (aunque parece que ya lo está)
        console.log("Updating Randy...");
        await axios.patch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.randy.contreras@gmail.com`, {
            referred_by: ELKIN_ID
        }, { headers });

        // 2. Buscar otros intentos completados y crearles perfil si no tienen
        const attempts = [
            { email: 'eduardo@gmail.com', name: 'Eduardo Cárdenas' },
            { email: 'juliana@gmail.com', name: 'Juliana Castro' },
            { email: 'fernanda@gmail.com', name: 'Fernanda Pérez' }
        ];

        for (const user of attempts) {
            console.log(`Checking/Creating profile for ${user.name}...`);
            const check = await axios.get(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${user.email}`, { headers });

            if (check.data.length === 0) {
                console.log(`Creating profile for ${user.email}`);
                await axios.post(`${SUPABASE_URL}/rest/v1/profiles`, {
                    full_name: user.name,
                    email: user.email,
                    referred_by: ELKIN_ID,
                    is_vip: true,
                    password: 'password123', // Default
                    referral_code: user.name.split(' ')[0].toUpperCase() + Math.floor(Math.random() * 900 + 100),
                    current_level: 1
                }, { headers });
            } else {
                console.log(`${user.email} already has a profile. Updating referrer...`);
                await axios.patch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${user.email}`, {
                    referred_by: ELKIN_ID
                }, { headers });
            }
        }

        console.log("✅ Network updated.");
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

fixNetwork();
