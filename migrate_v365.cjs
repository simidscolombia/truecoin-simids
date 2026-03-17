require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_SERVICE_ROLE
);

async function migrate() {
    console.log("🚀 Iniciando migración Fase 2: Cerebro IA...");

    try {
        // 1. Agregar columna is_system_bot si no existe
        console.log("Checking profiles table...");
        const { error: err1 } = await supabase.rpc('execute_sql', {
            sql_query: `
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_system_bot BOOLEAN DEFAULT FALSE;
      `
        });

        if (err1) {
            // Si el RPC no existe, podemos intentar via una consulta normal si tenemos permisos
            // o simplemente avisar. En Supabase local/admin suele funcionar a traves de la API si esta habilitado.
            // Pero usualmente se hace via el Dashboard.
            console.warn("⚠️ Intentando vía alternativa (SQL directo puede fallar si no hay RPC)...");
            console.error(err1);
        }

        console.log("✅ Migración intentada.");
    } catch (e) {
        console.error("❌ Error en migración:", e);
    }
}

migrate();
