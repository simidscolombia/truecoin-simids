'use client';

import { useState, useMemo } from 'react';
import {
    Award,
    ChevronRight, Zap, Calculator,
    Target
} from 'lucide-react';
import { giftService } from '../services/giftService';

export default function RevenueSimulator() {
    const [referralCount, setReferralCount] = useState(4);
    const [level, setLevel] = useState(1);

    // Cálculo de proyecciones
    const stats = useMemo(() => {
        const levelValue = giftService.getLevelValue(level);
        const rewardBase = levelValue * 0.25;

        // Mis directos que llenan mi nivel (máximo 4 para el ciclo actual)
        const myDirectsInMyMatrix = Math.min(referralCount, 4);

        // Excedente de referidos que generan Bono de Mérito (Shannon Effect) en mi red de abajo
        const spilloverReferrals = Math.max(0, referralCount - 4);


        // Nota: En la matriz 1x4, el premio total al completar es el 25% del valor de entrada
        const completeLevelReward = rewardBase;

        // Calculamos cuánto gano por poner gente debajo (Bono de Mérito 50% de la recompensa del que recibe)
        const meritBonusPerPerson = (rewardBase * 0.50);
        const totalMeritBonus = spilloverReferrals * meritBonusPerPerson;

        return {
            levelName: RANKS[level - 1],
            entryValue: levelValue,
            directGain: myDirectsInMyMatrix >= 4 ? completeLevelReward : 0,
            meritGain: totalMeritBonus,
            totalEstimated: (myDirectsInMyMatrix >= 4 ? completeLevelReward : 0) + totalMeritBonus,
            spilloverImpact: spilloverReferrals
        };
    }, [referralCount, level]);

    return (
        <div className="card-lg" style={{ padding: 40, background: 'var(--color-navy)', color: 'white', borderRadius: 32 }}>
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>

                {/* Left Side: Controls */}
                <div style={{ flex: '1 1 400px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                        <div style={{ padding: 10, background: 'var(--color-wallet)', borderRadius: 12, color: 'var(--color-navy)' }}>
                            <Calculator size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: 24, fontWeight: 900 }}>Simulador de Ganancias</h2>
                            <p style={{ fontSize: 14, opacity: 0.7 }}>Proyecta tu éxito con el Efecto Shannon</p>
                        </div>
                    </div>

                    {/* Level Selector */}
                    <div style={{ marginBottom: 40 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 800, marginBottom: 16, opacity: 0.6, textTransform: 'uppercase' }}>
                            Nivel de Desafío
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(l => (
                                <button
                                    key={l}
                                    onClick={() => setLevel(l)}
                                    style={{
                                        padding: '12px',
                                        borderRadius: 12,
                                        border: '1px solid',
                                        borderColor: level === l ? 'var(--color-wallet)' : 'rgba(255,255,255,0.1)',
                                        background: level === l ? 'var(--color-wallet)' : 'transparent',
                                        color: level === l ? 'var(--color-navy)' : 'white',
                                        fontWeight: 800,
                                        fontSize: 13,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Niv {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Referral Slider */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <label style={{ fontSize: 13, fontWeight: 800, opacity: 0.6, textTransform: 'uppercase' }}>
                                Tus Referidos Directos
                            </label>
                            <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--color-wallet)' }}>{referralCount}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={referralCount}
                            onChange={(e) => setReferralCount(parseInt(e.target.value))}
                            style={{
                                width: '100%',
                                accentColor: 'var(--color-wallet)',
                                cursor: 'pointer'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, opacity: 0.5 }}>
                            <span>0 socios</span>
                            <span>50 socios</span>
                            <span>100 socios</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Results */}
                <div style={{ flex: '1 1 300px', background: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, opacity: 0.6, marginBottom: 8 }}>GANANCIA ESTIMADA POR CICLO</p>
                        <h3 style={{ fontSize: 48, fontWeight: 900, color: 'var(--color-wallet)' }}>
                            {stats.totalEstimated.toLocaleString()} <span style={{ fontSize: 20 }}>TC</span>
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <ResultRow
                            icon={<Award size={18} />}
                            label="Recompensa Tu Matriz"
                            value={`${stats.directGain.toLocaleString()} TC`}
                            sub={referralCount < 4 ? "Faltan socios para completar" : "Nivel completado"}
                        />
                        <ResultRow
                            icon={<Zap size={18} />}
                            label="Bono de Mérito IA"
                            value={`${stats.meritGain.toLocaleString()} TC`}
                            sub={`Por ${stats.spilloverImpact} socios puestos en tu red`}
                            highlight
                        />
                        <ResultRow
                            icon={<Target size={18} />}
                            label="Pasa al Nivel Siguiente"
                            value={stats.levelName}
                            sub={`Fondo acumulado: ${(stats.entryValue * 0.5).toLocaleString()} TC`}
                        />
                    </div>

                    <button
                        className="btn btn-wallet btn-lg"
                        style={{ width: '100%', marginTop: 32, height: 56, borderRadius: 16, fontSize: 16, fontWeight: 800 }}
                    >
                        Empezar Ahora <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function ResultRow({ icon, label, value, sub, highlight }: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: highlight ? 'var(--color-wallet)' : 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: highlight ? 'var(--color-navy)' : 'white'
            }}>
                {icon}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.8 }}>{label}</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: highlight ? 'var(--color-wallet)' : 'white' }}>{value}</span>
                </div>
                <p style={{ fontSize: 11, opacity: 0.5 }}>{sub}</p>
            </div>
        </div>
    );
}

const RANKS = [
    "VIP BRONCE", "VIP PLATA", "VIP ORO", "PLATINO",
    "ZAFIRO", "ESMERALDA", "DIAMANTE", "DIAMANTE AZUL"
];
