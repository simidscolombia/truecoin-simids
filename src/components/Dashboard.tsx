'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet, Users, Copy, Send, CheckCircle2, Award, Zap
} from 'lucide-react';
import GiftMatrix from './GiftMatrix';
import NetworkTree from './NetworkTree';
import TransferModal from './TransferModal';
import RechargeModal from './RechargeModal';
import { userService } from '../services/userService';
import { matrixService } from '../services/matrixService';
import WaitingRoom from './WaitingRoom';

const RANKS = [
    "VIP BRONCE", "VIP COBRE", "VIP PLATA", "VIP ORO",
    "PLATINO", "ZAFIRO", "ESMERALDA",
    "DIAMANTE", "DIAMANTE AZUL", "CORONA",
    "EMBAJADOR", "EMBAJADOR REAL", "LEYENDA"
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

export default function Dashboard({ user, balance }: { user: any; balance: string; onUpdateBalance?: (b: string) => void; }) {
    const [showTransfer, setShowTransfer] = useState(false);
    const [showRecharge, setShowRecharge] = useState(false);
    const [localBalance, setLocalBalance] = useState(balance);
    const [copied, setCopied] = useState(false);
    const [view, setView] = useState<'ascension' | 'network'>('ascension');
    const [stats, setStats] = useState<any>({ directReferrals: 0, currentLevel: 1, isVip: false });
    const [pendingReferrals, setPendingReferrals] = useState<any[]>([]);
    const [isPlacing, setIsPlacing] = useState(false);
    const [matrixSlots, setMatrixSlots] = useState<any[]>([]);
    const [selectedUserToPlace, setSelectedUserToPlace] = useState<any | null>(null);

    useEffect(() => {
        if (user?.id) {
            fetchDashboardData();
        }
    }, [user?.id, stats.currentLevel]);

    const fetchDashboardData = async () => {
        try {
            const [s, p, m] = await Promise.all([
                userService.getDashboardStats(user.id),
                matrixService.getUnplacedReferrals(user.id),
                matrixService.getMatrixSlots(user.id, stats.currentLevel)
            ]);
            setStats(s);
            setPendingReferrals(p);
            setMatrixSlots(m);
        } catch (e) {
            console.error(e);
        }
    };

    const handlePlaceUser = async (userId: string, position: number) => {
        if (!user.id) return;
        setIsPlacing(true);
        try {
            await matrixService.placeUser({
                matrixOwnerId: user.id,
                occupantId: userId,
                recruiterId: user.id,
                level: stats.currentLevel,
                position
            });
            setSelectedUserToPlace(null);
            await fetchDashboardData();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsPlacing(false);
        }
    };

    return (
        <div className="module-page animate-in" style={{ background: 'var(--color-surface-2)', minHeight: '100vh', paddingBottom: 60 }}>
            <TransferModal isOpen={showTransfer} onClose={() => setShowTransfer(false)} user={user} onSuccess={(amt: number) => setLocalBalance((prev) => (Number(prev) - amt).toFixed(2))} />
            <RechargeModal isOpen={showRecharge} onClose={() => setShowRecharge(false)} user={user} onRechargeRequestSubmit={() => { }} />

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>

                {/* 1. Header Row */}
                <div style={{ padding: '40px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--color-navy)', margin: 0 }}>Hola, {user.fullName?.split(' ')[0]} 👋</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Bienvenido a tu Centro de Control VIP</p>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => setShowRecharge(true)} className="btn btn-wallet btn-sm"><Zap size={16} /> Recargar</button>
                        <button onClick={() => setShowTransfer(true)} className="btn btn-outline btn-sm"><Send size={16} /> Enviar</button>
                    </div>
                </div>

                {/* 2. Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
                    <StatCard label="Mi Saldo" value={localBalance} unit="TC" icon={<Wallet size={20} />} color="var(--color-wallet)" />
                    <StatCard label="Equipo Directo" value={stats.directReferrals.toString()} unit="Socios" icon={<Users size={20} />} color="var(--color-cloud-blue)" />
                    <StatCard label="Nivel Actual" value={RANKS[(stats.currentLevel - 1) % 12]} icon={<Award size={20} />} color="var(--color-directorio)" />
                </div>

                {/* 3. Main Action Center (Flexible Flow) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'start', marginBottom: 32 }}>

                    {/* Left: Waiting Room */}
                    <div style={{ flex: '1 1 340px' }}>
                        <WaitingRoom
                            pendingUsers={pendingReferrals}
                            onPlace={userId => setSelectedUserToPlace(pendingReferrals.find(p => p.id === userId))}
                            selectedUserId={selectedUserToPlace?.id}
                            isPlacing={isPlacing}
                        />

                        {/* Referral Link Card */}
                        <div className="card" style={{ marginTop: 24, padding: 24 }}>
                            <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 12 }}>MI CÓDIGO DE INVITACIÓN</h4>
                            <div style={{ background: 'var(--color-surface-2)', padding: '12px 16px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--color-border)' }}>
                                <code style={{ fontWeight: 900, letterSpacing: 1, color: 'var(--color-wallet)' }}>{user.referralCode}</code>
                                <button onClick={() => { navigator.clipboard.writeText(user.referralCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-navy)' }}>
                                    {copied ? <CheckCircle2 size={16} color="var(--color-marketplace)" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: The Board / Matrix */}
                    <div style={{ flex: '2 1 600px', minWidth: '320px' }}>
                        {/* Tab Switcher */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'rgba(0,0,0,0.05)', padding: 6, borderRadius: 16, width: 'fit-content' }}>
                            {['ascension', 'network'].map((v: any) => (
                                <button key={v} onClick={() => setView(v)} style={{
                                    padding: '8px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12,
                                    background: view === v ? 'var(--color-navy)' : 'transparent',
                                    color: view === v ? 'white' : 'var(--color-text-muted)',
                                    transition: 'all 0.2s'
                                }}>
                                    {v === 'ascension' ? 'Mi Tablero 1x4' : 'Mi Árbol Completado'}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {view === 'ascension' ? (
                                <motion.div key="m" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                                    <GiftMatrix
                                        currentLevel={stats.currentLevel}
                                        slots={matrixSlots}
                                        isPlacing={!!selectedUserToPlace}
                                        onSelectPosition={(pos: number) => selectedUserToPlace && handlePlaceUser(selectedUserToPlace.id, pos)}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div key="n" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                                    <div className="card" style={{ padding: 32 }}>
                                        <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--color-navy)', marginBottom: 24 }}>Vista de Red Jerárquica</h3>
                                        <NetworkTree userId={user.id} mentor={stats.mentor} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

            </div>
        </div>
    );
}
