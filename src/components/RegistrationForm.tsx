'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, Ticket, ArrowRight, CheckCircle2, Eye, EyeOff, Zap } from 'lucide-react';
import { userService } from '../services/userService';

interface RegistrationFormProps {
    onSuccess: (userData: any) => void;
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
    const [step, setStep] = useState(1);
    const [isLoginMode, setIsLoginMode] = useState(false);
    const [referralCode, setReferralCode] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailLogin, setEmailLogin] = useState('');
    const [showPhone, setShowPhone] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
    const [error, setError] = useState('');

    const handleValidateReferral = async () => {
        if (referralCode.length < 4) { setError('El código debe tener al menos 4 caracteres.'); return; }
        setError('');
        setIsValidating(true);
        setTimeout(() => { setStep(2); setIsValidating(false); }, 1000);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const profile = await userService.register({ ...formData, referralCode });
            onSuccess(profile);
        } catch (err: any) {
            setError(err.message || 'Error al registrar. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const profile = await userService.login(emailLogin);
            onSuccess(profile);
        } catch (err: any) {
            setError(err.message || 'Usuario no encontrado.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="card-lg"
                style={{ padding: '36px 32px', position: 'relative', overflow: 'hidden' }}
            >
                {/* Progress bar (register only) */}
                {!isLoginMode && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'var(--color-surface-2)' }}>
                        <motion.div
                            animate={{ width: step === 1 ? '50%' : '100%' }}
                            transition={{ duration: 0.4 }}
                            style={{ height: '100%', background: 'var(--color-wallet)', borderRadius: '0 999px 999px 0' }}
                        />
                    </div>
                )}

                <AnimatePresence mode="wait">

                    {/* ── LOGIN MODE ── */}
                    {isLoginMode && (
                        <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                            <div style={{ textAlign: 'center', marginBottom: 28 }}>
                                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'color-mix(in srgb, var(--color-navy) 8%, white)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-navy)' }}>
                                    <Zap size={24} />
                                </div>
                                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 6 }}>
                                    Acceder al Ecosistema
                                </h2>
                                <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Ingresa tu correo para acceder.</p>
                            </div>

                            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div className="input-with-icon">
                                    <Mail size={16} className="input-icon" />
                                    <input
                                        type="email"
                                        placeholder="tu@correo.com"
                                        value={emailLogin}
                                        onChange={e => setEmailLogin(e.target.value)}
                                        required
                                        className="input"
                                        style={{ paddingLeft: 40 }}
                                    />
                                </div>
                                {error && <p style={{ fontSize: 12, color: '#DC2626', textAlign: 'center', padding: '6px 10px', background: '#FEF2F2', borderRadius: 8 }}>{error}</p>}
                                <button type="submit" disabled={isLoading} className="btn btn-navy btn-full btn-lg" style={{ justifyContent: 'center', marginTop: 4 }}>
                                    {isLoading ? (
                                        <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                    ) : (
                                        <><ArrowRight size={16} /> Ingresar</>
                                    )}
                                </button>
                            </form>

                            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-text-muted)', marginTop: 20 }}>
                                ¿No tienes cuenta?{' '}
                                <button onClick={() => { setIsLoginMode(false); setError(''); }} style={{ color: 'var(--color-wallet)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                                    Regístrate gratis
                                </button>
                            </p>
                        </motion.div>
                    )}

                    {/* ── STEP 1 — Código de referido ── */}
                    {!isLoginMode && step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div style={{ textAlign: 'center', marginBottom: 28 }}>
                                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'color-mix(in srgb, var(--color-wallet) 10%, white)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-wallet)' }}>
                                    <Ticket size={24} />
                                </div>
                                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 6 }}>
                                    Únete al Ecosistema
                                </h2>
                                <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                                    Introduce el código exclusivo de quien te invitó.
                                </p>
                            </div>

                            <div className="input-with-icon" style={{ marginBottom: 12 }}>
                                <Ticket size={16} className="input-icon" style={{ color: 'var(--color-wallet)' }} />
                                <input
                                    type="text"
                                    placeholder="Código de Invitación"
                                    value={referralCode}
                                    onChange={e => { setReferralCode(e.target.value.toUpperCase()); setError(''); }}
                                    className="input"
                                    style={{ paddingLeft: 40, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                                />
                            </div>
                            {error && <p style={{ fontSize: 12, color: '#DC2626', marginBottom: 10, textAlign: 'center' }}>{error}</p>}

                            <button
                                onClick={handleValidateReferral}
                                disabled={isValidating || referralCode.length < 4}
                                className="btn btn-wallet btn-full btn-lg"
                                style={{ justifyContent: 'center', opacity: referralCode.length < 4 ? 0.5 : 1 }}
                            >
                                {isValidating ? (
                                    <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                ) : (
                                    <>Verificar Invitación <ArrowRight size={16} /></>
                                )}
                            </button>

                            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-text-muted)', marginTop: 20 }}>
                                ¿Ya tienes cuenta?{' '}
                                <button onClick={() => { setIsLoginMode(true); setError(''); }} style={{ color: 'var(--color-wallet)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                                    Inicia Sesión
                                </button>
                            </p>
                        </motion.div>
                    )}

                    {/* ── STEP 2 — Datos personales ── */}
                    {!isLoginMode && step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A', flexShrink: 0 }}>
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                        Código válido
                                    </p>
                                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Ahora crea tu cuenta.</p>
                                </div>
                            </div>

                            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div className="input-with-icon">
                                    <User size={16} className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="Nombre completo"
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                        className="input"
                                        style={{ paddingLeft: 40 }}
                                    />
                                </div>
                                <div className="input-with-icon">
                                    <Mail size={16} className="input-icon" />
                                    <input
                                        type="email"
                                        placeholder="Correo electrónico"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="input"
                                        style={{ paddingLeft: 40 }}
                                    />
                                </div>
                                <div className="input-with-icon">
                                    <Phone size={16} className="input-icon" />
                                    <input
                                        type={showPhone ? 'text' : 'tel'}
                                        placeholder="WhatsApp (opcional)"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="input"
                                        style={{ paddingLeft: 40, paddingRight: 40 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPhone(!showPhone)}
                                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                                    >
                                        {showPhone ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                {error && <p style={{ fontSize: 12, color: '#DC2626', textAlign: 'center', padding: '6px 10px', background: '#FEF2F2', borderRadius: 8 }}>{error}</p>}

                                <button
                                    type="submit"
                                    disabled={isLoading || !formData.fullName || !formData.email}
                                    className="btn btn-navy btn-full btn-lg"
                                    style={{ justifyContent: 'center', marginTop: 6 }}
                                >
                                    {isLoading ? (
                                        <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                    ) : (
                                        <>Crear mi Cuenta <Zap size={16} /></>
                                    )}
                                </button>
                            </form>

                            <button
                                onClick={() => setStep(1)}
                                style={{ width: '100%', marginTop: 12, fontSize: 13, color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                ← Cambiar código de invitación
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </motion.div>
        </div>
    );
}
