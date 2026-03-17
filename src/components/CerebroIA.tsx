'use client';

import { useState, useEffect } from 'react';
// Removed motion imports as they are unused in this version
import {
    Zap, ShieldCheck, Cpu, Activity, Users, Plus,
    AlertCircle, TrendingUp
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { matrixService } from '../services/matrixService';

export default function CerebroIA() {
    const [metrics, setMetrics] = useState<any>(null);
    const [agents, setAgents] = useState<any[]>([]);
    const [isInjecting, setIsInjecting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form states for new agent
    const [newAgent, setNewAgent] = useState({
        name: '',
        email: ''
    });

    const NAMES = [
        "Carlos M.", "Sandra P.", "Luis R.", "Elena G.", "Andrés F.",
        "Claudia B.", "Javier S.", "Marta L.", "Diego H.", "Paola V."
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [m, a] = await Promise.all([
                adminService.getCerebroMetrics(),
                adminService.getAiAgents()
            ]);
            setMetrics(m);
            setAgents(a);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleInjectAgent = async () => {
        setIsInjecting(true);
        try {
            const name = newAgent.name || NAMES[Math.floor(Math.random() * NAMES.length)];
            const email = newAgent.email || `agent.${Date.now()}@shopybrands.com`;

            await matrixService.createSystemAgent(name, email);
            await fetchData();
            setNewAgent({ name: '', email: '' });
        } catch (e) {
            alert("Error inyectando agente");
        } finally {
            setIsInjecting(false);
        }
    };

    if (loading && !metrics) {
        return <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>Cargando Red Neuronal...</div>;
    }

    if (!metrics) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <p style={{ color: '#DC2626', fontWeight: 700 }}>⚠️ Error al conectar con el Cerebro IA</p>
                <button onClick={fetchData} className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>Reintentar Sincronización</button>
            </div>
        );
    }

    return (
        <div className="cerebro-container animate-in">
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 950, color: 'var(--color-navy)', letterSpacing: -1, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Cpu size={32} color="var(--color-admin)" />
                        Cerebro IA Admin
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 4 }}>Control financiero y expansión autónoma del sistema.</p>
                </div>
                <div style={{ background: 'color-mix(in srgb, var(--color-admin) 10%, white)', padding: '6px 16px', borderRadius: 12, border: '1px solid color-mix(in srgb, var(--color-admin) 20%, white)' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-admin)', textTransform: 'uppercase' }}>Estado: Sincronizado</span>
                </div>
            </div>

            {/* 1. Audit Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                <AuditCard
                    label="Fondo de Salto"
                    value={metrics.jumpFunds}
                    unit="TC"
                    icon={TrendingUp}
                    desc="Reserva para progresión L1-L11"
                    color="var(--color-admin)"
                />
                <AuditCard
                    label="Fondo Tsunami"
                    value={metrics.tsunamiTotal}
                    unit="TC"
                    icon={Activity}
                    desc="Excedente L12 (Post-payout)"
                    color="#4F46E5"
                />
                <AuditCard
                    label="Agentes Activos"
                    value={metrics.agentCount}
                    icon={Users}
                    desc="Nodos de inversión IA"
                    color="var(--color-directorio)"
                />
                <AuditCard
                    label="Cuidado del Sistema"
                    value="ÓPTIMO"
                    icon={ShieldCheck}
                    desc="Estatus de liquidez"
                    color="#10B981"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
                {/* 2. Agents List */}
                <div className="card-lg" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Activity size={20} color="var(--color-admin)" />
                            Monitor de Agentes de Inversión
                        </h3>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                                    <th style={thStyle}>AGENTE</th>
                                    <th style={thStyle}>CÓDIGO</th>
                                    <th style={thStyle}>NIVEL</th>
                                    <th style={thStyle}>MATE</th>
                                    <th style={thStyle}>RECAUDO</th>
                                    <th style={{ ...thStyle, textAlign: 'right' }}>ESTADO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agents.map((a, i) => (
                                    <tr key={a.id} style={{ borderBottom: i === agents.length - 1 ? 'none' : '1px solid var(--color-surface-2)' }}>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-surface-2)', color: 'var(--color-admin)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                                                    {a.full_name?.charAt(0)}
                                                </div>
                                                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)' }}>{a.full_name}</span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}><code style={{ fontSize: 11, fontWeight: 700 }}>{a.referral_code}</code></td>
                                        <td style={tdStyle}><span style={{ fontSize: 11, fontWeight: 700 }}>L{a.current_level}</span></td>
                                        <td style={tdStyle}><Users size={14} color="var(--color-text-muted)" /></td>
                                        <td style={tdStyle}><span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-admin)' }}>{a.wallets?.balance_tc || 0} <span style={{ fontSize: 9 }}>TC</span></span></td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                                            <span style={{ fontSize: 9, fontWeight: 800, background: '#DCFCE7', color: '#166534', padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase' }}>Inyectando</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. Inyectar Agente Control */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="card-lg" style={{ padding: 24, background: 'linear-gradient(135deg, white 0%, #F1F5F9 100%)', border: '1px solid var(--color-admin)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <Plus size={24} color="var(--color-admin)" />
                            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--color-navy)', margin: 0 }}>Inyección Manual</h3>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 20 }}>Crea un agente discreto para empujar posiciones específicas en la red.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <input
                                type="text"
                                placeholder="Nombre (o aleatorio)"
                                value={newAgent.name}
                                onChange={e => setNewAgent({ ...newAgent, name: e.target.value })}
                                style={inputStyle}
                            />
                            <button
                                onClick={handleInjectAgent}
                                disabled={isInjecting}
                                style={{
                                    width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                                    background: 'var(--color-admin)', color: 'white', fontWeight: 950,
                                    fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: 10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                }}
                            >
                                {isInjecting ? 'Procesando...' : <><Zap size={18} fill="white" /> INYECTAR AGENTE IA</>}
                            </button>
                        </div>
                    </div>

                    <div className="card-lg" style={{ padding: 24, border: '1px dashed var(--color-border)' }}>
                        <h4 style={{ fontSize: 14, fontWeight: 900, color: 'var(--color-navy)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <AlertCircle size={16} color="var(--color-wallet)" />
                            Sugerencia de Empuje
                        </h4>
                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                            La IA sugiere inyectar 1 agente en el Nivel 1 para desbloquear el salto de 3 socios a Nivel 4.
                        </p>
                        <button style={{ marginTop: 16, width: '100%', padding: '8px', borderRadius: 8, border: '1px solid var(--color-admin)', background: 'transparent', color: 'var(--color-admin)', fontWeight: 800, fontSize: 11, cursor: 'pointer' }}>
                            VER ANÁLISIS COMPLETO
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AuditCard({ label, value, unit, icon: Icon, desc, color }: any) {
    return (
        <div style={{ padding: 20, background: 'white', borderRadius: 24, border: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={18} />
            </div>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 22, fontWeight: 950, color: 'var(--color-navy)' }}>{value}</span>
                {unit && <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-text-muted)' }}>{unit}</span>}
            </div>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 8 }}>{desc}</p>
        </div>
    );
}

const thStyle: React.CSSProperties = {
    padding: '16px 12px', fontSize: 10, fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em'
};

const tdStyle: React.CSSProperties = {
    padding: '16px 12px', fontSize: 13, borderBottom: '1px solid var(--color-surface-2)'
};

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-border)', fontSize: 14, fontWeight: 600
};
