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

    async login(email: string, password?: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*, wallets(*)')
            .ilike('email', email.trim())
            .limit(1);

        if (error) {
            console.error("Login Supabase Error:", error);
            throw new Error('Error al conectar con la base de datos.');
        }

        if (!data || data.length === 0) {
            throw new Error('Usuario no encontrado.');
        }

        const profile = data[0];

        // Validar contraseña estrictamente
        if (!profile.password || profile.password !== (password || '').trim()) {
            throw new Error('Contraseña incorrecta.');
        }

        return profile;
    },

    async register(userData: { fullName: string, email: string, phone: string, referralCode: string, password?: string }) {
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

        // 2. Generar un código único alfanumérico corto (6 caracteres sin caracteres ambiguos O,0,I,1,L)
        const generateCode = () => {
            const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
            let result = '';
            for (let i = 0; i < 6; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };
        const newCode = generateCode();

        // 3. Crear el perfil vinculado
        const { data: profile, error: pError } = await supabase
            .from('profiles')
            .insert([{
                full_name: userData.fullName,
                email: userData.email,
                phone: userData.phone,
                referral_code: newCode,
                referred_by: referredById,
                password: userData.password, // Nota: En producción usar Supabase Auth
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
    },

    // ── Gestión de Prospectos ─────────────────────────────────
    async getProspects(userId: string) {
        const { data, error } = await supabase
            .from('prospects')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async addProspect(userId: string, prospect: { full_name: string, phone: string, interest: string, notes?: string }) {
        const { data, error } = await supabase
            .from('prospects')
            .insert([{
                user_id: userId,
                full_name: prospect.full_name,
                phone: prospect.phone,
                interest: prospect.interest,
                notes: prospect.notes,
                status: 'nuevo'
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateProspectStatus(prospectId: string, status: string) {
        const { error } = await supabase
            .from('prospects')
            .update({ status })
            .eq('id', prospectId);

        if (error) throw error;
    },

    async validateReferralCode(code: string) {
        if (!code) return null;
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('referral_code', code.toUpperCase())
            .single();

        if (error || !data) return null;
        return data;
    }
};
