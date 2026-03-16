const https = require('https');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

function httpsReq(url, method, headers, body) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const opts = {
            hostname: u.hostname,
            path: u.pathname + u.search,
            method: method,
            headers: Object.assign({}, headers),
        };
        if (body) opts.headers['Content-Length'] = Buffer.byteLength(body);
        const req = https.request(opts, (res) => {
            let d = '';
            res.on('data', (c) => { d += c; });
            res.on('end', () => { resolve({ status: res.statusCode, body: d }); });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function createMatrixTable() {
    console.log("=== Intentando crear tabla matrix_slots vía RPC ===");

    const sqlScript = `
        CREATE TABLE IF NOT EXISTS public.matrix_slots (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            matrix_owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
            occupant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
            recruiter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
            level INTEGER DEFAULT 1,
            position INTEGER CHECK (position >= 1 AND position <= 4),
            created_at TIMESTAMPTZ DEFAULT now(),
            UNIQUE(matrix_owner_id, level, position)
        );

        -- RLS Policies
        ALTER TABLE public.matrix_slots ENABLE ROW LEVEL SECURITY;
        
        DO $$ 
        BEGIN
            DROP POLICY IF EXISTS "allow_read_all_matrix" ON public.matrix_slots;
            DROP POLICY IF EXISTS "allow_insert_self_matrix" ON public.matrix_slots;
        EXCEPTION WHEN OTHERS THEN null;
        END $$;

        CREATE POLICY "allow_read_all_matrix" ON public.matrix_slots FOR SELECT USING (true);
        CREATE POLICY "allow_insert_self_matrix" ON public.matrix_slots FOR INSERT WITH CHECK (true);
    `;

    // Intentamos varios nombres de RPC comunes para ejecutar SQL
    const rpcs = ['xquery', 'exec_sql', 'run_sql'];

    for (const rpc of rpcs) {
        console.log(`Probando RPC: ${rpc}...`);
        const rs = await httpsReq(
            SUPABASE_URL + `/rest/v1/rpc/${rpc}`,
            'POST',
            {
                'Content-Type': 'application/json',
                'apikey': SERVICE_ROLE,
                'Authorization': 'Bearer ' + SERVICE_ROLE
            },
            JSON.stringify({ query: sqlScript, sql: sqlScript }) // Probamos ambos nombres de parámetro
        );

        if (rs.status === 200 || rs.status === 204) {
            console.log(`✅ EXITO con RPC ${rpc}`);
            return;
        } else {
            console.log(`❌ Falló RPC ${rpc}: ${rs.status} ${rs.body.substring(0, 50)}`);
        }
    }

    console.log("\n⚠️ No se pudo crear la tabla automáticamente.");
    console.log("Copia y pega este SQL en tu SQL Editor de Supabase:");
    console.log(sqlScript);
}

createMatrixTable();
