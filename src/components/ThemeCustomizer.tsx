'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, RotateCcw, Save, CheckCircle2, Info } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColors } from '../services/themeService';

interface ModuleColorConfig {
    key: keyof ThemeColors;
    label: string;
    description: string;
    emoji: string;
    cssVar: string;
}

const MODULE_CONFIGS: ModuleColorConfig[] = [
    { key: 'color_navy', label: 'Base / Navegación', description: 'Header, sidebar activo y textos principales', emoji: '🌐', cssVar: 'var(--color-navy)' },
    { key: 'color_cloud_blue', label: 'Acento Global', description: 'Botones primarios, links y elementos globales', emoji: '☁️', cssVar: 'var(--color-cloud-blue)' },
    { key: 'color_wallet', label: 'Wallet / TrueCoin', description: 'Saldo, billetera, acciones financieras', emoji: '💰', cssVar: 'var(--color-wallet)' },
    { key: 'color_marketplace', label: 'Marketplace', description: 'Header, precios y botones de compra', emoji: '🛒', cssVar: 'var(--color-marketplace)' },
    { key: 'color_directorio', label: 'Directorio', description: 'Categorías, ratings y acciones del directorio', emoji: '📍', cssVar: 'var(--color-directorio)' },
    { key: 'color_pos', label: 'POS / Simids', description: 'Header del POS, botones de venta, módulo negocio', emoji: '🖥️', cssVar: 'var(--color-pos)' },
    { key: 'color_admin', label: 'Admin Panel', description: 'Acciones y estadísticas del panel de administración', emoji: '⚙️', cssVar: 'var(--color-admin)' },
];

const PRESET_PALETTES = [
    {
        name: 'Azul & Pino',
        description: 'El tema actual — Azul marino + Verde pino',
        colors: { color_navy: '#0B1F4B', color_cloud_blue: '#4A7FC1', color_wallet: '#D4A017', color_marketplace: '#2D5A27', color_directorio: '#E86430', color_pos: '#0B1F4B', color_admin: '#2A7F8A' },
    },
    {
        name: 'Ocean Teal',
        description: 'Teal profundo para toda la identidad',
        colors: { color_navy: '#0F3460', color_cloud_blue: '#16A085', color_wallet: '#F39C12', color_marketplace: '#1A8C6B', color_directorio: '#E74C3C', color_pos: '#0F3460', color_admin: '#8E44AD' },
    },
    {
        name: 'Corporate Slate',
        description: 'Tonos grises cálidos, máxima profesionalidad',
        colors: { color_navy: '#1E293B', color_cloud_blue: '#3B82F6', color_wallet: '#B45309', color_marketplace: '#15803D', color_directorio: '#EA580C', color_pos: '#1E293B', color_admin: '#0F766E' },
    },
    {
        name: 'Vibrant Purple',
        description: 'Morado y esmeralda — moderno y atrevido',
        colors: { color_navy: '#3B0764', color_cloud_blue: '#7C3AED', color_wallet: '#D97706', color_marketplace: '#059669', color_directorio: '#DC2626', color_pos: '#3B0764', color_admin: '#0284C7' },
    },
];

