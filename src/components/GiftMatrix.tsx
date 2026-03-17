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
    const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
    const referrals = slots.length;

    // Crear 4 slots, llenando con datos reales o vacíos
    const displaySlots = [1, 2, 3, 4].map(pos => {
        const data = slots.find(s => s.position === pos);
        return {
            pos,
            data,
            isActive: !!data
        };
    });

    return (
        <div id="gift-matrix" className="card-lg" style={{
            padding: '32px 28px',
            background: 'white',
            borderRadius: 24,
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            position: 'relative',
            border: isPlacing ? '3px solid var(--color-wallet)' : '1px solid var(--color-border)',
            transition: 'all 0.3s'
        }}>

            <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-navy)', margin: 0 }}>
                    Mi Tablero de Galardones
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    Nivel Actual: {RANKS[(currentLevel - 1) % 12]} ({referrals}/4 ubicados)
                </p>
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
                padding: '20px 0'
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
                                    onSelectUser?.({ id: slot.data?.occupant_id, full_name: slot.data?.occupant_name });
                                } else if (isPlacing) {
                                    onSelectPosition?.(slot.pos);
                                }
                            }}
                            whileHover={{ y: isActive ? -2 : -5 }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 12,
                                cursor: isActive || isPlacing ? 'pointer' : 'default',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                border: `4px solid ${isActive ? 'var(--color-wallet)' : 'dashed #CBD5E1'}`,
                                background: isActive ? 'white' : 'var(--color-surface-2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: isActive ? 'var(--color-wallet)' : '#94A3B8',
                                boxShadow: isActive ? '0 8px 15px rgba(245, 158, 11, 0.2)' : 'none',
                                transition: 'all 0.3s',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {isActive ? (
                                    <div style={{ fontSize: 28, fontWeight: 900 }}>{slot.data?.occupant_name?.charAt(0)}</div>
                                ) : (
                                    <UserPlus size={32} opacity={isPlacing ? 1 : 0.3} style={{ color: isPlacing ? 'var(--color-wallet)' : 'inherit' }} />
                                )}

                                {!isActive && isPlacing && (
                                    <motion.div
                                        animate={{ opacity: [0.2, 0.6, 0.2] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        style={{ position: 'absolute', inset: 0, background: 'var(--color-wallet)' }}
                                    />
                                )}
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <p style={{
                                    fontSize: 13,
                                    fontWeight: 800,
                                    color: isActive ? 'var(--color-navy)' : 'var(--color-text-muted)',
                                    margin: 0
                                }}>
                                    {isActive ? slot.data?.occupant_name : (isPlacing && hoveredSlot === slot.pos ? '¡UBICAR!' : `Puesto ${slot.pos}`)}
                                </p>
                                <p style={{ fontSize: 10, fontWeight: 700, color: color, textTransform: 'uppercase', margin: '2px 0 0 0' }}>
                                    {isActive ? 'Miembro' : (isPlacing ? 'Disponible' : 'Vacío')}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div style={{
                marginTop: 32,
                padding: 16,
                background: 'var(--color-surface-2)',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12
            }}>
                <Award size={20} style={{ color: 'var(--color-wallet)' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>
                    Al completar los 4 puestos, ¡saltas automáticamente al siguiente nivel!
                </span>
            </div>
        </div>
    );
}
