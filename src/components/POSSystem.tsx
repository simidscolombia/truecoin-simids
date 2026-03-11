'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Calculator, LayoutDashboard,
    TrendingUp, TrendingDown, History, ShoppingCart,
    AlertTriangle, Plus, DollarSign, Wifi,
    Settings
} from 'lucide-react';
import SalesTerminal from './SalesTerminal';

type POSTab = 'dashboard' | 'sales' | 'inventory' | 'reports';

const MENU_ITEMS: { id: POSTab; label: string; Icon: any }[] = [
    { id: 'dashboard', label: 'Resumen', Icon: LayoutDashboard },
    { id: 'sales', label: 'Nueva Venta', Icon: Calculator },
    { id: 'inventory', label: 'Inventario', Icon: Package },
    { id: 'reports', label: 'Configuración', Icon: Settings },
];

const BUSINESS_STATS = {
    dailySales: 1250000,
    dailyExpenses: 450000,
    lowStock: 5,
    inventoryValue: 15800000,
};

const RECENT_SALES = [
    { id: 1, customer: 'Caja Principal', amount: 120000, time: 'Hace 15 min', items: 3, method: 'Efectivo', highlight: false },
    { id: 2, customer: 'Pago TrueCoin', amount: 45000, time: 'Hace 1h', items: 1, method: 'TrueCoin', highlight: true },
    { id: 3, customer: 'Caja Principal', amount: 230000, time: 'Hace 3h', items: 5, method: 'Efectivo', highlight: false },
];

