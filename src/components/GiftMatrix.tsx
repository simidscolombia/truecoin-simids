'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Rocket, ShieldCheck, Award,
    Info, Cpu,
    TrendingUp, UserPlus
} from 'lucide-react';
import { useState } from 'react';

interface GiftMatrixProps {
    currentLevel?: number;
    referrals?: number;
}

const RANKS = [
    "VIP BRONCE", "VIP COBRE", "VIP PLATA", "VIP ORO",
    "PLATINO", "ZAFIRO", "ESMERALDA",
    "DIAMANTE", "DIAMANTE AZUL", "CORONA",
    "EMBAJADOR", "EMBAJADOR REAL", "LEYENDA"
];

const LEVEL_VALUES: Record<number, number> = {
    1: 50, 2: 100, 3: 200, 4: 400, 5: 800,
    6: 1600, 7: 3200, 8: 6400, 9: 12800,
    10: 25600, 11: 51200, 12: 102400,
};

export default function GiftMatrix({ currentLevel = 1, referrals = 0 }: GiftMatrixProps) {
    const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
    const investment = LEVEL_VALUES[currentLevel] || 50;
    const progress = (referrals / 4) * 100;

    // Configuración de propósitos por slot
    const slotConfig = [
        {
            id: 1,
            label: "Conexión Directa",
            icon: <Award size={18} />,
            color: "#F59E0B",
            desc: "Puntos de recompensa liberados inmediatamente a tu saldo.",
            type: "reward"
        },
        {
            id: 2,
            label: "Propulsión I",
            icon: <Rocket size={18} />,
            color: "#3B82F6",
            desc: "Energía acumulada para tu ascensión automática al siguiente nivel.",
            type: "propulsion"
        },
        {
            id: 3,
            label: "Propulsión II",
            icon: <Rocket size={18} />,
            color: "#3B82F6",
            desc: "Segunda fase de energía. Bloquea el salto de rango.",
            type: "propulsion"
        },
        {
            id: 4,
            label: "Nodo Maestro",
            icon: <ShieldCheck size={18} />,
            color: "#64748B",
            desc: "Garantiza la estabilidad y soporte del ecosistema Shopy.",
            type: "maintenance"
        }
    ];

    const nextRank = currentLevel < 12 ? RANKS[currentLevel] : null;

    return (
        <div className="card-lg" style={{
            padding: '32px 28px',
            background: 'var(--color-bg)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Fondo decorativo sutil */}
            <div style={{
                position: 'absolute', top: -50, right: -50, width: 200, height: 200,
                background: 'radial-gradient(circle, var(--color-wallet) 0%, transparent 70%)',
                opacity: 0.05, pointerEvents: 'none'
            }}></div>

            {/* Header del Nodo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{
                            fontSize: 10, fontWeight: 800, color: 'var(--color-wallet)',
                            background: 'color-mix(in srgb, var(--color-wallet) 10%, white)',
                            padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em'
                        }}>
                            Maestría de Rango
                        </span>
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--color-navy)', letterSpacing: -0.5 }}>
                        {RANKS[(currentLevel - 1) % 12]}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: referrals >= 4 ? '#10B981' : '#F59E0B' }}></div>
                        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 }}>
                            {referrals >= 4 ? 'Ciclo Completado' : `${4 - referrals} conexiones pendientes`}
                        </p>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>
                        Capacidad del Nodo
                    </p>
                    <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-navy)' }}>
                        {investment.toLocaleString()} <span style={{ fontSize: 14, opacity: 0.5 }}>TC</span>
                    </div>
                </div>
            </div>

            {/* Visualización Orbital */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Matriz Central */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16,
                    position: 'relative'
                }}>
                    {slotConfig.map((config) => {
                        const isActive = config.id <= referrals;
                        const isHovered = hoveredSlot === config.id;

                        return (
                            <motion.div
                                key={config.id}
                                onMouseEnter={() => setHoveredSlot(config.id)}
                                onMouseLeave={() => setHoveredSlot(null)}
                                whileHover={{ y: -5 }}
                                style={{
                                    padding: '20px 16px',
                                    borderRadius: 20,
                                    border: `2px ${isActive ? 'solid' : 'dashed'} ${isActive ? config.color : 'var(--color-border)'}`,
                                    background: isActive ? `color-mix(in srgb, ${config.color} 5%, var(--color-bg))` : 'var(--color-surface-2)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 12,
                                    cursor: 'help',
                                    transition: 'background 0.3s, border 0.3s'
                                }}
                            >
                                <div style={{
                                    width: 44, height: 44, borderRadius: 14,
                                    background: isActive ? config.color : 'var(--color-border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white',
                                    boxShadow: isActive ? `0 8px 20px -5px ${config.color}80` : 'none',
                                    transition: 'all 0.3s'
                                }}>
                                    {isActive ? config.icon : <UserPlus size={20} opacity={0.4} />}
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: 12, fontWeight: 800, color: isActive ? 'var(--color-navy)' : 'var(--color-text-muted)', marginBottom: 2 }}>
                                        {config.label}
                                    </p>
                                    <div style={{
                                        fontSize: 10, fontWeight: 700,
                                        color: isActive ? config.color : 'var(--color-text-muted)',
                                        textTransform: 'uppercase', letterSpacing: '0.04em'
                                    }}>
                                        {isActive ? 'Activo' : 'Pendiente'}
                                    </div>
                                </div>

                                {/* Tooltip / Info Overlay (Solo móvil o desktop sutil) */}
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            style={{
                                                position: 'absolute', bottom: 'calc(100% + 10px)', left: 0, right: 0,
                                                background: 'var(--color-navy)', color: 'white', padding: 12,
                                                borderRadius: 12, fontSize: 11, zIndex: 10, boxShadow: 'var(--shadow-lg)'
                                            }}
                                        >
                                            <strong>{config.label}:</strong> {config.desc}
                                            <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid var(--color-navy)' }}></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Barra de Expansión / Energía */}
                <div style={{ background: 'var(--color-surface-2)', padding: 20, borderRadius: 20, border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <TrendingUp size={16} color="var(--color-wallet)" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>Energía de Ascensión</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-wallet)' }}>{progress}%</span>
                    </div>
                    <div style={{ height: 10, background: 'var(--color-border)', borderRadius: 5, overflow: 'hidden' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{
                                height: '100%',
                                background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
                                borderRadius: 5,
                                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                            }}
                        />
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Info size={12} /> Complete el ciclo para activar la licencia **{nextRank}**.
                    </p>
                </div>

                {/* Distribución de Vitalidad */}
                <div style={{ marginTop: 8, padding: '24px 20px', background: 'var(--color-surface-2)', borderRadius: 20, border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Cpu size={16} />
                        </div>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-navy)' }}>Distribución del Ciclo</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 12, height: 12, borderRadius: 4, background: '#F59E0B' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)' }}>RECOMPENSA DIRECTA</span>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-navy)' }}>25%</span>
                                </div>
                                <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
                                    <div style={{ width: '25%', height: '100%', background: '#F59E0B' }} />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 12, height: 12, borderRadius: 4, background: '#3B82F6' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)' }}>FONDO DE ASCENSIÓN</span>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-navy)' }}>50%</span>
                                </div>
                                <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
                                    <div style={{ width: '50%', height: '100%', background: '#3B82F6' }} />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 12, height: 12, borderRadius: 4, background: '#64748B' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)' }}>INFRAESTRUCTURA</span>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-navy)' }}>25%</span>
                                </div>
                                <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
                                    <div style={{ width: '25%', height: '100%', background: '#64748B' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
