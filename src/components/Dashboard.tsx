'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet, Users, Copy, Share2, ArrowUpRight,
    Clock, Send, TrendingUp, Star, ChevronRight, CheckCircle2, Zap
} from 'lucide-react';
import GiftMatrix from './GiftMatrix';
import TransferModal from './TransferModal';
import RechargeModal from './RechargeModal';
import RevenueSimulator from './RevenueSimulator';

interface DashboardProps {
    user: { fullName: string; referralCode: string; id?: string };
    balance: string;
    onGoToStore: () => void;
    onGoToPOS: () => void;
    onGoToDirectory: () => void;
    onGoToFam: () => void;
    onGoToAdmin: () => void;
    onGoToProspects: () => void;
}

function StatCard({
    label, value, unit, icon, color, sub,
}: {
    label: string; value: string; unit?: string; icon: React.ReactNode;
    color: string; sub?: string;
}) {
    return (
        <motion.div
            whileHover={{ y: -3 }}
            className="stat-card"
            style={{ borderTop: `3px solid ${color}` }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="stat-card-label">{label}</span>
                <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `color-mix(in srgb, ${color} 12%, white)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color,
                }}>
                    {icon}
                </div>
            </div>
            <div className="stat-card-value" style={{ color }}>
                {value}
                {unit && <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginLeft: 6 }}>{unit}</span>}
            </div>
            {sub && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>{sub}</p>}
        </motion.div>
    );
}

function QuickAccessCard({
    title, description, accent, icon, onClick, cta,
}: {
    title: string; description: string; accent: string;
    icon: React.ReactNode; onClick: () => void; cta: string;
}) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="card"
            style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
            onClick={onClick}
        >
            <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: `color-mix(in srgb, ${accent} 12%, white)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: accent,
            }}>
                {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 15, marginBottom: 2 }}>{title}</p>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{description}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: accent, fontWeight: 600, fontSize: 13, flexShrink: 0 }}>
                {cta} <ChevronRight size={16} />
            </div>
        </motion.div>
    );
}

export default function Dashboard({
    user,
    balance,
    onGoToStore,
    onGoToPOS,
    onGoToDirectory,
    onGoToFam,
    onGoToAdmin,
    onGoToProspects
}: DashboardProps) {
    const [showTransfer, setShowTransfer] = useState(false);
    const [showRecharge, setShowRecharge] = useState(false);
    const [localBalance, setLocalBalance] = useState(balance);
    const [copied, setCopied] = useState(false);

    const copyReferral = () => {
        navigator.clipboard.writeText(`shopybrands.com/ref/${user.referralCode}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTransferSuccess = (amount: number) => {
        const newBal = (Number(localBalance) - amount).toFixed(2);
        setLocalBalance(newBal);
    };

    const handleRechargeSuccess = (amount: number) => {
        // En un caso real, esto pasa a estado "Pendiente de Confirmación de Tesorería".
        // Para que el Demo se vea vivo e interactivo de inmediato, le pre-cargamos el saldo al usuario en la UI.
        const newBal = (Number(localBalance) + amount).toFixed(2);
        setLocalBalance(newBal);
        alert(`¡Solicitud enviada! Hemós notificado a tesorería. Para esta demostración, se te han acreditado ${amount} TC inmediatamente.`);
    };

    return (
        <div className="module-page animate-in">
            <TransferModal
                isOpen={showTransfer}
                onClose={() => setShowTransfer(false)}
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
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 2 }}>
                        Hola, <span style={{ color: 'var(--color-cloud-blue)' }}>{user.fullName.split(' ')[0]}</span> 👋
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                        Bienvenido a tu ecosistema ShopyBrands · 12 Mar 2026
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="badge" style={{ background: 'var(--color-navy)', color: 'white', border: 'none' }}>
                        ⭐ VIP BRONCE (L1)
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
                        value="1"
                        icon={<Users size={18} />}
                        color="var(--color-cloud-blue)"
                        sub="Nivel 1 · 1/4 cupos"
                    />
                    <StatCard
                        label="Rango Actual"
                        value="VIP Bronce"
                        icon={<Star size={18} />}
                        color="var(--color-directorio)"
                        sub="Siguiente: VIP Plata"
                    />
                </div>

                {/* Wallet + Referral */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

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
                                <TrendingUp size={10} /> Nivel 1
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

                        <button className="btn btn-outline btn-full">
                            <Share2 size={16} /> Compartir por WhatsApp
                        </button>
                    </div>

                </div>

                {/* Gift Matrix */}
                <div style={{ marginBottom: 28 }}>
                    <GiftMatrix currentLevel={1} referrals={1} />
                </div>

                {/* Quick Access */}
                {/* Simulador de Ingresos */}
                <div style={{ marginBottom: 28 }}>
                    <RevenueSimulator />
                </div>

                <div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 14 }}>
                        Accesos Rápidos
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
                        <QuickAccessCard
                            title="Marketplace VIP"
                            description="Compra con tus puntos a precios de mayorista."
                            accent="var(--color-marketplace)"
                            icon={<TrendingUp size={22} />}
                            onClick={onGoToStore}
                            cta="Ir a la tienda"
                        />
                        <QuickAccessCard
                            title="POS Simids"
                            description="Terminal de ventas y control de tu negocio."
                            accent="var(--color-pos)"
                            icon={<Wallet size={22} />}
                            onClick={onGoToPOS}
                            cta="Abrir POS"
                        />
                        <QuickAccessCard
                            title="Directorio"
                            description="Busca comercios aliados en tu ciudad."
                            accent="var(--color-directorio)"
                            icon={<Users size={22} />}
                            onClick={onGoToDirectory}
                            cta="Explorar"
                        />
                        <QuickAccessCard
                            title="Fábrica de Socios"
                            description="Gestiona tus prospectos y acelera tu crecimiento."
                            accent="var(--color-wallet)"
                            icon={<Zap size={22} />}
                            onClick={onGoToProspects}
                            cta="Ver Prospectos"
                        />
                        <QuickAccessCard
                            title="ShopyFam"
                            description="Conecta con tu bloque y celebra tus logros en equipo."
                            accent="var(--color-cloud-blue)"
                            icon={<Users size={22} />}
                            onClick={onGoToFam}
                            cta="Entrar Social"
                        />
                        <QuickAccessCard
                            title="Panel Maestro"
                            description="Control total del ecosistema y configuración IA."
                            accent="var(--color-navy)"
                            icon={<Star size={22} />}
                            onClick={onGoToAdmin}
                            cta="Administrar"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
