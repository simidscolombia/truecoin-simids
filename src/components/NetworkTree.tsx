'use client';

import { motion } from 'framer-motion';
import { User, Users, Shield, Star, Award, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

interface NetworkTreeProps {
    userId: string;
    mentor?: { full_name: string, email: string } | null;
}

export default function NetworkTree({ userId, mentor }: NetworkTreeProps) {
    const [network, setNetwork] = useState<{ l1: any[], l2: any[], l3: any[], l4: any[] }>({ l1: [], l2: [], l3: [], l4: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNetwork = async () => {
            try {
                const data = await userService.getNetworkDetailed(userId);
                setNetwork(data);
            } catch (error) {
                console.error("Error fetching network:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNetwork();
    }, [userId]);

    const LevelCard = ({ title, count, icon, color, items }: any) => (
        <div style={{ marginBottom: 24 }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
                padding: '0 8px'
            }}>
                <div style={{
                    width: 32, height: 32, borderRadius: 8, background: color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                }}>
                    {icon}
                </div>
                <div>
                    <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-navy)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {title}
                    </h3>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        {count} conexiones activas
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.length === 0 ? (
                    <div style={{
                        padding: '16px', borderRadius: 16, border: '1px dashed var(--color-border)',
                        textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 12
                    }}>
                        Buscando nuevas conexiones...
                    </div>
                ) : (
                    items.slice(0, 5).map((item: any) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                padding: '12px 16px', borderRadius: 16, background: 'white',
                                border: '1px solid var(--color-border)', display: 'flex',
                                alignItems: 'center', justifyContent: 'space-between',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: '50%', background: 'var(--color-surface-2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)'
                                }}>
                                    <User size={18} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>{item.full_name}</p>
                                    <p style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Nodo Activo</p>
                                </div>
                            </div>
                            <div style={{ color: color, opacity: 0.5 }}>
                                <Zap size={14} />
                            </div>
                        </motion.div>
                    ))
                )}
                {items.length > 5 && (
                    <p style={{ fontSize: 11, textAlign: 'center', color: 'var(--color-wallet)', fontWeight: 700, cursor: 'pointer' }}>
                        + Ver {items.length - 5} más
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <div className="card-lg" style={{ padding: '32px 28px', background: 'var(--color-bg)' }}>
            <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--color-navy)', marginBottom: 8 }}>
                    Ecosistema de Red
                </h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    Gestiona tu árbol genealógico tecnológico hasta el 4to nivel de profundidad.
                </p>
            </div>

            {/* Mentor Section */}
            {mentor && (
                <div style={{
                    marginBottom: 40, padding: '16px 20px', borderRadius: 20,
                    background: 'linear-gradient(90deg, var(--color-navy), #1e293b)',
                    color: 'white', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
                        <Shield size={80} />
                    </div>
                    <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: 8 }}>
                        Mi Mentor (Guía)
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Star size={20} fill="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: 15, fontWeight: 800 }}>{mentor.full_name}</p>
                            <p style={{ fontSize: 11, opacity: 0.8 }}>Conexión Superior Activa</p>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Escaneando nodos de red...</p>
                </div>
            ) : (
                <div style={{ position: 'relative' }}>
                    {/* Línea vertical conectora */}
                    <div style={{
                        position: 'absolute', left: 23, top: 40, bottom: 40,
                        width: 2, background: 'linear-gradient(to bottom, var(--color-border), transparent)',
                        zIndex: 0
                    }}></div>

                    <LevelCard
                        title="Nivel 1 (Directos)"
                        count={network.l1.length}
                        icon={<Award size={18} />}
                        color="#F59E0B"
                        items={network.l1}
                    />
                    <LevelCard
                        title="Nivel 2"
                        count={network.l2.length}
                        icon={<Users size={18} />}
                        color="#3B82F6"
                        items={network.l2}
                    />
                    <LevelCard
                        title="Nivel 3"
                        count={network.l3.length}
                        icon={<Users size={18} />}
                        color="#6366F1"
                        items={network.l3}
                    />
                    <LevelCard
                        title="Nivel 4"
                        count={network.l4.length}
                        icon={<Shield size={18} />}
                        color="#94A3B8"
                        items={network.l4}
                    />
                </div>
            )}

            <div style={{
                marginTop: 20, padding: 16, borderRadius: 16, background: 'var(--color-surface-2)',
                textAlign: 'center'
            }}>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    Capacidad Total de Red: <span style={{ color: 'var(--color-navy)', fontWeight: 800 }}>
                        {network.l1.length + network.l2.length + network.l3.length + network.l4.length} socios
                    </span>
                </p>
            </div>
        </div>
    );
}
