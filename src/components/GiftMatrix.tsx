'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Award, UserPlus, Zap } from 'lucide-react';
import { useState } from 'react';
import { MatrixSlot } from '../services/giftService';

interface GiftMatrixProps {
    currentLevel?: number;
    slots?: MatrixSlot[];
    onSelectPosition?: (pos: number) => void;
    onSelectUser?: (user: any) => void;
    isPlacing?: boolean;
}

const RANKS = [
    "Vip Bronce", "Vip Cobre", "Vip Plata", "Vip Oro",
    "Platino", "Zafiro", "Esmeralda",
    "Diamante", "Diamante Azul", "Corona",
    "Embajador", "Embajador Real", "Leyenda"
];

export default function GiftMatrix({
    currentLevel = 1,
    slots = [],
    onSelectPosition,
    onSelectUser,
    isPlacing
}: GiftMatrixProps) {
    const [browsingLevel, setBrowsingLevel] = useState(currentLevel);
    const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

    const levels = Array.from({ length: 12 }, (_, i) => i + 1);
    const referrals = browsingLevel === currentLevel ? slots.length : 0;
    const isLevelUnlocked = browsingLevel <= currentLevel;
    const isActiveLevel = browsingLevel === currentLevel;

    const currentRank = RANKS[(browsingLevel - 1) % 12];
    const pointsForLevel = browsingLevel * 100;

    // Crear 4 slots, llenando con datos reales o vacíos (solo si es el nivel actual)
    const displaySlots = [1, 2, 3, 4].map(pos => {
        const data = browsingLevel === currentLevel ? slots.find(s => s.position === pos) : null;
        return {
            pos,
            data,
            isActive: !!data
        };
    });

    return (
        <div id="gift-matrix" className="card-lg" style={{
            padding: '40px 32px',
            background: 'white',
            borderRadius: 32,
            boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
            position: 'relative',
            border: isPlacing ? '3px solid var(--color-wallet)' : '1px solid var(--color-border)',
            transition: 'all 0.3s'
        }}>

            <div style={{ marginBottom: 40, textAlign: 'center' }}>
                <h2 style={{ fontSize: 28, fontWeight: 950, color: 'var(--color-navy)', margin: '0 0 8px 0', letterSpacing: -0.5 }}>
                    ShopyGift
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontWeight: 600, fontSize: 14 }}>
                    Explora el plan de expansión de 12 niveles de ShopyBrands.
                </p>
            </div>

            {/* ── LEVEL NAVIGATOR ── */}
            <div style={{
                display: 'flex',
                gap: 10,
                marginBottom: 48,
                overflowX: 'auto',
                padding: '4px 4px 16px',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch'
            }}>
                {levels.map(lvl => {
                    const isUnlocked = lvl <= currentLevel;
                    const isCurrent = lvl === currentLevel;
                    const isSelected = lvl === browsingLevel;

                    return (
                        <button
                            key={lvl}
                            onClick={() => setBrowsingLevel(lvl)}
                            style={{
                                flexShrink: 0,
                                width: 54,
                                height: 64,
                                borderRadius: 16,
                                border: isSelected ? '2px solid var(--color-wallet)' : '1px solid var(--color-border)',
                                background: isSelected ? 'rgba(245, 158, 11, 0.05)' : (isUnlocked ? 'white' : 'var(--color-surface-2)'),
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                position: 'relative',
                                opacity: isUnlocked || isSelected ? 1 : 0.6
                            }}
                        >
                            <span style={{
                                fontSize: 13,
                                fontWeight: 900,
                                color: isSelected ? 'var(--color-wallet)' : (isUnlocked ? 'var(--color-navy)' : 'var(--color-text-muted)')
                            }}>{lvl}</span>
                            <span style={{
                                fontSize: 8,
                                fontWeight: 800,
                                color: isSelected ? 'var(--color-wallet)' : 'var(--color-text-muted)',
                                textTransform: 'uppercase'
                            }}>Nivel</span>

                            {isCurrent && (
                                <div style={{
                                    position: 'absolute',
                                    top: -4,
                                    right: -4,
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    background: '#10B981',
                                    border: '2px solid white',
                                    zIndex: 2
                                }} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ── CURRENT LEVEL HEADER ── */}
            <div style={{ textAlign: 'center', marginBottom: 40, position: 'relative' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={browsingLevel}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: isLevelUnlocked ? 'rgba(245, 158, 11, 0.08)' : 'var(--color-surface-2)', padding: '8px 20px', borderRadius: 999, marginBottom: 12 }}>
                            <Award size={18} color={isLevelUnlocked ? 'var(--color-wallet)' : 'var(--color-text-muted)'} />
                            <span style={{ fontSize: 13, fontWeight: 900, color: isLevelUnlocked ? 'var(--color-navy)' : 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                {currentRank}
                            </span>
                        </div>
                        <h3 style={{ fontSize: 24, fontWeight: 900, color: isLevelUnlocked ? 'var(--color-navy)' : 'var(--color-text-muted)', margin: 0 }}>
                            {browsingLevel === currentLevel ? 'Tu Nivel Actual' : `Explorando Nivel ${browsingLevel}`}
                        </h3>
                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-wallet)', marginTop: 4 }}>
                            Recompensa: {pointsForLevel.toLocaleString()} PUNTOS
                            {isActiveLevel && <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}> ({referrals}/4 completados)</span>}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isPlacing && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="badge-wallet"
                        style={{
                            padding: '12px 20px',
                            borderRadius: 12,
                            marginBottom: 24,
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            fontWeight: 800,
                            fontSize: 14,
                            animation: 'pulse 2s infinite'
                        }}
                    >
                        <Zap size={18} /> MODO UBICACIÓN: Haz clic en un círculo vacío para colocar al socio.
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="matrix-grid" style={{
                position: 'relative',
                padding: '20px 0',
                opacity: isLevelUnlocked ? 1 : 0.4,
                filter: isLevelUnlocked ? 'none' : 'grayscale(1)'
            }}>
                {displaySlots.map((slot) => {
                    const isActive = slot.isActive;
                    const color = isActive ? 'var(--color-wallet)' : 'var(--color-surface-3)';

                    return (
                        <motion.div
                            key={slot.pos}
                            onMouseEnter={() => setHoveredSlot(slot.pos)}
                            onMouseLeave={() => setHoveredSlot(null)}
                            onClick={() => {
                                if (isActive) {
                                    onSelectUser?.({
                                        id: slot.data?.occupant_id,
                                        full_name: slot.data?.occupant_name,
                                        current_level: slot.data?.current_level,
                                        recruiter_name: slot.data?.recruiter_name,
                                        recruiter_code: slot.data?.recruiter_code
                                    });
                                } else if (isPlacing && isActiveLevel) {
                                    onSelectPosition?.(slot.pos);
                                }
                            }}
                            whileHover={{ y: (isActive || isPlacing) ? -5 : 0 }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 12,
                                cursor: (isActive || (isPlacing && isActiveLevel)) ? 'pointer' : 'default',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                border: isActive ? '4px solid var(--color-wallet)' : '2px dashed #CBD5E1',
                                background: isActive ? 'white' : 'var(--color-surface-2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: isActive ? 'var(--color-wallet)' : '#94A3B8',
                                boxShadow: isActive ? '0 8px 25px rgba(245, 158, 11, 0.2)' : 'none',
                                transition: 'all 0.3s',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {isActive ? (
                                    <div style={{ fontSize: 28, fontWeight: 900 }}>{slot.data?.occupant_name?.charAt(0)}</div>
                                ) : (
                                    <UserPlus size={32} opacity={isPlacing && isActiveLevel ? 1 : 0.3} style={{ color: isPlacing && isActiveLevel ? 'var(--color-wallet)' : 'inherit' }} />
                                )}

                                {!isActive && isPlacing && isActiveLevel && (
                                    <motion.div
                                        animate={{ opacity: [0.2, 0.6, 0.2] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        style={{ position: 'absolute', inset: 0, background: 'var(--color-wallet)' }}
                                    />
                                )}

                                {!isLevelUnlocked && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Zap size={20} style={{ color: 'var(--color-text-muted)' }} />
                                    </div>
                                )}
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <p style={{
                                    fontSize: 13,
                                    fontWeight: 800,
                                    color: isActive ? 'var(--color-navy)' : 'var(--color-text-muted)',
                                    margin: 0
                                }}>
                                    {isActive ? slot.data?.occupant_name : (isPlacing && isActiveLevel && hoveredSlot === slot.pos ? '¡UBICAR!' : `Puesto ${slot.pos}`)}
                                </p>
                                <p style={{ fontSize: 10, fontWeight: 700, color: color, textTransform: 'uppercase', margin: '2px 0 0 0' }}>
                                    {isActive ? 'Miembro' : (isPlacing && isActiveLevel ? 'Disponible' : 'Cerrado')}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div style={{
                marginTop: 40,
                padding: '24px',
                background: 'var(--color-surface-2)',
                borderRadius: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                border: '1px solid var(--color-border)'
            }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <Zap size={20} color="var(--color-wallet)" />
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 2px 0' }}>
                        Regla de Progresión IA
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', margin: 0 }}>
                        Completa los 4 puestos del nivel {browsingLevel} para recibir su premio y desbloquear el siguiente escalafón.
                    </p>
                </div>
            </div>
        </div>
    );
}
