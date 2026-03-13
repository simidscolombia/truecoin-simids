const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

async function inspectUser() {
    const email = 'elkindanielcastillo@gmail.com';
    console.log(`Buscando usuario: ${email}...`);

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log("Usuario encontrado:");
        console.log("- ID:", data.id);
        console.log("- Nombre:", data.full_name);
        console.log("- Contraseña actual:", data.password || "(Vacía)");

        if (!data.password) {
            console.log("Asignando contraseña temporal '123456'...");
            const { error: upError } = await supabase
                .from('profiles')
                .update({ password: '123456' })
                .eq('id', data.id);

            if (upError) console.error("Error al actualizar:", upError.message);
            else console.log("✅ Contraseña actualizada a '123456'");
        }
    }
}

inspectUser();
