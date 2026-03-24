'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Search, Edit3, Trash2, Package, 
    Sparkles, RefreshCw, Save, X, Image as ImageIcon 
} from 'lucide-react';
import { businessService, Product } from '../services/businessService';

export default function InventoryHQ() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        price_fiat: 0,
        price_public: 0,
        price_tc: 0,
        currency: 'COP',
        stock: 0,
        category: 'General',
        is_marketplace: true,
        business_id: null, // HQ Products have null business_id
        image_url: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await businessService.getMarketplaceProducts();
            // Filtrar solo los de HQ (business_id === null)
            setProducts(data.filter(p => p.business_id === null));
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData(product);
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price_fiat: 0,
                price_public: 0,
                price_tc: 0,
                currency: 'COP',
                stock: 0,
                category: 'General',
                is_marketplace: true,
                business_id: null,
                image_url: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleAutoCalculate = () => {
        const cost = formData.price_fiat || 0;
        setFormData({
            ...formData,
            price_public: Math.round(cost * 1.45), // +45% 
            price_tc: Math.round(cost / 1000) // 1 TC = 1000 COP aprox
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await businessService.saveProduct(formData);
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            alert("Error al guardar producto");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este producto permanentemente?")) return;
        try {
            await businessService.deleteProduct(id);
            fetchProducts();
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-navy)', margin: 0 }}>Inventario ShopyHQ</h2>
                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>Gestiona tus productos oficiales y servicios insignia.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn btn-admin" style={{ gap: 8, borderRadius: 12 }}>
                    <Plus size={18} /> Nuevo Producto
                </button>
            </div>

            <div className="card" style={{ padding: '0px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <div style={{ padding: '16px 24px', background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: 16 }}>
                    <div className="input-with-icon" style={{ flex: 1 }}>
                        <Search size={14} className="input-icon" />
                        <input 
                            type="text" 
                            placeholder="Buscar en bodega HQ..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input" 
                            style={{ paddingLeft: 40, height: 40, background: 'white' }}
                        />
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ textAlign: 'left', background: 'var(--color-surface-2)' }}>
                        <tr>
                            <th style={{ padding: '12px 24px', fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Producto</th>
                            <th style={{ padding: '12px 24px', fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Ficha de Precios</th>
                            <th style={{ padding: '12px 24px', fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Stock</th>
                            <th style={{ padding: '12px 24px', fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>No hay productos registrados en HQ.</td></tr>
                        ) : (
                            filtered.map(p => (
                                <tr key={p.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--color-surface-2)', overflow: 'hidden', flexShrink: 0 }}>
                                                {p.image_url ? <img src={p.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={20} style={{ margin: 12, opacity: 0.3 }} />}
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>{p.name}</p>
                                                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>{p.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>Público: ${p.price_public?.toLocaleString()}</span>
                                            <span style={{ fontSize: 13, fontWeight: 900, color: '#16A34A' }}>VIP: ${p.price_fiat?.toLocaleString()}</span>
                                            <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--color-wallet)' }}>{p.price_tc} TC</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ fontSize: 14, fontWeight: 800, color: p.stock > 10 ? 'var(--color-navy)' : '#EF4444' }}>{p.stock} unid.</span>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                            <button onClick={() => handleOpenModal(p)} style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-surface-2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Edit3 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} style={{ width: 32, height: 32, borderRadius: 8, background: '#FEF2F2', color: '#EF4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Producto */}
            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(11,31,75,0.7)', backdropFilter: 'blur(8px)' }} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="card-lg" style={{ position: 'relative', maxWidth: 800, width: '100%', padding: 0, overflow: 'hidden' }}>
                            <div style={{ padding: '24px 32px', background: 'var(--color-navy)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>{editingProduct ? 'Editar Producto HQ' : 'Publicar Nuevo Producto HQ'}</h3>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                                {/* Columna Izquierda: Visuales */}
                                <div>
                                    <div style={{ 
                                        width: '100%', aspectRatio: '1/1', background: 'var(--color-surface-2)', 
                                        borderRadius: 24, display: 'flex', flexDirection: 'column', 
                                        alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--color-border-strong)',
                                        overflow: 'hidden', position: 'relative'
                                    }}>
                                        {formData.image_url ? (
                                            <img src={formData.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <>
                                                <ImageIcon size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                                                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)' }}>Subir Imagen del Producto</p>
                                            </>
                                        )}
                                        <button 
                                            style={{ position: 'absolute', bottom: 20, right: 20, width: 44, height: 44, borderRadius: '50%', background: 'var(--color-wallet)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
                                            onClick={() => {/* Lógica de Upload */}}
                                        >
                                            <Sparkles size={20} fill="white" />
                                        </button>
                                    </div>
                                    <div style={{ marginTop: 24 }}>
                                        <label className="label">Descripción Premium</label>
                                        <textarea 
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            className="input" 
                                            style={{ height: 100, padding: 12, resize: 'none' }}
                                        />
                                    </div>
                                </div>

                                {/* Columna Derecha: Precios y Datos */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <div>
                                        <label className="label">Nombre del Producto</label>
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="input" 
                                            placeholder="Ej: Kit de Bienvenida ShopyBrands"
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div>
                                            <label className="label">Precio VIP ($)</label>
                                            <input 
                                                type="number" 
                                                value={formData.price_fiat}
                                                onChange={(e) => setFormData({...formData, price_fiat: parseFloat(e.target.value)})}
                                                className="input" 
                                                style={{ fontWeight: 950, color: '#16A34A' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <button onClick={handleAutoCalculate} className="btn btn-outline btn-full" style={{ height: 48, fontSize: 11, gap: 6 }}>
                                                <RefreshCw size={14} /> Autocalcular
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div>
                                            <label className="label">Precio Público ($)</label>
                                            <input 
                                                type="number" 
                                                value={formData.price_public}
                                                onChange={(e) => setFormData({...formData, price_public: parseFloat(e.target.value)})}
                                                className="input" 
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Valor en TC (Puntos)</label>
                                            <input 
                                                type="number" 
                                                value={formData.price_tc}
                                                onChange={(e) => setFormData({...formData, price_tc: parseFloat(e.target.value)})}
                                                className="input" 
                                                style={{ fontWeight: 950, color: 'var(--color-wallet)' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div>
                                            <label className="label">Stock Actual</label>
                                            <input 
                                                type="number" 
                                                value={formData.stock}
                                                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                                                className="input" 
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Categoría</label>
                                            <select 
                                                value={formData.category}
                                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                                className="input"
                                            >
                                                {['IA Services', 'Kits VIP', 'Electrónica', 'Alimentos', 'Hogar'].map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 'auto', display: 'flex', gap: 12 }}>
                                        <button onClick={() => setIsModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancelar</button>
                                        <button 
                                            onClick={handleSave} 
                                            disabled={isSaving}
                                            className="btn btn-admin" 
                                            style={{ flex: 2, background: 'var(--color-navy)', color: 'white' }}
                                        >
                                            <Save size={18} style={{ marginRight: 8 }} />
                                            {isSaving ? 'Guardando...' : 'Publicar Producto'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
