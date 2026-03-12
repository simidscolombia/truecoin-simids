require('dotenv').config();

async function purgeAll() {
    const url = process.env.VITE_SUPABASE_URL;
    const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!adminKey) {
        console.log("Error: No encuentro la llave SUPABASE_SERVICE_ROLE_KEY en el .env local. No tengo permisos para borrar a todos los usuarios.");
        return;
    }

    const headers = {
        'apikey': adminKey,
        'Authorization': `Bearer ${adminKey}`,
        'Content-Type': 'application/json'
    };

    try {
        console.log("🔥 1. Borrando billeteras..");
        await fetch(`${url}/rest/v1/wallets`, { method: 'DELETE', headers });

        console.log("🔥 2. Quitándoles a todos su padre (referred_by = null)..");
        await fetch(`${url}/rest/v1/profiles?id=not.eq.00000000-0000-0000-0000-000000000000`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ referred_by: null })
        });

        console.log("🔥 3. Borrando todos los usuarios..");
        await fetch(`${url}/rest/v1/profiles`, { method: 'DELETE', headers });

        console.log("👑 4. Creando a Elkin como SuperAdmin..");
        const adminRes = await fetch(`${url}/rest/v1/profiles`, {
            method: 'POST',
            headers: { ...headers, 'Prefer': 'return=representation' },
            body: JSON.stringify([
                {
                    full_name: 'Elkin Daniel Castillo',
                    email: 'elkindanielcastillo@gmail.com',
                    phone: '+573000000000',
                    referral_code: 'TCMASTER',
                    role: 'admin',
                    current_level: 12
                }
            ])
        });

        const adminData = await adminRes.json();

        if (adminData.length > 0) {
            console.log("💰 5. Asignando 1 Millón de TC a Elkin..");
            await fetch(`${url}/rest/v1/wallets`, {
                method: 'POST',
                headers,
                body: JSON.stringify([
                    { user_id: adminData[0].id, balance_tc: 1000000.00 }
                ])
            });
            console.log("✅ SISTEMA LIMPIADO Y RECREADO CON ÉXITO.");
        }

    } catch (e) {
        console.error("Error catastrofico", e);
    }
}

purgeAll();
