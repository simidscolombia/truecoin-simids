import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Coins, ShieldCheck, Users, ShoppingBag, ArrowRight, Zap,
  LayoutDashboard, Search, Settings, LogOut, ChevronRight
} from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import POSSystem from './components/POSSystem';
import Directory from './components/Directory';
import AIChatSupport from './components/AIChatSupport';
import AdminDashboard from './components/AdminDashboard';
import { userService } from './services/userService';

type AppView = 'dashboard' | 'marketplace' | 'pos' | 'directory' | 'admin';

// ── Sidebar Navigation ─────────────────────────────────────
function Sidebar({
  currentView,
  onNavigate,
  user,
  onLogout,
}: {
  currentView: AppView;
  onNavigate: (v: AppView) => void;
  user: any;
  onLogout: () => void;
}) {
  const navItems: { id: AppView; label: string; icon: React.ReactNode; activeClass: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, activeClass: 'active-wallet' },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag size={18} />, activeClass: 'active-market' },
    { id: 'directory', label: 'Directorio', icon: <Search size={18} />, activeClass: 'active-dir' },
    { id: 'pos', label: 'POS Simids', icon: <Coins size={18} />, activeClass: 'active-pos' },
    { id: 'admin', label: 'Admin', icon: <Settings size={18} />, activeClass: 'active-admin' },
  ];

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'TC';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Coins size={20} />
        </div>
        <span className="sidebar-logo-text">
          True<span style={{ color: 'var(--color-wallet)' }}>Coin</span>
          <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.5, marginLeft: 6, background: 'rgba(0,0,0,0.1)', padding: '2px 4px', borderRadius: 4 }}>v1.0.1</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', padding: '4px 12px 8px', marginBottom: 4 }}>
          Módulos
        </p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`sidebar-nav-item ${currentView === item.id ? item.activeClass : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
            {currentView === item.id && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
          </button>
        ))}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.fullName?.split(' ')[0] || 'Usuario'}
            </p>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Socio VIP</p>
          </div>
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ── Feature Card (Landing) ──────────────────────────────────
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 20,
        padding: '32px 28px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12, marginBottom: 20,
        background: 'color-mix(in srgb, var(--color-navy) 8%, white)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--color-navy)',
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--color-navy)' }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{description}</p>
    </motion.div>
  );
}

// ── Stat (Landing) ──────────────────────────────────────────
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-navy)', letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 6 }}>{label}</div>
    </div>
  );
}

// ── Main App ────────────────────────────────────────────────
function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [balance, setBalance] = useState('0.00');

  const handleRegisterSuccess = async (profile: any) => {
    setUser({ fullName: profile.full_name, referralCode: profile.referral_code, id: profile.id });
    try {
      const fullProfile = await userService.getProfile(profile.id);
      if (fullProfile.wallets?.length > 0) {
        setBalance(Number(fullProfile.wallets[0].balance_tc).toFixed(2));
      }
    } catch (err) {
      console.error('Error cargando perfil:', err);
    }
    setShowAuth(false);
    setIsLoggedIn(true);
  };

  const handlePurchase = async (amount: number) => {
    if (!user?.id) return;
    try {
      const newBalance = await userService.updateBalance(user.id, -amount);
      setBalance(newBalance.toFixed(2));
    } catch {
      alert('No se pudo procesar el pago en la Red.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setBalance('0.00');
    setCurrentView('dashboard');
  };

  // ── Authenticated Shell ──
  if (isLoggedIn && user) {
    return (
      <div className="app-shell">
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          user={user}
          onLogout={handleLogout}
        />
        <main className="main-content">
          {currentView === 'dashboard' && (
            <Dashboard
              user={user}
              balance={balance}
              onGoToStore={() => setCurrentView('marketplace')}
              onGoToPOS={() => setCurrentView('pos')}
              onGoToDirectory={() => setCurrentView('directory')}
            />
          )}
          {currentView === 'marketplace' && (
            <Marketplace
              onBack={() => setCurrentView('dashboard')}
              userBalance={balance}
              onPurchase={handlePurchase}
            />
          )}
          {currentView === 'pos' && (
            <POSSystem onBack={() => setCurrentView('dashboard')} />
          )}
          {currentView === 'directory' && (
            <Directory
              onBack={() => setCurrentView('dashboard')}
              userBalance={balance}
              onPurchase={handlePurchase}
            />
          )}
          {currentView === 'admin' && (
            <AdminDashboard onBack={() => setCurrentView('dashboard')} />
          )}
        </main>
        <AIChatSupport />
      </div>
    );
  }

  // ── Landing Page ──
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Navbar */}
      <nav style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 32px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'var(--color-navy)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={20} color="white" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-navy)', letterSpacing: -0.5 }}>
            True<span style={{ color: 'var(--color-wallet)' }}>Coin</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', background: 'var(--color-surface-2)', padding: '2px 6px', borderRadius: 6, marginLeft: 8, verticalAlign: 'middle' }}>v1.0.1</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontSize: 14, color: 'var(--color-text-muted)', display: 'none' }}>Ecosistema</span>
          <button
            onClick={() => setShowAuth(true)}
            className="btn btn-navy btn-sm"
          >
            Ingresar
          </button>
        </div>
      </nav>

      {/* Auth Overlay */}
      {showAuth && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowAuth(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(11,31,75,0.6)', backdropFilter: 'blur(8px)' }}
          />
          <div style={{ position: 'relative', zIndex: 110, width: '100%', maxWidth: 440 }}>
            <RegistrationForm onSuccess={handleRegisterSuccess} />
          </div>
        </div>
      )}

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px 60px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'color-mix(in srgb, var(--color-wallet) 12%, white)', color: 'var(--color-wallet)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24, border: '1px solid color-mix(in srgb, var(--color-wallet) 25%, white)' }}
        >
          <Zap size={13} /> Ecosistema Digital Unificado · Colombia
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, marginBottom: 24, color: 'var(--color-navy)' }}
        >
          Tu Red de Valor,{' '}
          <span style={{ color: 'var(--color-cloud-blue)' }}>Empoderada por IA</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: 18, color: 'var(--color-text-muted)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}
        >
          El primer ecosistema financiero en Latinoamérica que combina recompensas masivas, comercio real y gestión empresarial con Simids POS.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <button onClick={() => setShowAuth(true)} className="btn btn-navy btn-lg" style={{ gap: 10 }}>
            Comenzar con Referido <ArrowRight size={18} />
          </button>
          <button className="btn btn-outline btn-lg">
            Ver Marketplace
          </button>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          <FeatureCard
            icon={<ShieldCheck size={22} />}
            title="Seguridad Total"
            description="TrueWallet con protección de 24h y verificación doble para tu tranquilidad financiera."
          />
          <FeatureCard
            icon={<Users size={22} />}
            title="Matriz de 12 Niveles"
            description="Sistema de capitalización automatizada que escala tu red mientras te enfocas en crecer."
          />
          <FeatureCard
            icon={<ShoppingBag size={22} />}
            title="Marketplace VIP"
            description="Acceso a precios de mayorista y redención de puntos en productos reales."
          />
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '60px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 40 }}>
          <Stat label="Usuarios Activos" value="+12K" />
          <Stat label="Transacciones" value="+850K" />
          <Stat label="Puntos Redimidos" value="98.5%" />
          <Stat label="Niveles de Red" value="12" />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13, borderTop: '1px solid var(--color-border)' }}>
        <p>© 2026 TrueCoin Simids. Todos los derechos reservados.</p>
        <p style={{ marginTop: 4, fontSize: 11 }}>SIMIDS TECHNOLOGY · COLOMBIA</p>
      </footer>
    </div>
  );
}

// ── Root with ThemeProvider ─────────────────────────────────
export default function Root() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
