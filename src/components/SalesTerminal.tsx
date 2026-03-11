'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, ShoppingCart, Trash2, Plus, Minus,
    DollarSign, Coins, CheckCircle2, Banknote, CreditCard, Package
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category?: string;
}

interface CartItem extends Product {
    quantity: number;
}

const MOCK_PRODUCTS: Product[] = [
    { id: '1', name: 'Arroz Premium 1kg', price: 4.50, stock: 50, category: 'Alimentos' },
    { id: '2', name: 'Aceite de Girasol 1L', price: 12.00, stock: 24, category: 'Alimentos' },
    { id: '3', name: 'Café de Origen 500g', price: 15.00, stock: 12, category: 'Alimentos' },
    { id: '4', name: 'Azúcar Morena 500g', price: 3.20, stock: 40, category: 'Alimentos' },
    { id: '5', name: 'Pasta Integral 400g', price: 3.80, stock: 30, category: 'Alimentos' },
    { id: '6', name: 'Leche Entera 1L', price: 2.50, stock: 60, category: 'Lácteos' },
    { id: '7', name: 'Yogur Natural 250g', price: 1.80, stock: 45, category: 'Lácteos' },
    { id: '8', name: 'Jabón Líquido 500ml', price: 6.00, stock: 35, category: 'Aseo' },
];

type PaymentMethod = 'cash' | 'bank' | 'truecoin' | null;

