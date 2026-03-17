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

    const levels = Array.from({ length: 12 }, (_, i) => i + 1);
    const isLevelUnlocked = browsingLevel <= currentLevel;
    const isActiveLevel = browsingLevel === currentLevel;
    const pointsForLevel = browsingLevel * 100;

    // Distribución del premio (80% Socio, 10% Red/Hijos, 10% Sistema)
    const distribution = {
        propia: pointsForLevel * 0.8,
        red: pointsForLevel * 0.1,
        sistema: pointsForLevel * 0.1
    };

    const displaySlots = [1, 2, 3, 4].map(pos => {
        const data = browsingLevel === currentLevel ? slots.find(s => s.position === pos) : null;
        return { pos, data, isActive: !!data };
    });

    return (
        <div id="gift-matrix-layout" style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr 280px',
            gap: 24,
            alignItems: 'start',
            maxWidth: '100%',
            overflowX: 'hidden'
        }}>
            {/* ── COLUMNA 1: ESCALONES (V) ── */}
            <div style={{
                background: 'white',
                borderRadius: 24,
                padding: '16px 8px',
                border: '1px solid var(--color-border)',
                height: '75vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                scrollbarWidth: 'none',
                position: 'sticky',
                top: 20
            }}>
                <p style={{ fontSize: 9, fontWeight: 900, color: 'var(--color-text-muted)', textAlign: 'center', textTransform: 'uppercase', marginBottom: 8 }}>Niveles</p>
                {levels.map(lvl => {
                    const isUnlocked = lvl <= currentLevel;
                    const isSelected = lvl === browsingLevel;
                    return (
                        <button
                            key={lvl}
                            onClick={() => setBrowsingLevel(lvl)}
                            style={{
                                width: '100%', padding: '12px 0', borderRadius: 12, border: 'none',
                                background: isSelected ? 'var(--color-navy)' : (isUnlocked ? 'white' : 'rgba(0,0,0,0.03)'),
                                color: isSelected ? 'white' : (isUnlocked ? 'var(--color-navy)' : 'var(--color-text-muted)'),
                                cursor: 'pointer', fontWeight: 800, fontSize: 13, transition: 'all 0.2s',
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            L{lvl}
                            {lvl === currentLevel && (
                                <div style={{
                                    position: 'absolute', top: 4, right: 4, width: 6, height: 6,
                                    borderRadius: '50%', background: '#10B981', border: '1px solid white'
                                }} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ── COLUMNA 2: EL TABLERO (ShopyGift) ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="card-lg" style={{
                    padding: '40px 32px', background: 'white', borderRadius: 32,
                    border: isPlacing && isActiveLevel ? '3px solid var(--color-wallet)' : '1px solid var(--color-border)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: isLevelUnlocked ? 'rgba(245, 158, 11, 0.1)' : '#F1F5F9', padding: '6px 14px', borderRadius: 999, marginBottom: 16 }}>
                            <Award size={14} color={isLevelUnlocked ? 'var(--color-wallet)' : '#94A3B8'} />
                            <span style={{ fontSize: 11, fontWeight: 900, color: isLevelUnlocked ? 'var(--color-navy)' : '#94A3B8', textTransform: 'uppercase' }}>
                                {RANKS[(browsingLevel - 1) % 12]}
                            </span>
                        </div>
                        <h2 style={{ fontSize: 32, fontWeight: 950, color: 'var(--color-navy)', margin: 0, letterSpacing: -1 }}>
                            {browsingLevel === currentLevel ? 'ShopyGift Activo' : `ShopyGift Nivel ${browsingLevel}`}
                        </h2>
                        {browsingLevel === currentLevel && (
                            <p style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: 'var(--color-wallet)' }}>
                                {slots.length}/4 puestos completados
                            </p>
                        )}
                    </div>

                    <div className="matrix-grid" style={{
                        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40, width: '100%', maxWidth: 460,
                        opacity: isLevelUnlocked ? 1 : 0.4,
                        filter: isLevelUnlocked ? 'none' : 'grayscale(1)',
                        padding: '20px 0'
                    }}>
                        {displaySlots.map(slot => {
                            const isActive = slot.isActive;
                            return (
                                <motion.div
                                    key={slot.pos}
                                    onClick={() => {
                                        if (isActive) onSelectUser?.({ ...slot.data, id: slot.data.occupant_id, full_name: slot.data.occupant_name });
                                        else if (isPlacing && isActiveLevel) onSelectPosition?.(slot.pos);
                                    }}
                                    whileHover={{ y: isActive || (isPlacing && isActiveLevel) ? -8 : 0 }}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, cursor: (isActive || (isPlacing && isActiveLevel)) ? 'pointer' : 'default' }}
                                >
                                    <div style={{
                                        width: 110, height: 110, borderRadius: '50%',
                                        border: isActive ? '4px solid var(--color-wallet)' : '2px dashed #CBD5E1',
                                        background: isActive ? 'white' : '#F8FAFC',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: isActive ? '0 12px 30px rgba(245, 158, 11, 0.25)' : 'none',
                                        position: 'relative',
                                        transition: 'all 0.3s'
                                    }}>
                                        {isActive ? (
                                            <div style={{ fontSize: 40, fontWeight: 950, color: 'var(--color-wallet)' }}>{slot.data.occupant_name?.charAt(0)}</div>
                                        ) : (
                                            <div style={{ position: 'relative' }}>
                                                <UserPlus size={40} color="#CBD5E1" />
                                                {isPlacing && isActiveLevel && (
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                                        style={{ position: 'absolute', inset: -10, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)' }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {isActive && (
                                            <div style={{
                                                position: 'absolute', bottom: -5, right: -5, background: 'var(--color-navy)', color: 'white',
                                                padding: '4px 10px', borderRadius: 10, fontSize: 11, fontWeight: 950, border: '3px solid white',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                            }}>
                                                L{slot.data.current_level || 1}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ fontSize: 15, fontWeight: 800, color: isActive ? 'var(--color-navy)' : '#94A3B8', margin: 0 }}>
                                            {isActive ? slot.data.occupant_name.split(' ')[0] : (isPlacing && isActiveLevel ? 'Disponible' : `Puesto ${slot.pos}`)}
                                        </p>
                                        <p style={{ fontSize: 11, fontWeight: 700, color: isActive ? 'var(--color-wallet)' : '#94A3B8', textTransform: 'uppercase', marginTop: 2 }}>
                                            {isActive ? 'Miembro Activo' : (isPlacing && isActiveLevel ? '¡Haz clic aquí!' : 'Vacío')}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="card" style={{ padding: 24, borderRadius: 28, display: 'flex', gap: 16, alignItems: 'center', border: '1px solid var(--color-border)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={24} color="var(--color-wallet)" />
                    </div>
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 900, color: 'var(--color-navy)', margin: 0 }}>Regla de Salto Automático</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', margin: 0 }}>
                            Al completar los 4 espacios del nivel {browsingLevel}, el sistema te otorga el premio y te posiciona en el Nivel {browsingLevel + 1}.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── COLUMNA 3: DETALLE DE RECOMPENSA ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: 'var(--color-navy)', color: 'white', padding: 32, borderRadius: 32, boxShadow: '0 15px 35px rgba(15, 23, 42, 0.2)' }}>
                    <p style={{ fontSize: 11, fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>RECOMPENSA DE NIVEL</p>
                    <div style={{ fontSize: 40, fontWeight: 950, color: 'var(--color-wallet)', marginBottom: 4 }}>{pointsForLevel.toLocaleString()}</div>
                    <p style={{ fontSize: 14, fontWeight: 800 }}>PUNTOS TOTALES</p>

                    <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '24px 0' }} />

                    <p style={{ fontSize: 10, fontWeight: 900, marginBottom: 16, opacity: 0.7 }}>CÓMO SE REPARTE:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-wallet)' }} />
                                <span style={{ fontSize: 12, fontWeight: 600 }}>Tú (80%)</span>
                            </div>
                            <span style={{ fontSize: 16, fontWeight: 950 }}>{distribution.propia} </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#38BDF8' }} />
                                <span style={{ fontSize: 12, fontWeight: 600 }}>Hijos (10%)</span>
                            </div>
                            <span style={{ fontSize: 16, fontWeight: 950 }}>{distribution.red} </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#94A3B8' }} />
                                <span style={{ fontSize: 12, fontWeight: 600 }}>IA IA (10%)</span>
                            </div>
                            <span style={{ fontSize: 16, fontWeight: 950 }}>{distribution.sistema} </span>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: 24, borderRadius: 32, border: '1px solid var(--color-border)' }}>
                    <h4 style={{ fontSize: 13, fontWeight: 950, marginBottom: 20, color: 'var(--color-navy)', letterSpacing: 0.5, borderBottom: '1px solid #F1F5F9', pb: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        MONITOREO DE HIJOS
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {slots.length > 0 ? slots.map(s => (
                            <div key={s.occupant_id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                background: '#F8FAFC', padding: '14px', borderRadius: 16, border: '1px solid var(--color-border)',
                                transition: 'transform 0.2s', cursor: 'pointer'
                            }} onClick={() => onSelectUser?.({ ...s, id: s.occupant_id, full_name: s.occupant_name })}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>
                                        {s.occupant_name.charAt(0)}
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: 800 }}>{s.occupant_name.split(' ')[0]}</span>
                                </div>
                                <span style={{ fontSize: 10, fontWeight: 950, color: 'var(--color-wallet)', background: 'white', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                    NIVEL {s.current_level || 1}
                                </span>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '30px 0' }}>
                                <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, margin: 0 }}>No hay socios directos aún en este nivel.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
