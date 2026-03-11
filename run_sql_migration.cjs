const https = require('https');
const fs = require('fs');

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

async function runSql() {
    console.log("=== Ejecutando Migración SQL para Tablas de Negocios y Productos ===");

    // El script SQL para enviar
    const sqlScript = `
        -- Tablas base
        CREATE TABLE IF NOT EXISTS public.businesses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
            name TEXT NOT NULL,
            category TEXT DEFAULT 'General',
            description TEXT,
            address TEXT,
            phone TEXT,
            is_vip BOOLEAN DEFAULT false,
            membership_tier TEXT DEFAULT 'free',
            source TEXT DEFAULT 'organic',
            rating NUMERIC(3, 1) DEFAULT 5.0,
            image_url TEXT,
            payment_config JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS public.products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            description TEXT,
            price_cop NUMERIC(10, 2) DEFAULT 0,
            price_tc NUMERIC(10, 2) NOT NULL,
            mlm_utility NUMERIC(10, 2) DEFAULT 0,
            image_url TEXT,
            stock INTEGER DEFAULT 0,
            is_available BOOLEAN DEFAULT true,
            category TEXT DEFAULT 'General',
            is_marketplace BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT now()
        );

        -- RLS Policies
        ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

        -- Drop existing policies if any to avoid errors on re-run
        DO $$ 
        BEGIN
            DROP POLICY IF EXISTS "allow_read_businesses" ON public.businesses;
            DROP POLICY IF EXISTS "allow_read_products" ON public.products;
        EXCEPTION
            WHEN OTHERS THEN null;
        END $$;

        CREATE POLICY "allow_read_businesses" ON public.businesses FOR SELECT USING (true);
        CREATE POLICY "allow_read_products" ON public.products FOR SELECT USING (true);

        -- Mock Data para que el app no se vea vacía
        INSERT INTO public.businesses (id, name, category, description, address, is_vip, membership_tier, image_url)
        VALUES 
            ('b1111111-1111-1111-1111-111111111111', 'Restaurante La Casona', 'Comida Típica', 'Auténtica comida local.', 'Calle 10 # 45-12', true, 'vip', 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=400'),
            ('b2222222-2222-2222-2222-222222222222', 'Tech Store VIP', 'Tecnología', 'Bodega de importación China.', 'Centro Comercial Santa Fe', false, 'free', 'https://images.unsplash.com/photo-1531297172864-8eccd2de1ddb?q=80&w=400')
        ON CONFLICT (id) DO NOTHING;

        -- Productos para Cajero y Marketplace
        INSERT INTO public.products (id, business_id, name, description, price_cop, price_tc, mlm_utility, stock, image_url, is_marketplace)
        VALUES 
            ('p1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'Menú del Día Completo', 'Sopa, plato fuerte.', 15000, 15, 1.5, 50, 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400', false),
            ('p2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'Premium Plus', 'Versión de lujo del menú', 28000, 28, 2.8, 20, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=400', true),
            ('p3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'Auriculares Inalámbricos', 'Cancelación de ruido activa, 24h+', 120000, 120, 12.0, 15, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400', true)
        ON CONFLICT (id) DO NOTHING;
    `;

    console.log("Enviando comando SQL...");
    const rs = await httpsReq(
        SUPABASE_URL + '/rest/v1/rpc/xquery', // This endpoint executes plain SQL on some legacy setups, BUT we will use the rest API table approach if this fails. Note: Executing arbitrary SQL via REST usually requires a custom RPC function.
        'POST',
        {
            'Content-Type': 'application/json',
            'apikey': SERVICE_ROLE,
            'Authorization': 'Bearer ' + SERVICE_ROLE
        },
        JSON.stringify({ query: sqlScript })
    );

    // Supabase REST doesn't natively expose direct arbitrary SQL execution (unless `pg_graphql` or rpc is explicitly set).
    // Let's actually create the schema using a safe fallback: standard REST requests to mock the creation if possible, or print instructions if direct API fails.

    if (rs.status === 200 || rs.status === 204) {
        console.log(" ÉXITO ejecutando SQL directo.");
    } else {
        console.log("El SQL nativo no está expuesto vía REST POST.", rs.status, rs.body.substring(0, 100));
        console.log("  ⚠️  ATENCIÓN: Carga el script en el SQL EDITOR de Supabase.");
    }
}

runSql();
