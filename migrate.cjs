/**
 * TrueCoin Simids — Test & Seed (tabla ya existe)
 */
const https = require('https');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjY5NDgsImV4cCI6MjA4ODY0Mjk0OH0.placeholder';

const DEFAULT_THEME = [
    { key: 'color_wallet', value: '#D4A017' },
    { key: 'color_marketplace', value: '#2D5A27' },
    { key: 'color_directorio', value: '#E86430' },
    { key: 'color_pos', value: '#0B1F4B' },
    { key: 'color_admin', value: '#2A7F8A' },
    { key: 'color_cloud_blue', value: '#4A7FC1' },
    { key: 'color_navy', value: '#0B1F4B' },
];

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
    console.log('\n=== TrueCoin Simids — Verificacion DB ===\n');

    // Test 1: READ with service_role
    console.log('[1] Leyendo app_settings con service_role...');
    var r1 = await httpsReq(
        SUPABASE_URL + '/rest/v1/app_settings?select=key,value&order=key',
        'GET',
        {
            'apikey': SERVICE_ROLE,
            'Authorization': 'Bearer ' + SERVICE_ROLE,
        }
    );
    console.log('    Status:', r1.status);
    if (r1.status === 200) {
        var data = JSON.parse(r1.body);
        console.log('    OK! Filas encontradas:', data.length);
        if (data.length > 0) {
            console.log('    Colores guardados:');
            data.forEach(function (row) {
                console.log('      -', row.key, '=', row.value);
            });
        } else {
            console.log('    Tabla vacia, insertando colores...');
            var seedBody = JSON.stringify(DEFAULT_THEME.map(function (r) {
                return { key: r.key, value: r.value, updated_at: new Date().toISOString() };
            }));
            var rs = await httpsReq(
                SUPABASE_URL + '/rest/v1/app_settings',
                'POST',
                {
                    'Content-Type': 'application/json',
                    'apikey': SERVICE_ROLE,
                    'Authorization': 'Bearer ' + SERVICE_ROLE,
                    'Prefer': 'resolution=merge-duplicates',
                },
                seedBody
            );
            console.log('    Seed status:', rs.status);
        }
    } else {
        console.log('    Error:', r1.body.substring(0, 200));
    }

    // Test 2: READ with anon key (what the frontend uses)
    console.log('\n[2] Verificando acceso con anon key (frontend)...');
    var anonKeyFromEnv = process.env.VITE_SUPABASE_ANON_KEY || '';
    if (!anonKeyFromEnv) {
        // Read from .env file
        try {
            var fs = require('fs');
            var env = fs.readFileSync('.env', 'utf8');
            var match = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
            if (match) anonKeyFromEnv = match[1].trim();
        } catch (e) { }
    }

    if (anonKeyFromEnv) {
        var r2 = await httpsReq(
            SUPABASE_URL + '/rest/v1/app_settings?select=key,value&limit=1',
            'GET',
            {
                'apikey': anonKeyFromEnv,
                'Authorization': 'Bearer ' + anonKeyFromEnv,
            }
        );
        console.log('    Status:', r2.status, '|', r2.body.substring(0, 200));
        if (r2.status === 200) {
            console.log('    OK! El frontend puede leer los colores del tema.');
        } else if (r2.status === 401 || r2.status === 403) {
            console.log('    PERMISO DENEGADO. Necesitas agregar politica RLS.');
            console.log('\n    Ejecuta este SQL en el SQL Editor de Supabase:');
            console.log('    ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;');
            console.log('    CREATE POLICY "allow_read_all" ON app_settings');
            console.log('      FOR SELECT TO anon, authenticated USING (true);');
            console.log('    CREATE POLICY "allow_write_service" ON app_settings');
            console.log('      FOR ALL TO service_role USING (true);');
        }
    }

    console.log('\n=== Verificacion completada ===\n');
}

main().catch(function (err) {
    console.error('Error:', err.message);
});
