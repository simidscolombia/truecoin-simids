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

    async login(emailOrName: string, password?: string) {
        const query = emailOrName.trim();
        const { data, error } = await supabase
            .from('profiles')
            .select('*, wallets(*)')
            .or(`email.ilike.${query},full_name.ilike.${query}`)
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

    async register(userData: any) {
        // 1. Validar el código de referido del patrocinador
        let referredById = null;
        if (userData.referralCode) {
            const { data: referrer } = await supabase
                .from('profiles')
                .select('id')
                .eq('referral_code', userData.referralCode)
                .single();

            if (referrer) referredById = referrer.id;
        }

        // 2. Generar un código único
        const generateCode = () => {
            const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
            let result = '';
            for (let i = 0; i < 6; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };
        const newCode = generateCode();

        // 3. Crear el perfil (INACTIVO inicialmente)
        const { data: profile, error: pError } = await supabase
            .from('profiles')
            .insert([{
                full_name: userData.fullName,
                email: userData.email,
                phone: userData.phone,
                referral_code: newCode,
                referred_by: referredById,
                password: userData.password,
                current_level: 1,
                is_vip: false // 🛑 BLOQUEADO HASTA PAGO
            }])
            .select()
            .single();

        if (pError) throw pError;

        // 4. Crear Billetera Vacia
        await supabase.from('wallets').insert([{
            user_id: profile.id,
            balance_tc: 0
        }]);

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

        const newBalance = Math.max(0, Number(wallet.balance_tc) + amount);

        const { error } = await supabase
            .from('wallets')
            .update({ balance_tc: newBalance })
            .eq('user_id', userId);

        if (error) throw error;
        return newBalance;
    },

    async transferTC(senderId: string, receiverEmailOrCode: string, amount: number) {
        // 1. Buscar receptor
        const query = receiverEmailOrCode.trim();
        const { data: receiver } = await supabase
            .from('profiles')
            .select('id, full_name')
            .or(`email.eq.${query},referral_code.eq.${query.toUpperCase()}`)
            .single();

        if (!receiver) throw new Error('Receptor no encontrado.');
        if (receiver.id === senderId) throw new Error('No puedes enviarte TC a ti mismo.');

        // 2. Restar al emisor
        await this.updateBalance(senderId, -amount);

        // 3. Sumar al receptor
        await this.updateBalance(receiver.id, amount);

        return receiver.full_name;
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
    },

    async getPaymentSettings() {
        const { data } = await supabase.from('app_settings').select('value').eq('key', 'payment_api_keys').single();
        return { data: data ? JSON.parse(data.value) : null };
    },

    // ── Registro Seguro (Pre-pago) ────────────────────────────
    async createRegistrationAttempt(attemptData: {
        reference: string,
        fullName: string,
        email: string,
        phone: string,
        password: string,
        referralCode: string,
        regIp?: string,
        regLoc?: string
    }) {
        const { data, error } = await supabase
            .from('registration_attempts')
            .insert([{
                reference: attemptData.reference,
                full_name: attemptData.fullName,
                email: attemptData.email,
                phone: attemptData.phone,
                password: attemptData.password,
                referral_code: attemptData.referralCode,
                reg_ip: attemptData.regIp,
                reg_location: attemptData.regLoc,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getDashboardStats(userId: string) {
        // 1. Contar referidos directos
        const { count: directCount, error: err1 } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('referred_by', userId);

        // 2. Obtener nivel actual y mentor
        const { data: profile, error: err2 } = await supabase
            .from('profiles')
            .select('current_level, is_vip, referred_by')
            .eq('id', userId)
            .single();

        if (err1 || err2) throw err1 || err2;

        let mentor = null;
        if (profile?.referred_by) {
            const { data: mentorData } = await supabase
                .from('profiles')
                .select('full_name, email')
                .eq('id', profile.referred_by)
                .single();
            mentor = mentorData;
        }

        return {
            directReferrals: directCount || 0,
            currentLevel: profile?.current_level || 1,
            isVip: profile?.is_vip || false,
            mentor: mentor
        };
    },

    async getNetworkDetailed(userId: string) {
        // Fetch profiles levels to build the tree and counts
        const { data: allNetwork } = await supabase
            .from('profiles')
            .select('id, full_name, referred_by, current_level, created_at')
            .or(`referred_by.eq.${userId}`);

        if (!allNetwork) return { l1: [], l2: [], l3: [], l4: [] };

        // For deeper levels, we need recursive or multi-step fetching. 
        // Let's do it in 4 steps to ensure we get exactly L1-L4 and can count their children.

        // L1
        const l1 = allNetwork;
        const l1Ids = l1.map(u => u.id);

        // L2
        const { data: l2 } = await supabase.from('profiles').select('id, full_name, referred_by, current_level').in('referred_by', l1Ids);
        const l2Ids = l2?.map(u => u.id) || [];

        // L3
        const { data: l3 } = await supabase.from('profiles').select('id, full_name, referred_by, current_level').in('referred_by', l2Ids);
        const l3Ids = l3?.map(u => u.id) || [];

        // L4
        const { data: l4 } = await supabase.from('profiles').select('id, full_name, referred_by, current_level').in('referred_by', l3Ids);
        const l4Ids = l4?.map(u => u.id) || [];

        // L5 (just to count L4 children)
        const { data: l5 } = await supabase.from('profiles').select('referred_by').in('referred_by', l4Ids);

        const countChildren = (memberId: string, nextLevel: any[]) => {
            return nextLevel.filter(child => child.referred_by === memberId).length;
        };

        const enrich = (list: any[], nextLevel: any[]) => {
            return list.map(m => ({
                ...m,
                referralCount: countChildren(m.id, nextLevel)
            }));
        };

        return {
            l1: enrich(l1, l2 || []),
            l2: enrich(l2 || [], l3 || []),
            l3: enrich(l3 || [], l4 || []),
            l4: enrich(l4 || [], l5 || [])
        };
    },

    // ── Simulación de Mensajería IA ──────────────────────────
    async sendNotification(phone: string, message: string) {
        console.log(`📡 [SHANNON AI BRIDGE] Enviando a ${phone}: ${message}`);
        // Aquí iría el fetch a WAHA o bridge de WhatsApp
        return true;
    }
};
