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
    // 1. Eliminar a Fernanda Perez (por error)
    console.log("Eliminando registro erróneo de Fernanda Perez...");
    const fRes = await httpsReq(SUPABASE_URL + '/rest/v1/profiles?full_name=ilike.fernanda perez', 'GET', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE
    });
    const fernandas = JSON.parse(fRes.body);
    for (const f of fernandas) {
        await httpsReq(SUPABASE_URL + `/rest/v1/wallets?user_id=eq.${f.id}`, 'DELETE', { 'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE });
        await httpsReq(SUPABASE_URL + `/rest/v1/profiles?id=eq.${f.id}`, 'DELETE', { 'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE });
        console.log(`- Fernanda (${f.email}) eliminada.`);
    }

    // 2. Activar a James Sebastian Castillo
    console.log("\n🚀 Activando a James Sebastian Castillo García...");
    const email = 'jamessebastiancastillogarcia01@gmail.com';
    const aRes = await httpsReq(SUPABASE_URL + `/rest/v1/registration_attempts?email=eq.${email}&order=created_at.desc`, 'GET', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE
    });

    const attempts = JSON.parse(aRes.body);
    if (attempts.length > 0) {
        const a = attempts[0];

        // Buscar referente (Master)
        const masterRes = await httpsReq(SUPABASE_URL + '/rest/v1/profiles?referral_code=eq.TCMASTER', 'GET', {
            'apikey': SERVICE_ROLE,
            'Authorization': 'Bearer ' + SERVICE_ROLE
        });
        const masters = JSON.parse(masterRes.body);
        const masterId = masters.length > 0 ? masters[0].id : null;

        // Crear Perfil para James
        const pRes = await httpsReq(SUPABASE_URL + '/rest/v1/profiles', 'POST', {
            'apikey': SERVICE_ROLE,
            'Authorization': 'Bearer ' + SERVICE_ROLE,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }, JSON.stringify({
            full_name: a.full_name,
            email: a.email,
            phone: a.phone,
            referral_code: 'TC' + Math.random().toString(36).substring(2, 6).toUpperCase(),
            referred_by: masterId,
            password: a.password,
            current_level: 1,
            is_vip: true
        }));

        if (pRes.status < 300) {
            const newP = JSON.parse(pRes.body)[0];
            // Billetera con 5 TC
            await httpsReq(SUPABASE_URL + '/rest/v1/wallets', 'POST', { 'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE, 'Content-Type': 'application/json' }, JSON.stringify({ user_id: newP.id, balance_tc: 5.0 }));
            // Marcar intento como completado
            await httpsReq(SUPABASE_URL + `/rest/v1/registration_attempts?id=eq.${a.id}`, 'PATCH', { 'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE, 'Content-Type': 'application/json' }, JSON.stringify({ status: 'completed' }));
            console.log(`✅ ¡JAMES SEBASTIAN ACTIVADO EXITOSAMENTE!`);
        } else {
            console.log("❌ Error activando a James:", pRes.body);
        }
    } else {
        console.log("❌ No se encontró el intento de registro para James.");
    }
}

main();
