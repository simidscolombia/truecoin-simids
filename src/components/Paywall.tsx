import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Rocket, ArrowRight, Wallet, CheckCircle2 } from 'lucide-react';
import { userService } from '../services/userService';

interface PaywallProps {
    user: any;
}

export default function Paywall({ user }: PaywallProps) {
    const [regFee, setRegFee] = useState(5000);
    const [wompiPublicKey, setWompiPublicKey] = useState('');
    const [wompiIntegrity, setWompiIntegrity] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const result = await userService.getPaymentSettings();
                const settings = result.data;
                if (settings) {
                    setRegFee(settings.reg_fee || 5000);
                    setWompiPublicKey(settings.wompi_public);
                    setWompiIntegrity(settings.wompi_integrity);
                }
            } catch (e) {
                console.error("Error loading settings:", e);
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, []);

    const handlePay = async () => {
        const amountInCents = regFee * 100;
        const tempRef = `ACT-${user.id.substring(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

        let paymentUrl = `https://checkout.wompi.co/p/?public-key=${wompiPublicKey}&currency=COP&amount-in-cents=${amountInCents}&reference=${tempRef}&redirect_url=${encodeURIComponent(window.location.origin)}`;

        if (wompiIntegrity) {
            const text = `${tempRef}${amountInCents}COP${wompiIntegrity}`;
            const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
            const signature = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
            paymentUrl += `&signature:integrity=${signature}`;
        }

        window.open(paymentUrl, '_blank');
    };

    const handleVerifyStatus = async () => {
        setIsLoading(true);
        try {
            const freshProfile = await userService.getProfile(user.id);
            if (freshProfile.is_vip) {
                // EXCLUSIVO: Ubicación Automática al activar VIP
                const { matrixService } = await import('../services/matrixService');
                await matrixService.autoPlaceUser(user.id);

                window.location.reload(); // Recargar para entrar al Dashboard
            } else {
                alert("Aún no detectamos tu pago. Wompi puede tardar unos minutos en confirmar.");
            }
        } catch (e) {
            console.error("Error verificando estatus:", e);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}><div className="shopy-spinner" /></div>;

    return (
        <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 20px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-lg"
                style={{ overflow: 'hidden', padding: 0 }}
            >
                <div style={{ background: 'var(--color-navy)', padding: '40px 32px', textAlign: 'center', color: 'white' }}>
                    <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.1)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <Zap size={32} color="var(--color-wallet)" />
                    </div>
                    <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>¡Hola {user.fullName}!</h1>
                    <p style={{ fontSize: 18, opacity: 0.8, maxWidth: 500, margin: '0 auto' }}>
                        Tu cuenta ha sido creada con éxito. Activa tu membresía VIP para desbloquear todo el potencial de ShopyBrands.
                    </p>
                </div>

                <div style={{ padding: '40px 32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 40 }}>
                        {[
                            { icon: <Rocket size={20} />, title: 'Expansión de Red', desc: 'Invita socios y sube de nivel.' },
                            { icon: <Wallet size={20} />, title: 'Billetera TrueCoin', desc: 'Recibe pagos al instante.' },
                            { icon: <ShieldCheck size={20} />, title: 'Sistema POS', desc: 'Vende tus productos en la red.' }
                        ].map((feat, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ color: 'var(--color-wallet)' }}>{feat.icon}</div>
                                <h3 style={{ fontWeight: 800, fontSize: 16, color: 'var(--color-navy)' }}>{feat.title}</h3>
                                <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>{feat.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: 'var(--color-surface-2)', borderRadius: 24, padding: 32, textAlign: 'center' }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Inversión Única de Activación</p>
                        <div style={{ fontSize: 44, fontWeight: 900, color: 'var(--color-navy)', marginBottom: 24 }}>
                            ${regFee.toLocaleString()} <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-muted)' }}>COP</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320, margin: '0 auto' }}>
                            <button onClick={handlePay} className="btn btn-wallet btn-lg btn-full" style={{ justifyContent: 'center', height: 56, fontSize: 16 }}>
                                Activar mi Oficina Virtual <ArrowRight size={20} />
                            </button>
                            <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                                Pago 100% seguro procesado por Wompi (Bancolombia)
                            </p>
                        </div>
                    </div>

                    <div style={{ marginTop: 32, textAlign: 'center' }}>
                        <button
                            onClick={handleVerifyStatus}
                            style={{ background: 'none', border: 'none', color: 'var(--color-navy)', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto' }}
                        >
                            ¿Ya pagaste? Clic aquí para verificar <CheckCircle2 size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
