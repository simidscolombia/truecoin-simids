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
    console.log("Creando usuario maestro...");
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
        password: 'admin', // Contraseña por defecto para el master
        current_level: 12, // Rango máximo
        is_vip: true
    }));

    if (profileRes.status >= 300) {
        console.error("Error creando perfil:", profileRes.body);
        return;
    }

    const data = JSON.parse(profileRes.body);
    if (!data || data.length === 0) {
        console.error("No se recibió el perfil creado.");
        return;
    }

    const newProfile = data[0];
    console.log("Perfil creado:", newProfile.id);

    // Billetera
    await httpsReq(SUPABASE_URL + '/rest/v1/wallets', 'POST', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE,
        'Content-Type': 'application/json'
    }, JSON.stringify({
        user_id: newProfile.id,
        balance_tc: 0,
        address: 'SH-MASTER-2026'
    }));

    console.log("✅ Sistema reseteado con cuenta Maestra lista.");
}

main();
