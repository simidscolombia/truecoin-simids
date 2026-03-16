'use client';

import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Users, ArrowRight, ShoppingCart, TrendingUp } from 'lucide-react';
import RevenueSimulator from './RevenueSimulator';

export default function LandingHero({ onGetStarted }: { onGetStarted: () => void }) {
    return (
        <section style={{
            padding: '60px 32px',
            background: 'linear-gradient(135deg, var(--color-navy) 0%, #1e3a8a 100%)',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '0 0 40px 40px',
            marginBottom: 40
        }}>
            {/* Background Decorative Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute', top: -100, right: -100, width: 400, height: 400,
                    background: 'var(--color-wallet)', borderRadius: '40%', filter: 'blur(80px)'
                }}
            />

            <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

                    {/* Left Content */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '6px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)', color: 'white',
                                fontSize: 13, fontWeight: 700, marginBottom: 24, backdropFilter: 'blur(10px)'
                            }}>
                                <Zap size={14} fill="var(--color-wallet)" color="var(--color-wallet)" />
                                Ecosistema de Consumo Inteligente
                            </span>

                            <h1 style={{
                                fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: 'white',
                                lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.03em'
                            }}>
                                Gana mientras <br />
                                <span style={{ color: 'var(--color-wallet)', background: 'linear-gradient(to right, #FFD700, #FCD34D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    compras lo de siempre
                                </span>
                            </h1>

                            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: 40, maxWidth: 500 }}>
                                ShopyBrands une el poder del comercio real con una red inteligente de beneficios. Obtén Precios VIP exclusivos y construye una red de regalos infinita.
                            </p>

                            <div style={{ display: 'flex', gap: 16 }}>
                                <button
                                    onClick={onGetStarted}
                                    className="btn btn-wallet btn-lg"
                                    style={{ padding: '0 32px', height: 56, fontSize: 16, fontWeight: 800, borderRadius: 16, gap: 12 }}
                                >
                                    Unirse al Ecosistema <ArrowRight size={20} />
                                </button>
                                <button
                                    className="btn btn-outline btn-lg"
                                    style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', padding: '0 32px', height: 56, fontSize: 16, fontWeight: 800, borderRadius: 16 }}
                                >
                                    Ver Catálogo
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Steps Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: 32,
                            padding: 40,
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                        }}
                    >
                        <h3 style={{ color: 'white', fontSize: 20, fontWeight: 800, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <TrendingUp size={24} color="var(--color-wallet)" /> Paso a Paso al Éxito
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <StepItem
                                number="01"
                                title="Regístrate y Actívate"
                                desc="Crea tu perfil y activa tu membresía VIP para desbloquear Precios VIP exclusivos y beneficios."
                                icon={ShieldCheck}
                            />
                            <StepItem
                                number="02"
                                title="Consume y Ahorra"
                                desc="Compra en el Marketplace o en negocios aliados usando TrueCoins y obten Puntos Acumulables."
                                icon={ShoppingCart}
                            />
                            <StepItem
                                number="03"
                                title="Expande tu Red"
                                desc="Invita a 4 socios directos y activa la Cascada Inteligente de 12 niveles."
                                icon={Users}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Stat Row */}
            <div style={{
                maxWidth: 1200, margin: '60px auto 0',
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
                paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
                <StatSimple label="Precios VIP" value="Exclusivo" />
                <StatSimple label="Niveles de Red" value="12" />
                <StatSimple label="Moneda Ecosistema" value="TrueCoin" />
                <StatSimple label="Estructura Pro" value="1 x 4" />
            </div>

            {/* Visual Master Plan Step-by-Step */}
            <div style={{ maxWidth: 1000, margin: '80px auto 0', textAlign: 'center' }}>
                <h2 style={{ color: 'white', fontSize: 24, fontWeight: 900, marginBottom: 40 }}>Tu Camino al Éxito ShopyBrands</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, position: 'relative' }}>
                    <VisualStep num="1" color="#4ADE80" title="Activación" text="Paga tu membresía y recibe tus primeros TrueCoins." />
                    <VisualStep num="2" color="#FACC15" title="Consumo" text="Accede a Precios VIP y acumula Puntos Acumulables." />
                    <VisualStep num="3" color="#3B82F6" title="Red 1x4" text="Invita 4 socios y empieza a escalar niveles." />
                    <VisualStep num="4" color="#A855F7" title="Infinito" text="Completa el nivel 12 y reinicia el ciclo." />
                </div>
            </div>

            {/* Simulation Section */}
            <div style={{ maxWidth: 1200, margin: '100px auto 40px', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <h2 style={{ color: 'white', fontSize: 32, fontWeight: 900, marginBottom: 16 }}>Calcula tu Potencial de Ingresos</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
                        Usa nuestro simulador inteligente para ver cuánto puedes ganar activando el Efecto Shannon en cada nivel.
                    </p>
                </div>
                <RevenueSimulator />
            </div>
        </section>
    );
}

function VisualStep({ num, color, title, text }: any) {
    return (
        <div style={{ padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{
                width: 32, height: 32, borderRadius: '50%', background: color, color: 'var(--color-navy)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, margin: '0 auto 16px'
            }}>
                {num}
            </div>
            <h4 style={{ color: 'white', fontSize: 14, fontWeight: 800, marginBottom: 8 }}>{title}</h4>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, lineHeight: 1.4 }}>{text}</p>
        </div>
    );
}

function StepItem({ number, title, desc, icon: Icon }: any) {
    return (
        <div style={{ display: 'flex', gap: 20 }}>
            <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-wallet)', flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <Icon size={24} />
            </div>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--color-wallet)', opacity: 0.6 }}>{number}</span>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>{title}</h4>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{desc}</p>
            </div>
        </div>
    );
}

function StatSimple({ label, value }: any) {
    return (
        <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 24, fontWeight: 900, color: 'white', marginBottom: 4 }}>{value}</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
        </div>
    );
}
