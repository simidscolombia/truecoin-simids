'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Star, Zap, Building2, MapPin, Phone, LayoutGrid, List } from 'lucide-react';
import { businessService, Product, Business } from '../services/businessService';

const CATEGORIES = ['Todos', 'Alimentos', 'Electrónica', 'Hogar', 'Moda', 'Salud'];
const CITIES = ['Todas', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga'];

const MOCK_FALLBACK: Product[] = [
    { id: '1', business_id: null, name: 'Arroz Premium Bolívar 5kg', description: 'Arroz de grano largo seleccionado, cosecha directa de los llanos.', price_tc: 18.00, price_fiat: 24000, price_public: 32400, currency: 'COP', mlm_utility: 1.80, image_url: '', stock: 120, category: 'Alimentos', is_marketplace: true },
    { id: '2', business_id: null, name: 'Aceite La Favorita 3L', description: 'Aceite de girasol 100% natural, prensado en frío para tu salud.', price_tc: 22.00, price_fiat: 28000, price_public: 37800, currency: 'COP', mlm_utility: 2.20, image_url: '', stock: 80, category: 'Alimentos', is_marketplace: true },
    { id: '3', business_id: null, name: 'Audífonos Bluetooth Pro', description: 'Sonido HD con cancelación de ruido activa y batería de 40h.', price_tc: 89.00, price_fiat: 120000, price_public: 162000, currency: 'COP', mlm_utility: 8.90, image_url: '', stock: 30, category: 'Electrónica', is_marketplace: true },
    { id: '4', business_id: null, name: 'Café Juan Valdez 500g', description: 'Mezcla de origen colombiano, tostado medio, aroma intenso.', price_tc: 32.00, price_fiat: 42000, price_public: 56700, currency: 'COP', mlm_utility: 3.20, image_url: '', stock: 60, category: 'Alimentos', is_marketplace: true },
    { id: '5', business_id: null, name: 'Vitamina C 1000mg x60', description: 'Suplemento inmunológico de alta biodisponibilidad y pureza.', price_tc: 28.00, price_fiat: 38000, price_public: 51300, currency: 'COP', mlm_utility: 2.80, image_url: '', stock: 45, category: 'Salud', is_marketplace: true },
    { id: '6', business_id: null, name: 'Shampoo Pantene 750ml', description: 'Fórmula Pro-V para un cabello fuerte, brillante y saludable.', price_tc: 15.00, price_fiat: 22000, price_public: 29700, currency: 'COP', mlm_utility: 1.50, image_url: '', stock: 100, category: 'Hogar', is_marketplace: true },
    { id: '7', business_id: null, name: 'Camiseta Essential Dry-Fit', description: 'Tela transpirable ideal para deporte y uso casual diario.', price_tc: 45.00, price_fiat: 65000, price_public: 87750, currency: 'COP', mlm_utility: 4.50, image_url: '', stock: 50, category: 'Moda', is_marketplace: true },
    { id: '8', business_id: null, name: 'Azúcar Manuelita 2kg', description: 'Azúcar refinada de caña colombiana, calidad superior.', price_tc: 8.00, price_fiat: 12000, price_public: 16200, currency: 'COP', mlm_utility: 0.80, image_url: '', stock: 200, category: 'Alimentos', is_marketplace: true },
];

const CATEGORY_EMOJIS: Record<string, string> = {
    Alimentos: '🥗', Electrónica: '📱', Hogar: '🏠', Moda: '👕', Salud: '💊', Todos: '✨',
};

function ProductCard({ product, onBuy, layout = 'grid' }: { product: Product; onBuy: (p: Product) => void; layout?: 'grid' | 'list' }) {
    const isList = layout === 'list';
    const fiatPrice = product.price_fiat;
    const fiatPublic = product.price_public || fiatPrice * 1.35;
    const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: product.currency || 'COP', maximumFractionDigits: 0 }).format(val);

    return (
        <motion.div
            whileHover={{ y: isList ? 0 : -4, x: isList ? 4 : 0 }}
            className="product-card"
            style={{
                display: 'flex',
                flexDirection: isList ? 'row' : 'column',
                height: isList ? 140 : 'auto',
                alignItems: isList ? 'center' : 'stretch',
                overflow: 'hidden'
            }}
        >
            {/* Image Container - Forced 1:1 Aspect Ratio */}
            <div style={{
                width: isList ? 140 : '100%',
                aspectRatio: '1/1',
                background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRight: isList ? '1px solid var(--color-border)' : 'none',
                borderBottom: isList ? 'none' : '1px solid var(--color-border)',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
                padding: 12
            }}>
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                    <ShoppingBag size={isList ? 32 : 48} style={{ color: 'var(--color-marketplace)', opacity: 0.15 }} />
                )}
                
                {/* Micro-badge of Business */}
                <div style={{ 
                    position: 'absolute', top: 8, right: 8, width: 24, height: 24, 
                    borderRadius: '50%', background: 'var(--color-navy)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <Building2 size={10} color="white" />
                </div>
            </div>

            {/* Info Area - Clean & Minimal */}
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 12, lineHeight: 1.2, height: '2.4em', overflow: 'hidden' }}>
                        {product.name}
                    </h3>

                    {/* Matrix of Prices */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textDecoration: 'line-through', margin: 0 }}>
                            {formatCurrency(fiatPublic)}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                             <span style={{ fontSize: 13, fontWeight: 900, color: '#16A34A' }}>VIP {formatCurrency(fiatPrice)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                            <div style={{ width: 14, height: 14, background: 'var(--color-wallet)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Zap size={8} fill="white" color="white" />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--color-wallet)' }}>{product.price_tc.toFixed(2)} TC</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onBuy(product)}
                    className="btn btn-marketplace btn-full"
                    style={{ borderRadius: 8, height: 34, fontSize: 11, fontWeight: 800, marginTop: 16, padding: '0 8px' }}
                >
                    <ShoppingBag size={12} /> Canjear / Comprar
                </button>
            </div>
        </motion.div>
    );
}

