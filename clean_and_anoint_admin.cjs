const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function formatDatabaseAndCreateSuperAdmin() {
    console.log("Iniciando formateo de la base de datos...");

    try {
        // 1. Borrar referidos (Romper vínculos)
        console.log("Limpiando red de referidos...");
        await supabase.from('profiles').update({ referred_by: null }).neq('id', '00000000-0000-0000-0000-000000000000');

        // 2. Borrar transacciones y retiros
        console.log("Borrando transacciones financieras falsas de la demo...");
        await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('withdrawals').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        // 3. Borrar billeteras
        console.log("Destruyendo billeteras viejas con saldo de prueba...");
        await supabase.from('wallets').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        // 4. Borrar todos los perfiles actuales
        console.log("Eliminando todos los usuarios falsos...");
        await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        console.log("✅ Limpieza completada exitosamente.");
        console.log("---------------------------------------");

        // 5. Crear el PRIMER Y ÚNICO SuperAdmin: Elkin
        console.log("Creando la nueva Deidad del Sistema: Elkin Daniel Castillo...");

        // Asignaremos un código hiper exclusivo para el dueño: TCMASTER o 000001 (Elegimos TCMASTER para que sea épico)
        const generateGodCode = () => 'TCMASTER';

        const { data: adminProfile, error: pError } = await supabase
            .from('profiles')
            .insert([{
                full_name: 'Elkin Daniel Castillo',
                email: 'elkindanielcastillo@gmail.com',
                phone: '+573000000000', // Actualízalo después si deseas
                referral_code: generateGodCode(),
                role: 'admin',
                current_level: 12 // Nivel Máximo como creador
            }])
            .select()
            .single();

        if (pError) throw pError;
        console.log(`✅ Perfil SuperAdmin creado. Código Sagrado: ${adminProfile.referral_code}`);

        // 6. Dotar al SuperAdmin de una Billetera Infinita (Solo para propósitos administrativos initially)
        console.log("Generando la Billetera Maestra...");
        const { error: wError } = await supabase
            .from('wallets')
            .insert([{
                user_id: adminProfile.id,
                balance_tc: 1000000.00 // 1 Millón de TrueCoins iniciales para fondear comerciantes
            }]);

        if (wError) throw wError;
        console.log(`✅ Billetera Maestra activada: $1,000,000 TC.`);
        console.log("---------------------------------------");
        console.log("🎉 TODO FUE UN ÉXITO. Puede ir a su página web e Iniciar Sesión con: elkindanielcastillo@gmail.com");

    } catch (err) {
        console.error("🔥🔥 ERROR CATASTRÓFICO 🔥🔥");
        console.error(err);
    }
}

formatDatabaseAndCreateSuperAdmin();
