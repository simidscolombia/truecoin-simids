
const https = require('https');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

function httpsReq(url, method, headers, body) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const opts = {
            hostname: u.hostname,
            path: u.pathname + u.search,
            method: method,
            headers: Object.assign({}, headers),
        };
        const req = https.request(opts, (res) => {
            let d = '';
            res.on('data', (c) => { d += c; });
            res.on('end', () => { resolve({ status: res.statusCode, body: d }); });
        });
        req.on('error', reject);
        if (body) {
            opts.headers['Content-Length'] = Buffer.byteLength(body);
            req.write(body);
        }
        req.end();
    });
}

async function forceUpdateWallet() {
    const juangarcia_id = "fd9094d2-f473-4e28-b31d-45e605c030f5";
    console.log("Force updating wallet for user ID:", juangarcia_id);

    // Update balance_tc to 999.00
    const body = JSON.stringify({ balance_tc: 999.00 });
    const res = await httpsReq(
        SUPABASE_URL + '/rest/v1/wallets?user_id=eq.' + juangarcia_id,
        'PATCH',
        {
            'apikey': SERVICE_ROLE,
            'Authorization': 'Bearer ' + SERVICE_ROLE,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body
    );
    console.log("Update Result:", res.status, res.body);
}

forceUpdateWallet();
