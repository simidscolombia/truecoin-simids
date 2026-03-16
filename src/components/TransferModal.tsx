'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, ShieldCheck, Clock, ArrowRight, X, CheckCircle2, Coins, AlertCircle } from 'lucide-react';
import { userService } from '../services/userService';

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onSuccess: (amount: number, receiver?: string) => void;
}

export default function TransferModal({ isOpen, onClose, user, onSuccess }: TransferModalProps) {
    const [step, setStep] = useState(1);
    const [receiver, setReceiver] = useState('');
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleNext = () => {
        if (step === 1 && receiver && amount) setStep(2);
    };

    const handleConfirm = async () => {
        if (!user?.id) return;
        setIsProcessing(true);
        setError('');
        try {
            await userService.transferTC(user.id, receiver, Number(amount));
            onSuccess(Number(amount), receiver);
            setStep(3);
        } catch (err: any) {
            setError(err.message || 'Error al procesar la transferencia.');
        } finally {
            setIsProcessing(false);
        }
    };

    const resetAndClose = () => {
        setStep(1);
        setReceiver('');
        setAmount('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={resetAndClose}
                style={{ position: 'absolute', inset: 0, background: 'rgba(11,31,75,0.55)', backdropFilter: 'blur(8px)' }}
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                className="card-lg"
                style={{ position: 'relative', zIndex: 210, width: '100%', maxWidth: 420, padding: 36 }}
            >
                {/* Close */}
                <button
                    onClick={resetAndClose}
                    style={{ position: 'absolute', top: 20, right: 20, width: 32, height: 32, borderRadius: '50%', background: 'var(--color-surface-2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}
                >
                    <X size={16} />
                </button>

                <AnimatePresence mode="wait">
                    {/* Step 1 — Form */}
                    {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div style={{ textAlign: 'center', marginBottom: 28 }}>
                                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-wallet) 12%, white)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-wallet)' }}>
                                    <Send size={24} />
                                </div>
                                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 6 }}>
                                    Enviar TrueCoins
                                </h2>
                                <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                                    Transfiere TC de forma segura a cualquier socio de la red.
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                                <div className="input-with-icon">
                                    <User size={16} className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="ID o código del destinatario"
                                        value={receiver}
                                        onChange={e => setReceiver(e.target.value)}
                                        className="input"
                                        style={{ paddingLeft: 40 }}
                                    />
                                </div>
                                <div className="input-with-icon">
                                    <Coins size={16} className="input-icon" style={{ color: 'var(--color-wallet)' }} />
                                    <input
                                        type="number"
                                        placeholder="Monto a enviar"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        className="input"
                                        style={{ paddingLeft: 40, fontSize: 18, fontWeight: 700 }}
                                    />
                                </div>
                            </div>

                            <div style={{ padding: '12px 14px', borderRadius: 10, background: 'color-mix(in srgb, var(--color-wallet) 8%, white)', border: '1px solid color-mix(in srgb, var(--color-wallet) 20%, white)', marginBottom: 20, display: 'flex', gap: 10 }}>
                                <Clock size={16} style={{ color: 'var(--color-wallet)', flexShrink: 0, marginTop: 1 }} />
                                <p style={{ fontSize: 12, color: 'var(--color-wallet)', lineHeight: 1.6 }}>
                                    <strong>Seguridad 24h:</strong> Esta transferencia tendrá un periodo de retención antes de ser efectiva.
                                </p>
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!receiver || !amount}
                                className="btn btn-wallet btn-full btn-lg"
                                style={{ justifyContent: 'center' }}
                            >
                                Revisar Transferencia <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2 — Confirm */}
                    {step === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-cloud-blue) 12%, white)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-cloud-blue)' }}>
                                    <ShieldCheck size={24} />
                                </div>
                                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 6 }}>
                                    Confirmar Envío
                                </h2>
                            </div>

                            <div style={{ background: 'var(--color-surface-2)', borderRadius: 16, padding: '20px 24px', marginBottom: 20 }}>
                                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 12 }}>
                                    Resumen de transferencia
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Monto:</span>
                                    <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-wallet)' }}>
                                        {Number(amount).toLocaleString()} TC
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--color-border)' }}>
                                    <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Para:</span>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)' }}>{receiver}</span>
                                </div>
                            </div>

                            <p style={{ fontSize: 11, color: '#DC2626', textAlign: 'center', fontWeight: 600, marginBottom: 16, padding: '0 16px', lineHeight: 1.5 }}>
                                ⚠️ Una vez confirmada, no podrás cancelar esta operación durante 24 horas.
                            </p>

                            {error && (
                                <div style={{ display: 'flex', gap: 8, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 10, marginBottom: 16, color: '#DC2626', fontSize: 13 }}>
                                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <button
                                    onClick={handleConfirm}
                                    disabled={isProcessing}
                                    className="btn btn-wallet btn-full btn-lg"
                                    style={{ justifyContent: 'center' }}
                                >
                                    {isProcessing ? (
                                        <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                    ) : (
                                        <><Send size={16} /> Confirmar y Enviar</>
                                    )}
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="btn btn-ghost btn-full"
                                    style={{ color: 'var(--color-text-muted)', justifyContent: 'center' }}
                                >
                                    Regresar y Corregir
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3 — Success */}
                    {step === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '12px 0' }}>
                            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#16A34A' }}>
                                <CheckCircle2 size={44} />
                            </div>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 10 }}>
                                ¡Transferencia Programada!
                            </h2>
                            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 28, padding: '0 12px' }}>
                                Los TrueCoins han sido restados de tu saldo y serán acreditados a <strong style={{ color: 'var(--color-navy)' }}>{receiver}</strong> en las próximas 24 horas.
                            </p>
                            <button onClick={resetAndClose} className="btn btn-navy btn-full btn-lg" style={{ justifyContent: 'center' }}>
                                Entendido
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
