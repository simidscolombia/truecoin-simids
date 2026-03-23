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
        if (body) opts.headers['Content-Length'] = Buffer.byteLength(body);
        const req = https.request(opts, (res) => {
            let d = '';
            res.on('data', (c) => { d += c; });
            res.on('end', () => { resolve({ status: res.statusCode, body: d }); });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function testSchema() {
    console.log("Testing insert via raw REST API...");

    // Insert as service role
    const body = JSON.stringify({
        reference: 'TEST-123456',
        full_name: 'Test Agent',
        email: 'test@agent.com',
        phone: '123456789',
        password: 'testpassword',
        user_agent: 'test_agent', 
        status: 'pending'
    });

    const res = await httpsReq(SUPABASE_URL + '/rest/v1/registration_attempts', 'POST', {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE
    }, body);

    console.log("Status:", res.status);
    console.log("Body:", res.body);
    
    // Si funciona, borramos la prueba
    if (res.status === 201) {
        await httpsReq(SUPABASE_URL + '/rest/v1/registration_attempts?reference=eq.TEST-123456', 'DELETE', {
            'apikey': SERVICE_ROLE,
            'Authorization': 'Bearer ' + SERVICE_ROLE
        });
        console.log("Success! Schema is fine.");
    }
}
testSchema();
