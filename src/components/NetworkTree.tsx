'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Users, Star, ChevronRight, CheckCircle2, AlertCircle, Share2, Zap, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

interface NetworkTreeProps {
    userId: string;
    mentor?: { full_name: string, email: string } | null;
    onSelectUser?: (user: any) => void;
}

const RANKS = [
    "VIP BRONCE", "VIP COBRE", "VIP PLATA", "VIP ORO",
    "PLATINO", "ZAFIRO", "ESMERALDA",
    "DIAMANTE", "DIAMANTE AZUL", "CORONA",
    "EMBAJADOR", "EMBAJADOR REAL", "LEYENDA"
];

export default function NetworkTree({ userId, onSelectUser }: NetworkTreeProps) {
    const [network, setNetwork] = useState<{ l1: any[], l2: any[], l3: any[], l4: any[] }>({ l1: [], l2: [], l3: [], l4: [] });
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<{id: string, name: string}[]>([{id: userId, name: 'Tú (Raíz)'}]);
    const [activeLevel, setActiveLevel] = useState<number>(1);

    const currentViewId = history[history.length - 1].id;

    useEffect(() => {
        const fetchNetwork = async () => {
            setLoading(true);
            try {
                // Forzamos modo 'sponsorship' porque es la red de afiliados pura
                const data = await userService.getNetworkDetailed(currentViewId);
                setNetwork(data);
                // Si la persona recién clickeada no tiene socios nivel 1, igual mostramos el nivel 1 (vacío) para que no se quiebre la navegación
                setActiveLevel(1); 
            } catch (error) {
                console.error("Error fetching network:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNetwork();
    }, [currentViewId]);

    const handleDrillDown = (user: any) => {
        setHistory([...history, {id: user.id, name: user.full_name.split(' ')[0]}]);
    };

    const handleBreadcrumbClick = (index: number) => {
        setHistory(history.slice(0, index + 1));
    };


    // Get current active list
    const activeList = activeLevel === 1 ? network.l1 : activeLevel === 2 ? network.l2 : activeLevel === 3 ? network.l3 : network.l4;

    return (
        <div style={{ padding: '0px', background: 'transparent', minHeight: 600 }}>
            {/* 🍞 Breadcrumbs interactivas */}
            <div style={{ marginBottom: 24, padding: '16px 24px', background: 'white', borderRadius: 20, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid var(--color-border)' }}>
                <Users size={18} color="var(--color-navy)" /> 
                {history.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button 
                            onClick={() => handleBreadcrumbClick(idx)}
                            style={{
                                background: idx === history.length - 1 ? 'var(--color-wallet)' : 'var(--color-surface-2)',
                                color: idx === history.length - 1 ? 'white' : 'var(--color-navy)',
                                border: 'none', padding: '8px 16px', borderRadius: 12,
                                fontSize: 13, fontWeight: 900, cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: idx === history.length - 1 ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none'
                            }}
                            onMouseOver={(e) => idx !== history.length - 1 && (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
                            onMouseOut={(e) => idx !== history.length - 1 && (e.currentTarget.style.background = 'var(--color-surface-2)')}
                        >
                            {step.name}
                        </button>
                        {idx < history.length - 1 && <ChevronRight size={16} color="var(--color-border)" />}
                    </div>
                ))}
            </div>



            {/* 📑 Navegación por Niveles (Pestañas visuales) */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
                {[
                    { level: 1, name: 'SOCIOS DIRECTOS', count: network.l1.length, icon: <Star size={16} /> },
                    { level: 2, name: 'NIVEL 2 (Indirectos)', count: network.l2.length, icon: <Share2 size={16} /> },
                    { level: 3, name: 'NIVEL 3 (Profundo)', count: network.l3.length, icon: <Users size={16} /> },
                    { level: 4, name: 'NIVEL 4 (Expansión)', count: network.l4.length, icon: <Zap size={16} /> },
                ].map((l) => (
                    <button
                        key={l.level}
                        onClick={() => setActiveLevel(l.level)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderRadius: 18, cursor: 'pointer',
                            border: activeLevel === l.level ? '2px solid var(--color-wallet)' : '1px solid var(--color-border)',
                            background: activeLevel === l.level ? 'white' : 'var(--color-surface-2)',
                            color: activeLevel === l.level ? 'var(--color-navy)' : 'var(--color-text-muted)',
                            fontWeight: 900, fontSize: 13, transition: 'all 0.2s', whiteSpace: 'nowrap',
                            boxShadow: activeLevel === l.level ? '0 10px 25px rgba(16, 185, 129, 0.15)' : 'none'
                        }}
                    >
                        <div style={{ color: activeLevel === l.level ? 'var(--color-wallet)' : 'inherit' }}>{l.icon}</div>
                        {l.name}
                        <span style={{ 
                            background: activeLevel === l.level ? 'var(--color-wallet)' : 'rgba(0,0,0,0.05)', 
                            color: activeLevel === l.level ? 'white' : 'inherit',
                            padding: '2px 8px', borderRadius: 20, fontSize: 11 
                        }}>{l.count}</span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} style={{ width: 44, height: 44, border: '4px solid var(--color-surface-2)', borderTopColor: 'var(--color-wallet)', borderRadius: '50%', margin: '0 auto 20px' }} />
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 15, fontWeight: 800 }}>Mapeando el ecosistema...</p>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeLevel}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeList.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: 28, border: '2px dashed var(--color-border)' }}>
                                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--color-text-muted)' }}>
                                    <UserPlus size={40} />
                                </div>
                                <h3 style={{ fontSize: 22, fontWeight: 950, color: 'var(--color-navy)', marginBottom: 8 }}>Aún no hay socios en este nivel</h3>
                                <p style={{ fontSize: 15, color: 'var(--color-text-muted)', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
                                    {activeLevel === 1 
                                        ? "Es tu momento de brillar. Comparte tu enlace de invitación y empieza a construir tu imperio ahora mismo."
                                        : "Tus socios de niveles anteriores necesitan invitar a más personas para que este nivel comience a verse activo."}
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                                {activeList.map((item: any, idx) => {
                                    const isActive = (item.current_level || 1) >= 1; 

                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            onClick={() => {
                                                onSelectUser?.(item);
                                                handleDrillDown(item);
                                            }}
                                            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                                            style={{
                                                background: 'white', borderRadius: 24, border: '1px solid var(--color-border)',
                                                padding: '24px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
                                                display: 'flex', flexDirection: 'column', gap: 20,
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                                                    {/* Avatar Circular Vibrante */}
                                                    <div style={{
                                                        width: 56, height: 56, borderRadius: '50%',
                                                        background: isActive ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                                                        boxShadow: isActive ? '0 8px 20px rgba(16, 185, 129, 0.4)' : '0 8px 20px rgba(245, 158, 11, 0.4)',
                                                        border: '3px solid white', zIndex: 2
                                                    }}>
                                                        <span style={{ fontSize: 20, fontWeight: 950 }}>{item.full_name?.charAt(0)}</span>
                                                    </div>
                                                    <div>
                                                        <h4 style={{ fontSize: 17, fontWeight: 950, color: 'var(--color-navy)', margin: '0 0 4px 0', letterSpacing: -0.3 }}>
                                                            {item.full_name?.substring(0, 16)}
                                                        </h4>
                                                        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-navy)', background: 'var(--color-surface-2)', padding: '4px 10px', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                                                            {RANKS[(item.current_level - 1) % 12] || 'VIP BRONCE'}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* Indicador de Estado (Semáforo) */}
                                                <div title={isActive ? "Activo" : "Pendiente"} style={{ background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: isActive ? '#10B981' : '#F59E0B', padding: 8, borderRadius: '50%' }}>
                                                    {isActive ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                                </div>
                                            </div>

                                            {/* Info Box Estilo Botón */}
                                            <div style={{ background: 'var(--color-surface-2)', borderRadius: 16, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(0,0,0,0.03)' }}>
                                                <div>
                                                    <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Tamaño de su Red</p>
                                                    <p style={{ fontSize: 18, fontWeight: 950, color: 'var(--color-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        {item.referralCount || 0} <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)' }}>SOCIOS</span>
                                                    </p>
                                                </div>
                                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-wallet)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                                    <ChevronRight size={20} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
