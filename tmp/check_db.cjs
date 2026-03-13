const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkTable() {
    console.log("Verificando tabla 'prospects'...");
    const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .limit(1);

    if (error) {
        console.error("❌ Error accediendo a 'prospects':", error.message);
        console.log("Probablemente la tabla no existe o falta la política RLS.");
    } else {
        console.log("✅ Tabla 'prospects' accesible.");
        console.log("Datos encontrados:", data.length);
    }
}

checkTable();
