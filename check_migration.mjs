import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_SERVICE_ROLE
);

async function migrate() {
    console.log("🚀 Iniciando migración Fase 2: Cerebro IA...");

    try {
        // Intentar agregar la columna. 
        // Nota: El SDK de Supabase no permite ALTER TABLE directamente via .from().
        // Se requiere usar RPC o hacerlo manualmente en el Dashboard.
        // Sin embargo, podemos intentar llamar a un RPC genérico si existe.

        console.log("Verificando existencia de columna is_system_bot...");
        const { data: profiles, error: checkError } = await supabase
            .from('profiles')
            .select('*')
            .limit(1);

        if (profiles && profiles.length > 0) {
            if ('is_system_bot' in profiles[0]) {
                console.log("✅ La columna is_system_bot ya existe.");
            } else {
                console.warn("⚠️ La columna is_system_bot NO existe. Por favor agrégala manualmente en el Dashboard de Supabase:");
                console.log("SQL: ALTER TABLE profiles ADD COLUMN is_system_bot BOOLEAN DEFAULT FALSE;");
            }
        }

    } catch (e) {
        console.error("❌ Error en migración:", e);
    }
}

migrate();
