'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet, Users, Copy, Share2, ArrowUpRight,
    Clock, Send, CheckCircle2, Award, Zap
} from 'lucide-react';
import GiftMatrix from './GiftMatrix';
import NetworkTree from './NetworkTree';
import TransferModal from './TransferModal';
import RechargeModal from './RechargeModal';
import { userService } from '../services/userService';

const RANKS = [
    "VIP BRONCE", "VIP COBRE", "VIP PLATA", "VIP ORO",
    "PLATINO", "ZAFIRO", "ESMERALDA",
    "DIAMANTE", "DIAMANTE AZUL", "CORONA",
    "EMBAJADOR", "EMBAJADOR REAL", "LEYENDA"
];

function StatCard({
    label, value, unit, icon, color, sub,
}: {
    label: string; value: string; unit?: string; icon: React.ReactNode;
    color: string; sub?: string;
}) {
    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
            className="stat-card"
            style={{
                borderTop: `4px solid ${color}`,
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: `color-mix(in srgb, ${color} 10%, white)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color,
                }}>
                    {icon}
                </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--color-navy)', letterSpacing: -1 }}>
                {value}
                {unit && <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-muted)', marginLeft: 6 }}>{unit}</span>}
            </div>
            {sub && <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginTop: 8, opacity: 0.8 }}>{sub}</p>}
        </motion.div>
    );
}


export default function Dashboard({
    user,
    balance,
    onUpdateBalance
}: {
    user: { fullName: string; referralCode: string; id?: string };
    balance: string;
    onUpdateBalance: (balance: string) => void;
}) {
    const [showTransfer, setShowTransfer] = useState(false);
    const [showRecharge, setShowRecharge] = useState(false);
    const [localBalance, setLocalBalance] = useState(balance);
    const [copied, setCopied] = useState(false);
    const [view, setView] = useState<'ascension' | 'network'>('ascension');
    const [stats, setStats] = useState<{ directReferrals: number, currentLevel: number, isVip: boolean, mentor?: any }>({
        directReferrals: 0,
        currentLevel: 1,
        isVip: false,
        mentor: null
    });

    useEffect(() => {
        if (user?.id) {
            userService.getDashboardStats(user.id).then(setStats).catch(console.error);
        }
    }, [user?.id]);

    const copyReferral = () => {
        const link = `${window.location.origin}/?ref=${user.referralCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareToWhatsApp = () => {
        const link = `${window.location.origin}/?ref=${user.referralCode}`;
        const message = encodeURIComponent(`🚀 ¡Únete a ShopyBrands conmigo! \n\nAccede a precios de mayorista, gana puntos y sé parte del primer club VIP con IA. \n\nRegístrate aquí: ${link}`);
        window.open(`https://wa.me/?text=${message}`, '_blank');
    };

    const handleTransferSuccess = (amount: number) => {
        const newBal = (Number(localBalance) - amount).toFixed(2);
        setLocalBalance(newBal);
        onUpdateBalance(newBal);
    };

    const handleRechargeSuccess = (amount: number) => {
        const newBal = (Number(localBalance) + amount).toFixed(2);
        setLocalBalance(newBal);
        onUpdateBalance(newBal);
        alert(`¡Pago confirmado! Se han acreditado ${amount} TC a tu saldo.`);
    };

    return (
        <div className="module-page animate-in">
            <TransferModal
                isOpen={showTransfer}
                onClose={() => setShowTransfer(false)}
                user={user}
                onSuccess={handleTransferSuccess}
            />
            <RechargeModal
                isOpen={showRecharge}
                onClose={() => setShowRecharge(false)}
                user={user}
                onRechargeRequestSubmit={handleRechargeSuccess}
            />

            {/* Page Header */}
            <div className="module-page-header">
                <div>
                    <h1 style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 800, color: 'var(--color-navy)', marginBottom: 2 }}>
                        Hola, <span style={{ color: 'var(--color-cloud-blue)' }}>{user.fullName.split(' ')[0]}</span> 👋
                    </h1>
                    <p style={{ fontSize: 'clamp(12px, 3.5vw, 14px)', color: 'var(--color-text-muted)' }}>
                        Bienvenido a tu ecosistema ShopyBrands · {new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: 'var(--color-navy)', color: 'white', border: 'none' }}>
                        ⭐ VIP {stats.currentLevel === 1 ? 'BRONCE' : stats.currentLevel === 2 ? 'PLATA' : 'ORO'} (L{stats.currentLevel})
                    </span>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: '#e6fcf5',
                        padding: '4px 10px',
                        borderRadius: 20,
                        border: '1px solid #20c997'
                    }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#20c997' }}></div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#099268' }}>PIONERO VELOZ</span>
                    </div>
                </div>
            </div>

            <div className="module-page-content" style={{ maxWidth: 1200, margin: '0 auto' }}>

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                    <StatCard
                        label="Saldo Disponible"
                        value={localBalance}
                        unit="TC"
                        icon={<Wallet size={18} />}
                        color="var(--color-wallet)"
                        sub="1 TC = $1,000 COP"
                    />
                    <StatCard
                        label="En Espera (24h)"
                        value="0.00"
                        unit="TC"
                        icon={<Clock size={18} />}
                        color="var(--color-text-muted)"
                        sub="Sin transferencias pendientes"
                    />
                    <StatCard
                        label="Referidos Activos"
                        value={stats.directReferrals.toString()}
                        icon={<Users size={18} />}
                        color="var(--color-cloud-blue)"
                        sub={`Nivel ${stats.currentLevel} · ${stats.directReferrals}/4 cupos`}
                    />
                    <StatCard
                        label="Rango Actual"
                        value={stats.currentLevel === 1 ? 'VIP Bronce' : stats.currentLevel === 2 ? 'VIP Cobre' : 'VIP Plata'}
                        icon={<Award size={18} />}
                        color="var(--color-directorio)"
                        sub={`Siguiente: ${stats.currentLevel === 1 ? 'VIP Cobre' : stats.currentLevel === 2 ? 'VIP Plata' : 'VIP Oro'}`}
                    />
                </div>

                {/* Wallet + Referral */}
                <div className="dashboard-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 28 }}>

                    {/* Wallet Card */}
                    <div className="card-lg" style={{ padding: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)' }}>
                                <Wallet size={18} style={{ display: 'inline', marginRight: 8, color: 'var(--color-wallet)' }} />
                                Shopy Wallet
                            </h2>
                            <span className="badge badge-wallet">Activa</span>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                                Saldo Disponible
                            </p>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                                <span style={{ fontSize: 48, fontWeight: 800, color: 'var(--color-wallet)', letterSpacing: -2, lineHeight: 1 }}>
                                    {localBalance}
                                </span>
                                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-wallet)', opacity: 0.7 }}>TC</span>
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 6 }}>
                                ≈ ${(Number(localBalance) * 1000).toLocaleString('es-CO')} COP
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                className="btn btn-wallet"
                                style={{ flex: 1 }}
                                onClick={() => setShowRecharge(true)}
                            >
                                <ArrowUpRight size={16} /> Comprar TC
                            </button>
                            <button
                                className="btn btn-outline"
                                style={{ flex: 1 }}
                                onClick={() => setShowTransfer(true)}
                            >
                                <Send size={16} /> Enviar
                            </button>
                        </div>
                    </div>

                    {/* Referral Card */}
                    <div className="card-lg" style={{ padding: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)' }}>
                                <Users size={18} style={{ display: 'inline', marginRight: 8, color: 'var(--color-cloud-blue)' }} />
                                Tu Red
                            </h2>
                            <span className="badge badge-navy">
                                <Zap size={10} /> {RANKS[(stats.currentLevel - 1) % 12]}
                            </span>
                        </div>

                        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
                            Comparte tu código y acelera tu camino a <strong>VIP PLATA</strong>. Cada ciclo completo te otorga 25% en puntos y te impulsa al siguiente nivel.
                        </p>

                        {/* Referral Code */}
                        <div style={{
                            background: 'var(--color-bg)',
                            border: '1.5px dashed var(--color-border-strong)',
                            borderRadius: 12,
                            padding: '14px 18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 14,
                        }}>
                            <code style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-navy)', letterSpacing: 2 }}>
                                {user.referralCode}
                            </code>
                            <button
                                onClick={copyReferral}
                                className="btn btn-sm"
                                style={{ background: copied ? 'var(--color-marketplace)' : 'var(--color-navy)', color: 'white' }}
                            >
                                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                {copied ? 'Copiado' : 'Copiar'}
                            </button>
                        </div>

                        <button onClick={shareToWhatsApp} className="btn btn-outline btn-full">
                            <Share2 size={16} /> Compartir por WhatsApp
                        </button>
                    </div>

                </div>

                {/* View Toggle (Glassmorphism) */}
                <div style={{
                    display: 'flex', gap: 6, marginBottom: 32,
                    background: 'rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(10px)',
                    padding: 6, borderRadius: 16, border: '1px solid rgba(255,255,255,0.8)',
                    width: 'fit-content',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}>
                    <button
                        onClick={() => setView('ascension')}
                        style={{
                            padding: '10px 24px', borderRadius: 12, fontSize: 13, fontWeight: 800,
                            background: view === 'ascension' ? 'var(--color-navy)' : 'transparent',
                            color: view === 'ascension' ? 'white' : 'var(--color-text-muted)',
                            border: 'none', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        Mi Ascensión
                    </button>
                    <button
                        onClick={() => setView('network')}
                        style={{
                            padding: '10px 24px', borderRadius: 12, fontSize: 13, fontWeight: 800,
                            background: view === 'network' ? 'var(--color-navy)' : 'transparent',
                            color: view === 'network' ? 'white' : 'var(--color-text-muted)',
                            border: 'none', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        Mi Red (4 Niveles)
                    </button>
                </div>

                <div style={{ marginBottom: 28 }}>
                    <AnimatePresence mode="wait">
                        {view === 'ascension' ? (
                            <motion.div
                                key="ascension"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <GiftMatrix currentLevel={stats.currentLevel} referrals={stats.directReferrals} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="network"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <NetworkTree userId={user.id || ''} mentor={stats.mentor} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>


            </div>
        </div>
    );
}