function BusinessCard({ business, isGuest, onLoginRequired }: { business: Business; isGuest?: boolean; onLoginRequired?: () => void }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="card"
            style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}
        >
            <div style={{ height: 120, background: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Building2 size={40} color="white" style={{ opacity: 0.2 }} />
                <div style={{ position: 'absolute', bottom: -20, left: 20, width: 40, height: 40, background: 'var(--color-wallet)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <Building2 size={20} color="white" />
                </div>
                {business.membership_tier === 'vip' && (
                    <span style={{
                        position: 'absolute', top: 12, right: 12,
                        background: 'linear-gradient(135deg, #FFD700, #D4AF37)',
                        color: '#422006', fontSize: 10, fontWeight: 800,
                        padding: '4px 10px', borderRadius: 6, textTransform: 'uppercase',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>VIP</span>
                )}
            </div>
            <div style={{ padding: '28px 20px 20px' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 4 }}>{business.name}</h3>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-wallet)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{business.category}</span>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 12, lineHeight: 1.5, height: 40, overflow: 'hidden' }}>{business.description}</p>

                <div style={{ marginTop: 20, borderTop: '1px solid var(--color-border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: 12 }}>
                        <MapPin size={14} /> {business.address}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: 12 }}>
                        <Phone size={14} /> {business.phone}
                    </div>
                </div>

                <div style={{ marginTop: 24 }}>
                    <button
                        onClick={() => isGuest ? onLoginRequired?.() : null}
                        className="btn btn-outline btn-full btn-sm"
                    >
                        Ver Catálogo
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default function Marketplace({ onAddToCart, isGuest, onLoginRequired, viewMode = 'products' }: {
    onBack?: () => void;
    userBalance?: string;
    onAddToCart?: (p: Product) => void;
    isGuest?: boolean;
    onLoginRequired?: () => void;
    viewMode?: 'products' | 'businesses';
    setViewMode?: (v: 'products' | 'businesses') => void;
}) {
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [activeCity, setActiveCity] = useState('Todas');
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const fetch = async () => {
            try {
                const [pData, bData] = await Promise.all([
                    businessService.getMarketplaceProducts(),
                    businessService.getBusinesses()
                ]);
                setProducts(pData.length > 0 ? pData : MOCK_FALLBACK);
                setBusinesses(bData);
            } catch {
                setProducts(MOCK_FALLBACK);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const filteredProducts = products.filter(p => {
        const matchCat = activeCategory === 'Todos' || p.category === activeCategory;
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCity = activeCity === 'Todas' || (p as any).city === activeCity;
        return matchCat && matchSearch && matchCity;
    });

    const filteredBusinesses = businesses.filter(b => {
        const matchCat = activeCategory === 'Todos' || b.category === activeCategory;
        const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCity = activeCity === 'Todas' || b.address.includes(activeCity);
        return matchCat && matchSearch && matchCity;
    });

    const handleProductAction = (p: Product) => {
        if (onAddToCart) {
            onAddToCart(p);
        }
    };

    return (
        <div className="module-page animate-in">
            {/* Dynamic Color Filter Bar */}
            <div style={{
                background: viewMode === 'products' ? 'var(--color-marketplace)' : 'var(--color-directorio)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                transition: 'background-color 0.4s ease'
            }}>
                <div className="input-with-icon" style={{ flex: '1 1 200px', maxWidth: 300 }}>
                    <Search size={14} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)' }} />
                    <input
                        type="text"
                        placeholder={viewMode === 'products' ? "Buscar productos..." : "Buscar negocios..."}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%', height: 38, padding: '0 16px 0 44px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                            color: 'white', fontSize: 14, outline: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <select
                        value={activeCity}
                        onChange={(e) => setActiveCity(e.target.value)}
                        style={{
                            height: 38, padding: '0 12px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                            color: 'white', fontSize: 14, outline: 'none', minWidth: 140
                        }}
                    >
                        {CITIES.map(c => <option key={c} value={c} style={{ color: 'var(--color-navy)' }}>{c === 'Todas' ? '📍 Toda Colombia' : c}</option>)}
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <select
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value)}
                        style={{
                            height: 38, padding: '0 12px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                            color: 'white', fontSize: 14, outline: 'none', minWidth: 160
                        }}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat} style={{ color: 'var(--color-navy)' }}>
                                {CATEGORY_EMOJIS[cat]} {cat === 'Todos' ? 'Todas las Categorías' : cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Layout Toggle */}
                {viewMode === 'products' && (
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 3, marginLeft: 'auto' }}>
                        <button
                            onClick={() => setLayoutMode('grid')}
                            style={{
                                border: 'none', background: layoutMode === 'grid' ? 'white' : 'transparent',
                                color: layoutMode === 'grid' ? '#0a3d2e' : 'white',
                                padding: '6px 10px', borderRadius: 8, cursor: 'pointer', display: 'flex'
                            }}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setLayoutMode('list')}
                            style={{
                                border: 'none', background: layoutMode === 'list' ? 'white' : 'transparent',
                                color: layoutMode === 'list' ? '#0a3d2e' : 'white',
                                padding: '6px 10px', borderRadius: 8, cursor: 'pointer', display: 'flex'
                            }}
                        >
                            <List size={16} />
                        </button>
                    </div>
                )}
            </div>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                    <div style={{ width: 40, height: 40, border: '3px solid var(--color-border)', borderTopColor: 'var(--color-marketplace)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
            ) : (viewMode === 'products' ? filteredProducts : filteredBusinesses).length === 0 ? (
                <div style={{ textAlign: 'center', padding: 80, color: 'var(--color-text-muted)' }}>
                    {viewMode === 'products' ? <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: 16 }} /> : <Building2 size={48} style={{ opacity: 0.3, marginBottom: 16 }} />}
                    <p style={{ fontWeight: 600 }}>{viewMode === 'products' ? 'No se encontraron productos' : 'No se encontraron negocios'}</p>
                </div>
            ) : (
                <div style={{
                    display: viewMode === 'products' && layoutMode === 'list' ? 'flex' : 'grid',
                    flexDirection: 'column',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 20,
                    padding: '32px'
                }}>
                    {viewMode === 'products'
                        ? filteredProducts.map(p => (
                            <ProductCard key={p.id} product={p} onBuy={handleProductAction} layout={layoutMode} />
                        ))
                        : filteredBusinesses.map(b => (
                            <BusinessCard key={b.id} business={b} isGuest={isGuest} onLoginRequired={onLoginRequired} />
                        ))
                    }
                </div>
            )}
        </div>
    );
}
