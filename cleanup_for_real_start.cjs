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
    // 1. Obtener todos los perfiles excepto el maestro
    const res = await httpsReq(SUPABASE_URL + '/rest/v1/profiles?referral_code=neq.TCMASTER&select=id,full_name,email', 'GET', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE
    });

    const usersToDelete = JSON.parse(res.body);
    console.log(`Borrando ${usersToDelete.length} usuarios de prueba...`);

    for (const u of usersToDelete) {
        console.log(`- Eliminando: ${u.full_name} (${u.email})`);

        // Eliminar billeteras primero (por FK)
        await httpsReq(SUPABASE_URL + `/rest/v1/wallets?user_id=eq.${u.id}`, 'DELETE', {
            'apikey': SERVICE_ROLE,
            'Authorization': 'Bearer ' + SERVICE_ROLE
        });

        // Eliminar perfil
        await httpsReq(SUPABASE_URL + `/rest/v1/profiles?id=eq.${u.id}`, 'DELETE', {
            'apikey': SERVICE_ROLE,
            'Authorization': 'Bearer ' + SERVICE_ROLE
        });
    }

    // 2. Limpiar intentos de registro
    console.log("Limpiando tabla de intentos de registro...");
    await httpsReq(SUPABASE_URL + '/rest/v1/registration_attempts', 'DELETE', {
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE
    });

    console.log("✅ Limpieza completada exitosamente.");
}

main();
