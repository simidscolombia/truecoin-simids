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
    const ref = 'REG-AXDF2BLQ-MMSI7ZCZ'; // Referencia de Eduardo
    console.log(`Buscando intento: ${ref}...`);

    // 1. Obtener datos del intento
    const res = await httpsReq(SUPABASE_URL + `/rest/v1/registration_attempts?reference=eq.${ref}`, 'GET', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE
    });

    const attempts = JSON.parse(res.body);
    if (attempts.length === 0) return console.log("❌ No se encontró el intento.");
    const a = attempts[0];

    // 2. Buscar referido
    let referredById = null;
    if (a.referral_code) {
        const rRes = await httpsReq(SUPABASE_URL + `/rest/v1/profiles?referral_code=eq.${a.referral_code}`, 'GET', {
            'apikey': SERVICE_ROLE,
            'Authorization': 'Bearer ' + SERVICE_ROLE
        });
        const refs = JSON.parse(rRes.body);
        if (refs.length > 0) referredById = refs[0].id;
    }

    // 3. Crear Perfil
    console.log("Creando perfil...");
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let newCode = '';
    for (let i = 0; i < 6; i++) newCode += chars.charAt(Math.floor(Math.random() * chars.length));

    const pRes = await httpsReq(SUPABASE_URL + '/rest/v1/profiles', 'POST', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }, JSON.stringify({
        full_name: a.full_name,
        email: a.email,
        phone: a.phone,
        referral_code: newCode,
        referred_by: referredById,
        password: a.password,
        current_level: 1,
        is_vip: true
    }));

    if (pRes.status >= 300) return console.log("❌ Error creando perfil:", pRes.body);
    const newProfile = JSON.parse(pRes.body)[0];

    // 4. Crear Billetera
    console.log("Creando billetera...");
    await httpsReq(SUPABASE_URL + '/rest/v1/wallets', 'POST', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE,
        'Content-Type': 'application/json'
    }, JSON.stringify({
        user_id: newProfile.id,
        balance_tc: 5.0 // Por el pago de 5000
    }));

    // 5. Marcar intento como completado
    await httpsReq(SUPABASE_URL + `/rest/v1/registration_attempts?id=eq.${a.id}`, 'PATCH', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE,
        'Content-Type': 'application/json'
    }, JSON.stringify({ status: 'completed' }));

    console.log(`✅ ¡EDUARDO CÁRDENAS ACTIVADO EXITOSAMENTE! Código: ${newCode}`);
}

main();
