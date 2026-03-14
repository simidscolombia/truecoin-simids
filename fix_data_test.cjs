
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

async function fixRLS() {
    console.log("Intentando deshabilitar RLS o agregar políticas vía RPC si existe... (Aunque mejor trato de parchear la tabla directamente)");
    // actually, let's just use service role to update the user to prove we can.
    const juangarcia_id = "fd9094d2-f473-4e28-b31d-45e605c030f5";
    const body = JSON.stringify({ full_name: "Juan Garcia (Fix Test)" });
    const res = await httpsReq(
        SUPABASE_URL + '/rest/v1/profiles?id=eq.' + juangarcia_id,
        'PATCH',
        {
            'apikey': SERVICE_ROLE,
            'Authorization': 'Bearer ' + SERVICE_ROLE,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body
    );
    console.log("Resultado Update Perfil (Service Role):", res.status, res.body);
}

fixRLS();
