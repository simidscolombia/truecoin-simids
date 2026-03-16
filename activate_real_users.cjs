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

async function activateAttempt(ref) {
    console.log(`\n🚀 Procesando activación para: ${ref}...`);

    // 1. Obtener datos del intento
    const res = await httpsReq(SUPABASE_URL + `/rest/v1/registration_attempts?reference=eq.${ref}`, 'GET', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE
    });

    const attempts = JSON.parse(res.body);
    if (attempts.length === 0) {
        console.log(`❌ No se encontró el intento ${ref}.`);
        return;
    }
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

    if (pRes.status >= 300) {
        console.log(`❌ Error creando perfil para ${a.full_name}:`, pRes.body);
        return;
    }
    const newProfile = JSON.parse(pRes.body)[0];

    // 4. Crear Billetera (Sincronizado con el pago de 5000 COP -> 5 TC)
    await httpsReq(SUPABASE_URL + '/rest/v1/wallets', 'POST', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE,
        'Content-Type': 'application/json'
    }, JSON.stringify({
        user_id: newProfile.id,
        balance_tc: 5.0
    }));

    // 5. Marcar intento como completado
    await httpsReq(SUPABASE_URL + `/rest/v1/registration_attempts?id=eq.${a.id}`, 'PATCH', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE,
        'Content-Type': 'application/json'
    }, JSON.stringify({ status: 'completed' }));

    console.log(`✅ ACTIVADO: ${a.full_name} | Código: ${newCode} | Email: ${a.email}`);
}

async function main() {
    // Referencias de los dos usuarios que pagaron
    const references = [
        'REG-Y9EGI35H-MMSNE5VO', // Keren Hapuc
        'REG-66KB5MET-MMSII2M6'  // Juliana Castro (O el otro pago pendiente)
    ];

    for (const ref of references) {
        await activateAttempt(ref);
    }
}

main();
