'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { businessService, Product, Business } from '../services/businessService';
import {
    ArrowLeft, MapPin, Phone, Star, ShieldCheck,
    MessageSquare, ShoppingBag, Globe, Zap, Plus, X, ChevronRight
} from 'lucide-react';

interface BusinessProfileProps {
    business: Business;
    onBack: () => void;
    onPurchase: (amount: number) => void;
    userBalance: string;
}

const MOCK_CATALOG: Product[] = [
    { id: 'p1', business_id: '', name: 'Menú del Día Completo', description: 'Sopa, plato fuerte, jugo y postre.', price_tc: 15, price_fiat: 18000, price_public: 24300, currency: 'COP', mlm_utility: 1.5, image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400', stock: 50, category: 'Comida', is_marketplace: false },
    { id: 'p2', business_id: '', name: 'Bandeja Paisa Premium', description: 'La auténtica bandeja con chicharrón, chorizo y más.', price_tc: 28, price_fiat: 35000, price_public: 47250, currency: 'COP', mlm_utility: 2.8, image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=400', stock: 30, category: 'Comida', is_marketplace: false },
    { id: 'p3', business_id: '', name: 'Café Especial + Postre', description: 'Café de origen colombiano con torta de la casa.', price_tc: 12, price_fiat: 15000, price_public: 20250, currency: 'COP', mlm_utility: 1.2, image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400', stock: 100, category: 'Café', is_marketplace: false },
    { id: 'p4', business_id: '', name: 'Ceviche de Camarón', description: 'Fresco, con limón y aguacate de la costa.', price_tc: 22, price_fiat: 28000, price_public: 37800, currency: 'COP', mlm_utility: 2.2, image_url: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?q=80&w=400', stock: 20, category: 'Comida', is_marketplace: false },
];

export default function BusinessProfile({ business, onBack, onPurchase, userBalance }: BusinessProfileProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPurchased, setIsPurchased] = useState(false);
    const [catalog, setCatalog] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await businessService.getBusinessCatalog(business.id);
                setCatalog(data.length > 0 ? data : MOCK_CATALOG);
            } catch {
                setCatalog(MOCK_CATALOG);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [business.id]);

    const handlePurchase = () => {
        if (!selectedProduct) return;
        onPurchase(selectedProduct.price_tc);
        setIsPurchased(true);
        setTimeout(() => {
            setIsPurchased(false);
            setShowConfirm(false);
            setSelectedProduct(null);
        }, 2500);
    };

    return (
        <div className="module-page animate-in" style={{ padding: 0 }}>

            {/* Hero Cover */}
            <div style={{ position: 'relative', height: 220, overflow: 'hidden', flexShrink: 0 }}>
                {business.image_url && (
                    <img
                        src={business.image_url}
                        alt={business.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,31,75,0.85) 0%, rgba(11,31,75,0.3) 60%, transparent 100%)' }} />

                {/* Back button */}
                <button
                    onClick={onBack}
                    style={{ position: 'absolute', top: 16, left: 20, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                    <ArrowLeft size={14} /> Directorio
                </button>

                {/* Business Name on cover */}
                <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', letterSpacing: -0.5 }}>{business.name}</h1>
                        {business.is_vip && <ShieldCheck size={20} color="#4ADE80" />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', background: 'var(--color-directorio)', color: 'white', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {business.category}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Star size={13} fill="#FBBF24" color="#FBBF24" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{business.rating}</span>
                        </div>
                    </div>
                </div>

                {/* Social links */}
                <div style={{ position: 'absolute', top: 16, right: 20, display: 'flex', gap: 8 }}>
                    {[Globe, MessageSquare].map((Icon, i) => (
                        <button key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
                            <Icon size={16} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, padding: '24px 28px', flex: 1 }}>

                {/* --- Sidebar --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Info Card */}
                    <div className="card" style={{ padding: '20px 18px' }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 12 }}>Información</h3>
                        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 14 }}>
                            {business.description}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 14, borderTop: '1px solid var(--color-border)' }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                <MapPin size={14} style={{ color: 'var(--color-directorio)', flexShrink: 0, marginTop: 1 }} />
                                <span style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{business.address}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <Phone size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{business.phone}</span>
                            </div>
                        </div>
                        <button className="btn btn-directorio btn-full btn-sm" style={{ justifyContent: 'center', marginTop: 16 }}>
                            <MessageSquare size={14} /> Contactar Negocio
                        </button>
                    </div>

                    {/* VIP Benefit */}
                    <div style={{ padding: '16px 18px', borderRadius: 14, background: 'color-mix(in srgb, var(--color-wallet) 8%, white)', border: '1px solid color-mix(in srgb, var(--color-wallet) 20%, white)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                            <Zap size={14} style={{ color: 'var(--color-wallet)' }} />
                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-wallet)' }}>Beneficio VIP</span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                            Este negocio entrega <strong style={{ color: 'var(--color-wallet)' }}>2% extra de Cashback</strong> al pagar con TrueCoin.
                        </p>
                    </div>

                    {/* User Balance */}
                    <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>Mi Saldo</span>
                        <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-wallet)' }}>
                            {userBalance} <span style={{ fontSize: 12 }}>TC</span>
                        </span>
                    </div>
                </div>

                {/* --- Product Catalog --- */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <ShoppingBag size={20} style={{ color: 'var(--color-directorio)' }} />
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-navy)' }}>Catálogo de Productos</h2>
                        <span className="badge badge-directorio">{catalog.length} items</span>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                            <div style={{ width: 36, height: 36, border: '3px solid var(--color-border)', borderTopColor: 'var(--color-directorio)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                            {catalog.map(product => (
                                <motion.div
                                    key={product.id}
                                    whileHover={{ y: -4 }}
                                    className="card"
                                    style={{ overflow: 'hidden', cursor: 'pointer', borderTop: '2px solid var(--color-directorio)' }}
                                    onClick={() => { setSelectedProduct(product); setShowConfirm(true); }}
                                >
                                    {product.image_url && (
                                        <div style={{ height: 130, overflow: 'hidden' }}>
                                            <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', display: 'block' }}
                                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                        </div>
                                    )}
                                    <div style={{ padding: '12px 14px' }}>
                                        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 4 }}>{product.name}</h4>
                                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4, marginBottom: 10, WebkitLineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>
                                            {product.description}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-directorio)' }}>{product.price_tc.toFixed(1)} <span style={{ fontSize: 11, fontWeight: 600 }}>TC</span></p>
                                                <p style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>+{product.mlm_utility} TC → red</p>
                                            </div>
                                            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-directorio)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Plus size={16} color="white" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Purchase Confirm Modal */}
            <AnimatePresence>
                {showConfirm && selectedProduct && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => { if (!isPurchased) { setShowConfirm(false); setSelectedProduct(null); } }}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(11,31,75,0.6)', backdropFilter: 'blur(8px)' }}
                        />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="card-lg"
                            style={{ position: 'relative', zIndex: 510, maxWidth: 380, width: '100%', padding: 36, textAlign: 'center' }}
                        >
                            {!isPurchased ? (
                                <>
                                    <button onClick={() => { setShowConfirm(false); setSelectedProduct(null); }}
                                        style={{ position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: '50%', background: 'var(--color-surface-2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <X size={14} style={{ color: 'var(--color-text-muted)' }} />
                                    </button>
                                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-directorio) 12%, white)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-directorio)' }}>
                                        <ShoppingBag size={26} />
                                    </div>
                                    <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 8 }}>Confirmar Compra</h2>
                                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>Pagarás con tus TrueCoins disponibles</p>
                                    <div style={{ background: 'var(--color-surface-2)', borderRadius: 14, padding: '14px 18px', marginBottom: 20, textAlign: 'left' }}>
                                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 8 }}>{selectedProduct.name}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Precio:</span>
                                            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-directorio)' }}>{selectedProduct.price_tc.toFixed(1)} TC</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
                                            <span style={{ fontSize: 11, color: 'var(--color-wallet)', fontWeight: 600 }}>Aporte a la RED:</span>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-wallet)' }}>+{selectedProduct.mlm_utility} TC</span>
                                        </div>
                                    </div>
                                    <button onClick={handlePurchase} className="btn btn-directorio btn-full btn-lg" style={{ justifyContent: 'center' }}>
                                        Confirmar y Pagar <Zap size={16} />
                                    </button>
                                    <p style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                        Transacción protegida por Simids Technology
                                    </p>
                                </>
                            ) : (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                        <ChevronRight size={40} />
                                    </div>
                                    <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)' }}>¡Compra Exitosa!</h2>
                                    <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 8 }}>El negocio ha sido notificado de tu pedido.</p>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
