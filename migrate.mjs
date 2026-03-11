/**
 * TrueCoin Simids — DB Migration Script (Node.js compatible)
 */

import https from 'https';

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';
const REF = 'rpodcifhgqzfmdbkeinu';

const DEFAULT_THEME = [
    { key: 'color_wallet', value: '#D4A017' },
    { key: 'color_marketplace', value: '#2D5A27' },
    { key: 'color_directorio', value: '#E86430' },
    { key: 'color_pos', value: '#0B1F4B' },
    { key: 'color_admin', value: '#2A7F8A' },
    { key: 'color_cloud_blue', value: '#4A7FC1' },
    { key: 'color_navy', value: '#0B1F4B' },
];

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS app_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`;

function request(url, options, body) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const reqOptions = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {},
        };

        const req = https.request(reqOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });

        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function runSQL(sql) {
    const body = JSON.stringify({ query: sql });
    return request(
        `https://api.supabase.com/v1/projects/${REF}/database/query`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                'Authorization': `Bearer ${SERVICE_ROLE}`,
            },
        },
        body
    );
}

async function seedViaREST(rows) {
    const body = JSON.stringify(rows);
    return request(
        `${SUPABASE_URL}/rest/v1/app_settings`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                'apikey': SERVICE_ROLE,
                'Authorization': `Bearer ${SERVICE_ROLE}`,
                'Prefer': 'resolution=merge-duplicates',
            },
        },
        body
    );
}

async function main() {
    console.log('🚀 TrueCoin Simids — DB Migration\n');

    // Step 1: Create table
    console.log('📋 Step 1: Creando tabla app_settings...');
    const createResult = await runSQL(CREATE_TABLE_SQL);
    console.log(`   HTTP Status: ${createResult.status}`);
    console.log(`   Response: ${createResult.body.substring(0, 300)}\n`);

    if (createResult.status === 200 || createResult.status === 201) {
        console.log('✅ Tabla creada exitosamente.\n');
    } else if (createResult.status === 401 || createResult.status === 403) {
        console.log('⚠️  Management API requiere Personal Access Token (PAT).');
        console.log('   La tabla se creará vía instrucciones manuales (ver abajo).\n');
        printManualInstructions();
        return;
    } else {
        console.log('⚠️  Respuesta inesperada. Intentando igualmente el seed...\n');
    }

    // Step 2: Seed default theme colors
    console.log('🎨 Step 2: Insertando colores por defecto...');
    const rows = DEFAULT_THEME.map(r => ({ ...r, updated_at: new Date().toISOString() }));
    const seedResult = await seedViaREST(rows);
    console.log(`   HTTP Status: ${seedResult.status}`);
    console.log(`   Response: ${seedResult.body.substring(0, 300)}\n`);

    if (seedResult.status >= 200 && seedResult.status < 300 || seedResult.status === 204) {
        console.log('✅ Colores del tema insertados.');
        console.log('🎉 ¡Migración completada! El ThemeCustomizer ya funciona al 100%.\n');
    } else if (seedResult.status === 404) {
        console.log('❌ La tabla aún no existe. Necesitas crearla primero (ver instrucciones).\n');
        printManualInstructions();
    } else {
        console.log('❌ Error al insertar colores. Detalle arriba.\n');
    }
}

function printManualInstructions() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('📌 INSTRUCCIONES MANUALES (30 segundos):');
    console.log('═══════════════════════════════════════════════════════');
    console.log('   1. Abre: https://supabase.com/dashboard/project/rpodcifhgqzfmdbkeinu/sql');
    console.log('   2. Pega este SQL en el editor y presiona "RUN":');
    console.log('');
    console.log(CREATE_TABLE_SQL);
    console.log('');
    console.log('   3. Luego corre: node migrate.mjs');
    console.log('═══════════════════════════════════════════════════════\n');
}

main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
