'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet, Users, Copy, Send, CheckCircle2, Award, Zap, Shield, UserPlus
} from 'lucide-react';
import GiftMatrix from './GiftMatrix';
import NetworkTree from './NetworkTree';
import TransferModal from './TransferModal';
import RechargeModal from './RechargeModal';
import { userService } from '../services/userService';
import { matrixService } from '../services/matrixService';

const RANKS = [
    "VIP BRONCE", "VIP PLATA", "VIP ORO",
    "PLATINO I", "PLATINO II", "PLATINO III",
    "ESMERALDA I", "ESMERALDA II", "ESMERALDA III",
    "ZAFIRO", "DIAMANTE", "SOY LEYENDA"
];

function StatCard({ label, value, unit, icon, color }: { label: string; value: string; unit?: string; icon: React.ReactNode; color: string; }) {
    return (
        <div style={{
            background: 'white',
            borderRadius: 20,
            padding: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 16
        }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 20, fontWeight: 900, color: 'var(--color-navy)', margin: 0 }}>{value} <span style={{ fontSize: 12, fontWeight: 700 }}>{unit}</span></p>
            </div>
        </div>
    );
}

export default function Dashboard({ user, balance, onUpdateBalance }: { user: any; balance: string; onUpdateBalance?: (b: string) => void; }) {
    const [showTransfer, setShowTransfer] = useState(false);
    const [showRecharge, setShowRecharge] = useState(false);
    const [localBalance, setLocalBalance] = useState(balance);
    const [copied, setCopied] = useState(false);
    const [view, setView] = useState<'ascension' | 'network'>('ascension');
    const [stats, setStats] = useState<any>({ directReferrals: 0, currentLevel: 1, isVip: false });
    const [matrixSlots, setMatrixSlots] = useState<any[]>([]);
    const [selectedDetailUser, setSelectedDetailUser] = useState<any | null>(null);

    // Placement Logic
    const [showPlacementModal, setShowPlacementModal] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
    const [pendingReferrals, setPendingReferrals] = useState<any[]>([]);
    const [isPlacing, setIsPlacing] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchDashboardData();
        }
    }, [user?.id, stats.currentLevel]);

    const fetchDashboardData = async () => {
        try {
            const [s, m] = await Promise.all([
                userService.getDashboardStats(user.id),
                matrixService.getMatrixSlots(user.id, stats.currentLevel)
            ]);
            setStats(s);
            setMatrixSlots(m);

            // Also fetch pending referrals for placement
            const pending = await matrixService.getUnplacedReferrals(user.id);
            setPendingReferrals(pending);
        } catch (e) {
            console.error(e);
        }
    };

    const handlePlaceUser = async (occupantId: string) => {
        if (!selectedPosition || !user?.id) return;
        setIsPlacing(true);
        try {
            await matrixService.placeUser({
                matrixOwnerId: user.id,
                occupantId: occupantId,
                recruiterId: user.id,
                level: stats.currentLevel,
                position: selectedPosition
            });
            setShowPlacementModal(false);
            setSelectedPosition(null);
            await fetchDashboardData();
        } catch (e: any) {
            alert(e.message || "Error al ubicar socio");
        } finally {
            setIsPlacing(false);
        }
    };

    return (
        <div className="module-page animate-in" style={{ background: 'var(--color-surface-2)', minHeight: '100vh', paddingBottom: 60 }}>
            <TransferModal isOpen={showTransfer} onClose={() => setShowTransfer(false)} user={user} onSuccess={(amt: number) => {
                const nb = (Number(localBalance) - amt).toFixed(2);
                setLocalBalance(nb);
                onUpdateBalance?.(nb);
            }} />
            <RechargeModal isOpen={showRecharge} onClose={() => setShowRecharge(false)} user={user} onRechargeRequestSubmit={() => { }} />

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>

                <div style={{ padding: '40px 0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div>
                            <h1 style={{ fontSize: 28, fontWeight: 950, color: 'var(--color-navy)', margin: 0, letterSpacing: -0.5 }}>Hola, {user.fullName?.split(' ')[0]} 👋</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }}></div>
                                    IA SPILLOVER 3.6 ACTIVA
                                </div>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1px solid var(--color-border)',
                                    padding: '4px 12px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s'
                                }}
                                    onClick={() => { navigator.clipboard.writeText(user.referralCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-wallet)'}
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                                >
                                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Código:</span>
                                    <code style={{ fontSize: 13, fontWeight: 950, color: 'var(--color-wallet)', letterSpacing: 0.5 }}>{user.referralCode}</code>
                                    {copied ? <CheckCircle2 size={14} color="#10B981" /> : <Copy size={14} color="var(--color-navy)" />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => setShowRecharge(true)} className="btn btn-wallet btn-sm" style={{ padding: '10px 20px', borderRadius: 12, fontWeight: 900 }}><Zap size={16} /> Recargar</button>
                        <button onClick={() => setShowTransfer(true)} className="btn btn-outline btn-sm" style={{ padding: '10px 20px', borderRadius: 12, fontWeight: 900 }}><Send size={16} /> Enviar</button>
                    </div>
                </div>

                {/* 2. Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
                    <StatCard label="Mi Saldo" value={localBalance} unit="TC" icon={<Wallet size={20} />} color="var(--color-wallet)" />
                    <StatCard label="Equipo Directo" value={stats.directReferrals.toString()} unit="Socios" icon={<Users size={20} />} color="var(--color-cloud-blue)" />
                    <StatCard label="Nivel Actual" value={RANKS[(stats.currentLevel - 1) % 12]} icon={<Award size={20} />} color="var(--color-directorio)" />
                </div>

                {/* 3. Main Center - Tab Switching */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'rgba(0,0,0,0.05)', padding: 6, borderRadius: 16, width: 'fit-content' }}>
                        {['ascension', 'network'].map((v: any) => (
                            <button key={v} onClick={() => setView(v)} style={{
                                padding: '10px 24px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: 13,
                                background: view === v ? 'var(--color-navy)' : 'transparent',
                                color: view === v ? 'white' : 'var(--color-text-muted)',
                                transition: 'all 0.2s'
                            }}>
                                {v === 'ascension' ? 'NIVEL DE REGALOS' : 'MI RED'}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {view === 'ascension' ? (
                            <motion.div key="m" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <GiftMatrix
                                    currentLevel={stats.currentLevel}
                                    slots={matrixSlots}
                                    onSelectUser={(u: any) => setSelectedDetailUser(u)}
                                    isPlacing={pendingReferrals.length > 0}
                                    onSelectPosition={(pos) => {
                                        setSelectedPosition(pos);
                                        setShowPlacementModal(true);
                                    }}
                                />
                            </motion.div>
                        ) : (
                            <motion.div key="n" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <div className="card" style={{ padding: 40, border: '1px solid var(--color-border)', borderRadius: 24 }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 950, color: 'var(--color-navy)', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <Users size={24} color="var(--color-wallet)" />
                                        Genealogía de Red 12 Niveles
                                    </h3>
                                    <NetworkTree userId={user.id} mentor={stats.mentor} onSelectUser={(u: any) => setSelectedDetailUser(u)} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 4. Modals */}
                <AnimatePresence>
                    {/* User Detail Modal */}
                    {selectedDetailUser && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setSelectedDetailUser(null)}
                                style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)' }}
                            />
                            <motion.div
                                initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                style={{
                                    width: '100%', maxWidth: 440, background: 'white', borderRadius: 32, overflow: 'hidden', position: 'relative',
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.2)', border: '1px solid var(--color-border)'
                                }}
                            >
                                <div style={{ height: 120, background: 'linear-gradient(135deg, var(--color-navy) 0%, #334155 100%)', position: 'relative' }}>
                                    <button onClick={() => setSelectedDetailUser(null)} style={{ position: 'absolute', right: 20, top: 20, background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✕</button>
                                    <div style={{ position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)', width: 100, height: 100, borderRadius: '50%', border: '5px solid white', background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                                        <Users size={48} color="var(--color-navy)" />
                                    </div>
                                </div>
                                <div style={{ paddingTop: 60, paddingBottom: 40, paddingLeft: 40, paddingRight: 40, textAlign: 'center' }}>
                                    <h3 style={{ fontSize: 22, fontWeight: 950, color: 'var(--color-navy)', margin: '0 0 4px 0' }}>{selectedDetailUser.full_name}</h3>
                                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-wallet)', textTransform: 'uppercase', letterSpacing: 1 }}>{RANKS[(selectedDetailUser.current_level || 1) - 1]}</span>

                                    <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(30, 41, 59, 0.03)', borderRadius: 16, border: '1px dashed var(--color-border)', textAlign: 'left' }}>
                                        <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Referido por:</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--color-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900 }}>
                                                {selectedDetailUser.recruiter_name?.charAt(0) || 'S'}
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 13, fontWeight: 900, color: 'var(--color-navy)', margin: 0 }}>{selectedDetailUser.recruiter_name || 'Sistema / IA'}</p>
                                                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-wallet)', margin: 0 }}>Cód: {selectedDetailUser.recruiter_code || 'SB-AUTO'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24, textAlign: 'left' }}>
                                        <div style={{ padding: 16, background: 'var(--color-surface-2)', borderRadius: 20 }}>
                                            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>ID SOCIO</p>
                                            <p style={{ fontSize: 14, fontWeight: 900, color: 'var(--color-navy)', margin: 0 }}>#{selectedDetailUser.id.substring(0, 8)}</p>
                                        </div>
                                        <div style={{ padding: 16, background: 'var(--color-surface-2)', borderRadius: 20 }}>
                                            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>ENERGÍA / NIVEL</p>
                                            <p style={{ fontSize: 14, fontWeight: 900, color: 'var(--color-wallet)', margin: 0 }}>{((selectedDetailUser.current_level || 1) * 100).toLocaleString()} <span style={{ fontSize: 10 }}>PUNTOS</span></p>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 24, padding: 20, background: 'var(--color-surface-2)', borderRadius: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
                                            <Shield size={20} color="var(--color-wallet)" />
                                        </div>
                                        <div style={{ textAlign: 'left' }}>
                                            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-text-muted)', margin: 0 }}>ESTADO DEL SOCIO</p>
                                            <p style={{ fontSize: 13, fontWeight: 900, color: 'var(--color-navy)', margin: 0 }}>Nodo Activo y Proyectando</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedDetailUser(null)}
                                        style={{ marginTop: 32, width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: 'var(--color-navy)', color: 'white', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s' }}
                                    >CERRAR FICHA</button>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Placement Selection Modal */}
                    {showPlacementModal && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => !isPlacing && setShowPlacementModal(false)}
                                style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)' }}
                            />
                            <motion.div
                                initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                style={{
                                    width: '100%', maxWidth: 440, background: 'white', borderRadius: 32, overflow: 'hidden', position: 'relative',
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.2)', border: '1px solid var(--color-border)'
                                }}
                            >
                                <div style={{ padding: '32px 32px 24px' }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 950, color: 'var(--color-navy)', marginBottom: 8 }}>Ubicar Socio Directo</h3>
                                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 }}>Selecciona un socio de tu lista de espera para ubicarlo en la posición {selectedPosition}.</p>
                                </div>
                                <div style={{ maxHeight: 350, overflowY: 'auto', padding: '0 32px 32px' }}>
                                    {pendingReferrals.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            {pendingReferrals.map(ref => (
                                                <button
                                                    key={ref.id}
                                                    disabled={isPlacing}
                                                    onClick={() => handlePlaceUser(ref.id)}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 20,
                                                        background: '#F8FAFC', border: '1px solid var(--color-border)', cursor: 'pointer',
                                                        transition: 'all 0.2s', width: '100%', textAlign: 'left',
                                                        opacity: isPlacing ? 0.6 : 1
                                                    }}
                                                >
                                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>
                                                        {ref.full_name?.charAt(0)}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontSize: 15, fontWeight: 900, color: 'var(--color-navy)', margin: 0 }}>{ref.full_name}</p>
                                                        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-wallet)', margin: 0 }}>{ref.email}</p>
                                                    </div>
                                                    <UserPlus size={18} color="var(--color-wallet)" />
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-muted)' }}>No tienes socios directos pendientes de ubicar.</p>
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: 24, borderTop: '1px solid #F1F5F9', textAlign: 'right' }}>
                                    <button
                                        onClick={() => setShowPlacementModal(false)}
                                        disabled={isPlacing}
                                        style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontWeight: 800, cursor: 'pointer', padding: '8px 16px' }}
                                    >CANCELAR</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
