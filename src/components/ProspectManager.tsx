'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Plus, Search, MessageSquare,
    Clock, MoreVertical,
    Zap, Phone, ArrowRight
} from 'lucide-react';
import { userService } from '../services/userService';

interface Prospect {
    id: string;
    full_name: string;
    phone: string;
    status: 'nuevo' | 'contactado' | 'seguimiento' | 'cerrado';
    interest: string;
    notes: string;
    created_at: string;
}

export default function ProspectManager({ user }: { user: any }) {
    const [prospects, setProspects] = useState<Prospect[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filter, setFilter] = useState('todos');
    const [aiSuggestion, setAiSuggestion] = useState<string>('Analizando tu fábrica de socios...');
    const [isGenerating, setIsGenerating] = useState(false);

    const [newProspect, setNewProspect] = useState({
        full_name: '',
        phone: '',
        interest: '',
        notes: ''
    });

    useEffect(() => {
        if (user?.id) {
            loadProspects();
        }
    }, [user]);

    useEffect(() => {
        if (prospects.length > 0) {
            getAiStrategy();
        } else {
            setAiSuggestion('"Tu fábrica está vacía. ¡Agrega tus primeros prospectos para que Shopy te ayude a cerrar ventas!"');
        }
    }, [prospects]);

    const loadProspects = async () => {
        try {
            setLoading(true);
            const data = await userService.getProspects(user.id);
            setProspects(data || []);
        } catch (error) {
            console.error("Error loading prospects:", error);
        } finally {
            setLoading(false);
        }
    };

    const getAiStrategy = async () => {
        const nextProspect = prospects.find(p => p.status === 'nuevo' || p.status === 'seguimiento') || prospects[0];
        if (!nextProspect) return;

        setIsGenerating(true);
        try {
            const { aiService } = await import('../services/aiService');
            const res = await aiService.getProspectCoaching(nextProspect);
            setAiSuggestion(res);
        } catch (err) {
            setAiSuggestion(`"Tienes a ${nextProspect.full_name} en espera. ¡Escríbele y concreta su entrada a ShopyBrands!"`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await userService.addProspect(user.id, newProspect);
            setShowAddModal(false);
            setNewProspect({ full_name: '', phone: '', interest: '', notes: '' });
            loadProspects();
        } catch (error) {
            alert("Error al guardar prospecto. Asegúrate de que la tabla 'prospects' exista en Supabase.");
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: any) => {
        try {
            await userService.updateProspectStatus(id, newStatus);
            loadProspects();
        } catch (error) {
            console.error(error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'nuevo': return { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' };
            case 'contactado': return { bg: '#FFF7ED', text: '#C2410C', dot: '#F97316' };
            case 'seguimiento': return { bg: '#F5F3FF', text: '#6D28D9', dot: '#8B5CF6' };
            case 'cerrado': return { bg: '#ECFDF5', text: '#047857', dot: '#10B981' };
            default: return { bg: '#F3F4F6', text: '#374151', dot: '#9CA3AF' };
        }
    };

    const filteredProspects = prospects.filter(p => filter === 'todos' || p.status === filter);

    return (
        <div className="module-container" style={{ paddingBottom: 100 }}>
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 8 }}>
                        Fábrica de <span style={{ color: 'var(--color-wallet)' }}>Socios</span> 🏭
                    </h1>
                    <p style={{ fontSize: 16, color: 'var(--color-text-muted)' }}>
                        Gestiona tus prospectos y acelera tu camino a <strong>VIP PLATA</strong>.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-navy"
                    style={{ borderRadius: 14, padding: '12px 24px', boxShadow: '0 10px 20px rgba(10,30,66,0.1)' }}
                >
                    <Plus size={20} /> Nuevo Prospecto
                </button>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                {[
                    { label: 'Total Prospectos', value: prospects.length, icon: <Users size={20} />, color: 'var(--color-navy)' },
                    { label: 'En Seguimiento', value: prospects.filter(p => p.status === 'seguimiento').length, icon: <Clock size={20} />, color: '#8B5CF6' },
                    { label: 'Por Contactar', value: prospects.filter(p => p.status === 'nuevo').length, icon: <Zap size={20} />, color: '#F97316' },
                ].map((stat, i) => (
                    <div key={i} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: `color-mix(in srgb, ${stat.color} 10%, white)`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{stat.label}</p>
                            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-navy)' }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filter Bar */}
            <div className="card" style={{ padding: 12, marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o teléfono..."
                        className="input"
                        style={{ paddingLeft: 48, background: 'var(--color-surface-2)', border: 'none' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {['todos', 'nuevo', 'contactado', 'seguimiento', 'cerrado'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            style={{
                                padding: '8px 16px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                background: filter === t ? 'var(--color-navy)' : 'var(--color-surface-2)',
                                color: filter === t ? 'white' : 'var(--color-text-muted)',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s'
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Prospects List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>Cargando fábrica...</div>
                ) : filteredProspects.length === 0 ? (
                    <div style={{ padding: 60, textAlign: 'center', background: 'var(--color-surface-2)', borderRadius: 20 }}>
                        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-text-muted)' }}>
                            <Users size={30} />
                        </div>
                        <p style={{ fontWeight: 700, color: 'var(--color-navy)' }}>Aún no tienes prospectos</p>
                        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>¡Agrega a tu primer contacto para empezar a crecer!</p>
                    </div>
                ) : filteredProspects.map((prospect) => {
                    const statusStyle = getStatusColor(prospect.status);
                    return (
                        <motion.div
                            layout
                            key={prospect.id}
                            className="card"
                            whileHover={{ scale: 1.005, boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}
                            style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 200px 180px 120px', alignItems: 'center', gap: 20 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-navy), var(--color-wallet))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
                                    {prospect.full_name?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-navy)' }}>{prospect.full_name}</p>
                                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Phone size={12} /> {prospect.phone}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Interés</p>
                                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>{prospect.interest}</p>
                            </div>

                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Estado</p>
                                <select
                                    value={prospect.status}
                                    onChange={(e) => handleStatusUpdate(prospect.id, e.target.value)}
                                    style={{
                                        padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800,
                                        background: statusStyle.bg, color: statusStyle.text,
                                        border: 'none', cursor: 'pointer', outline: 'none'
                                    }}
                                >
                                    <option value="nuevo">NUEVO</option>
                                    <option value="contactado">CONTACTADO</option>
                                    <option value="seguimiento">SEGUIMIENTO</option>
                                    <option value="cerrado">SOCIÓ ACTIVO</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                <button
                                    onClick={() => window.open(`https://wa.me/${prospect.phone.replace(/\D/g, '')}`, '_blank')}
                                    className="btn btn-sm" style={{ background: '#25D366', color: 'white', border: 'none' }}
                                >
                                    <MessageSquare size={16} />
                                </button>
                                <button className="btn btn-sm btn-outline">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* AI Assistant Coach - Floating Widget */}
            <div style={{
                position: 'fixed', bottom: 32, right: 32, width: 340,
                background: 'var(--color-navy)', color: 'white',
                borderRadius: 24, padding: 24, boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.15)',
                zIndex: 50,
                overflow: 'hidden'
            }}>
                {/* Glossy Effect */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)', pointerEvents: 'none' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, position: 'relative' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 10px rgba(255,255,255,0.1)' }}>
                        <Zap size={22} color="var(--color-wallet)" />
                    </div>
                    <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-wallet)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Coach Shopy AI</p>
                        <p style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Estrategia de Cierre</p>
                    </div>
                </div>

                <div style={{ position: 'relative', marginBottom: 20 }}>
                    {isGenerating ? (
                        <div style={{ display: 'flex', gap: 4, padding: '10px 0' }}>
                            {[0, 0.2, 0.4].map(d => <motion.div key={d} animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: d }} style={{ width: 6, height: 6, background: 'var(--color-wallet)', borderRadius: '50%' }} />)}
                        </div>
                    ) : (
                        <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.95, fontStyle: 'italic', background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 14, borderLeft: '3px solid var(--color-wallet)' }}>
                            {aiSuggestion}
                        </p>
                    )}
                </div>

                <button
                    onClick={getAiStrategy}
                    disabled={isGenerating || prospects.length === 0}
                    className="btn btn-full"
                    style={{ background: 'var(--color-wallet)', color: 'white', border: 'none', padding: '12px', borderRadius: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                    {isGenerating ? 'Generando...' : 'Nueva Sugerencia'} <ArrowRight size={14} />
                </button>
            </div>

            {/* Modal para Nuevo Prospecto */}
            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,50,0.5)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-lg" style={{ width: '100%', maxWidth: 450, padding: 32 }}>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 24 }}>Nuevo Prospecto 👤</h2>
                        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Nombre Completo</label>
                                <input required type="text" className="input" value={newProspect.full_name} onChange={e => setNewProspect({ ...newProspect, full_name: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>WhatsApp / Teléfono</label>
                                <input required type="tel" className="input" value={newProspect.phone} onChange={e => setNewProspect({ ...newProspect, phone: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>¿Qué le interesa?</label>
                                <input required type="text" placeholder="Ej: Red 1x4, Tienda, Inversión" className="input" value={newProspect.interest} onChange={e => setNewProspect({ ...newProspect, interest: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancelar</button>
                                <button type="submit" className="btn btn-navy" style={{ flex: 2 }}>Guardar en Fábrica</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
