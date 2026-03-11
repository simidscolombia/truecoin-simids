import { supabase } from '../lib/supabase';

export const userService = {
    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*, wallets(*)')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    async login(email: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*, wallets(*)')
            .eq('email', email)
            .limit(1);

        if (error) {
            console.error("Login Supabase Error:", error);
            throw new Error("Ocurrió un error al conectar con la base de datos.");
        }

        if (!data || data.length === 0) {
            throw new Error("No encontramos una cuenta con ese correo.");
        }

        return data[0];
    },

    async register(userData: { fullName: string, email: string, phone: string, referralCode: string }) {
        // 1. Buscar al referente por su código
        let referredById = null;
        if (userData.referralCode) {
            const { data: referrer } = await supabase
                .from('profiles')
                .select('id')
                .eq('referral_code', userData.referralCode)
                .single();

            if (referrer) referredById = referrer.id;
        }

        // 2. Generar un código único para el nuevo usuario (ej: ELKIN23)
        const newCode = (userData.fullName.split(' ')[0] + Math.floor(Math.random() * 999)).toUpperCase();

        // 3. Crear el perfil vinculado
        const { data: profile, error: pError } = await supabase
            .from('profiles')
            .insert([{
                full_name: userData.fullName,
                email: userData.email,
                phone: userData.phone,
                referral_code: newCode,
                referred_by: referredById,
                current_level: 1 // Inicia en nivel 1
            }])
            .select()
            .single();

        if (pError) throw pError;

        // 4. Crear la billetera inicial con 50.00 TC (según membresía)
        const { error: wError } = await supabase
            .from('wallets')
            .insert([{
                user_id: profile.id,
                balance_tc: 50.00
            }]);

        if (wError) throw wError;

        return profile;
    },

    async updateBalance(userId: string, amount: number) {
        // En un App real, esto debería ser vía RPC o Función de Postgres por seguridad
        const { data: wallet } = await supabase
            .from('wallets')
            .select('balance_tc')
            .eq('user_id', userId)
            .single();

        if (!wallet) throw new Error('Wallet not found');

        const newBalance = Number(wallet.balance_tc) + amount;

        const { error } = await supabase
            .from('wallets')
            .update({ balance_tc: newBalance })
            .eq('user_id', userId);

        if (error) throw error;
        return newBalance;
    }
};