export default function POSSystem({ onBack }: { onBack: () => void }) {
    const [activeTab, setActiveTab] = useState<POSTab>('dashboard');
    void onBack;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg)' }}>

            {/* ── POS TOP HEADER (NAVY) ── */}
            <header className="module-header-pos" style={{ padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, boxShadow: 'var(--shadow-md)', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, background: 'color-mix(in srgb, var(--color-pos) 20%, white)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={20} color="white" />
                        </div>
                        <div>
                            <span style={{ fontWeight: 900, fontSize: 20, color: 'white', letterSpacing: -0.5 }}>Simids</span>
                            <span style={{ fontSize: 10, color: 'var(--color-cloud-blue)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginLeft: 6 }}>POS</span>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <nav style={{ display: 'flex', gap: 4, marginLeft: 16 }}>
                        {MENU_ITEMS.map(({ id, label, Icon }) => {
                            const isActive = activeTab === id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
                                        borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                                        transition: 'all 0.2s',
                                        background: isActive ? 'white' : 'transparent',
                                        color: isActive ? 'var(--color-pos)' : 'color-mix(in srgb, var(--color-cloud-blue) 80%, white)',
                                    }}
                                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'white' }}
                                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'color-mix(in srgb, var(--color-cloud-blue) 80%, white)' }}
                                >
                                    <Icon size={16} />
                                    {label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Wifi size={14} color="#4ADE80" />
                        <span style={{ fontSize: 12, color: 'white', fontWeight: 700, letterSpacing: '0.05em' }}>EN LÍNEA</span>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 8px #4ADE80' }} />
                    </div>
                </div>
            </header>

            {/* ── MAIN CONTENT AREA ── */}
            <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                <AnimatePresence mode="wait">

                    {/* ────── TABS: DASHBOARD ────── */}
                    {activeTab === 'dashboard' && (
                        <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ padding: '32px 40px', maxWidth: 1280, margin: '0 auto' }}>
                            <div style={{ marginBottom: 28 }}>
                                <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-navy)', letterSpacing: -0.5, marginBottom: 4 }}>Resumen de Turno</h2>
                                <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Caja Activa · Miércoles, 11 Mar 2026</p>
                            </div>

                            {/* Top Metrics */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
                                <POSMetricCard label="Ventas Totales Hoy" value={`$${BUSINESS_STATS.dailySales.toLocaleString('es-CO')}`} icon={TrendingUp} accent="#16A34A" />
                                <POSMetricCard label="Gastos y Egresos" value={`$${BUSINESS_STATS.dailyExpenses.toLocaleString('es-CO')}`} icon={TrendingDown} accent="#DC2626" />
                                <POSMetricCard label="Alertas de Stock" value={`${BUSINESS_STATS.lowStock} Productos`} icon={AlertTriangle} accent="var(--color-directorio)" alert />
                                <POSMetricCard label="Valor Inventario" value={`$${BUSINESS_STATS.inventoryValue.toLocaleString('es-CO')}`} icon={DollarSign} accent="var(--color-wallet)" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

                                {/* Recent Sales List */}
                                <div className="card-lg" style={{ padding: 28 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                                        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <History size={20} style={{ color: 'var(--color-pos)' }} /> Últimas Transacciones
                                        </h3>
                                        <button className="btn btn-ghost btn-sm">Ver Historial Completo</button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {RECENT_SALES.map(sale => (
                                            <div key={sale.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 16, background: sale.highlight ? 'color-mix(in srgb, var(--color-wallet) 8%, white)' : 'var(--color-surface-2)', border: `1px solid ${sale.highlight ? 'color-mix(in srgb, var(--color-wallet) 25%, white)' : 'transparent'}` }}>
                                                <div style={{ width: 44, height: 44, borderRadius: 12, background: sale.highlight ? 'var(--color-wallet)' : 'white', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: sale.highlight ? 'white' : 'var(--color-text-muted)', flexShrink: 0 }}>
                                                    <ShoppingCart size={20} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-navy)' }}>{sale.customer}</p>
                                                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, marginTop: 2 }}>{sale.items} ARTÍCULOS · {sale.time.toUpperCase()}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontSize: 16, fontWeight: 800, color: sale.highlight ? 'var(--color-wallet)' : 'var(--color-pos)' }}>
                                                        ${sale.amount.toLocaleString('es-CO')}
                                                    </p>
                                                    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 6, background: sale.highlight ? 'color-mix(in srgb, var(--color-wallet) 15%, white)' : 'var(--color-surface)', fontSize: 10, fontWeight: 800, color: sale.highlight ? 'var(--color-wallet)' : 'var(--color-text-muted)', textTransform: 'uppercase', marginTop: 4, letterSpacing: '0.05em' }}>
                                                        {sale.method}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Column: Actions & Tips */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                                    {/* Big Action Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setActiveTab('sales')}
                                        style={{ width: '100%', padding: '32px 24px', borderRadius: 24, background: 'var(--color-pos)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, boxShadow: '0 12px 30px rgba(11,31,75,0.2)' }}
                                    >
                                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Plus size={32} />
                                        </div>
                                        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>Nueva Venta</span>
                                    </motion.button>

                                    <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-cloud-blue) 10%, white) 0%, color-mix(in srgb, var(--color-pos) 5%, white) 100%)', border: '1px solid color-mix(in srgb, var(--color-cloud-blue) 20%, white)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                            <span style={{ fontSize: 18 }}>🤖</span>
                                            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-pos)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>IA insights</span>
                                        </div>
                                        <p style={{ fontSize: 14, color: 'var(--color-navy)', lineHeight: 1.6, fontWeight: 500 }}>
                                            Tus ventas de <strong style={{ color: 'var(--color-pos)' }}>Café Especial</strong> aumentan un 20% los miércoles por la tarde. Preparando sugerencias de combos para tus clientes...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ────── TABS: SALES TERMINAL ────── */}
                    {activeTab === 'sales' && (
                        <motion.div key="sales" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ height: 'calc(100vh - 64px)' }}>
                            <SalesTerminal />
                        </motion.div>
                    )}

                    {/* ────── TABS: INVENTORY ────── */}
                    {activeTab === 'inventory' && (
                        <motion.div key="inventory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ padding: '40px', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
                            <div className="card-lg" style={{ padding: '60px 40px' }}>
                                <div style={{ width: 80, height: 80, borderRadius: 24, background: 'color-mix(in srgb, var(--color-pos) 10%, white)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-pos)', margin: '0 auto 24px' }}>
                                    <Package size={40} />
                                </div>
                                <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 12 }}>Catálogo e Inventario</h2>
                                <p style={{ fontSize: 15, color: 'var(--color-text-muted)', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.6 }}>
                                    Gestiona tus productos, niveles de stock, códigos de barra y categorías desde un solo lugar.
                                </p>
                                <button className="btn btn-pos btn-lg shadow-xl" style={{ margin: '0 auto' }}>
                                    <Plus size={18} /> Crear Primer Producto
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ────── TABS: REPORTS & CONFIG ────── */}
                    {activeTab === 'reports' && (
                        <motion.div key="reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ padding: '40px', maxWidth: 1000, margin: '0 auto' }}>
                            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 24 }}>Configuración de Pasarelas</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                                {/* Wompi Card */}
                                <div className="card-lg" style={{ padding: 28 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--color-navy)', letterSpacing: -0.5 }}>Wompi</span>
                                        <span style={{ fontSize: 10, fontWeight: 800, color: '#16A34A', background: '#DCFCE7', padding: '4px 10px', borderRadius: 999 }}>ACTIVO</span>
                                    </div>
                                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.5 }}>
                                        Integra cobros con tarjeta y PSE automáticamente a tu cuenta Bancolombia.
                                    </p>
                                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wompi API Key</label>
                                    <input type="password" value="************************" readOnly className="input" style={{ marginBottom: 16, background: 'var(--color-surface-2)' }} />
                                    <button className="btn btn-navy btn-full">Editar Credenciales</button>
                                </div>

                                {/* Bold Card */}
                                <div className="card-lg" style={{ padding: 28, border: '2px dashed var(--color-border-strong)', background: 'transparent', boxShadow: 'none' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--color-text-muted)', letterSpacing: -0.5 }}>BOLD.</span>
                                        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-text-muted)', background: 'var(--color-surface-2)', padding: '4px 10px', borderRadius: 999 }}>INACTIVO</span>
                                    </div>
                                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.5 }}>
                                        Registra links de pago Bold para seguimiento interno en caja.
                                    </p>
                                    <button className="btn btn-ghost btn-full" style={{ border: '1px solid var(--color-border-strong)', marginTop: 'auto' }}>Conectar Bold</button>
                                </div>
                            </div>

                            <div style={{ padding: 20, borderRadius: 16, background: 'color-mix(in srgb, var(--color-wallet) 10%, white)', border: '1px solid color-mix(in srgb, var(--color-wallet) 30%, white)', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                <DollarSign size={24} style={{ color: 'var(--color-wallet)' }} />
                                <div>
                                    <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 4 }}>Distribución Automática MLM</h4>
                                    <p style={{ fontSize: 13, color: 'var(--color-navy)', lineHeight: 1.6 }}>Al procesar pagos con pasarelas externas en el POS, el sistema liquidará automáticamente el <strong style={{ color: 'var(--color-wallet)' }}>10% en TrueCoins</strong> para la red (Cashback + Comisiones de Nivel).</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
}

function POSMetricCard({ label, value, icon: Icon, accent, alert }: any) {
    return (
        <div className="card" style={{ padding: 24, borderTop: `4px solid ${accent}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `color-mix(in srgb, ${accent} 12%, white)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
                    <Icon size={20} />
                </div>
                {alert && <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#DC2626', boxShadow: '0 0 10px #DC2626' }} />}
            </div>
            <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</p>
                <p style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-navy)', letterSpacing: -0.5 }}>{value}</p>
            </div>
        </div>
    );
}
