'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Award,
    Info, Cpu,
    TrendingUp, UserPlus, Zap
} from 'lucide-react';
import { useState } from 'react';

import { giftService, MatrixSlot } from '../services/giftService';

interface GiftMatrixProps {
    currentLevel?: number;
    slots?: MatrixSlot[];
    onSelectPosition?: (pos: number) => void;
    isPlacing?: boolean;
}

const RANKS = [
    "VIP BRONCE", "VIP COBRE", "VIP PLATA", "VIP ORO",
    "PLATINO", "ZAFIRO", "ESMERALDA",
    "DIAMANTE", "DIAMANTE AZUL", "CORONA",
    "EMBAJADOR", "EMBAJADOR REAL", "LEYENDA"
];



export default function GiftMatrix({
    currentLevel = 1,
    slots = [],
    onSelectPosition,
    isPlacing
}: GiftMatrixProps) {
    const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
    const investment = giftService.getLevelValue(currentLevel);
    const referrals = slots.length;
    const progress = (referrals / 4) * 100;

    // Crear 4 slots, llenando con datos reales de 'slots' o vacíos
    const displaySlots = [1, 2, 3, 4].map(pos => {
        const data = slots.find(s => s.position === pos);
        return {
            pos,
            data,
            isActive: !!data,
            // Cálculo de recompensa usando el servicio de mérito
            dist: data ? giftService.calculateRewardDistribution(currentLevel, 'current_user_id', data.recruiter_id || '') : null
        };
    });

    const nextRank = currentLevel < 12 ? RANKS[currentLevel] : null;

    return (
        <div id="gift-matrix" className="card-lg" style={{
            padding: '32px 28px',
            background: 'var(--color-bg)',
            position: 'relative',
            overflow: 'hidden',
            border: isPlacing ? '2px solid var(--color-wallet)' : 'none',
            transition: 'all 0.3s'
        }}>
            {/* Banner de Instrucción si está Ubicando */}
            <AnimatePresence>
                {isPlacing && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            background: 'var(--color-wallet)',
                            color: 'white',
                            padding: '12px',
                            borderRadius: 12,
                            marginBottom: 24,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            fontWeight: 700,
                            fontSize: 14,
                            boxShadow: '0 8px 20px -5px rgba(245, 158, 11, 0.4)'
                        }}
                    >
                        <Zap size={18} className="animate-pulse" />
                        ¡MODO UBICACIÓN ACTIVO! Haz clic en cualquiera de los cuadros pulsantes debajo para colocar al socio.
                    </motion.div>
                )}
            </AnimatePresence>
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
                    {displaySlots.map((slot) => {
                        const isActive = slot.isActive;
                        const isHovered = hoveredSlot === slot.pos;
                        const color = isActive ? (slot.dist?.isSpillover ? '#8B5CF6' : '#10B981') : 'var(--color-border)';

                        return (
                            <motion.div
                                key={slot.pos}
                                onMouseEnter={() => setHoveredSlot(slot.pos)}
                                onMouseLeave={() => setHoveredSlot(null)}
                                onClick={() => !isActive && isPlacing && onSelectPosition?.(slot.pos)}
                                whileHover={{ y: -5 }}
                                animate={!isActive && isPlacing ? {
                                    boxShadow: ["0 0 0px #3B82F600", "0 0 15px #3B82F680", "0 0 0px #3B82F600"]
                                } : {}}
                                transition={!isActive && isPlacing ? { duration: 2, repeat: Infinity } : {}}
                                style={{
                                    padding: '20px 16px',
                                    borderRadius: 20,
                                    border: `2px ${isActive ? 'solid' : 'dashed'} ${color}`,
                                    background: isActive ? `color-mix(in srgb, ${color} 5%, var(--color-bg))` : 'var(--color-surface-2)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 12,
                                    position: 'relative',
                                    transition: 'all 0.3s',
                                    cursor: !isActive && isPlacing ? 'pointer' : 'default'
                                }}
                            >
                                <div style={{
                                    width: 44, height: 44, borderRadius: 14,
                                    background: color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white',
                                    boxShadow: isActive ? `0 8px 20px -5px ${color}80` : 'none',
                                }}>
                                    {isActive ? (slot.dist?.isSpillover ? <Cpu size={20} /> : <Award size={20} />) : <UserPlus size={20} opacity={0.4} />}
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: 12, fontWeight: 800, color: isActive ? 'var(--color-navy)' : 'var(--color-text-muted)', marginBottom: 2 }}>
                                        {isActive ? slot.data?.occupant_name : (isPlacing && hoveredSlot === slot.pos ? 'UBICAR AQUÍ' : `Posición ${slot.pos}`)}
                                    </p>
                                    <div style={{
                                        fontSize: 10, fontWeight: 700,
                                        color: color,
                                        textTransform: 'uppercase', letterSpacing: '0.04em'
                                    }}>
                                        {isActive ? (slot.dist?.isSpillover ? 'Derrame IA' : 'Directo') : (isPlacing ? 'DISPONIBLE' : 'Pendiente')}
                                    </div>
                                </div>

                                {isHovered && isActive && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{
                                            position: 'absolute', bottom: 'calc(100% + 12px)', left: -20, right: -20,
                                            background: 'var(--color-navy)', color: 'white', padding: '12px 16px',
                                            borderRadius: 16, fontSize: 11, zIndex: 10, boxShadow: 'var(--shadow-lg)',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        <div style={{ marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 }}>
                                            <strong>💰 Distribución de Mérito</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <span>Para ti:</span>
                                            <span style={{ color: '#4ADE80', fontWeight: 700 }}>+{slot.dist?.ownerGain} TC</span>
                                        </div>
                                        {slot.dist?.isSpillover && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8 }}>
                                                <span>Bono Líder:</span>
                                                <span style={{ color: '#FACC15' }}>+{slot.dist?.recruiterBonus} TC</span>
                                            </div>
                                        )}
                                        <div style={{ fontSize: 9, opacity: 0.6, marginTop: 8 }}>
                                            El 50% restante impulsa tu ascenso al siguiente rango.
                                        </div>
                                    </motion.div>
                                )}
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
