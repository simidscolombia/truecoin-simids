import { supabase } from '../lib/supabase';

export interface Product {
    id: string;
    business_id: string | null;
    name: string;
    description: string;
    price_tc: number;
    price_fiat: number; // Precio real en moneda local
    price_public: number; // Precio sugerido al público
    currency: string;   // e.g., 'COP', 'USD'
    mlm_utility: number;
    image_url: string;
    stock: number;
    category: string;
    is_marketplace: boolean;
}

export interface Business {
    id: string;
    owner_id: string;
    name: string;
    category: string;
    description: string;
    address: string;
    phone: string;
    is_vip: boolean;
    membership_tier: 'free' | 'vip';
    source: string;
    rating: number;
    image_url: string;
    payment_config: any;
}

export const businessService = {
    async getBusinesses() {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .order('membership_tier', { ascending: false });

        if (error) throw error;
        return data as Business[];
    },

    async getBusinessCatalog(businessId: string) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('business_id', businessId);

        if (error) throw error;
        return data as Product[];
    },

    async getMarketplaceProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_marketplace', true);

        if (error) throw error;
        return data as Product[];
    },

    // ── GESTIÓN DE PRODUCTOS HQ (Admin/Aliados) ────────────
    async saveProduct(product: Partial<Product>) {
        const { data, error } = await supabase
            .from('products')
            .upsert([product])
            .select();

        if (error) throw error;
        return data?.[0];
    },

    async deleteProduct(productId: string) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);

        if (error) throw error;
        return true;
    },

    async uploadProductImage(productId: string, file: File) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${productId}-${Math.random()}.${fileExt}`;
        const filePath = `catalog/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('inventory')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('inventory')
            .getPublicUrl(filePath);

        return publicUrl;
    }
};
