'use client';

import { motion } from 'framer-motion';
import { User, Users, Shield, Star, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

interface NetworkTreeProps {
    userId: string;
    mentor?: { full_name: string, email: string } | null;
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

export default function NetworkTree({ userId, mentor }: NetworkTreeProps) {
    const [network, setNetwork] = useState<{ l1: any[], l2: any[], l3: any[], l4: any[] }>({ l1: [], l2: [], l3: [], l4: [] });
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<'sponsorship' | 'placement'>('placement');

    useEffect(() => {
        const fetchNetwork = async () => {
            setLoading(true);
            try {
                const data = mode === 'sponsorship'
                    ? await userService.getNetworkDetailed(userId)
                    : await userService.getPlacementNetwork(userId);
                setNetwork(data);
            } catch (error) {
                console.error("Error fetching network:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNetwork();
    }, [userId, mode]);

    const ProgressDots = ({ count }: { count: number }) => (
        <div style={{ display: 'flex', gap: 3 }}>
            {[1, 2, 3, 4].map(idx => (
                <div key={idx} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: idx <= count ? 'var(--color-wallet)' : 'var(--color-border)',
                    boxShadow: idx <= count ? '0 0 8px var(--color-wallet)' : 'none'
                }} />
            ))}
        </div>
    );

    const LevelCard = ({ title, count, icon, color, items, levelNum }: any) => {
        // Calculate theoretical energy: each member contributes based on their value
        const totalEnergyValue = items.reduce((acc: number, item: any) => acc + (LEVEL_VALUES[item.current_level || 1] || 50), 0);

        return (
            <div style={{ marginBottom: 32, position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
                    padding: '0 8px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 12, background: color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                            boxShadow: `0 8px 16px color-mix(in srgb, ${color} 25%, transparent)`
                        }}>
                            {icon}
                        </div>
                        <div>
                            <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-navy)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {title}
                            </h3>
                            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>
                                {count} / {Math.pow(4, levelNum)} Nodos Ocupados
                            </p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Energía de Nivel</p>
                        <p style={{ fontSize: 14, fontWeight: 900, color: 'var(--color-navy)' }}>
                            {totalEnergyValue.toLocaleString()} <span style={{ fontSize: 10, opacity: 0.5 }}>TC</span>
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {items.length === 0 ? (
                        <div style={{
                            padding: '24px', borderRadius: 20, border: '1px dashed var(--color-border)',
                            background: 'rgba(255,255,255,0.3)',
                            textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13
                        }}>
                            <Users size={24} style={{ opacity: 0.2, marginBottom: 8 }} />
                            <p>Esperando la expansión del ecosistema...</p>
                        </div>
                    ) : (
                        items.slice(0, 10).map((item: any) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.01, boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}
                                style={{
                                    padding: '14px 20px', borderRadius: 20, background: 'white',
                                    border: '1px solid var(--color-border)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'space-between',
                                    transition: 'all 0.2s',
                                    cursor: 'default'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{
                                        width: 42, height: 42, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--color-surface-2), #f1f5f9)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-navy)',
                                        border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                    }}>
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-navy)' }}>{item.full_name}</p>
                                            <span style={{
                                                fontSize: 9, fontWeight: 800, background: 'var(--color-surface-2)',
                                                color: 'var(--color-text-muted)', padding: '2px 6px', borderRadius: 5,
                                                border: '1px solid var(--color-border)'
                                            }}>
                                                {RANKS[(item.current_level - 1) % 12]}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                            <ProgressDots count={item.referralCount || 0} />
                                            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)' }}>
                                                {item.referralCount || 0}/4 Socios
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: 12, fontWeight: 900, color: color }}>
                                        {LEVEL_VALUES[item.current_level || 1]} <span style={{ fontSize: 9, opacity: 0.6 }}>TC</span>
                                    </p>
                                    <p style={{ fontSize: 9, color: 'var(--color-text-muted)', fontWeight: 600 }}>Nodo Activo</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                    {items.length > 10 && (
                        <button style={{
                            padding: '10px', width: '100%', borderRadius: 12, border: 'none',
                            background: 'var(--color-surface-2)', color: 'var(--color-navy)',
                            fontSize: 12, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                            onMouseOver={(e) => (e.currentTarget.style.background = 'var(--color-border)')}
                            onMouseOut={(e) => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                        >
                            Ver todos los {items.length} socios de este nivel
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="card-lg" style={{
            padding: '40px 32px',
            background: 'var(--color-bg)',
            minHeight: 600
        }}>
            <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--color-wallet)' }}></div>
                        <h2 style={{ fontSize: 24, fontWeight: 950, color: 'var(--color-navy)', letterSpacing: -0.5 }}>
                            Ecosistema de Red
                        </h2>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: 600 }}>
                        {mode === 'placement'
                            ? "Visualiza la estructura real de posicionamiento (IA) en la matriz 1x4."
                            : "Supervisa la expansión de tus referidos directos y su genealogía."}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 8, background: 'var(--color-surface-2)', padding: 6, borderRadius: 14 }}>
                    <button
                        onClick={() => setMode('placement')}
                        style={{
                            padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                            fontSize: 12, fontWeight: 800, transition: 'all 0.2s',
                            background: mode === 'placement' ? 'white' : 'transparent',
                            color: mode === 'placement' ? 'var(--color-navy)' : 'var(--color-text-muted)',
                            boxShadow: mode === 'placement' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                        }}>Estructura IA</button>
                    <button
                        onClick={() => setMode('sponsorship')}
                        style={{
                            padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                            fontSize: 12, fontWeight: 800, transition: 'all 0.2s',
                            background: mode === 'sponsorship' ? 'white' : 'transparent',
                            color: mode === 'sponsorship' ? 'var(--color-navy)' : 'var(--color-text-muted)',
                            boxShadow: mode === 'sponsorship' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                        }}>Mis Directos</button>
                </div>
            </div>

            {/* Mentor Section (Card Premium) */}
            {mentor && (
                <div style={{
                    marginBottom: 48, padding: '24px', borderRadius: 24,
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    color: 'white', position: 'relative', overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        position: 'absolute', right: -20, top: -20, opacity: 0.05,
                        transform: 'rotate(15deg)'
                    }}>
                        <Shield size={140} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 18,
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                            <Star size={28} fill="#F59E0B" color="#F59E0B" />
                        </div>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94A3B8', marginBottom: 4 }}>
                                Líder Superior (Mentor)
                            </p>
                            <h3 style={{ fontSize: 18, fontWeight: 900 }}>{mentor.full_name}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }}></div>
                                <p style={{ fontSize: 11, opacity: 0.7, fontWeight: 600 }}>Conectado al Nodo Maestro</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        style={{ width: 40, height: 40, border: '4px solid var(--color-surface-2)', borderTopColor: 'var(--color-wallet)', borderRadius: '50%', margin: '0 auto 20px' }}
                    />
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 15, fontWeight: 600 }}>Sincronizando registros de red...</p>
                </div>
            ) : (
                <div style={{ position: 'relative' }}>
                    {/* Línea vertical conectora mejorada */}
                    <div style={{
                        position: 'absolute', left: 25, top: 40, bottom: 40,
                        width: 3, background: 'linear-gradient(to bottom, var(--color-border), transparent)',
                        zIndex: 0, opacity: 0.5
                    }}></div>

                    <LevelCard
                        title="Nivel 1"
                        count={network.l1.length}
                        icon={<Award size={20} />}
                        color="#F59E0B"
                        items={network.l1}
                        levelNum={1}
                    />
                    <LevelCard
                        title="Nivel 2"
                        count={network.l2.length}
                        icon={<Users size={20} />}
                        color="#3B82F6"
                        items={network.l2}
                        levelNum={2}
                    />
                    <LevelCard
                        title="Nivel 3"
                        count={network.l3.length}
                        icon={<Users size={20} />}
                        color="#6366F1"
                        items={network.l3}
                        levelNum={3}
                    />
                    <LevelCard
                        title="Nivel 4"
                        count={network.l4.length}
                        icon={<Shield size={20} />}
                        color="#94A3B8"
                        items={network.l4}
                        levelNum={4}
                    />
                </div>
            )}

            <div style={{
                marginTop: 40, padding: '24px', borderRadius: 24,
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(10px)',
                border: '1px solid white',
                textAlign: 'center'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
                    <div>
                        <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Capacidad Total</p>
                        <p style={{ fontSize: 20, fontWeight: 950, color: 'var(--color-navy)' }}>
                            {network.l1.length + network.l2.length + network.l3.length + network.l4.length} <span style={{ fontSize: 12, opacity: 0.5 }}>SOCIOS</span>
                        </p>
                    </div>
                    <div style={{ width: 1, background: 'var(--color-border)' }}></div>
                    <div>
                        <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Valor en Red</p>
                        <p style={{ fontSize: 20, fontWeight: 950, color: 'var(--color-wallet)' }}>
                            {[...network.l1, ...network.l2, ...network.l3, ...network.l4].reduce((acc, i) => acc + (LEVEL_VALUES[i.current_level || 1] || 50), 0).toLocaleString()} <span style={{ fontSize: 12, opacity: 0.5 }}>TC</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
