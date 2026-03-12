'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Star, Zap, CheckCircle2, Filter, Tag } from 'lucide-react';
import { businessService, Product } from '../services/businessService';

const CATEGORIES = ['Todos', 'Alimentos', 'Electrónica', 'Hogar', 'Moda', 'Salud'];
const CITIES = ['Todas', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga'];

const MOCK_FALLBACK: Product[] = [
    { id: '1', business_id: null, name: 'Arroz Premium Bolívar 5kg', description: 'Arroz de grano largo seleccionado, cosecha directa.', price_tc: 18.00, mlm_utility: 1.80, image_url: '', stock: 120, category: 'Alimentos', is_marketplace: true },
    { id: '2', business_id: null, name: 'Aceite La Favorita 3L', description: 'Aceite de girasol 100% natural, prensado en frío.', price_tc: 22.00, mlm_utility: 2.20, image_url: '', stock: 80, category: 'Alimentos', is_marketplace: true },
    { id: '3', business_id: null, name: 'Audífonos Bluetooth Pro', description: 'Sonido HD con cancelación de ruido activa.', price_tc: 89.00, mlm_utility: 8.90, image_url: '', stock: 30, category: 'Electrónica', is_marketplace: true },
    { id: '4', business_id: null, name: 'Café Juan Valdez 500g', description: 'Mezcla de origen colombiano, tostado medio.', price_tc: 32.00, mlm_utility: 3.20, image_url: '', stock: 60, category: 'Alimentos', is_marketplace: true },
    { id: '5', business_id: null, name: 'Vitamina C 1000mg x60', description: 'Suplemento inmunológico de alta biodisponibilidad.', price_tc: 28.00, mlm_utility: 2.80, image_url: '', stock: 45, category: 'Salud', is_marketplace: true },
    { id: '6', business_id: null, name: 'Shampoo Pantene 750ml', description: 'Fórmula Pro-V para cabello fuerte y brillante.', price_tc: 15.00, mlm_utility: 1.50, image_url: '', stock: 100, category: 'Hogar', is_marketplace: true },
    { id: '7', business_id: null, name: 'Camiseta Essential Dry-Fit', description: 'Tela transpirable ideal para deporte y casual.', price_tc: 45.00, mlm_utility: 4.50, image_url: '', stock: 50, category: 'Moda', is_marketplace: true },
    { id: '8', business_id: null, name: 'Azúcar Manuelita 2kg', description: 'Azúcar refinada de caña colombiana.', price_tc: 8.00, mlm_utility: 0.80, image_url: '', stock: 200, category: 'Alimentos', is_marketplace: true },
];

const CATEGORY_EMOJIS: Record<string, string> = {
    Alimentos: '🥗', Electrónica: '📱', Hogar: '🏠', Moda: '👕', Salud: '💊', Todos: '✨',
};

function ProductCard({ product, onBuy, isGuest }: { product: Product; onBuy: (p: Product) => void; isGuest?: boolean }) {
    const netPrice = product.price_tc;
    const publicPrice = netPrice * 1.3; // 30% más para público general
    const aporte = (product.mlm_utility * 0.1).toFixed(2);

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="product-card"
            style={{ display: 'flex', flexDirection: 'column' }}
        >
            {/* Image */}
            <div style={{
                height: 160, background: 'color-mix(in srgb, var(--color-marketplace) 8%, white)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderBottom: '1px solid var(--color-border)', position: 'relative',
                overflow: 'hidden',
            }}>
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <ShoppingBag size={48} style={{ color: 'var(--color-marketplace)', opacity: 0.25 }} />
                )}
                <span
                    style={{
                        position: 'absolute', top: 12, left: 12,
                        background: 'var(--color-marketplace)', color: 'white',
                        fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.08em', padding: '3px 10px', borderRadius: 999,
                    }}
                >
                    {product.category}
                </span>
            </div>

            {/* Info */}
            <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 6, lineHeight: 1.3 }}>
                    {product.name}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: 14, flex: 1 }}>
                    {product.description}
                </p>

                {/* Stars */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 14 }}>
                    {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={12} fill={s <= 4 ? 'var(--color-wallet)' : 'none'} color={s <= 4 ? 'var(--color-wallet)' : 'var(--color-border-strong)'} />
                    ))}
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 4 }}>(24)</span>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
                        <div>
                            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', textDecoration: 'line-through', marginBottom: 2 }}>
                                Precio Público: {publicPrice.toFixed(2)} TC
                            </p>
                            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-marketplace)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Star size={12} fill="var(--color-marketplace)" /> Precio VIP
                            </p>
                            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1 }}>
                                {netPrice.toFixed(2)} <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>TC</span>
                            </p>
                        </div>
                        <div style={{
                            background: 'color-mix(in srgb, var(--color-marketplace) 10%, white)',
                            border: '1px solid color-mix(in srgb, var(--color-marketplace) 20%, white)',
                            borderRadius: 8, padding: '4px 10px', textAlign: 'right',
                        }}>
                            <p style={{ fontSize: 10, color: 'var(--color-marketplace)', fontWeight: 700, textTransform: 'uppercase' }}>Aporte Red</p>
                            <p style={{ fontSize: 13, color: 'var(--color-marketplace)', fontWeight: 800 }}>{aporte} TC</p>
                        </div>
                    </div>

                    <button
                        onClick={() => onBuy(product)}
                        className={`btn ${isGuest ? 'btn-navy' : 'btn-marketplace'} btn-full`}
                        style={{ borderRadius: 10, gap: 8 }}
                    >
                        {isGuest ? <><Zap size={15} /> Obtener Precio VIP</> : <><ShoppingBag size={15} /> Comprar Ahora</>}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default function Marketplace({ onBack, userBalance, onPurchase, isGuest, onLoginRequired }: {
    onBack?: () => void;
    userBalance?: string;
    onPurchase?: (amount: number) => void;
    isGuest?: boolean;
    onLoginRequired?: () => void;
}) {
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [activeCity, setActiveCity] = useState('Todas');
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    void onBack; // retained for navigation prop interface

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await businessService.getMarketplaceProducts();
                setProducts(data.length > 0 ? data : MOCK_FALLBACK);
            } catch {
                setProducts(MOCK_FALLBACK);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const filtered = products.filter(p => {
        const matchCat = activeCategory === 'Todos' || p.category === activeCategory;
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        // Simulación: Algunos productos pertenecen a ciudades específicas (Bogotá/Medellín)
        const mockCity = p.id === '1' || p.id === '3' ? 'Bogotá' : 'Medellín';
        const matchCity = activeCity === 'Todas' || mockCity === activeCity;
        return matchCat && matchSearch && matchCity;
    });

    const handleProductAction = (p: Product) => {
        if (isGuest) {
            onLoginRequired?.();
            return;
        }
        setSelectedProduct(p);
    };

    const confirmPurchase = () => {
        if (!selectedProduct || !onPurchase) return;
        onPurchase(selectedProduct.price_tc);
        setIsSuccess(true);
        setTimeout(() => { setIsSuccess(false); setSelectedProduct(null); }, 3000);
    };

    return (
        <div className="module-page animate-in">

            {/* Module Header */}
            <div className="module-header-marketplace" style={{ padding: isGuest ? '20px 32px' : '28px 32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <ShoppingBag size={isGuest ? 20 : 24} color="white" />
                            <h1 style={{ fontSize: isGuest ? 20 : 24, fontWeight: 800, color: 'white', letterSpacing: -0.5 }}>
                                Marketplace <span style={{ opacity: 0.8 }}>VIP</span>
                            </h1>
                        </div>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                            {isGuest ? 'Precios de mayorista exclusivos para Miembros.' : 'Paga con su saldo TrueCoin'}
                        </p>
                    </div>
                    {!isGuest && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                                borderRadius: 12, padding: '8px 18px', border: '1px solid rgba(255,255,255,0.2)',
                                display: 'flex', alignItems: 'center', gap: 10,
                            }}>
                                <Tag size={16} color="white" />
                                <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{Number(userBalance || 0).toFixed(2)}</span>
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600 }}>TC disponibles</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Filters Bar */}
            <div style={{
                background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)',
                padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            }}>
                <div className="input-with-icon" style={{ flex: '1 1 200px', maxWidth: 300 }}>
                    <Search size={14} className="input-icon" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="input input-sm"
                        style={{ paddingLeft: 36 }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Filter size={14} color="var(--color-text-muted)" />
                    <select
                        value={activeCity}
                        onChange={(e) => setActiveCity(e.target.value)}
                        className="input input-sm"
                        style={{ width: 'auto', minWidth: 140 }}
                    >
                        {CITIES.map(c => <option key={c} value={c}>{c === 'Todas' ? 'Toda Colombia' : c}</option>)}
                    </select>
                </div>

                <div className="category-pills" style={{ flex: 1 }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`pill pill-sm ${activeCategory === cat ? 'active-marketplace' : ''}`}
                        >
                            {CATEGORY_EMOJIS[cat]} {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div style={{ padding: '24px 32px' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                        <div style={{ width: 40, height: 40, border: '3px solid var(--color-border)', borderTopColor: 'var(--color-marketplace)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 80, color: 'var(--color-text-muted)' }}>
                        <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                        <p style={{ fontWeight: 600 }}>No se encontraron productos</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 20 }}>
                        {filtered.map(p => (
                            <ProductCard key={p.id} product={p} onBuy={handleProductAction} isGuest={isGuest} />
                        ))}
                    </div>
                )}
            </div>

            {/* Confirm Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => !isSuccess && setSelectedProduct(null)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(11,31,75,0.6)', backdropFilter: 'blur(8px)' }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="card-lg"
                            style={{ position: 'relative', zIndex: 310, width: '100%', maxWidth: 420, padding: 36, textAlign: 'center' }}
                        >
                            {!isSuccess ? (
                                <>
                                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-marketplace) 12%, white)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--color-marketplace)' }}>
                                        <ShoppingBag size={30} />
                                    </div>
                                    <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 8 }}>Confirmar Compra</h2>
                                    <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>
                                        Estás a punto de adquirir: <strong style={{ color: 'var(--color-navy)' }}>{selectedProduct.name}</strong>
                                    </p>
                                    <div style={{ background: 'var(--color-bg)', borderRadius: 12, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Precio del producto:</span>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>{selectedProduct.price_tc.toFixed(2)} TC</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: 13, color: 'var(--color-marketplace)' }}>Aporte Red (10%):</span>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-marketplace)' }}>{(selectedProduct.mlm_utility * 0.1).toFixed(2)} TC</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <button onClick={() => setSelectedProduct(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancelar</button>
                                        <button onClick={confirmPurchase} className="btn btn-marketplace" style={{ flex: 2 }}>Confirmar y Comprar</button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ padding: '20px 0' }}>
                                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#16A34A' }}>
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 8 }}>¡Compra Exitosa!</h2>
                                    <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                                        Tus puntos han sido descontados. El proveedor iniciará el despacho en breve.<br />
                                        <span style={{ color: 'var(--color-marketplace)', fontWeight: 700 }}>10% distribuido en tu red.</span>
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