export default function ThemeCustomizer() {
    const { theme, setColor, resetTheme } = useTheme();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [localTheme, setLocalTheme] = useState<ThemeColors>({ ...theme });

    const handleColorChange = (key: keyof ThemeColors, value: string) => {
        setLocalTheme(prev => ({ ...prev, [key]: value }));
        // Apply live preview immediately
        document.documentElement.style.setProperty(`--${key.replace(/_/g, '-')}`, value);
    };

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            for (const [key, value] of Object.entries(localTheme)) {
                await setColor(key as keyof ThemeColors, value);
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (e) {
            alert('Error al guardar. Revisa tu conexión a Supabase.');
        } finally {
            setSaving(false);
        }
    };

    const applyPreset = (preset: typeof PRESET_PALETTES[0]) => {
        const newTheme = { ...localTheme, ...preset.colors } as ThemeColors;
        setLocalTheme(newTheme);
        // Live preview
        for (const [key, value] of Object.entries(preset.colors)) {
            document.documentElement.style.setProperty(`--${key.replace(/_/g, '-')}`, value);
        }
    };

    const handleReset = async () => {
        if (!confirm('¿Restaurar todos los colores a los valores por defecto?')) return;
        await resetTheme();
        setLocalTheme({ ...theme });
    };

    return (
        <div className="animate-in" style={{ padding: '32px', maxWidth: 900, margin: '0 auto' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: 'color-mix(in srgb, var(--color-admin) 12%, white)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-admin)', flexShrink: 0 }}>
                        <Palette size={24} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 4 }}>
                            Personalización del Sistema
                        </h2>
                        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                            Cambia los colores de cada módulo en tiempo real. Los cambios se guardan en la base de datos.
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={handleReset} className="btn btn-outline btn-sm">
                        <RotateCcw size={14} /> Restablecer
                    </button>
                    <button
                        onClick={handleSaveAll}
                        disabled={saving}
                        className="btn btn-sm"
                        style={{ background: saved ? '#16A34A' : 'var(--color-admin)', color: 'white' }}
                    >
                        {saving ? (
                            <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        ) : saved ? (
                            <CheckCircle2 size={14} />
                        ) : (
                            <Save size={14} />
                        )}
                        {saved ? '¡Guardado!' : saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>

            {/* Live Preview Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, background: 'color-mix(in srgb, var(--color-cloud-blue) 8%, white)', border: '1px solid color-mix(in srgb, var(--color-cloud-blue) 20%, white)', marginBottom: 28 }}>
                <Info size={16} style={{ color: 'var(--color-cloud-blue)', flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: 'var(--color-cloud-blue)' }}>
                    <strong>Vista previa en tiempo real:</strong> Los cambios de color se aplican inmediatamente mientras editas. Presiona "Guardar" para que sean permanentes.
                </p>
            </div>

            {/* Preset Palettes */}
            <section style={{ marginBottom: 36 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 16 }}>
                    🎨 Paletas Predefinidas
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                    {PRESET_PALETTES.map((preset) => (
                        <motion.button
                            key={preset.name}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => applyPreset(preset)}
                            className="card"
                            style={{ padding: '16px 18px', textAlign: 'left', cursor: 'pointer', border: '1.5px solid var(--color-border)', transition: 'all 0.15s' }}
                        >
                            {/* Color Dots Preview */}
                            <div style={{ display: 'flex', gap: 5, marginBottom: 12 }}>
                                {Object.values(preset.colors).slice(0, 5).map((color, i) => (
                                    <div key={i} style={{ width: 22, height: 22, borderRadius: '50%', background: color, border: '2px solid white', outline: '1px solid rgba(0,0,0,0.1)' }} />
                                ))}
                            </div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 4 }}>{preset.name}</p>
                            <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{preset.description}</p>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Module Color Editor */}
            <section>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 16 }}>
                    🖌️ Personalización por Módulo
                </h3>
                <div className="card-lg" style={{ overflow: 'hidden' }}>
                    {MODULE_CONFIGS.map((config, index) => {
                        const currentColor = localTheme[config.key] || '#000000';
                        return (
                            <div
                                key={config.key}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 20, padding: '18px 24px',
                                    borderBottom: index < MODULE_CONFIGS.length - 1 ? '1px solid var(--color-border)' : 'none',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                {/* Emoji */}
                                <span style={{ fontSize: 22, flexShrink: 0, width: 32 }}>{config.emoji}</span>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 2 }}>{config.label}</p>
                                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{config.description}</p>
                                </div>

                                {/* Preview Bar */}
                                <div style={{
                                    height: 6, width: 80, borderRadius: 999,
                                    background: currentColor, flexShrink: 0,
                                    boxShadow: `0 2px 8px ${currentColor}60`,
                                }} />

                                {/* Color Picker */}
                                <div className="color-swatch" style={{ background: currentColor, position: 'relative', flexShrink: 0 }}>
                                    <input
                                        type="color"
                                        value={currentColor}
                                        onChange={e => handleColorChange(config.key, e.target.value)}
                                        title={`Cambiar color de ${config.label}`}
                                    />
                                </div>

                                {/* Hex Input */}
                                <input
                                    type="text"
                                    value={currentColor}
                                    onChange={e => {
                                        const v = e.target.value;
                                        if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) handleColorChange(config.key, v);
                                    }}
                                    style={{
                                        width: 90, fontFamily: 'monospace', fontSize: 13, fontWeight: 600,
                                        padding: '6px 10px', borderRadius: 8, border: '1.5px solid var(--color-border)',
                                        color: 'var(--color-navy)', background: 'var(--color-surface)',
                                        outline: 'none',
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Footer Save */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--color-border)' }}>
                <button onClick={handleReset} className="btn btn-outline">
                    <RotateCcw size={15} /> Restaurar Defaults
                </button>
                <button
                    onClick={handleSaveAll}
                    disabled={saving}
                    className="btn"
                    style={{ background: saved ? '#16A34A' : 'var(--color-admin)', color: 'white', minWidth: 160 }}
                >
                    {saving ? 'Guardando...' : saved ? '✓ ¡Guardado!' : <><Save size={15} /> Guardar Todo</>}
                </button>
            </div>
        </div>
    );
}
