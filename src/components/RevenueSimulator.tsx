'use client';

import { useState } from 'react';
import { TrendingUp, ArrowRight, Zap, Target } from 'lucide-react';

export default function RevenueSimulator() {
    const [referrals, setReferrals] = useState(4);
    const [duplication, setDuplication] = useState(4);
    const [levels, setLevels] = useState(3);

    // Lógica de cálculo basada en el plan 2-2-2-4 y 1x4
    // Simplificado para la proyección: 
    // Nivel 1: $X, Nivel 2: $Y...
    // Supongamos un promedio de 10 TC ($10,000 COP) de ganancia residual por socio activo en la red
    const tcValue = 1000; // 1 TC = $1000 COP

    const calculateTotalPartners = () => {
        let total = 0;
        let currentLevelPartners = referrals;
        for (let i = 0; i < levels; i++) {
            total += currentLevelPartners;
            currentLevelPartners = currentLevelPartners * duplication;
        }
        return total;
    };

    const totalPartners = calculateTotalPartners();
    const monthlyTC = totalPartners * 5; // 5 TC por socio de ganancia residual promedio
    const monthlyCOP = monthlyTC * tcValue;

    return (
        <div className="card-lg" style={{ padding: 32, background: 'linear-gradient(135deg, #0B1F4B, #1E40AF)', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                <TrendingUp size={200} />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Target size={24} color="var(--color-wallet)" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 2 }}>Simulador de Libertad 🚀</h2>
                        <p style={{ fontSize: 13, opacity: 0.7 }}>Proyecta tu crecimiento en el ecosistema ShopyBrands</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 32 }}>
                    {/* Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', opacity: 0.8, marginBottom: 8, display: 'block' }}>
                                Tus Referidos Directos: <span style={{ color: 'var(--color-wallet)', fontSize: 16 }}>{referrals}</span>
                            </label>
                            <input
                                type="range" min="1" max="10" step="1"
                                value={referrals}
                                onChange={(e) => setReferrals(parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--color-wallet)' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', opacity: 0.8, marginBottom: 8, display: 'block' }}>
                                Duplicación (¿Cuántos traen ellos?): <span style={{ color: 'var(--color-wallet)', fontSize: 16 }}>{duplication}</span>
                            </label>
                            <input
                                type="range" min="2" max="6" step="1"
                                value={duplication}
                                onChange={(e) => setDuplication(parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--color-wallet)' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', opacity: 0.8, marginBottom: 8, display: 'block' }}>
                                Profundidad de Red: <span style={{ color: 'var(--color-wallet)', fontSize: 16 }}>{levels} Niveles</span>
                            </label>
                            <input
                                type="range" min="1" max="5" step="1"
                                value={levels}
                                onChange={(e) => setLevels(parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--color-wallet)' }}
                            />
                        </div>
                    </div>

                    {/* Results Card */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 24, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ marginBottom: 20 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, opacity: 0.6, textTransform: 'uppercase' }}>Socios en tu Red</p>
                            <p style={{ fontSize: 40, fontWeight: 900, color: 'white' }}>{totalPartners.toLocaleString()}</p>
                        </div>
                        <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 20 }} />
                        <div>
                            <p style={{ fontSize: 12, fontWeight: 700, opacity: 0.6, textTransform: 'uppercase' }}>Ingreso Mensual Estimado</p>
                            <p style={{ fontSize: 32, fontWeight: 900, color: 'var(--color-wallet)' }}>
                                {monthlyTC.toLocaleString()} <span style={{ fontSize: 16 }}>TC</span>
                            </p>
                            <p style={{ fontSize: 18, fontWeight: 700, opacity: 0.9 }}>
                                ≈ ${monthlyCOP.toLocaleString()} COP
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'white', color: 'var(--color-navy)', borderRadius: 16, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Zap size={20} color="var(--color-wallet)" />
                        <span style={{ fontSize: 14, fontWeight: 700 }}>Con esta red alcanzarías el rango <strong>PLATINO DIAMANTE</strong></span>
                    </div>
                    <button className="btn btn-navy" style={{ padding: '8px 20px', fontSize: 13 }}>
                        Ver Plan de Acción <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
