const axios = require('axios');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

async function runSQL(sql) {
    try {
        const res = await axios.post(`${SUPABASE_URL}/rest/v1/rpc/xquery`, { query: sql }, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': SERVICE_ROLE,
                'Authorization': `Bearer ${SERVICE_ROLE}`
            }
        });
        console.log("Success:", res.data);
    } catch (e) {
        console.log("Error running xquery:", e.response ? e.response.data : e.message);
        try {
            const res2 = await axios.post(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, { sql: sql }, {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SERVICE_ROLE,
                    'Authorization': `Bearer ${SERVICE_ROLE}`
                }
            });
            console.log("Success with exec_sql:", res2.data);
        } catch (e2) {
            console.log("Error running exec_sql:", e2.response ? e2.response.data : e2.message);
        }
    }
}

async function fixRLS() {
    console.log("Fixing RLS for transactions table...");
    const sql = `
        DO $$ 
        BEGIN 
            -- Drop existing policies if they exist (ignoring errors if they don't, manually to be safe)
            DROP POLICY IF EXISTS "Allow anon inserts to transactions" ON public.transactions;
            DROP POLICY IF EXISTS "Allow public inserts to transactions" ON public.transactions;
            DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.transactions;
            DROP POLICY IF EXISTS "Enable insert for anon users" ON public.transactions;
        END $$;
        
        -- Create a new fully permissive policy for inserts
        CREATE POLICY "Allow public inserts to transactions" ON public.transactions FOR INSERT WITH CHECK (true);
        
        -- Also ensure select is allowed
        DROP POLICY IF EXISTS "Allow public selects from transactions" ON public.transactions;
        CREATE POLICY "Allow public selects from transactions" ON public.transactions FOR SELECT USING (true);
        
        -- And UPDATE
        DROP POLICY IF EXISTS "Allow public updates to transactions" ON public.transactions;
        CREATE POLICY "Allow public updates to transactions" ON public.transactions FOR UPDATE USING (true);
    `;
    await runSQL(sql);
}

fixRLS();
