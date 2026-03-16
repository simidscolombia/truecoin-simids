'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, Ticket, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
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
    const [passwordLogin, setPasswordLogin] = useState('');
    const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [referrerName, setReferrerName] = useState('');
    const [wompiPublicKey, setWompiPublicKey] = useState('pub_test_Q5yS9pmev6W9kzE0v6X2pY123'); // Fallback
    const [wompiIntegrity, setWompiIntegrity] = useState('');
    const [regIp, setRegIp] = useState('');
    const [regLoc, setRegLoc] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const { data } = await userService.getPaymentSettings();
                if (data?.wompi_public) {
                    setWompiPublicKey(data.wompi_public.trim());
                }
                if (data?.wompi_integrity) {
                    setWompiIntegrity(data.wompi_integrity.trim());
                }

                // Track IP Info (Opcional pero útil)
                const ipRes = await fetch('https://ipapi.co/json/').then(r => r.json()).catch(() => null);
                if (ipRes) {
                    setRegIp(ipRes.ip || '');
                    setRegLoc(`${ipRes.city}, ${ipRes.country_name}`);
                }
            } catch (e) {
                console.error("Error loading keys:", e);
            }
        };
        loadSettings();
    }, []);

    const handleValidateReferral = async () => {
        if (referralCode.length < 4) {
            setError('El código debe tener al menos 4 caracteres.');
            return;
        }

        setError('');
        setIsValidating(true);

        try {
            const referrer = await userService.validateReferralCode(referralCode);
            if (referrer) {
                setReferrerName(referrer.full_name);
                setStep(2);
            } else {
                setError('Código de invitación inválido. Por favor verifica con quien te invitó.');
            }
        } catch (err) {
            setError('Error al validar el código. Intenta de nuevo.');
        } finally {
            setIsValidating(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. GENERAMOS REFERENCIA ÚNICA
            const tempRef = `REG-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

            // 2. GUARDAMOS INTENTO EN DB (AUDITORÍA & PERSISTENCIA)
            await userService.createRegistrationAttempt({
                reference: tempRef,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                referralCode: referralCode,
                regIp: regIp,
                regLoc: regLoc
            });

            // 3. Link de Pago Wompi (CORRECCIÓN: Wompi usa guiones '-' no guiones bajos '_')
            let paymentUrl = `https://checkout.wompi.co/p/?public-key=${wompiPublicKey}&currency=COP&amount-in-cents=5000000&reference=${tempRef}&redirect_url=${encodeURIComponent(window.location.origin)}`;

            // 3.1. Agregar Firma de Integridad si existe el secreto
            if (wompiIntegrity) {
                const text = `${tempRef}5000000COP${wompiIntegrity}`;
                const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
                const signature = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
                paymentUrl += `&signature:integrity=${signature}`;
            }

            // 4. Abrir pasarela
            window.open(paymentUrl, '_blank');

            // 5. Notificamos al usuario
            alert(`🚀 REGISTRO INICIADO: ${formData.fullName}\n\nPor seguridad, tu cuenta se activará automáticamente apenas Wompi confirme tu pago.\n\n📍 IP: ${regIp || 'Detectada'} | Loc: ${regLoc || 'Detectada'}\n\nEl sistema te enviará un WhatsApp de bienvenida al confirmar el pago.`);

            // Resetear flujo
            setStep(1);
            setReferralCode('');
            setIsLoginMode(true);

        } catch (err: any) {
            console.error("Error en registro:", err);
            setError('Error al iniciar el proceso de registro. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const profile = await userService.login(emailLogin, passwordLogin);
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
                                <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Ingresa tu correo o nombre para acceder.</p>
                            </div>

                            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div className="input-with-icon">
                                    <Mail size={16} className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="Correo o Nombre completo"
                                        value={emailLogin}
                                        onChange={e => setEmailLogin(e.target.value)}
                                        required
                                        className="input"
                                        style={{ paddingLeft: 40 }}
                                    />
                                </div>
                                <div className="input-with-icon">
                                    <Ticket size={16} className="input-icon" />
                                    <input
                                        type="password"
                                        placeholder="Tu contraseña"
                                        value={passwordLogin}
                                        onChange={e => setPasswordLogin(e.target.value)}
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
                                <button onClick={() => { setIsLoginMode(false); setStep(1); setError(''); }} style={{ color: 'var(--color-wallet)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                                    Regístrate ahora
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
                                        Paso 2: Perfil
                                    </p>
                                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                                        Invitado por: <strong style={{ color: 'var(--color-navy)' }}>{referrerName}</strong>
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                                        type="tel"
                                        placeholder="WhatsApp (opcional)"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="input"
                                        style={{ paddingLeft: 40, paddingRight: 40 }}
                                    />
                                </div>
                                <div className="input-with-icon">
                                    <Ticket size={16} className="input-icon" />
                                    <input
                                        type="password"
                                        placeholder="Crea tu contraseña"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        className="input"
                                        style={{ paddingLeft: 40 }}
                                    />
                                </div>
                                <div className="input-with-icon">
                                    <Ticket size={16} className="input-icon" />
                                    <input
                                        type="password"
                                        placeholder="Confirma tu contraseña"
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                        className="input"
                                        style={{ paddingLeft: 40 }}
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        if (formData.password !== formData.confirmPassword) {
                                            setError('Las contraseñas no coinciden.');
                                        } else if (formData.password.length < 6) {
                                            setError('Mínimo 6 caracteres.');
                                        } else {
                                            setError('');
                                            setStep(3);
                                        }
                                    }}
                                    disabled={!formData.fullName || !formData.email || !formData.password}
                                    className="btn btn-navy btn-full btn-lg"
                                    style={{ justifyContent: 'center', marginTop: 10 }}
                                >
                                    Continuar al Pago <ArrowRight size={16} />
                                </button>
                                {error && <p style={{ fontSize: 12, color: '#DC2626', textAlign: 'center' }}>{error}</p>}
                            </div>

                            <button
                                onClick={() => setStep(1)}
                                style={{ width: '100%', marginTop: 20, fontSize: 13, color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                ← Cambiar código de invitación
                            </button>
                        </motion.div>
                    )}

                    {/* ── STEP 3 — Pago de Membresía ── */}
                    {!isLoginMode && step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-wallet) 10%, white)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-wallet)' }}>
                                    <Zap size={32} />
                                </div>
                                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 4 }}>
                                    Activación VIP
                                </h2>
                                <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                                    Paga tu membresía anual para activar tu red.
                                </p>
                            </div>

                            <div style={{
                                background: 'var(--color-surface-2)',
                                borderRadius: 16,
                                padding: 20,
                                border: '1px solid var(--color-border)',
                                marginBottom: 20,
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                                    Total a Pagar
                                </p>
                                <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-navy)' }}>
                                    $50,000 <span style={{ fontSize: 14, opacity: 0.6 }}>COP</span>
                                </p>
                                <div style={{ height: 1, background: 'var(--color-border)', margin: '14px 0' }}></div>
                                <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                                    Recibirás <strong>50 TC</strong> para participar en la Red de Regalos.
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div style={{
                                    padding: '12px 16px',
                                    borderRadius: 12,
                                    border: '2px solid var(--color-wallet)',
                                    background: 'color-mix(in srgb, var(--color-wallet) 5%, white)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12
                                }}>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-wallet)' }}></div>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)' }}>Pago Seguro (Wompi/TRX)</span>
                                </div>

                                {error && <p style={{ fontSize: 12, color: '#DC2626', textAlign: 'center', marginTop: 10 }}>{error}</p>}

                                <button
                                    onClick={handleRegister}
                                    disabled={isLoading}
                                    className="btn btn-wallet btn-full btn-lg"
                                    style={{ justifyContent: 'center', marginTop: 10 }}
                                >
                                    {isLoading ? (
                                        <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                    ) : (
                                        <>Pagar y Activar mi Cuenta <CheckCircle2 size={18} /></>
                                    )}
                                </button>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                style={{ width: '100%', marginTop: 20, fontSize: 13, color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                ← Regresar a mis datos
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </motion.div >
        </div >
    );
}
