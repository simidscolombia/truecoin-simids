'use client';

import { motion } from 'framer-motion';
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
    "VIP BRONCE", "VIP PLATA", "VIP ORO",
    "PLATINO I", "PLATINO II", "PLATINO III",
    "ESMERALDA I", "ESMERALDA II", "ESMERALDA III",
    "ZAFIRO", "DIAMANTE", "LEYENDA SIMID"
];

export default function GiftMatrix({
    currentLevel = 1,
    slots = [],
    onSelectPosition,
    onSelectUser,
    isPlacing
}: GiftMatrixProps) {
    const [browsingLevel, setBrowsingLevel] = useState(currentLevel);

    const levels = Array.from({ length: 12 }, (_, i) => i + 1);
    const entryCost = 50 * Math.pow(2, browsingLevel - 1);
    const totalGross = entryCost * 4;
    const isLevelUnlocked = browsingLevel <= currentLevel;
    const isActiveLevel = browsingLevel === currentLevel;
    const fillingPercentage = isActiveLevel ? (slots.length / 4) * 100 : (isLevelUnlocked ? 100 : 0);

    // Distribución ShopyBrands Oficial (25% Tú, 25% Sostenibilidad, 50% Salto de Nivel)
    const distribution = {
        propia: entryCost,       // 25% (1 entrada)
        sistema: entryCost,      // 25% (1 entrada para plataforma)
        salto: entryCost * 2     // 50% (2 entradas para reinversión)
    };

    const displaySlots = [1, 2, 3, 4].map(pos => {
        const data = browsingLevel === currentLevel ? slots.find(s => s.position === pos) : null;
        return { pos, data, isActive: !!data };
    });

    return (
        <div id="gift-matrix-unified" style={{ maxWidth: 800, margin: '0 auto' }}>
            {/* ── UNIFIED BOARD ── */}
            <div className="card-lg" style={{
                padding: '40px', background: 'white', borderRadius: 40,
                border: isPlacing && isActiveLevel ? '3px solid var(--color-wallet)' : '1px solid var(--color-border)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.06)',
                position: 'relative',
                overflow: 'hidden'
            }}>

                {/* ── LEVEL SELECTOR (HORIZONTAL BAR AT THE TOP) ── */}
                <div style={{
                    display: 'flex', gap: 8, marginBottom: 32, overflowX: 'auto',
                    padding: '4px 4px 12px', scrollbarWidth: 'none',
                    borderBottom: '1px solid #F1F5F9'
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
                                    flexShrink: 0, width: 44, height: 44, borderRadius: 12, border: 'none',
                                    background: isSelected ? 'var(--color-navy)' : (isUnlocked ? 'rgba(245, 158, 11, 0.05)' : '#F8FAFC'),
                                    color: isSelected ? 'white' : (isUnlocked ? 'var(--color-wallet)' : '#94A3B8'),
                                    cursor: 'pointer', fontWeight: 900, fontSize: 13, transition: 'all 0.2s',
                                    position: 'relative', opacity: isUnlocked || isSelected ? 1 : 0.6
                                }}
                            >
                                {lvl}
                                {isCurrent && <div style={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, borderRadius: '50%', background: '#10B981', border: '2px solid white' }} />}
                            </button>
                        );
                    })}
                </div>

                {/* ── MAIN HEADER: RANK + PROGRESS ── */}
                <div style={{ textAlign: 'center', marginBottom: 44 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(245, 158, 11, 0.08)', padding: '10px 24px', borderRadius: 999, marginBottom: 16 }}>
                        <Award size={20} color="var(--color-wallet)" />
                        <span style={{ fontSize: 14, fontWeight: 950, color: 'var(--color-navy)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {RANKS[(browsingLevel - 1) % 12]}
                        </span>
                    </div>

                    <h2 style={{ fontSize: 36, fontWeight: 950, color: 'var(--color-navy)', margin: 0, letterSpacing: -1 }}>
                        ShopyGift <span style={{ color: 'var(--color-wallet)' }}>Nivel {browsingLevel}</span>
                    </h2>

                    {/* PROGRESS BAR (Unified) */}
                    <div style={{ maxWidth: 400, margin: '28px auto 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 12, fontWeight: 900, color: 'var(--color-text-muted)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Zap size={14} color="var(--color-wallet)" /> PROGRESO DEL CICLO
                            </span>
                            <span>{Math.round(fillingPercentage)}% COMPLETADO</span>
                        </div>
                        <div style={{ height: 12, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden', padding: 2 }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${fillingPercentage}%` }}
                                style={{ height: '100%', background: 'linear-gradient(90deg, var(--color-wallet), #FFB02E)', borderRadius: 99 }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── MATRIX BOARD ── */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40, width: '100%', maxWidth: 460, margin: '0 auto',
                    opacity: isLevelUnlocked ? 1 : 0.4,
                    filter: isLevelUnlocked ? 'none' : 'grayscale(1)',
                    position: 'relative'
                }}>
                    {displaySlots.map(slot => {
                        const isActive = slot.isActive;
                        return (
                            <motion.div
                                key={slot.pos}
                                onClick={() => {
                                    if (isActive && slot.data) onSelectUser?.({ ...slot.data, id: slot.data.occupant_id, full_name: slot.data.occupant_name });
                                    else if (isPlacing && isActiveLevel) onSelectPosition?.(slot.pos);
                                }}
                                whileHover={{ scale: isActive || (isPlacing && isActiveLevel) ? 1.05 : 1 }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, cursor: (isActive || (isPlacing && isActiveLevel)) ? 'pointer' : 'default' }}
                            >
                                <div style={{
                                    width: 110, height: 110, borderRadius: '50%',
                                    border: isActive ? '4px solid var(--color-wallet)' : '2px dashed #CBD5E1',
                                    background: isActive ? 'white' : '#F8FAFC',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: isActive ? '0 15px 35px rgba(245, 158, 11, 0.2)' : 'none',
                                    position: 'relative'
                                }}>
                                    {isActive && slot.data ? (
                                        <div style={{ fontSize: 40, fontWeight: 950, color: 'var(--color-wallet)' }}>{slot.data.occupant_name?.charAt(0)}</div>
                                    ) : (
                                        <div style={{ position: 'relative' }}>
                                            <UserPlus size={40} color="#CBD5E1" />
                                            {isPlacing && isActiveLevel && (
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    style={{ position: 'absolute', inset: -10, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)' }}
                                                />
                                            )}
                                        </div>
                                    )}
                                    {isActive && slot.data && (
                                        <div style={{
                                            position: 'absolute', bottom: -5, right: -5, background: 'var(--color-navy)', color: 'white',
                                            padding: '4px 10px', borderRadius: 10, fontSize: 11, fontWeight: 950, border: '3px solid white'
                                        }}>
                                            L{slot.data.current_level || 1}
                                        </div>
                                    )}
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: 15, fontWeight: 900, color: isActive ? 'var(--color-navy)' : '#94A3B8', margin: 0 }}>
                                        {(isActive && slot.data) ? slot.data.occupant_name?.split(' ')[0] : `Espacio ${slot.pos}`}
                                    </p>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: isActive ? 'var(--color-wallet)' : '#94A3B8', textTransform: 'uppercase', marginTop: 3 }}>
                                        {isActive ? 'Miembro' : 'Vacío'}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ── REWARD & DISTRIBUTION (OFFICIAL 25/25/50) ── */}
                <div style={{
                    marginTop: 52, padding: '32px 40px', background: 'var(--color-navy)', borderRadius: 32, color: 'white',
                    boxShadow: '0 15px 40px rgba(15, 23, 42, 0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32
                }}>
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>PREMIO TOTAL DEL CICLO</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                            <span style={{ fontSize: 44, fontWeight: 950, color: 'var(--color-wallet)' }}>{totalGross.toLocaleString()}</span>
                            <span style={{ fontSize: 16, fontWeight: 800 }}>TC</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 40, paddingLeft: 32, borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: 20, fontWeight: 950, color: 'var(--color-wallet)', margin: 0 }}>{distribution.propia.toLocaleString()}</p>
                            <p style={{ fontSize: 10, fontWeight: 800, opacity: 0.8 }}>PREMIO (25%)</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: 20, fontWeight: 950, color: 'white', margin: 0 }}>{distribution.sistema.toLocaleString()}</p>
                            <p style={{ fontSize: 10, fontWeight: 800, opacity: 0.6 }}>SISTEMA (25%)</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: 20, fontWeight: 950, color: 'white', margin: 0 }}>{distribution.salto.toLocaleString()}</p>
                            <p style={{ fontSize: 10, fontWeight: 800, opacity: 0.6 }}>PROGRESIÓN (50%)</p>
                        </div>
                    </div>
                </div>

                {/* ── FOOTER INFO ── */}
                <div style={{ marginTop: 32, textAlign: 'center' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <Zap size={14} color="var(--color-wallet)" />
                        {isActiveLevel
                            ? `Al completar este ciclo de 4 personas, recibes ${distribution.propia} TC y saltas gratis al Nivel ${browsingLevel + 1}.`
                            : `Este nivel genera un movimiento total de ${totalGross} TC entre premios y progresión.`}
                    </p>
                </div>

            </div>
        </div>
    );
}
