const https = require('https');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjY5NDgsImV4cCI6MjA4ODY0Mjk0OH0.XUjNkWStJT7R6JviAap1Czr4Wq98fyJ7q5ANwCtJGzE';

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
    console.log("Testing insert via raw REST API as ANON...");

    // Insert as anon
    const body = JSON.stringify({
        reference: 'TEST-123456',
        full_name: 'Test Agent',
        email: 'test@agent.com',
        phone: '123456789',
        password: 'testpassword',
        reg_ip: '127.0.0.1',
        reg_location: 'LOCAL',
        status: 'pending'
    });

    const res = await httpsReq(SUPABASE_URL + '/rest/v1/registration_attempts', 'POST', {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': 'Bearer ' + ANON_KEY
    }, body);

    console.log("Status:", res.status);
    console.log("Body:", res.body);
}
testSchema();
