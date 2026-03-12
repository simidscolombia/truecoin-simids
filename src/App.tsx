import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Coins, ShoppingBag, ArrowRight, Zap,
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
    { id: 'marketplace', label: 'ShopyBrands', icon: <ShoppingBag size={18} />, activeClass: 'active-market' },
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

// ── Main App ────────────────────────────────────────────────
function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [balance, setBalance] = useState('0.00');
  const [guestViewMode, setGuestViewMode] = useState<'products' | 'businesses'>('products');

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
      {/* Navbar Unified (Integrated with ShopyBrands) */}
      <nav style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 32px',
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'var(--color-navy)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={20} color="white" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-navy)', letterSpacing: -0.5 }}>
            True<span style={{ color: 'var(--color-wallet)' }}>Coin</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', background: 'var(--color-surface-2)', padding: '2px 6px', borderRadius: 6, marginLeft: 8, verticalAlign: 'middle' }}>v1.3.1</span>
          </span>
        </div>

        {/* Navigation Tabs - Centered & Integrated */}
        <div style={{
          height: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 12,
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: -1
        }}>
          <button
            onClick={() => setGuestViewMode('products')}
            style={{
              border: 'none',
              padding: '12px 24px',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: guestViewMode === 'products' ? 'var(--color-marketplace)' : 'transparent',
              color: guestViewMode === 'products' ? 'white' : 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <ShoppingBag size={16} /> Tienda en Línea
          </button>
          <button
            onClick={() => setGuestViewMode('businesses')}
            style={{
              border: 'none',
              padding: '12px 24px',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: guestViewMode === 'businesses' ? 'var(--color-directorio)' : 'transparent',
              color: guestViewMode === 'businesses' ? 'white' : 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Search size={16} /> Directorio
          </button>
        </div>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={{
            background: 'var(--color-surface-2)',
            border: 'none',
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)',
            cursor: 'pointer'
          }}>
            <ShoppingBag size={20} />
          </button>

          <button
            onClick={() => setShowAuth(true)}
            className="btn btn-navy"
            style={{ borderRadius: 12, padding: '10px 24px' }}
          >
            Ingresar
          </button>
        </div>
      </nav>

      {/* Auth Overlay */}
      {
        showAuth && (
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
        )
      }

      {/* 1. Marketplace Top (Main focus - Integrated as ShopyBrands) */}
      <Marketplace
        isGuest={true}
        onLoginRequired={() => setShowAuth(true)}
        viewMode={guestViewMode}
        setViewMode={setGuestViewMode}
      />

      {/* 2. VIP Club Benefits & Video (Secondary/Validation) */}
      <section style={{ background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)', padding: '80px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 60, alignItems: 'center' }}>

          {/* Video Right (moved for variety) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ width: '100%', aspectRatio: '16/9', background: 'var(--color-surface)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 50px rgba(11,31,75,0.1)', border: '1px solid var(--color-border)' }}
          >
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--color-navy), var(--color-pos))', color: 'white' }}>
              <div style={{ width: 64, height: 44, background: '#FF0000', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '16px solid white', marginLeft: 4 }} />
              </div>
              <p style={{ marginTop: 16, fontSize: 13, fontWeight: 600, opacity: 0.8 }}>¿Cómo funciona TrueCoin? (3 Min)</p>
            </div>
          </motion.div>

          {/* Content Left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'color-mix(in srgb, var(--color-wallet) 12%, white)', color: 'var(--color-wallet)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 20 }}>
              <Zap size={13} /> Club VIP TrueCoin
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 20, lineHeight: 1.2 }}>
              Bienvenido al primer Club VIP <br /> <span style={{ color: 'var(--color-cloud-blue)' }}>impulsado por IA.</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--color-text-muted)', marginBottom: 32, lineHeight: 1.6 }}>
              Únete a nuestra red de referidos como <strong>Miembro VIP</strong> y accede a precios de mayorista directo de fábrica. Ahorra en tus compras, gana por expandir la red y crece con nosotros.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={() => setShowAuth(true)} className="btn btn-navy btn-lg" style={{ padding: '0 32px' }}>
                Registrarme Ahora <ArrowRight size={18} style={{ marginLeft: 8 }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13, borderTop: '1px solid var(--color-border)' }}>
        <p>© 2026 TrueCoin Simids. Todos los derechos reservados.</p>
        <p style={{ marginTop: 4, fontSize: 11 }}>SIMIDS TECHNOLOGY · COLOMBIA</p>
      </footer>
    </div >
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
