import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { X, ChevronRight, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';

interface RechargeModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: { id?: string; fullName: string };
    onRechargeRequestSubmit: (amount: number) => void;
}

export default function RechargeModal({ isOpen, onClose, user, onRechargeRequestSubmit }: RechargeModalProps) {
    const [step, setStep] = useState(1);
    const [amountTC, setAmountTC] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [wompiKey, setWompiKey] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setAmountTC('');
            setIsProcessing(false);
            fetchApiKeys();
        }
    }, [isOpen]);

    const fetchApiKeys = async () => {
        try {
            const { data } = await supabase.from('app_settings').select('*').eq('key', 'payment_api_keys').single();
            if (data && data.value) {
                const keys = JSON.parse(data.value);
                setWompiKey(keys.wompi_public || 'pub_test_xxxx');
            }
        } catch (e) {
            setWompiKey('pub_test_xxxx');
        }
    };

    const handleNext = () => {
        if (step === 1 && Number(amountTC) >= 10) {
            setStep(2);
        } else if (step === 2) {
            simulateWompiPayment();
        } else if (step === 3) {
            onRechargeRequestSubmit(Number(amountTC));
            onClose();
        }
    };

    const simulateWompiPayment = () => {
        setIsProcessing(true);

        if (!wompiKey || wompiKey === 'pub_test_xxxx') {
            alert('⚠️ La llave pública de Wompi no está configurada. Usa el Panel de SuperAdmin para configurar tus credenciales FIAT.');
            setIsProcessing(false);
            return;
        }

        const amountCOP = Number(amountTC) * 1000;

        // El widget de Wompi se expone en window.WidgetCheckout (Lo cargamos en index.html)
        const checkout = new (window as any).WidgetCheckout({
            currency: 'COP',
            amountInCents: amountCOP * 100, // Wompi requiere centavos
            reference: `TC-REQ-${Date.now()}-${user.id || 'ANON'}`,
            publicKey: wompiKey,
        });

        checkout.open(function (result: any) {
            setIsProcessing(false);
            const transaction = result.transaction;
            console.log('Resultado Wompi:', transaction);

            // Wompi Modal callback response
            if (transaction.status === 'APPROVED') {
                setStep(3);
            } else {
                alert(`El pago no fue exitoso. Estado devuelto por el banco: ${transaction.status}`);
            }
        });
    };

    if (!isOpen) return null;

    const amountCOP = Number(amountTC) * 1000;

    return (
        <AnimatePresence>
            <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    style={{ width: '100%', maxWidth: 440, background: 'var(--color-bg)', borderRadius: 24, padding: 32, boxShadow: 'var(--shadow-xl)', position: 'relative' }}
                >
                    <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 4 }}>
                        <X size={20} />
                    </button>

                    {/* STEPS INDICATOR */}
                    <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
                        {[1, 2, 3].map(s => (
                            <div key={s} style={{ height: 4, flex: 1, borderRadius: 2, background: step >= s ? 'var(--color-wallet)' : 'var(--color-border)', transition: 'all 0.3s' }} />
                        ))}
                    </div>

                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 8 }}>Monto a recargar</h2>
                            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24 }}>Ingresa la cantidad de TrueCoins que deseas adquirir (Mínimo 10 TC).</p>

                            <div style={{ position: 'relative', marginBottom: 16 }}>
                                <span style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', fontSize: 24, fontWeight: 800, color: 'var(--color-wallet)' }}>TC</span>
                                <input
                                    type="number"
                                    min="10"
                                    value={amountTC}
                                    onChange={(e) => setAmountTC(e.target.value)}
                                    placeholder="0"
                                    style={{ width: '100%', padding: '20px 20px 20px 60px', fontSize: 32, fontWeight: 800, color: 'var(--color-navy)', background: 'var(--color-surface)', border: '2px solid transparent', borderRadius: 16, outline: 'none', transition: 'all 0.2s', textAlign: 'right' }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-wallet)'}
                                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                                />
                            </div>

                            <div style={{ background: 'color-mix(in srgb, var(--color-wallet) 10%, white)', padding: '16px 20px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total a pagar (COP)</span>
                                <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-navy)' }}>${amountCOP.toLocaleString('es-CO')}</span>
                            </div>

                            <button className="btn btn-wallet btn-full btn-lg" onClick={handleNext} disabled={Number(amountTC) < 10}>
                                Continuar <ChevronRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 8 }}>Pasarela de Pago</h2>
                            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24 }}>
                                Serás redirigido a Wompi para procesar tu pago de forma segura.
                            </p>

                            <div style={{ background: '#F8FAFC', padding: 24, borderRadius: 16, border: '1px solid #E2E8F0', textAlign: 'center', marginBottom: 32 }}>
                                <div style={{ background: 'white', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <ShieldCheck size={32} color="#1D4ED8" />
                                </div>
                                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1E293B', marginBottom: 4 }}>Pago Seguro Wompi</h3>
                                <p style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>Llave: {wompiKey?.substring(0, 10)}***</p>
                                <div style={{ fontSize: 24, fontWeight: 900, color: '#1D4ED8' }}>
                                    ${amountCOP.toLocaleString('es-CO')}
                                </div>
                            </div>

                            <button
                                className="btn btn-full btn-lg"
                                style={{ background: '#1D4ED8', color: 'white', opacity: isProcessing ? 0.7 : 1 }}
                                onClick={handleNext}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                        Procesando...
                                    </span>
                                ) : (
                                    <>Pagar con Wompi <CreditCard size={18} style={{ marginLeft: 8 }} /></>
                                )}
                            </button>
                            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--color-text-muted)', marginTop: 12 }}>TrueCoin conecta oficialmente con Bancolombia.</p>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <CheckCircle2 size={40} />
                            </div>
                            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 8 }}>¡Pago Exitoso!</h2>
                            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 32 }}>
                                Wompi ha confirmado tu pago automático. Tus <strong>{amountTC} TC</strong> están listos en tu billetera.
                            </p>

                            <button className="btn btn-wallet btn-full btn-lg" onClick={handleNext}>
                                Entendido
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
