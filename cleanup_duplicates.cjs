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
    // 1. Get all profiles ordered by creation
    const res = await httpsReq(SUPABASE_URL + '/rest/v1/profiles?select=*&order=created_at.asc', 'GET', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE
    });

    const profiles = JSON.parse(res.body);
    const seenEmails = new Set();
    const toDelete = [];

    console.log("Analizando duplicados...");
    for (const p of profiles) {
        const email = p.email.toLowerCase();
        if (email === 'elkindanielcastillo@gmail.com') continue; // Ignorar master

        if (seenEmails.has(email)) {
            console.log(`- Marcando para borrar duplicado: ${p.full_name} (${p.email}) [ID: ${p.id}]`);
            toDelete.push(p.id);
        } else {
            seenEmails.add(email);
            console.log(`+ Manteniendo original: ${p.full_name} (${p.email})`);
        }
    }

    // 2. Ejecutar limpieza
    for (const id of toDelete) {
        // Borrar billetera primero (si existe)
        await httpsReq(SUPABASE_URL + `/rest/v1/wallets?user_id=eq.${id}`, 'DELETE', {
            'apikey': SERVICE_ROLE,
            'Authorization': 'Bearer ' + SERVICE_ROLE
        });
        // Borrar perfil
        await httpsReq(SUPABASE_URL + `/rest/v1/profiles?id=eq.${id}`, 'DELETE', {
            'apikey': SERVICE_ROLE,
            'Authorization': 'Bearer ' + SERVICE_ROLE
        });
    }

    console.log(`\n✅ Limpieza completada. ${toDelete.length} perfiles duplicados eliminados.`);
}

main();
