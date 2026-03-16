const https = require('https');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

function httpsReq(url, method, headers, body) {
    return new Promise(function (resolve, reject) {
        var u = new URL(url);
        var opts = {
            hostname: u.hostname,
            path: u.pathname + u.search,
            method: method,
            headers: Object.assign({}, headers),
        };
        if (body) opts.headers['Content-Length'] = Buffer.byteLength(body);
        var req = https.request(opts, function (res) {
            var d = '';
            res.on('data', function (c) { d += c; });
            res.on('end', function () { resolve({ status: res.statusCode, body: d }); });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function main() {
    // 1. Verificar si existe
    const check = await httpsReq(SUPABASE_URL + '/rest/v1/profiles?email=eq.elkindanielcastillo@gmail.com', 'GET', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE
    });

    if (JSON.parse(check.body).length > 0) {
        console.log("El usuario maestro ya existe.");
        return;
    }

    console.log("Recreando usuario maestro...");
    const profileRes = await httpsReq(SUPABASE_URL + '/rest/v1/profiles', 'POST', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }, JSON.stringify({
        full_name: 'Elkin Daniel Castillo',
        email: 'elkindanielcastillo@gmail.com',
        phone: '+573000000000',
        referral_code: 'TCMASTER',
        role: 'master'
    }));

    const newProfile = JSON.parse(profileRes.body)[0];
    console.log("Perfil creado:", newProfile.id);

    // Billetera
    await httpsReq(SUPABASE_URL + '/rest/v1/wallets', 'POST', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE,
        'Content-Type': 'application/json'
    }, JSON.stringify({
        user_id: newProfile.id,
        balance_tc: 0,
        address: 'SH-MASTER-' + Math.random().toString(36).substring(7).toUpperCase()
    }));

    console.log("✅ Sistema reseteado con cuenta Maestra lista.");
}

main();
