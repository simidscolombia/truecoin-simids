import { supabase } from '../lib/supabase';

export const adminService = {
    // Métricas Globales para el Dashboard de SuperAdmin
    async getGlobalStats() {
        // 1. Total Usuarios
        const { count: userCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        // 2. Saldo Total en Circulación
        const { data: wallets } = await supabase
            .from('wallets')
            .select('balance_tc');

        const totalTC = wallets?.reduce((sum, w) => sum + Number(w.balance_tc), 0) || 0;

        // 3. Total Negocios
        const { count: businessCount } = await supabase
            .from('businesses')
            .select('*', { count: 'exact', head: true });

        // 4. Últimas Transacciones
        const { data: recentTransactions } = await supabase
            .from('transactions')
            .select('*, sender:profiles!transactions_sender_id_fkey(full_name), receiver:profiles!transactions_receiver_id_fkey(full_name)')
            .order('created_at', { ascending: false })
            .limit(10);

        // 5. Distribución por Niveles
        const { data: levelDist } = await supabase
            .from('profiles')
            .select('current_level');

        const levels = (levelDist || []).reduce((acc: any, p) => {
            acc[p.current_level] = (acc[p.current_level] || 0) + 1;
            return acc;
        }, {});

        return {
            userCount: userCount || 0,
            totalTC: totalTC.toFixed(2),
            businessCount: businessCount || 0,
            recentTransactions: recentTransactions || [],
            levelDistribution: levels
        };
    },

    // CRM: Gestionar Todos los Negocios
    async getAllBusinesses() {
        const { data, error } = await supabase
            .from('businesses')
            .select('*, owner:profiles(full_name)')
            .order('membership_tier', { ascending: false }); // VIP primero

        if (error) throw error;
        return data;
    },

    // CRM: Aprobar/Desaprobar Negocio
    async updateBusinessStatus(businessId: string, isVip: boolean) {
        const { error } = await supabase
            .from('businesses')
            .update({ is_vip: isVip })
            .eq('id', businessId);

        if (error) throw error;
        return true;
    },

    // CRM: Actualizar Tier de Negocio (Free -> VIP)
    async updateBusinessTier(businessId: string, tier: 'free' | 'vip') {
        const { error } = await supabase
            .from('businesses')
            .update({
                membership_tier: tier,
                is_vip: tier === 'vip'
            })
            .eq('id', businessId);

        if (error) throw error;
        return true;
    },

    // MOTOR DE EXPANSIÓN: Importar desde Google
    async importBusinessFromGoogle(businessData: any) {
        const { data, error } = await supabase
            .from('businesses')
            .insert([{
                name: businessData.name,
                category: businessData.category || 'Varios',
                description: businessData.description || 'Comercio invitado a TrueCoin',
                address: businessData.address,
                phone: businessData.phone,
                image_url: businessData.image_url,
                rating: businessData.rating || 4.5,
                membership_tier: 'free',
                source: 'google_importer'
            }])
            .select();

        if (error) throw error;
        return data;
    },

    // CRM: Gestionar Usuarios
    async getAllUsers() {
        const { data, error } = await supabase
            .from('profiles')
            .select('*, wallets(balance_tc)')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Obtenemos todos los registros para contar referidos en memoria (si no es red masiva)
        const { data: allRefs } = await supabase.from('profiles').select('referred_by');
        const refCounts = (allRefs || []).reduce((acc: any, r) => {
            if (r.referred_by) acc[r.referred_by] = (acc[r.referred_by] || 0) + 1;
            return acc;
        }, {});

        return data.map(u => ({
            ...u,
            team_size: refCounts[u.id] || 0
        }));
    },

    // CRM: Actualizar perfil de usuario
    async updateUserProfile(userId: string, updates: any) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId);

        if (error) throw error;
        return data;
    },

    // CRM: Ajuste manual de saldo (Poder de Dios Admin)
    async adjustUserBalance(userId: string, newBalance: number) {
        const { error } = await supabase
            .from('wallets')
            .update({ balance_tc: newBalance })
            .eq('user_id', userId);

        if (error) throw error;
        return true;
    }
};
