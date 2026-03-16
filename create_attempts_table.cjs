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

async function main() {
    const sql = `
        CREATE TABLE IF NOT EXISTS public.registration_attempts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            reference TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            password TEXT NOT NULL,
            referral_code TEXT,
            reg_ip TEXT,
            reg_location TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMPTZ DEFAULT now(),
            payment_id TEXT
        );

        ALTER TABLE public.registration_attempts ENABLE ROW LEVEL SECURITY;
        
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_insert_attempts') THEN
                CREATE POLICY "allow_insert_attempts" ON public.registration_attempts FOR INSERT TO anon, authenticated WITH CHECK (true);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_read_attempts') THEN
                CREATE POLICY "allow_read_attempts" ON public.registration_attempts FOR SELECT TO anon, authenticated USING (true);
            END IF;
        END $$;
    `;

    // Try rpc/exec_sql if it exists, or just print
    const res = await httpsReq(SUPABASE_URL + '/rest/v1/rpc/exec_sql', 'POST', {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE,
        'Authorization': 'Bearer ' + SERVICE_ROLE
    }, JSON.stringify({ sql }));

    if (res.status === 200 || res.status === 204) {
        console.log("Table registration_attempts created successfully.");
    } else {
        console.log("Could not create table via RPC. Status:", res.status);
        console.log(res.body);
        console.log("\nPLEASE RUN THIS SQL IN SUPABASE SQL EDITOR:\n");
        console.log(sql);
    }
}

main();
