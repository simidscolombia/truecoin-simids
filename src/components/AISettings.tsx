'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Key, ShieldCheck, Sparkles, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';

interface AIConfigProps {
    user: any;
    balance: number;
    onUpdateAIConfig: (config: any) => void;
}

export default function AISettings({ user, balance, onUpdateAIConfig }: AIConfigProps) {
    const [mode, setMode] = useState<'shopy' | 'personal'>(user.ai_config?.mode || 'shopy');
    const [apiKey, setApiKey] = useState(user.ai_config?.apiKey || '');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulación de guardado y cifrado local (en una app real se enviaría a Supabase cifrado)
        setTimeout(() => {
            onUpdateAIConfig({ mode, apiKey });
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1000);
    };

    const aiCredits = Math.floor(balance / 10); // 10 TC = 1 Crédito IA

    return (
        <div className="card-lg" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            <div style={{ padding: 32, background: 'linear-gradient(135deg, var(--color-navy) 0%, #1e293b 100%)', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 style={{ fontSize: 24, fontWeight: 950, margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Cpu size={28} color="white" />
                            Cerebro IA Personal
                        </h2>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>Configura tu inteligencia para diseño, ventas y expansión.</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: 16, textAlign: 'right', backdropFilter: 'blur(10px)' }}>
                        <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Potencial Activo</p>
                        <h3 style={{ fontSize: 24, fontWeight: 950, margin: 0, color: 'var(--color-wallet)' }}>{aiCredits} <span style={{ fontSize: 12 }}>CRÉDITOS</span></h3>
                        <p style={{ fontSize: 9, margin: 0, opacity: 0.5 }}>1 Crédito = 10 TC</p>
                    </div>
                </div>
            </div>

            <div style={{ padding: 32 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
                    {/* Modo Shopy */}
                    <div 
                        onClick={() => setMode('shopy')}
                        style={{ 
                            padding: 24, borderRadius: 20, border: '2px solid', 
                            borderColor: mode === 'shopy' ? 'var(--color-wallet)' : 'var(--color-border)',
                            background: mode === 'shopy' ? 'var(--color-surface-2)' : 'white',
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-wallet)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                            <Zap size={24} fill="white" />
                        </div>
                        <h4 style={{ fontWeight: 800, fontSize: 16, margin: '0 0 8px 0' }}>IA ShopyBrands</h4>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>Usar el cerebro central de la red. Costo financiado por tus TrueCoins.</p>
                        {mode === 'shopy' && <CheckCircle2 size={20} color="var(--color-wallet)" style={{ marginTop: 12 }} />}
                    </div>

                    {/* Modo Personal (BYOAI) */}
                    <div 
                        onClick={() => setMode('personal')}
                        style={{ 
                            padding: 24, borderRadius: 20, border: '2px solid', 
                            borderColor: mode === 'personal' ? 'var(--color-navy)' : 'var(--color-border)',
                            background: mode === 'personal' ? 'var(--color-surface-2)' : 'white',
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                            <Key size={24} />
                        </div>
                        <h4 style={{ fontWeight: 800, fontSize: 16, margin: '0 0 8px 0' }}>Mi Propia IA (BYOAI)</h4>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>Conecta tu propia API Key. Sin costo de créditos TC de ShopyBrands.</p>
                        {mode === 'personal' && <CheckCircle2 size={20} color="var(--color-navy)" style={{ marginTop: 12 }} />}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {mode === 'personal' && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: 'hidden', paddingBottom: 24 }}
                        >
                            <div className="card" style={{ padding: 24, background: '#f8fafc' }}>
                                <label style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: 'var(--color-navy)', display: 'block', marginBottom: 8 }}>
                                    OpenAI / Google Gemini API KEY
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type="password" 
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                        style={{ 
                                            width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid var(--color-border)',
                                            fontSize: 14, fontFamily: 'monospace'
                                        }}
                                    />
                                    <ShieldCheck size={20} color="#10B981" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }} />
                                </div>
                                <div style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'center' }}>
                                    <AlertCircle size={16} color="var(--color-text-muted)" />
                                    <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: 0 }}>Tus datos se usan solo para enviar las peticiones y no se comparten con terceros.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className={mode === 'shopy' ? 'btn btn-wallet' : 'btn btn-navy'}
                        style={{ height: 48, padding: '0 32px', borderRadius: 14, fontWeight: 900 }}
                    >
                        {isSaving ? 'Vinculando...' : showSuccess ? '¡IA Actualizada!' : 'Guardar Configuración'}
                    </button>
                </div>
            </div>

            {/* Shopy Studio Preview Section */}
            <div style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface-2)', padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <div style={{ width: 48, height: 48, background: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageIcon size={24} color="var(--color-wallet)" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--color-navy)', margin: 0 }}>Shopy Studio Preview</h3>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>Prueba la ambientación mágica de tus productos.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
                    <div style={{ height: 260, border: '2px dashed var(--color-border-strong)', borderRadius: 24, background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer' }}>
                        <Sparkles size={40} color="var(--color-wallet)" />
                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)' }}>Arrastra tu foto cruda aquí</p>
                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>La IA la transformará en una obra de catálogo.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Estilos Disponibles:</p>
                        {['Estudio Minimal', 'Bodegón de Lujo', 'Minimalista Zen', 'Naturaleza Viva'].map(s => (
                            <div key={s} style={{ background: 'white', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-border)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {s}
                                <Sparkles size={14} color="var(--color-wallet)" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
