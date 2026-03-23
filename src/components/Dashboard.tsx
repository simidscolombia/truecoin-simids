'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Copy, Send, CheckCircle2, Award, Zap, Shield, Gift, Camera, Loader2
} from 'lucide-react';
import NetworkTree from './NetworkTree';
import TransferModal from './TransferModal';
import RechargeModal from './RechargeModal';
import { userService } from '../services/userService';

const RANKS = [
    "VIP BRONCE", "VIP PLATA", "VIP ORO",
    "PLATINO I", "PLATINO II", "PLATINO III",
    "ESMERALDA I", "ESMERALDA II", "ESMERALDA III",
    "ZAFIRO", "DIAMANTE", "SOY LEYENDA"
];

export default function Dashboard({ user, balance, onUpdateBalance }: { user: any; balance: string; onUpdateBalance?: (b: string) => void; }) {
    const [showTransfer, setShowTransfer] = useState(false);
    const [showRecharge, setShowRecharge] = useState(false);
    const [localBalance, setLocalBalance] = useState(balance);
    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState<any>({ directReferrals: 0, currentLevel: 1, isVip: false });
    const [selectedDetailUser, setSelectedDetailUser] = useState<any | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(user.image_url || null);

    useEffect(() => {
        if (user?.id) {
            fetchDashboardData();
        }
    }, [user?.id, stats.currentLevel]);

    const fetchDashboardData = async () => {
        try {
            const s = await userService.getDashboardStats(user.id);
            setStats(s);
        } catch (e) {
            console.error(e);
        }
    };

    const handleAvatarClick = () => {
        const input = document.getElementById('avatar-upload') as HTMLInputElement;
        if (input) input.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const publicUrl = await userService.uploadAvatar(user.id, file);
            setAvatarUrl(publicUrl);
        } catch (err: any) {
            alert("Error subiendo imagen: " + err.message);
        } finally {
            setIsUploading(false);
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
                        {/* 📸 AVATAR INTERACTIVO */}
                        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleAvatarClick}>
                            <input 
                                type="file" 
                                id="avatar-upload" 
                                style={{ display: 'none' }} 
                                accept="image/*"
                                onChange={handleFileChange} 
                            />
                            <div style={{
                                width: 80, height: 80, borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--color-wallet) 0%, #059669 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: 32, fontWeight: 950,
                                border: '4px solid white', boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                overflow: 'hidden', position: 'relative'
                            }}>
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    user.fullName?.charAt(0).toUpperCase()
                                )}

                                {isUploading && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Loader2 className="animate-spin" size={24} />
                                    </div>
                                )}

                                <div className="avatar-overlay" style={{
                                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0,
                                    transition: 'opacity 0.2s'
                                }}>
                                    <Camera size={20} />
                                </div>
                            </div>
                        </div>

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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
                    <div style={{
                        borderRadius: 24, padding: '24px', display: 'flex', alignItems: 'center', gap: 20,
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        boxShadow: '0 10px 25px rgba(245, 158, 11, 0.25)', color: 'white'
                    }}>
                        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Gift size={28} />
                        </div>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, opacity: 0.9 }}>Mis Puntos de Regalo</p>
                            <h3 style={{ fontSize: 26, fontWeight: 950, margin: 0 }}>{localBalance} <span style={{ fontSize: 14 }}>TC</span></h3>
                        </div>
                    </div>

                    <div style={{
                        background: 'white', borderRadius: 24, padding: '24px', display: 'flex', alignItems: 'center', gap: 20,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid var(--color-border)'
                    }}>
                        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--color-surface-2)', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={28} />
                        </div>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Mi Equipo Directo</p>
                            <h3 style={{ fontSize: 26, fontWeight: 950, color: 'var(--color-navy)', margin: 0 }}>{stats.directReferrals} <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-muted)' }}>Socios</span></h3>
                        </div>
                    </div>

                    <div style={{
                        background: 'white', borderRadius: 24, padding: '24px', display: 'flex', alignItems: 'center', gap: 20,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid var(--color-border)'
                    }}>
                        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Award size={28} />
                        </div>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Mi Nivel de Regalo</p>
                            <h3 style={{ fontSize: 22, fontWeight: 950, color: 'var(--color-navy)', margin: 0 }}>
                                Nivel {stats.currentLevel} <span style={{ fontSize: 11, fontWeight: 800, background: 'var(--color-surface-2)', padding: '4px 8px', borderRadius: 8, marginLeft: 4 }}>{RANKS[(stats.currentLevel - 1) % 12]}</span>
                            </h3>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                    <div className="card" style={{ padding: 40, border: '1px solid var(--color-border)', borderRadius: 24 }}>
                        <h3 style={{ fontSize: 20, fontWeight: 950, color: 'var(--color-navy)', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Users size={24} color="var(--color-wallet)" />
                            Ecosistema de Red
                        </h3>
                        <NetworkTree userId={user.id} mentor={stats.mentor} onSelectUser={(u: any) => setSelectedDetailUser(u)} />
                    </div>
                </div>

                <AnimatePresence>
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
                </AnimatePresence>
            </div>
        </div>
    );
}
