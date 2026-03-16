import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins, ShoppingBag, ArrowRight, Zap,
  LayoutDashboard, Search, Settings, LogOut, Users
} from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import POSSystem from './components/POSSystem';
import ShopyFam from './components/ShopyFam';
import ProspectManager from './components/ProspectManager';
import AIChatSupport from './components/AIChatSupport';
import AdminDashboard from './components/AdminDashboard';
import { userService } from './services/userService';
import { Product } from './services/businessService';
import ShoppingCart from './components/ShoppingCart';

import { useState } from 'react';
type AppView = 'dashboard' | 'marketplace' | 'pos' | 'admin' | 'shopyfam' | 'prospects';

function Header({
  isLoggedIn,
  isAdmin,
  onLogout,
  onLogin,
  currentView,
  onNavigate,
  viewMode,
  setViewMode,
  cartCount,
  onOpenCart,
  balance
}: {
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
  onLogin: () => void;
  currentView: AppView;
  onNavigate: (v: AppView) => void;
  viewMode?: 'products' | 'businesses';
  setViewMode?: (v: 'products' | 'businesses') => void;
  cartCount: number;
  onOpenCart: () => void;
  balance?: string;
}) {
  return (
    <nav className="app-header" style={{
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
        <span className="header-logo-text" style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-navy)', letterSpacing: -0.5 }}>
          Shopy<span style={{ color: 'var(--color-wallet)' }}>Brands</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', background: 'var(--color-surface-2)', padding: '2px 6px', borderRadius: 6, marginLeft: 8, verticalAlign: 'middle', display: 'inline-block' }}>V2.6.2 — DYNAMIC KEYS & TRACKING</span>
        </span>
      </div>

      {/* Navigation Tabs - Centered & Integrated */}
      <div className="header-nav" style={{
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 12,
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: -1
      }}>
        {/* Marketplace / Products */}
        <button
          onClick={() => {
            onNavigate('marketplace');
            if (setViewMode) setViewMode('products');
          }}
          style={{
            border: 'none',
            padding: '12px 24px',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: (currentView === 'marketplace' && viewMode === 'products') ? 'var(--color-marketplace)' : 'transparent',
            color: (currentView === 'marketplace' && viewMode === 'products') ? 'white' : 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <ShoppingBag size={16} /> Tienda en Línea
        </button>

        {/* Directory / Businesses */}
        <button
          onClick={() => {
            onNavigate('marketplace');
            if (setViewMode) setViewMode('businesses');
          }}
          style={{
            border: 'none',
            padding: '12px 24px',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: (currentView === 'marketplace' && viewMode === 'businesses') ? 'var(--color-pos)' : 'transparent',
            color: (currentView === 'marketplace' && viewMode === 'businesses') ? 'white' : 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Search size={16} /> Directorio
        </button>

        {isLoggedIn && !isAdmin && (
          <button
            onClick={() => onNavigate('dashboard')}
            style={{
              border: 'none',
              padding: '12px 24px',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: currentView === 'dashboard' ? 'var(--color-wallet)' : 'transparent',
              color: currentView === 'dashboard' ? 'white' : 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>
        )}

        {isLoggedIn && !isAdmin && (
          <button
            onClick={() => onNavigate('shopyfam')}
            style={{
              border: 'none',
              padding: '12px 24px',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: currentView === 'shopyfam' ? 'var(--color-cloud-blue)' : 'transparent',
              color: currentView === 'shopyfam' ? 'white' : 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Users size={16} /> ShopyFam
          </button>
        )}

        {isLoggedIn && isAdmin && (
          <button
            onClick={() => onNavigate('admin')}
            style={{
              border: 'none',
              padding: '12px 24px',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: currentView === 'admin' ? 'var(--color-admin)' : 'transparent',
              color: currentView === 'admin' ? 'white' : 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Settings size={16} /> Admin Cerebro
          </button>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {isLoggedIn && balance && !isAdmin && (
          <div className="header-balance" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Tu Saldo</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-wallet)' }}>{balance} TC</span>
          </div>
        )}

        <button
          onClick={onOpenCart}
          style={{
            background: 'var(--color-surface-2)',
            border: 'none',
            width: 44,
            height: 44,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.2s'
          }}>
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -4,
              right: -4,
              background: 'var(--color-marketplace)',
              color: 'white',
              fontSize: 10,
              fontWeight: 800,
              width: 20,
              height: 20,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white'
            }}>
              {cartCount}
            </span>
          )}
        </button>

        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={onLogout}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="btn btn-navy"
            style={{ borderRadius: 12, padding: '10px 24px' }}
          >
            Ingresar
          </button>
        )}
      </div>
    </nav>
  );
}

// ── Main App ────────────────────────────────────────────────
function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<AppView>('marketplace');
  const [balance, setBalance] = useState('0.00');
  const [guestViewMode, setGuestViewMode] = useState<'products' | 'businesses'>('products');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);

  // ── Manejo de Retorno de Wompi ──
  useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('id') || params.get('reference')) {
        setTimeout(() => {
          alert("🚀 ¡Pago en proceso! Estamos activando tu cuenta ShopyBrands. \n\nRecibirás un WhatsApp en breve y ya podrás iniciar sesión con tu correo.");
          window.history.replaceState({}, document.title, window.location.pathname);
        }, 1000);
      }
    }
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setShowCart(true); // Open cart when adding item
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleRegisterSuccess = async (profile: any) => {
    // Definimos quién es Admin
    const isSuperAdmin = profile.email?.toLowerCase() === 'elkindanielcastillo@gmail.com' || profile.referral_code === 'TCMASTER';

    setUser({
      fullName: profile.full_name,
      referralCode: profile.referral_code,
      id: profile.id,
      email: profile.email
    });

    setIsAdmin(isSuperAdmin);

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

    // Redirigir según rol
    if (isSuperAdmin) {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
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
    setIsAdmin(false);
    setUser(null);
    setBalance('0.00');
    setCurrentView('marketplace');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Header
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onLogin={() => setShowAuth(true)}
        currentView={currentView}
        onNavigate={setCurrentView}
        viewMode={guestViewMode}
        setViewMode={setGuestViewMode}
        cartCount={cartCount}
        onOpenCart={() => setShowCart(true)}
        balance={balance}
      />

      {/* Auth Overlay */}
      <AnimatePresence>
        {showAuth && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuth(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(11,31,75,0.6)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ position: 'relative', zIndex: 310, width: '100%', maxWidth: 440 }}
            >
              <RegistrationForm onSuccess={handleRegisterSuccess} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main>
        {currentView === 'marketplace' && (
          <div className="animate-in">
            <Marketplace
              isGuest={!isLoggedIn}
              onLoginRequired={() => setShowAuth(true)}
              viewMode={guestViewMode}
              setViewMode={setGuestViewMode}
              onAddToCart={addToCart}
              userBalance={balance}
            />
          </div>
        )}

        {currentView === 'dashboard' && isLoggedIn && (
          <div className="animate-in">
            <Dashboard
              user={user}
              balance={balance}
              onGoToStore={() => { setCurrentView('marketplace'); setGuestViewMode('products'); }}
              onGoToPOS={() => setCurrentView('pos')}
              onGoToDirectory={() => { setCurrentView('marketplace'); setGuestViewMode('businesses'); }}
              onGoToFam={() => setCurrentView('shopyfam')}
              onGoToAdmin={() => setCurrentView('admin')}
              onGoToProspects={() => setCurrentView('prospects')}
            />
          </div>
        )}

        {currentView === 'prospects' && isLoggedIn && (
          <div className="animate-in">
            <ProspectManager user={user} />
          </div>
        )}

        {currentView === 'shopyfam' && isLoggedIn && (
          <div className="animate-in">
            <ShopyFam user={user} />
          </div>
        )}

        {currentView === 'pos' && isLoggedIn && isAdmin && (
          <div className="animate-in">
            <POSSystem onBack={() => setCurrentView('dashboard')} />
          </div>
        )}

        {currentView === 'admin' && isLoggedIn && isAdmin && (
          <div className="animate-in">
            <AdminDashboard onBack={() => setCurrentView('dashboard')} />
          </div>
        )}
      </main>

      <ShoppingCart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onClear={clearCart}
        isLoggedIn={isLoggedIn}
        onLogin={() => setShowAuth(true)}
        onPurchase={handlePurchase}
      />

      {/* Landing Features Section (Only show on marketplace or dashboard as context) */}
      {(currentView === 'marketplace' || currentView === 'dashboard') && (
        <section style={{ background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)', padding: '80px 32px' }}>
          <div className="landing-grid" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center' }}>
            {/* Video Left */}
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
                <p style={{ marginTop: 16, fontSize: 13, fontWeight: 600, opacity: 0.8 }}>¿Cómo funciona ShopyBrands? (3 Min)</p>
              </div>
            </motion.div>

            {/* Content Right */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'color-mix(in srgb, var(--color-wallet) 12%, white)', color: 'var(--color-wallet)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 20 }}>
                <Zap size={13} /> Club VIP ShopyBrands
              </div>
              <h2 className="landing-title" style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 20, lineHeight: 1.2 }}>
                Bienvenido al primer Club VIP <br /> <span style={{ color: 'var(--color-cloud-blue)' }}>impulsado por IA.</span>
              </h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                Bienvenido a tu ecosistema ShopyBrands · 12 Mar 2026
              </p>
              <p style={{ fontSize: 16, color: 'var(--color-text-muted)', marginBottom: 32, lineHeight: 1.6 }}>
                Únete a nuestra red de referidos como <strong>Miembro VIP</strong> y accede a precios de mayorista directo de fábrica. Ahorra en tus compras, gana por expandir la red y crece con nosotros.
              </p>
              {!isLoggedIn && (
                <button onClick={() => setShowAuth(true)} className="btn btn-navy btn-lg" style={{ padding: '0 32px' }}>
                  Registrarme Ahora <ArrowRight size={18} style={{ marginLeft: 8 }} />
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13, borderTop: '1px solid var(--color-border)' }}>
        <p>© 2026 ShopyBrands. Todos los derechos reservados.</p>
        <p style={{ marginTop: 4, fontSize: 11 }}>SIMIDS TECHNOLOGY · COLOMBIA</p>
      </footer>

      <AIChatSupport />
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
