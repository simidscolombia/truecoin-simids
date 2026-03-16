'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search, MapPin, Phone, Star, Filter,
    ShieldCheck, ShoppingBag, ExternalLink, ChevronRight
} from 'lucide-react';
import BusinessProfile from './BusinessProfile';
import { businessService, Business } from '../services/businessService';

const CATEGORIES = ['Todos', 'Gastronomía', 'Construcción', 'Salud', 'Moda', 'Tecnología', 'Hogar', 'Servicios'];
const CITIES = ['Todas', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga'];

const CAT_EMOJIS: Record<string, string> = {
    Todos: '🗺️', Gastronomía: '🍽️', Construcción: '🏗️',
    Salud: '💊', Moda: '👗', Tecnología: '💻', Hogar: '🏠', Servicios: '⚙️',
};

const MOCK_BUSINESSES: Business[] = [
    { id: 'b1', owner_id: '', name: 'Restaurante El Poblado', category: 'Gastronomía', description: 'Cocina colombiana de autor con ingredientes de la región.', address: 'Cl 10 #38-38, El Poblado, Medellín', phone: '+57 300 1234567', is_vip: true, membership_tier: 'vip', source: 'local', rating: 4.8, image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400', payment_config: {} },
    { id: 'b2', owner_id: '', name: 'TechStore Laureles', category: 'Tecnología', description: 'Tienda de electrónica y accesorios con garantía y soporte.', address: 'Cra 70 #44B-10, Laureles, Medellín', phone: '+57 301 9876543', is_vip: true, membership_tier: 'vip', source: 'local', rating: 4.5, image_url: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=400', payment_config: {} },
    { id: 'b3', owner_id: '', name: 'Andino Gourmet Bogotá', category: 'Gastronomía', description: 'Experiencia culinaria de alto nivel en el corazón de la capital.', address: 'Cra 11 #82-71, Bogotá', phone: '+57 302 5551234', is_vip: true, membership_tier: 'vip', source: 'google', rating: 4.9, image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400', payment_config: {} },
    { id: 'b4', owner_id: '', name: 'Clínica Dental Cali', category: 'Salud', description: 'Odontología estética y general. Ortodoncistas certificados.', address: 'Av 6N #22-04, Cali', phone: '+57 304 8887654', is_vip: false, membership_tier: 'free', source: 'google', rating: 4.3, image_url: 'https://images.unsplash.com/photo-1629909615957-be38d48fbbe4?q=80&w=400', payment_config: {} },
    { id: 'b5', owner_id: '', name: 'Moda Caribe Barranquilla', category: 'Moda', description: 'Ropa casual y formal para hombre y mujer. Estilo fresco.', address: 'Cc Buenavista, Barranquilla', phone: '+57 305 3334455', is_vip: false, membership_tier: 'free', source: 'local', rating: 4.1, image_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=400', payment_config: {} },
    { id: 'b6', owner_id: '', name: 'Constructora del Valle', category: 'Construcción', description: 'Remodelaciones y obra gris con los mejores materiales.', address: 'Avenida Sexta #18-70, Cali', phone: '+57 303 6667788', is_vip: false, membership_tier: 'free', source: 'google', rating: 4.4, image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=400', payment_config: {} },
];

interface DirectoryProps {
    onBack: () => void;
    userBalance: string;
    onPurchase: (amount: number) => void;
}

export default function Directory({ onBack, userBalance, onPurchase }: DirectoryProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedCity, setSelectedCity] = useState('Todas');
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);

    void onBack; // navigation managed by App sidebar

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await businessService.getBusinesses();
                setBusinesses(data.length > 0 ? data : MOCK_BUSINESSES);
            } catch {
                setBusinesses(MOCK_BUSINESSES);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const filtered = businesses.filter(b => {
        const matchSearch =
            b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = selectedCategory === 'Todos' || b.category === selectedCategory;
        const matchCity = selectedCity === 'Todas' || b.address.toLowerCase().includes(selectedCity.toLowerCase());
        return matchSearch && matchCat && matchCity;
    });

    const vipCount = filtered.filter(b => b.membership_tier === 'vip').length;

    if (selectedBusiness) {
        return (
            <BusinessProfile
                business={selectedBusiness}
                onBack={() => setSelectedBusiness(null)}
                userBalance={userBalance}
                onPurchase={onPurchase}
            />
        );
    }

    return (
        <div className="module-page animate-in">

            {/* Module Header */}
            <div className="module-header-directorio" style={{ padding: '28px 32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <MapPin size={24} color="white" />
                            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'white', letterSpacing: -0.5 }}>
                                Directorio <span style={{ opacity: 0.8 }}>TrueCoin</span>
                            </h1>
                        </div>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
                            Comercios aliados en tu ciudad
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                            borderRadius: 12, padding: '8px 18px', border: '1px solid rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <ShieldCheck size={16} color="white" />
                            <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{vipCount}</span>
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600 }}>negocios VIP</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search + Category Filter */}
            <div style={{
                background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)',
                padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                position: 'sticky', top: 0, zIndex: 10
            }}>
                <div className="input-with-icon" style={{ flex: 1, minWidth: 220, maxWidth: 360 }}>
                    <Search size={16} className="input-icon" />
                    <input
                        type="text"
                        placeholder="¿Qué negocio buscas hoy?"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="input"
                        style={{ paddingLeft: 40 }}
                    />
                </div>
                <div className="category-pills">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`pill ${selectedCategory === cat ? 'active-dir' : ''}`}
                        >
                            {CAT_EMOJIS[cat]} {cat}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                    <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        style={{
                            height: 38, padding: '0 12px', borderRadius: 10,
                            background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
                            color: 'var(--color-navy)', fontSize: 13, fontWeight: 700, outline: 'none', minWidth: 160
                        }}
                    >
                        {CITIES.map(c => <option key={c} value={c}>{c === 'Todas' ? '📍 Toda Colombia' : c}</option>)}
                    </select>

                    <button className="btn btn-outline btn-sm" style={{ height: 38 }}>
                        <Filter size={14} /> Filtros
                    </button>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '28px 32px' }}>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                        <div style={{ width: 40, height: 40, border: '3px solid var(--color-border)', borderTopColor: 'var(--color-directorio)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 80, color: 'var(--color-text-muted)' }}>
                        <Search size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                        <p style={{ fontWeight: 600 }}>Sin resultados para tu búsqueda</p>
                    </div>
                ) : (
                    <>
                        {/* VIP Section */}
                        {filtered.some(b => b.membership_tier === 'vip') && (
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                    <ShieldCheck size={18} style={{ color: 'var(--color-directorio)' }} />
                                    <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)' }}>
                                        Comercios VIP
                                    </h2>
                                    <span className="badge badge-directorio">Catálogo Activo</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                                    {filtered.filter(b => b.membership_tier === 'vip').map(business => (
                                        <BusinessCard
                                            key={business.id}
                                            business={business}
                                            onClick={() => setSelectedBusiness(business)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Free Section */}
                        {filtered.some(b => b.membership_tier !== 'vip') && (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                    <ExternalLink size={18} style={{ color: 'var(--color-text-muted)' }} />
                                    <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)' }}>
                                        Comercios Invitados
                                    </h2>
                                    <span className="badge badge-navy" style={{ opacity: 0.6 }}>Nivel Free</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                                    {filtered.filter(b => b.membership_tier !== 'vip').map(business => (
                                        <BusinessCard
                                            key={business.id}
                                            business={business}
                                            onClick={undefined}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function BusinessCard({ business, onClick }: { business: Business; onClick?: () => void }) {
    const isVip = business.membership_tier === 'vip';

    return (
        <motion.div
            whileHover={{ y: -3 }}
            className="card"
            style={{
                overflow: 'hidden', cursor: isVip ? 'pointer' : 'default',
                borderTop: isVip ? '3px solid var(--color-directorio)' : '3px solid var(--color-border)',
                opacity: isVip ? 1 : 0.75,
            }}
            onClick={isVip ? onClick : undefined}
        >
            {/* Image */}
            <div style={{ height: 140, overflow: 'hidden', position: 'relative' }}>
                {business.image_url ? (
                    <img
                        src={business.image_url}
                        alt={business.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MapPin size={40} style={{ color: 'var(--color-border-strong)' }} />
                    </div>
                )}
                {isVip && (
                    <div style={{
                        position: 'absolute', top: 12, right: 12,
                        background: 'var(--color-directorio)', color: 'white',
                        fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.08em', padding: '3px 10px', borderRadius: 999,
                        display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                        <ShieldCheck size={10} /> VIP
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {business.name}
                        </h3>
                        <span className="badge badge-directorio" style={{ fontSize: 10 }}>{business.category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0, marginLeft: 8 }}>
                        <Star size={12} fill="var(--color-wallet)" color="var(--color-wallet)" />
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>{business.rating}</span>
                    </div>
                </div>

                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: 12, WebkitLineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>
                    {business.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
                        <MapPin size={12} style={{ color: 'var(--color-directorio)', flexShrink: 0 }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{business.address}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
                        <Phone size={12} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                        <span>{business.phone}</span>
                    </div>
                </div>

                {isVip ? (
                    <button
                        className="btn btn-full btn-sm"
                        style={{ background: 'var(--color-directorio)', color: 'white', justifyContent: 'center' }}
                        onClick={onClick}
                    >
                        <ShoppingBag size={14} /> Ver Catálogo <ChevronRight size={14} />
                    </button>
                ) : (
                    <div style={{
                        padding: '8px 14px', borderRadius: 8, background: 'var(--color-surface-2)',
                        fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)',
                        display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                        <ExternalLink size={12} /> Pendiente de activación VIP
                    </div>
                )}
            </div>
        </motion.div>
    );
}
