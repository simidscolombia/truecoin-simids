'use client';

import { motion } from 'framer-motion';
import { UserPlus, Star, Zap, Award, ChevronRight } from 'lucide-react';

interface GiftMatrixProps {
    currentLevel?: number;
    referrals?: number;
}

const RANKS = [
    "VIP BRONCE", "VIP PLATA", "VIP ORO",
    "PLATINO I", "PLATINO II", "PLATINO III",
    "ESMERALDA I", "ESMERALDA II", "ESMERALDA III",
    "ZAFIRO", "DIAMANTE", "LEYENDA SIMID"
];

const LEVEL_VALUES: Record<number, number> = {
    1: 50, 2: 100, 3: 200, 4: 400, 5: 800,
    6: 1600, 7: 3200, 8: 6400, 9: 12800,
    10: 25600, 11: 51200, 12: 102400,
};

export default function GiftMatrix({ currentLevel = 1, referrals = 0 }: GiftMatrixProps) {
    const slots = [1, 2, 3, 4];
    const investment = LEVEL_VALUES[currentLevel] || 50;
    const progress = (referrals / 4) * 100;

    return (
        <div className="card-lg" style={{ padding: 28 }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: 'var(--color-wallet)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 18,
                    }}>
                        {currentLevel}
                    </div>
                    <div>
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 2 }}>
                            {RANKS[(currentLevel - 1) % 12]}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{
                                width: 10, height: 10, borderRadius: '50%',
                                background: referrals >= 3 ? '#20c997' : referrals >= 1 ? '#fab005' : '#fa5252',
                                border: '2px solid white', boxShadow: '0 0 0 1px #eee'
                            }}></div>
                            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                                {referrals >= 3 ? 'Pulsación Óptima' : referrals >= 1 ? 'Ritmo Moderado' : 'Sin Actividad'}
                            </p>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 2 }}>
                        Tu Recompensa
                    </p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-wallet)' }}>
                        {investment.toLocaleString()} <span style={{ fontSize: 12, opacity: 0.7 }}>TC</span>
                    </p>
                </div>
            </div>

            {/* Slots Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                {slots.map((slot) => {
                    const isActive = slot <= referrals;
                    return (
                        <motion.div
                            key={slot}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: slot * 0.08 }}
                            style={{
                                aspectRatio: '1',
                                borderRadius: 16,
                                border: `2px ${isActive ? 'solid' : 'dashed'} ${isActive ? 'var(--color-wallet)' : 'var(--color-border-strong)'}`,
                                background: isActive ? 'color-mix(in srgb, var(--color-wallet) 8%, white)' : 'var(--color-surface-2)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                transition: 'all 0.2s',
                                position: 'relative',
                            }}
                        >
                            {isActive ? (
                                <>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-wallet)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Star size={16} color="white" fill="white" />
                                    </div>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-wallet)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        Ref {slot}
                                    </span>
                                    <div style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, background: '#16A34A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                                        <Zap size={10} color="white" fill="white" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px dashed var(--color-border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <UserPlus size={16} color="var(--color-border-strong)" />
                                    </div>
                                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                                        Libre
                                    </span>
                                </>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Progreso Nivel {currentLevel}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-wallet)' }}>
                        {referrals}/4 completados
                    </span>
                </div>
                <div style={{ height: 8, background: 'var(--color-surface-2)', borderRadius: 999, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{ height: '100%', background: 'var(--color-wallet)', borderRadius: 999 }}
                    />
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                        Entrada al Ciclo
                    </p>
                    <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--color-navy)' }}>
                        {(investment * 4).toLocaleString()} <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)' }}>TC</span>
                    </p>
                </div>
                <div style={{ padding: '12px 14px', borderRadius: 12, background: 'color-mix(in srgb, var(--color-wallet) 8%, white)', border: '1px solid color-mix(in srgb, var(--color-wallet) 20%, white)' }}>
                    <p style={{ fontSize: 11, color: 'var(--color-wallet)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                        Salto al Nivel {currentLevel + 1}
                    </p>
                    <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--color-wallet)' }}>
                        {(investment * 2).toLocaleString()} <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.7 }}>TC</span>
                    </p>
                </div>
            </div>

            {/* Info Banner */}
            <div style={{
                padding: '12px 14px', borderRadius: 12,
                background: 'color-mix(in srgb, var(--color-cloud-blue) 8%, white)',
                border: '1px solid color-mix(in srgb, var(--color-cloud-blue) 20%, white)',
                display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
                <Award size={16} style={{ color: 'var(--color-cloud-blue)', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: 'var(--color-cloud-blue)', lineHeight: 1.6 }}>
                    Al completar este nivel se distribuirán <strong>{investment.toLocaleString()} TC</strong> para la empresa y{' '}
                    <strong>{investment.toLocaleString()} TC</strong> directos a tu saldo disponible.
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontWeight: 700, fontSize: 11 }}>
                        <ChevronRight size={12} /> Completa 4 referidos para avanzar
                    </span>
                </p>
            </div>
        </div>
    );
}
