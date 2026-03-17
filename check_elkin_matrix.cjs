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

async function checkMatrix() {
    // Primero buscar a Elkin para estar seguros de su ID
    const profRes = await httpsReq(
        SUPABASE_URL + '/rest/v1/profiles?full_name=ilike.elkin*&select=id,full_name',
        'GET',
        { 'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE }
    );
    const profiles = JSON.parse(profRes.body);
    console.log("Elkin profiles:", profiles);

    if (profiles.length === 0) return;
    const elkinId = profiles[0].id;

    // Buscar sus slots en la matriz
    const matrixRes = await httpsReq(
        SUPABASE_URL + '/rest/v1/matrix_slots?matrix_owner_id=eq.' + elkinId + '&select=*',
        'GET',
        { 'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE }
    );
    console.log("Elkin Matrix Slots:", JSON.parse(matrixRes.body));
}

checkMatrix();
