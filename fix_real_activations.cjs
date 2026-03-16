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
    // 1. ELIMINAR A EDUARDO (Como pediste)
    console.log("Eliminando a Eduardo Cárdenas...");
    const eRes = await httpsReq(SUPABASE_URL + '/rest/v1/profiles?full_name=ilike.eduardo cardenas', 'GET', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE
    });
    const eduardos = JSON.parse(eRes.body);
    for (const ed of eduardos) {
        await httpsReq(SUPABASE_URL + `/rest/v1/wallets?user_id=eq.${ed.id}`, 'DELETE', { 'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE });
        await httpsReq(SUPABASE_URL + `/rest/v1/profiles?id=eq.${ed.id}`, 'DELETE', { 'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE });
        console.log(`- Eduardo (${ed.email}) eliminado.`);
    }

    // 2. ACTIVAR A LOS DOS REALES
    const references = [
        'REG-ZELB1ERT-MMSNB562', // Keren Hapuc
        'REG-ULZJH8IH-MMSJD4F8'  // Fernanda Perez (o el otro que pagó)
    ];

    for (const ref of references) {
        console.log(`\n🚀 Activando real: ${ref}...`);
        const res = await httpsReq(SUPABASE_URL + `/rest/v1/registration_attempts?reference=eq.${ref}`, 'GET', {
            'apikey': SERVICE_ROLE,
            'Authorization': 'Bearer ' + SERVICE_ROLE
        });
        const attempts = JSON.parse(res.body);
        if (attempts.length > 0) {
            const a = attempts[0];

            // Buscar referente
            let refId = null;
            if (a.referral_code) {
                const r = await httpsReq(SUPABASE_URL + `/rest/v1/profiles?referral_code=eq.${a.referral_code}`, 'GET', { 'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE });
                const rData = JSON.parse(r.body);
                if (rData.length > 0) refId = rData[0].id;
            }

            // Crear Perfil
            const pRes = await httpsReq(SUPABASE_URL + '/rest/v1/profiles', 'POST', {
                'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE, 'Content-Type': 'application/json', 'Prefer': 'return=representation'
            }, JSON.stringify({
                full_name: a.full_name, email: a.email, phone: a.phone, referral_code: 'TC' + Math.random().toString(36).substring(2, 6).toUpperCase(),
                referred_by: refId, password: a.password, current_level: 1, is_vip: true
            }));

            if (pRes.status < 300) {
                const newP = JSON.parse(pRes.body)[0];
                await httpsReq(SUPABASE_URL + '/rest/v1/wallets', 'POST', { 'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE, 'Content-Type': 'application/json' }, JSON.stringify({ user_id: newP.id, balance_tc: 5.0 }));
                await httpsReq(SUPABASE_URL + `/rest/v1/registration_attempts?id=eq.${a.id}`, 'PATCH', { 'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE, 'Content-Type': 'application/json' }, JSON.stringify({ status: 'completed' }));
                console.log(`✅ ACTIVADO: ${a.full_name}`);
            }
        }
    }
}
main();