export default function SalesTerminal() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [cashGiven, setCashGiven] = useState('');

    const filtered = MOCK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product: Product) => {
        const existing = cart.find(i => i.id === product.id);
        if (existing) {
            setCart(cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id: string) => setCart(cart.filter(i => i.id !== id));

    const updateQty = (id: string, delta: number) => {
        setCart(cart.map(i => {
            if (i.id !== id) return i;
            const q = i.quantity + delta;
            return q <= 0 ? null : { ...i, quantity: q };
        }).filter(Boolean) as CartItem[]);
    };

    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = subtotal * 0.19;
    const total = subtotal + tax;
    const tcEquivalent = (total / 1000).toFixed(2);
    const change = cashGiven ? Math.max(0, Number(cashGiven) - total).toFixed(0) : null;

    const handleConfirmSale = () => {
        if (!paymentMethod || cart.length === 0) return;
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setCart([]);
            setPaymentMethod(null);
            setCashGiven('');
        }, 3000);
    };

    return (
        <div style={{ display: 'flex', gap: 20, height: '100%', position: 'relative' }}>

            {/* Success overlay */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(11,31,75,0.6)', backdropFilter: 'blur(8px)', borderRadius: 16 }}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="card-lg"
                            style={{ padding: 40, textAlign: 'center', maxWidth: 340 }}
                        >
                            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <CheckCircle2 size={44} />
                            </div>
                            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 8 }}>¡Venta Registrada!</h2>
                            <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Total cobrado: <strong style={{ color: 'var(--color-pos)' }}>${total.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</strong></p>
                            {paymentMethod === 'truecoin' && (
                                <p style={{ marginTop: 8, fontSize: 13, color: 'var(--color-wallet)' }}>✨ +{(Number(tcEquivalent) * 0.1).toFixed(2)} TC distribuidos a la red</p>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LEFT — Product Catalog */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>

                {/* Search */}
                <div className="input-with-icon">
                    <Search size={16} className="input-icon" />
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="input"
                        style={{ paddingLeft: 40 }}
                    />
                </div>

                {/* Product Grid */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, alignContent: 'start', paddingRight: 4 }}>
                    {filtered.map(product => (
                        <motion.button
                            key={product.id}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => addToCart(product)}
                            style={{
                                background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
                                borderRadius: 14, padding: '14px 12px', cursor: 'pointer',
                                textAlign: 'left', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', gap: 6,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-pos)'; e.currentTarget.style.background = 'color-mix(in srgb, var(--color-pos) 4%, white)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--color-surface)'; }}
                        >
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Package size={18} style={{ color: 'var(--color-text-muted)' }} />
                            </div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)', lineHeight: 1.3 }}>{product.name}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-pos)' }}>${product.price.toFixed(0)}</p>
                                <span style={{ fontSize: 10, color: 'var(--color-text-muted)', padding: '2px 6px', background: 'var(--color-surface-2)', borderRadius: 999 }}>
                                    x{product.stock}
                                </span>
                            </div>
                            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{product.category}</p>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* RIGHT — Cart + Payment */}
            <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>

                {/* Cart Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ShoppingCart size={18} style={{ color: 'var(--color-pos)' }} />
                        Carrito
                        {cart.length > 0 && (
                            <span style={{ fontSize: 11, background: 'var(--color-pos)', color: 'white', borderRadius: 999, padding: '2px 8px', fontWeight: 700 }}>
                                {cart.reduce((s, i) => s + i.quantity, 0)}
                            </span>
                        )}
                    </h3>
                    {cart.length > 0 && (
                        <button onClick={() => setCart([])} style={{ fontSize: 11, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                            Vaciar
                        </button>
                    )}
                </div>

                {/* Cart Items */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--color-text-muted)' }}>
                            <ShoppingCart size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                            <p style={{ fontSize: 13 }}>El carrito está vacío</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                                    <p style={{ fontSize: 12, color: 'var(--color-wallet)', fontWeight: 600 }}>${(item.price * item.quantity).toFixed(0)}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <button onClick={() => updateQty(item.id, -1)} style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Minus size={12} />
                                    </button>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                                    <button onClick={() => updateQty(item.id, 1)} style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Plus size={12} />
                                    </button>
                                    <button onClick={() => removeFromCart(item.id)} style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: '#FEF2F2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Totals */}
                {cart.length > 0 && (
                    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, padding: '14px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Subtotal</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-navy)' }}>${subtotal.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                            <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>IVA 19%</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)' }}>${tax.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--color-border)' }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-navy)' }}>Total</span>
                            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-pos)' }}>${total.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
                        </div>
                        <p style={{ fontSize: 11, color: 'var(--color-wallet)', textAlign: 'right', marginTop: 4 }}>≈ {tcEquivalent} TC</p>
                    </div>
                )}

                {/* Payment Method */}
                {cart.length > 0 && (
                    <>
                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>
                            Método de Pago
                        </p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                onClick={() => setPaymentMethod('cash')}
                                className={`payment-method-btn ${paymentMethod === 'cash' ? 'selected-cash' : ''}`}
                            >
                                <Banknote size={18} />
                                Efectivo
                            </button>
                            <button
                                onClick={() => setPaymentMethod('bank')}
                                className={`payment-method-btn ${paymentMethod === 'bank' ? 'selected-bank' : ''}`}
                            >
                                <CreditCard size={18} />
                                Banco
                            </button>
                            <button
                                onClick={() => setPaymentMethod('truecoin')}
                                className={`payment-method-btn ${paymentMethod === 'truecoin' ? 'selected-tc' : ''}`}
                            >
                                <Coins size={18} />
                                TC
                            </button>
                        </div>

                        {/* Cash change calculator */}
                        {paymentMethod === 'cash' && (
                            <div className="input-with-icon">
                                <DollarSign size={16} className="input-icon" />
                                <input
                                    type="number"
                                    placeholder="Efectivo recibido..."
                                    value={cashGiven}
                                    onChange={e => setCashGiven(e.target.value)}
                                    className="input"
                                    style={{ paddingLeft: 40 }}
                                />
                            </div>
                        )}
                        {paymentMethod === 'cash' && change !== null && (
                            <div style={{ padding: '10px 14px', borderRadius: 10, background: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 13, color: '#16A34A', fontWeight: 600 }}>Vuelto</span>
                                <span style={{ fontSize: 16, fontWeight: 800, color: '#16A34A' }}>${Number(change).toLocaleString('es-CO')}</span>
                            </div>
                        )}

                        <button
                            onClick={handleConfirmSale}
                            disabled={!paymentMethod}
                            className="btn btn-pos btn-full btn-lg"
                            style={{ justifyContent: 'center', opacity: !paymentMethod ? 0.5 : 1 }}
                        >
                            <CheckCircle2 size={18} /> Cobrar ${total.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
