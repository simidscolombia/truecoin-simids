'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag, Trash2, Plus, Minus, X,
    CreditCard, Banknote, Zap, CheckCircle2, ChevronRight,
    Lock
} from 'lucide-react';
import { Product } from '../services/businessService';

interface CartItem {
    product: Product;
    quantity: number;
}

interface ShoppingCartProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
    onClear: () => void;
    isLoggedIn: boolean;
    onLogin: () => void;
    onPurchase: (amountTC: number) => Promise<void>;
}

export default function ShoppingCart({
    isOpen,
    onClose,
    items,
    onUpdateQuantity,
    onRemove,
    onClear,
    isLoggedIn,
    onLogin,
    onPurchase
}: ShoppingCartProps) {
    const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank' | 'tc'>('tc');
    const [isProcessing, setIsProcessing] = useState(false);

    const totalFiat = items.reduce((acc, item) => acc + (item.product.price_fiat * item.quantity), 0);
    const totalStandard = items.reduce((acc, item) => acc + (item.product.price_public * item.quantity), 0);
    const totalTC = items.reduce((acc, item) => acc + (item.product.price_tc * item.quantity), 0);

    const formatCurrency = (val: number, currency: string = 'COP') =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency, maximumFractionDigits: 0 }).format(val);

    const handleCheckout = async () => {
        if (!isLoggedIn) {
            onLogin();
            return;
        }
        setIsProcessing(true);
        try {
            if (paymentMethod === 'tc') {
                await onPurchase(totalTC);
            }
            setStep('success');
            onClear();
        } catch (err) {
            alert('Error al procesar el pago. Inténtalo de nuevo.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(11,31,75,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 450,
                            background: 'white', zIndex: 1001, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                            display: 'flex', flexDirection: 'column'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-navy)' }}>
                                    <ShoppingBag size={20} />
                                </div>
                                <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                                    {step === 'cart' ? 'Tu Carrito' : step === 'checkout' ? 'Finalizar Compra' : '¡Éxito!'}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                style={{ border: 'none', background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 4 }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                            {items.length === 0 && step !== 'success' ? (
                                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.5 }}>
                                    <ShoppingBag size={64} style={{ marginBottom: 16 }} />
                                    <p style={{ fontWeight: 600 }}>Tu carrito está vacío</p>
                                    <button onClick={onClose} className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>Ir a la tienda</button>
                                </div>
                            ) : (
                                <>
                                    {step === 'cart' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                            {items.map((item) => (
                                                <div key={item.product.id} style={{ display: 'flex', gap: 16 }}>
                                                    <div style={{ width: 80, height: 80, borderRadius: 12, background: 'var(--color-surface-2)', flexShrink: 0, overflow: 'hidden' }}>
                                                        {item.product.image_url ? (
                                                            <img src={item.product.image_url} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                                                                <ShoppingBag size={24} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 4 }}>{item.product.name}</h4>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-surface-2)', padding: '4px 8px', borderRadius: 8 }}>
                                                                <button onClick={() => onUpdateQuantity(item.product.id, -1)} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex' }}><Minus size={14} /></button>
                                                                <span style={{ fontSize: 13, fontWeight: 700, width: 20, textAlign: 'center' }}>{item.quantity}</span>
                                                                <button onClick={() => onUpdateQuantity(item.product.id, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex' }}><Plus size={14} /></button>
                                                            </div>
                                                            <div style={{ textAlign: 'right' }}>
                                                                <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>{formatCurrency(item.product.price_fiat * item.quantity)}</p>
                                                                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-marketplace)', margin: 0 }}>{(item.product.price_tc * item.quantity).toFixed(2)} TC</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => onRemove(item.product.id)}
                                                            style={{ border: 'none', background: 'none', color: '#EF4444', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 8, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
                                                        >
                                                            <Trash2 size={12} /> Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {step === 'checkout' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                            {/* Order Summary */}
                                            <div style={{ background: 'var(--color-surface-2)', padding: 20, borderRadius: 16 }}>
                                                <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 16 }}>Resumen del Pedido</h3>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                                                        <span style={{ color: 'var(--color-text-muted)' }}>Precio Estándar (Público)</span>
                                                        <span style={{ fontWeight: 600 }}>{formatCurrency(totalStandard)}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                                                        <span style={{ color: 'var(--color-text-muted)' }}>Ahorro VIP</span>
                                                        <span style={{ color: '#16A34A', fontWeight: 700 }}>-{formatCurrency(totalStandard - totalFiat)}</span>
                                                    </div>
                                                    <div style={{ height: 1, background: 'rgba(0,0,0,0.05)', margin: '4px 0' }} />
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                                        <span style={{ fontWeight: 800, color: 'var(--color-navy)' }}>Total a Pagar</span>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--color-navy)' }}>{formatCurrency(totalFiat)}</div>
                                                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-marketplace)' }}>{totalTC.toFixed(2)} TC</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Method */}
                                            <div>
                                                <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 16 }}>Forma de Pago</h3>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                    <button
                                                        onClick={() => setPaymentMethod('tc')}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 12, cursor: 'pointer',
                                                            background: paymentMethod === 'tc' ? 'color-mix(in srgb, var(--color-wallet) 10%, white)' : 'white',
                                                            border: `2px solid ${paymentMethod === 'tc' ? 'var(--color-wallet)' : 'var(--color-border)'}`,
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-wallet)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                            <Zap size={20} fill="white" />
                                                        </div>
                                                        <div style={{ flex: 1, textAlign: 'left' }}>
                                                            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: 'var(--color-navy)' }}>TrueCoin Wallet</p>
                                                            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>Pago digital instantáneo</p>
                                                        </div>
                                                        {paymentMethod === 'tc' && <CheckCircle2 size={20} color="var(--color-wallet)" />}
                                                    </button>

                                                    <button
                                                        onClick={() => setPaymentMethod('bank')}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 12, cursor: 'pointer',
                                                            background: paymentMethod === 'bank' ? 'color-mix(in srgb, var(--color-cloud-blue) 10%, white)' : 'white',
                                                            border: `2px solid ${paymentMethod === 'bank' ? 'var(--color-cloud-blue)' : 'var(--color-border)'}`,
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-cloud-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                            <CreditCard size={20} />
                                                        </div>
                                                        <div style={{ flex: 1, textAlign: 'left' }}>
                                                            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: 'var(--color-navy)' }}>Transferencia / Tarjeta</p>
                                                            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>Bancos nacionales</p>
                                                        </div>
                                                        {paymentMethod === 'bank' && <CheckCircle2 size={20} color="var(--color-cloud-blue)" />}
                                                    </button>

                                                    <button
                                                        onClick={() => setPaymentMethod('cash')}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 12, cursor: 'pointer',
                                                            background: paymentMethod === 'cash' ? '#F0FDF4' : 'white',
                                                            border: `2px solid ${paymentMethod === 'cash' ? '#16A34A' : 'var(--color-border)'}`,
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                            <Banknote size={20} />
                                                        </div>
                                                        <div style={{ flex: 1, textAlign: 'left' }}>
                                                            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: 'var(--color-navy)' }}>Efectivo / Punto de Venta</p>
                                                            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>Pago contra entrega</p>
                                                        </div>
                                                        {paymentMethod === 'cash' && <CheckCircle2 size={20} color="#16A34A" />}
                                                    </button>
                                                </div>
                                            </div>

                                            {!isLoggedIn && (
                                                <div style={{ padding: 16, borderRadius: 12, background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', display: 'flex', gap: 12 }}>
                                                    <Lock size={18} style={{ color: '#A16207', flexShrink: 0 }} />
                                                    <p style={{ margin: 0, fontSize: 12, color: '#A16207', lineHeight: 1.4 }}>
                                                        Debes iniciar sesión o registrarte para completar el pedido y obtener el descuento VIP.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {step === 'success' && (
                                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                style={{ width: 80, height: 80, borderRadius: '50%', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}
                                            >
                                                <CheckCircle2 size={48} />
                                            </motion.div>
                                            <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-navy)', marginBottom: 12 }}>¡Pedido Confirmado!</h3>
                                            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 32 }}>
                                                Gracias por tu compra. Te hemos enviado un correo con los detalles del pedido y las instrucciones de envío.
                                            </p>
                                            <button onClick={onClose} className="btn btn-navy btn-full">Seguir comprando</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer Actions */}
                        {items.length > 0 && step !== 'success' && (
                            <div style={{ padding: '24px', borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)', boxShadow: '0 -10px 20px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                    <span style={{ fontSize: 14, color: 'var(--color-text-muted)', fontWeight: 600 }}>Subtotal</span>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-navy)' }}>{formatCurrency(totalFiat)}</div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-marketplace)' }}>{totalTC.toFixed(2)} TC</div>
                                    </div>
                                </div>

                                {step === 'cart' ? (
                                    <button
                                        onClick={() => setStep('checkout')}
                                        className="btn btn-marketplace btn-full btn-lg"
                                        style={{ height: 54, fontSize: 16 }}
                                    >
                                        Continuar al Pago <ChevronRight size={20} />
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <button onClick={() => setStep('cart')} className="btn btn-outline" style={{ height: 54 }}>Atrás</button>
                                        <button
                                            onClick={handleCheckout}
                                            disabled={isProcessing}
                                            className="btn btn-marketplace btn-full btn-lg"
                                            style={{ height: 54, fontSize: 16, background: isLoggedIn ? 'var(--color-marketplace)' : 'var(--color-navy)' }}
                                        >
                                            {isProcessing ? 'Procesando...' : isLoggedIn ? 'Confirmar Pedido' : 'Iniciar Sesión para Pagar'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
