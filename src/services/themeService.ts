import { supabase } from '../lib/supabase';

export interface ThemeColors {
    color_wallet: string;
    color_marketplace: string;
    color_directorio: string;
    color_pos: string;
    color_admin: string;
    color_cloud_blue: string;
    color_navy: string;
}

export const DEFAULT_THEME: ThemeColors = {
    color_wallet: '#D4A017',
    color_marketplace: '#2D5A27',
    color_directorio: '#E86430',
    color_pos: '#0B1F4B',
    color_admin: '#2A7F8A',
    color_cloud_blue: '#4A7FC1',
    color_navy: '#0B1F4B',
};

export const themeService = {
    async getTheme(): Promise<ThemeColors> {
        try {
            const { data, error } = await supabase
                .from('app_settings')
                .select('key, value')
                .in('key', Object.keys(DEFAULT_THEME));

            if (error || !data || data.length === 0) {
                return DEFAULT_THEME;
            }

            const theme = { ...DEFAULT_THEME };
            data.forEach((row: { key: string; value: string }) => {
                if (row.key in theme) {
                    (theme as any)[row.key] = row.value;
                }
            });

            return theme;
        } catch {
            return DEFAULT_THEME;
        }
    },

    async saveColor(key: keyof ThemeColors, value: string): Promise<void> {
        const { error } = await supabase
            .from('app_settings')
            .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

        if (error) throw error;
    },

    async saveTheme(theme: Partial<ThemeColors>): Promise<void> {
        const rows = Object.entries(theme).map(([key, value]) => ({
            key,
            value,
            updated_at: new Date().toISOString(),
        }));

        const { error } = await supabase
            .from('app_settings')
            .upsert(rows, { onConflict: 'key' });

        if (error) throw error;
    },

    applyToDOM(theme: ThemeColors): void {
        const root = document.documentElement;
        root.style.setProperty('--color-wallet', theme.color_wallet);
        root.style.setProperty('--color-marketplace', theme.color_marketplace);
        root.style.setProperty('--color-directorio', theme.color_directorio);
        root.style.setProperty('--color-pos', theme.color_pos);
        root.style.setProperty('--color-admin', theme.color_admin);
        root.style.setProperty('--color-cloud-blue', theme.color_cloud_blue);
        root.style.setProperty('--color-navy', theme.color_navy);
    },
};
