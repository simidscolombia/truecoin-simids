'use client';

import {
    Users, Wallet, TrendingUp, ArrowLeft, Search, Edit3, ShieldAlert,
    Database, LayoutDashboard, Save, BarChart3, SearchCode,
    Globe, Sparkles, Palette, Trash2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../services/adminService';
import ThemeCustomizer from './ThemeCustomizer';
import ApiSettings from './ApiSettings';

export default function AdminDashboard({ onBack }: { onBack: () => void }) {
    const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'directory' | 'expansion' | 'themes' | 'banks'>('stats');
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<any>(null);
    const [editData, setEditData] = useState({
        fullName: '',
        phone: '',
        referralCode: '',
        referredBy: '',
        currentLevel: 1,
        balance: '0',
        email: '',
        password: ''
    });

    // Expansion Scanner States
    const [scanQuery, setScanQuery] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scanResults, setScanResults] = useState<any[]>([]);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [globalStats, allUsers, allBusinesses] = await Promise.all([
                adminService.getGlobalStats(),
                adminService.getAllUsers(),
                adminService.getAllBusinesses()
            ]);
            setStats(globalStats);
            setUsers(allUsers);
            setBusinesses(allBusinesses);
        } catch (error) {
            console.error("Error cargando el Cerebro:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBusinessVip = async (id: string, currentVip: boolean) => {
        try {
            await adminService.updateBusinessStatus(id, !currentVip);
            fetchData();
        } catch (err) {
            alert("Error actualizando negocio");
        }
    };

    const handleEditUser = (u: any) => {
        setEditingUser(u);
        setEditData({
            fullName: u.full_name || '',
            email: u.email || '',
            phone: u.phone || '',
            referralCode: u.referral_code || '',
            referredBy: u.referred_by || '',
            currentLevel: u.current_level || 1,
            balance: u.wallets?.[0]?.balance_tc?.toString() || '0',
            password: u.password || ''
        });
    };

    const handleSaveUser = async () => {
        if (!editingUser) return;
        setLoading(true);
        try {
            // 1. Actualizar Perfil
            await adminService.updateUserProfile(editingUser.id, {
                full_name: editData.fullName,
                phone: editData.phone,
                referral_code: editData.referralCode,
                referred_by: editData.referredBy || null,
                current_level: editData.currentLevel,
                password: editData.password
            });

            // 2. Ajustar Saldo
            await adminService.adjustUserBalance(editingUser.id, parseFloat(editData.balance));

            // 3. Notificar por WhatsApp (Opcional, no bloqueante)
            if (editData.phone) {
                const message = `🔔 *ShopyBrands Hola!* Tus datos han sido actualizados por administración.\n\n👤 *Nombre:* ${editData.fullName}\n📈 *Nivel:* ${editData.currentLevel}\n💰 *Saldo:* ${editData.balance} TC\n🔑 *Referral:* ${editData.referralCode}\n\nSi no reconoces este cambio, contacta a soporte.`;
                adminService.notifyUser(editData.phone, message);
            }

            alert("Socio actualizado con éxito y notificado por WhatsApp.");
            setEditingUser(null);
            fetchData();
        } catch (error) {
            alert("Error al actualizar socio: " + (error as any).message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string, name: string) => {
        if (!confirm(`🚨 ¿Estás SEGURO de eliminar a ${name}? Esta acción no se puede deshacer y borrará su billetera y red.`)) return;
        setLoading(true);
        try {
            await adminService.deleteUser(userId);
            alert("Socio eliminado del mapa.");
            fetchData();
        } catch (error) {
            alert("No se pudo eliminar: " + (error as any).message);
        } finally {
            setLoading(false);
        }
    };

    const handleStartScan = () => {
        if (!scanQuery) return;
        setIsScanning(true);
        setTimeout(() => {
            const results = [
                { id: 'g1', name: "Mondongo's Poblado", address: "Cl 10 #38-38, El Poblado", category: "Comida Típica", rating: 4.7, image_url: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=400" },
                { id: 'g2', name: "Carmen Restaurant", address: "Cra 36 #10A-27, Provenza", category: "Alta Cocina", rating: 4.8, image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400" },
                { id: 'g3', name: "Pergamino Café", address: "Cl 10B #36-38, Poblado", category: "Café Especial", rating: 4.8, image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400" },
            ];
            setScanResults(results);
            setIsScanning(false);
        }, 2000);
    };

    const handleImportOne = async (bus: any) => {
        try {
            await adminService.importBusinessFromGoogle(bus);
            alert(`${bus.name} ahora es parte del Directorio (Nivel Free).`);
            setScanResults(prev => prev.filter(r => r.id !== bus.id));
            fetchData();
        } catch (err) {
            alert("Error importando comercio.");
        }
    };

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredBusinesses = businesses.filter(b =>
        b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, border: '4px solid var(--color-border)', borderTopColor: 'var(--color-admin)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-admin)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sincronizando Cerebro...</p>
                </div>
            </div>
        );
    }

    // Helper for tab buttons
    const TabBtn = ({ id, icon: Icon, label, customColor }: any) => {
        const isActive = activeTab === id;
        const activeBg = customColor ? `color-mix(in srgb, ${customColor} 12%, white)` : 'color-mix(in srgb, var(--color-admin) 12%, white)';
        const activeText = customColor || 'var(--color-admin)';

        return (
            <button
                onClick={() => { setActiveTab(id); setSearchTerm(''); }}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 18px', borderRadius: 14, cursor: 'pointer', border: 'none',
                    background: isActive ? activeBg : 'transparent',
                    color: isActive ? activeText : 'var(--color-text-muted)',
                    fontWeight: isActive ? 700 : 600,
                    transition: 'all 0.2s',
                    fontSize: 14,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--color-surface-2)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
                <Icon size={18} /> {label}
            </button>
        );
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-bg)' }}>
            {/* ── SIDEBAR ── */}
            <aside style={{ width: 280, background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                {/* Header */}
                <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--color-admin)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldAlert size={20} color="white" />
                    </div>
                    <div>
                        <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--color-navy)', letterSpacing: -0.5 }}>Super<span style={{ color: 'var(--color-admin)' }}>Admin</span></span>
                        <p style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Panel de Control</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <TabBtn id="stats" icon={LayoutDashboard} label="Dashboard" />
                    <TabBtn id="users" icon={Users} label="Mi Red (CRM)" />
                    <TabBtn id="directory" icon={Database} label="Directorio" />

                    <div style={{ height: 1, background: 'var(--color-border)', margin: '12px 8px' }} />

                    <TabBtn id="expansion" icon={Globe} label="Expansión IA" customColor="#4F46E5" />
                    <TabBtn id="themes" icon={Palette} label="Personalización" />
                    <TabBtn id="banks" icon={Wallet} label="Ajustes de Pago" customColor="#16A34A" />
                </nav>

                {/* Footer */}
                <div style={{ padding: 20, borderTop: '1px solid var(--color-border)' }}>
                    <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px', width: '100%', borderRadius: 12, border: 'none', background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: 13, justifyContent: 'center' }}>
                        <ArrowLeft size={16} /> Volver al App
                    </button>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main style={{ flex: 1, padding: 40, overflowY: 'auto', height: '100vh' }}>
                <AnimatePresence mode="wait">

                    {/* ────── TABS: STATS ────── */}
                    {activeTab === 'stats' && (
                        <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <div style={{ marginBottom: 32 }}>
                                <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-navy)', letterSpacing: -0.5 }}>Métricas Globales</h2>
                                <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>El ecosistema está operando correctamente.</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
                                <AdminStatCard label="Socios Totales" value={stats?.userCount || 0} icon={Users} trend="+12% mensual" />
                                <AdminStatCard label="Liquidez Total (TC)" value={Math.floor(stats?.totalTC || 0).toLocaleString()} icon={Wallet} trend="Respaldado 1:1" />
                                <AdminStatCard label="Negocios Aliados" value={stats?.businessCount || 0} icon={Database} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                {/* Level Chart */}
                                <div className="card-lg" style={{ padding: 28 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <BarChart3 size={18} style={{ color: 'var(--color-admin)' }} /> Alcance por Niveles
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        {[1, 2, 3, 4, 5].map(lvl => {
                                            const count = stats?.levelDistribution?.[lvl] || 0;
                                            const percentage = stats?.userCount ? (count / stats.userCount) * 100 : 0;
                                            return (
                                                <div key={lvl}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nivel {lvl}</span>
                                                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-navy)' }}>{count} Socios</span>
                                                    </div>
                                                    <div style={{ height: 8, background: 'var(--color-surface-2)', borderRadius: 999, overflow: 'hidden' }}>
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.8 }} style={{ height: '100%', background: 'var(--color-admin)', borderRadius: 999 }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Recent TXs */}
                                <div className="card-lg" style={{ padding: 28 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <TrendingUp size={18} style={{ color: 'var(--color-admin)' }} /> Últimos Movimientos
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}>
                                        {(stats?.recentTransactions || []).map((tx: any) => (
                                            <div key={tx.id} style={{ padding: '12px 16px', background: 'var(--color-surface-2)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>{tx.sender?.full_name || 'Sistema'} → {tx.receiver?.full_name || 'Negocio'}</p>
                                                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, marginTop: 2 }}>{tx.type}</p>
                                                </div>
                                                <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-admin)' }}>{tx.amount} <span style={{ fontSize: 11 }}>TC</span></p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ────── TABS: USERS (CRM) ────── */}
                    {activeTab === 'users' && (
                        <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                                <div>
                                    <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-navy)', letterSpacing: -0.5 }}>Gestión de Socios</h2>
                                    <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Lista maestra de red y auditoría.</p>
                                </div>
                                <div className="input-with-icon" style={{ width: 320, background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', borderRadius: 12 }}>
                                    <Search size={16} className="input-icon" />
                                    <input type="text" placeholder="Buscar socio..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input" style={{ paddingLeft: 40 }} />
                                </div>
                            </div>

                            <div className="card-lg" style={{ overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                                        <tr>
                                            <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Socio</th>
                                            <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contacto</th>
                                            <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nivel</th>
                                            <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Equipo</th>
                                            <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>Balance</th>
                                            <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Ax</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((u, i) => (
                                            <tr key={u.id} style={{ borderBottom: i === filteredUsers.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-admin) 15%, white)', color: 'var(--color-admin)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                                                            {u.full_name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)' }}>{u.full_name}</p>
                                                            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{u.referral_code}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <p style={{ fontSize: 13, color: 'var(--color-navy)', fontWeight: 500 }}>{u.email}</p>
                                                    {u.phone && <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{u.phone}</p>}
                                                </td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <span style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--color-surface-2)', fontSize: 11, fontWeight: 700, color: 'var(--color-navy)' }}>
                                                        Lvl {u.current_level}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        <Users size={14} style={{ color: 'var(--color-text-muted)' }} />
                                                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>{u.team_size || 0}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-admin)' }}>
                                                        {u.wallets?.[0]?.balance_tc || "0.00"} <span style={{ fontSize: 10 }}>TC</span>
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                                        <button
                                                            onClick={() => handleEditUser(u)}
                                                            style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-surface-2)', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}
                                                        >
                                                            <Edit3 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(u.id, u.full_name)}
                                                            style={{ width: 32, height: 32, borderRadius: 8, background: '#FEF2F2', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* ────── TABS: DIRECTORY ────── */}
                    {activeTab === 'directory' && (
                        <motion.div key="directory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                                <div>
                                    <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-navy)', letterSpacing: -0.5 }}>Comercios Aliados</h2>
                                    <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Administra membresías y niveles VIP.</p>
                                </div>
                                <div className="input-with-icon" style={{ width: 320, background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', borderRadius: 12 }}>
                                    <Search size={16} className="input-icon" />
                                    <input type="text" placeholder="Buscar negocio..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input" style={{ paddingLeft: 40 }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                                {filteredBusinesses.map(bus => (
                                    <div key={bus.id} className="card" style={{ padding: 24 }}>
                                        <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                                            <div style={{ width: 56, height: 56, borderRadius: 14, overflow: 'hidden', background: 'var(--color-surface-2)', flexShrink: 0 }}>
                                                {bus.image_url ? <img src={bus.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Database size={24} style={{ margin: '16px auto', color: 'var(--color-text-muted)' }} />}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bus.name}</h3>
                                                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-directorio)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{bus.category || 'General'}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleToggleBusinessVip(bus.id, bus.is_vip)}
                                            style={{
                                                width: '100%', padding: '10px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 12, border: 'none',
                                                background: bus.is_vip ? 'color-mix(in srgb, var(--color-wallet) 15%, white)' : 'var(--color-surface-2)',
                                                color: bus.is_vip ? 'var(--color-wallet)' : 'var(--color-text-muted)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s',
                                            }}
                                        >
                                            {bus.is_vip ? <><ShieldAlert size={14} /> VIP Activo</> : 'Hacer VIP'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ────── TABS: EXPANSION & THEMES ────── */}
                    {activeTab === 'expansion' && (
                        <motion.div key="exp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <div style={{ background: 'color-mix(in srgb, #4F46E5 4%, white)', borderRadius: 32, padding: 48, textAlign: 'center', border: '1px solid color-mix(in srgb, #4F46E5 15%, white)' }}>
                                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'color-mix(in srgb, #4F46E5 15%, white)', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                    <Sparkles size={32} />
                                </div>
                                <h2 style={{ fontSize: 32, fontWeight: 900, color: '#312E81', marginBottom: 12, letterSpacing: -0.5 }}>Agente de Expansión</h2>
                                <p style={{ fontSize: 15, color: '#4F46E5', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.6 }}>
                                    Rastrea negocios en Google Maps y agrégalos automáticamente al Directorio Simids.
                                </p>

                                <div style={{ display: 'flex', gap: 12, maxWidth: 640, margin: '0 auto' }}>
                                    <div className="input-with-icon" style={{ flex: 1 }}>
                                        <SearchCode size={18} className="input-icon" style={{ color: '#4F46E5' }} />
                                        <input
                                            type="text"
                                            placeholder="Ej: Mejores Cafeterías en Medellín"
                                            value={scanQuery}
                                            onChange={e => setScanQuery(e.target.value)}
                                            className="input"
                                            style={{ paddingLeft: 44, padding: 20, fontSize: 16, background: 'white', borderColor: '#C7D2FE' }}
                                        />
                                    </div>
                                    <button onClick={handleStartScan} disabled={isScanning || !scanQuery} style={{ padding: '0 32px', borderRadius: 16, background: '#4F46E5', color: 'white', border: 'none', fontWeight: 800, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {isScanning ? <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : 'Escanear'}
                                    </button>
                                </div>

                                {scanResults.length > 0 && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 40, textAlign: 'left' }}>
                                        {scanResults.map(res => (
                                            <div key={res.id} style={{ background: 'white', padding: 20, borderRadius: 20, border: '1px solid #E0E7FF' }}>
                                                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#312E81', marginBottom: 4 }}>{res.name}</h4>
                                                <p style={{ fontSize: 12, color: '#6366F1', fontWeight: 600, textTransform: 'uppercase', marginBottom: 12 }}>{res.category}</p>
                                                <button onClick={() => handleImportOne(res)} style={{ width: '100%', padding: 10, borderRadius: 10, background: '#EEF2FF', color: '#4F46E5', border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                                                    Importar a TrueCoin
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'themes' && (
                        <motion.div key="themes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <ThemeCustomizer />
                        </motion.div>
                    )}

                    {activeTab === 'banks' && (
                        <motion.div key="banks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <ApiSettings />
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>

            {/* ── MODAL DE EDICIÓN DE USUARIO ── */}
            <AnimatePresence>
                {editingUser && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingUser(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(11,31,75,0.6)', backdropFilter: 'blur(8px)' }} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="card-lg" style={{ position: 'relative', zIndex: 1010, maxWidth: 650, width: '100%', padding: 40, overflowY: 'auto', maxHeight: '90vh' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-admin)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                        <Edit3 size={20} />
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-navy)' }}>Editar Registro</h3>
                                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>ID: {editingUser.id}</p>
                                    </div>
                                </div>
                                <button onClick={() => setEditingUser(null)} className="btn btn-ghost" style={{ padding: 8 }}>×</button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, textAlign: 'left' }}>
                                {/* Personal Info */}
                                <div>
                                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Nombre Completo</label>
                                    <input type="text" value={editData.fullName} onChange={e => setEditData({ ...editData, fullName: e.target.value })} className="input" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Teléfono / WhatsApp</label>
                                    <input type="text" value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} className="input" />
                                </div>

                                {/* Network Data */}
                                <div>
                                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Código Referido (Propio)</label>
                                    <input type="text" value={editData.referralCode} onChange={e => setEditData({ ...editData, referralCode: e.target.value })} className="input" style={{ fontFamily: 'monospace', fontWeight: 700 }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Referido Por (ID)</label>
                                    <input type="text" value={editData.referredBy} onChange={e => setEditData({ ...editData, referredBy: e.target.value })} className="input" placeholder="Opcional" />
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Nueva Contraseña</label>
                                    <input type="text" value={editData.password} onChange={e => setEditData({ ...editData, password: e.target.value })} className="input" placeholder="Escribe la nueva contraseña aquí" />
                                </div>

                                {/* Levels & Finance */}
                                <div>
                                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Nivel VIP (L1-L12)</label>
                                    <select value={editData.currentLevel} onChange={e => setEditData({ ...editData, currentLevel: parseInt(e.target.value) })} className="input">
                                        {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>Nivel {i + 1}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Saldo TrueCoin (TC)</label>
                                    <input type="number" value={editData.balance} onChange={e => setEditData({ ...editData, balance: e.target.value })} className="input" style={{ fontWeight: 800, color: 'var(--color-admin)' }} />
                                </div>
                            </div>

                            <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
                                <button onClick={() => setEditingUser(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancelar</button>
                                <button onClick={handleSaveUser} className="btn btn-admin" style={{ flex: 2, background: 'var(--color-admin)', color: 'white' }}>
                                    <Save size={18} style={{ marginRight: 8 }} /> Guardar Cambios en la Nube
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function AdminStatCard({ label, value, icon: Icon, trend }: { label: string, value: string | number, icon: any, trend?: string }) {
    return (
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'color-mix(in srgb, var(--color-admin) 10%, white)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-admin)' }}>
                    <Icon size={20} />
                </div>
                {trend && <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', background: '#F0FDF4', color: '#16A34A', borderRadius: 999 }}>{trend}</span>}
            </div>
            <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</p>
                <p style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-navy)', letterSpacing: -0.5 }}>{value}</p>
            </div>
        </div>
    );
}
