'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Trophy, MessageSquare, Heart, ShieldCheck,
    Award, Send
} from 'lucide-react';

interface Shout {
    id: string;
    user: string;
    content: string;
    type: 'achievement' | 'message';
    time: string;
    rank?: string;
}

export default function ShopyFam({ user }: { user: any }) {
    const [activeTab, setActiveTab] = useState<'wall' | 'group'>('wall');
    const [shouts, setShouts] = useState<Shout[]>([
        { id: '1', user: 'Ana M.', content: '¡Acaba de alcanzar el rango PLATA II! 🚀', type: 'achievement', time: 'hace 2 min', rank: 'VIP PLATA' },
        { id: '2', user: 'Carlos R.', content: 'Bienvenido al equipo Juan, ¡vamos por ese nivel 2!', type: 'message', time: 'hace 5 min' },
        { id: '3', user: 'Laura G.', content: '¡Ciclo infinito activado! Recibiendo premios nivel 12 💎', type: 'achievement', time: 'hace 10 min', rank: 'DIAMANTE' },
        { id: '4', user: 'Sistemas', content: 'Nuevo récord: 150 miembros alcanzaron el bono Pionero Veloz esta semana.', type: 'message', time: 'hace 15 min' }
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (!newMessage.trim()) return;
        const shout: Shout = {
            id: Date.now().toString(),
            user: user?.fullName.split(' ')[0] || 'Tú',
            content: newMessage,
            type: 'message',
            time: 'ahora'
        };
        setShouts([shout, ...shouts]);
        setNewMessage('');
    };

    return (
        <div className="module-container">
            {/* Legend Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 8 }}>
                    Shopy<span style={{ color: 'var(--color-wallet)' }}>Fam</span> 🚀
                </h1>
                <p style={{ fontSize: 16, color: 'var(--color-text-muted)' }}>
                    La red social exclusiva de los pioneros de ShopyBrands.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

                {/* Main Content Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: 8, background: 'var(--color-surface-2)', padding: 6, borderRadius: 14, alignSelf: 'flex-start' }}>
                        <button
                            onClick={() => setActiveTab('wall')}
                            style={{
                                padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                                fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
                                background: activeTab === 'wall' ? 'white' : 'transparent',
                                color: activeTab === 'wall' ? 'var(--color-navy)' : 'var(--color-text-muted)',
                                boxShadow: activeTab === 'wall' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                            }}>
                            <Trophy size={16} style={{ marginBottom: -3, marginRight: 6 }} /> Muro de la Fama
                        </button>
                        <button
                            onClick={() => setActiveTab('group')}
                            style={{
                                padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                                fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
                                background: activeTab === 'group' ? 'white' : 'transparent',
                                color: activeTab === 'group' ? 'var(--color-navy)' : 'var(--color-text-muted)',
                                boxShadow: activeTab === 'group' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                            }}>
                            <Users size={16} style={{ marginBottom: -3, marginRight: 6 }} /> Mi Bloque (4)
                        </button>
                    </div>

                    {/* Feed Area */}
                    <div className="card-lg" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 600 }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-navy)' }}>
                                {activeTab === 'wall' ? 'Logros Recientes Globales' : 'Conversación de Equipo'}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%' }}></div>
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#10b981' }}>{activeTab === 'wall' ? '1,240 activos' : '4 activos'}</span>
                            </div>
                        </div>

                        <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <AnimatePresence initial={false}>
                                {shouts.filter(s => activeTab === 'wall' || (activeTab === 'group' && s.type === 'message')).map((shout) => (
                                    <motion.div
                                        key={shout.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        layout
                                        style={{
                                            padding: 16, borderRadius: 16,
                                            background: shout.type === 'achievement' ? 'color-mix(in srgb, var(--color-wallet) 5%, white)' : 'var(--color-surface-2)',
                                            border: shout.type === 'achievement' ? '1px solid color-mix(in srgb, var(--color-wallet) 15%, white)' : '1px solid var(--color-border)',
                                        }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>
                                                    {shout.user.charAt(0)}
                                                </div>
                                                <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--color-navy)' }}>{shout.user}</span>
                                                {shout.rank && (
                                                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'var(--color-wallet)', color: 'white' }}>
                                                        {shout.rank}
                                                    </span>
                                                )}
                                            </div>
                                            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{shout.time}</span>
                                        </div>
                                        <p style={{ fontSize: 14, color: 'var(--color-navy)', lineHeight: 1.5 }}>{shout.content}</p>
                                        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                                            <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-muted)', fontSize: 12, cursor: 'pointer' }}>
                                                <Heart size={14} /> 12
                                            </button>
                                            <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-muted)', fontSize: 12, cursor: 'pointer' }}>
                                                <MessageSquare size={14} /> Responder
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: 20, background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <input
                                    type="text"
                                    placeholder={activeTab === 'wall' ? "Felicita a la comunidad..." : "Escribe a tu equipo..."}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    className="input"
                                    style={{ flex: 1 }}
                                />
                                <button onClick={handleSend} className="btn btn-navy" style={{ padding: '0 20px' }}>
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                    {/* Leaderboard Card */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <Award style={{ color: 'var(--color-wallet)' }} />
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-navy)' }}>Top Líderes</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[
                                { name: 'Marta Soler', points: '4,250', rank: 'LEYENDA' },
                                { name: 'Kevin J.', points: '3,890', rank: 'DIAMANTE' },
                                { name: 'Sonia V.', points: '2,100', rank: 'ESMERALDA' }
                            ].map((leader, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-text-muted)', width: 14 }}>{i + 1}</div>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--color-navy)' }}>{leader.name[0]}</div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>{leader.name}</p>
                                        <p style={{ fontSize: 11, color: 'var(--color-wallet)', fontWeight: 700 }}>{leader.rank}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-navy)' }}>{leader.points}</p>
                                        <p style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>TC Ganhados</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-outline btn-full" style={{ marginTop: 24, padding: '10px' }}> Ver Ranking Completo </button>
                    </div>

                    {/* Team Health Card */}
                    <div className="card" style={{ padding: 24, background: 'var(--color-navy)', color: 'white', border: 'none' }}>
                        <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ShieldCheck size={18} /> Salud de tu Bloque
                        </h4>
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8, opacity: 0.8 }}>
                                <span>Progreso Grupal</span>
                                <span>75%</span>
                            </div>
                            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} style={{ height: '100%', background: 'var(--color-cloud-blue)' }} />
                            </div>
                        </div>
                        <p style={{ fontSize: 12, lineHeight: 1.6, opacity: 0.8 }}>
                            Tu bloque está a solo 1 referido de alcanzar el <strong>Rango Plata</strong> grupal. ¡Motívalos!
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
