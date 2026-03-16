'use client';

import { motion } from 'framer-motion';
import { Users, TrendingUp, BarChart3, Zap } from 'lucide-react';


const EXPANSION_DATA = [
    { level: 1, rank: "VIP BRONCE", users: 4, perUser: 50, total: 200, color: '#F59E0B' },
    { level: 2, rank: "VIP COBRE", users: 16, perUser: 100, total: 400, color: '#3B82F6' },
    { level: 3, rank: "VIP PLATA", users: 64, perUser: 200, total: 800, color: '#6366F1' },
    { level: 4, rank: "VIP ORO", users: 256, perUser: 400, total: 1600, color: '#8B5CF6' },
    { level: 5, rank: "PLATINO", users: 1024, perUser: 800, total: 3200, color: '#EC4899' },
    { level: 6, rank: "ZAFIRO", users: 4096, perUser: 1600, total: 6400, color: '#F43F5E' },
    { level: 7, rank: "ESMERALDA", users: 16384, perUser: 3200, total: 12800, color: '#10B981' },
    { level: 8, rank: "DIAMANTE", users: 65536, perUser: 6400, total: 25600, color: '#14B8A6' },
    { level: 9, rank: "DIAMANTE AZUL", users: 262144, perUser: 12800, total: 51200, color: '#0EA5E9' },
    { level: 10, rank: "CORONA", users: 1048576, perUser: 25600, total: 102400, color: '#6366F1' },
    { level: 11, rank: "EMBAJADOR", users: 4194304, perUser: 51200, total: 204800, color: '#4F46E5' },
    { level: 12, rank: "EMBAJADOR REAL", users: 16777216, perUser: 102400, total: 409600, color: '#1E1B4B' },
];

export default function ExpansionMap() {
    return (
        <div className="card-lg" style={{ padding: '40px 32px', background: 'var(--color-bg)' }}>
            <div style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 12, background: 'var(--color-navy)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                    }}>
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 24, fontWeight: 950, color: 'var(--color-navy)', letterSpacing: -0.5 }}>
                            Plan de Expansión Shopy
                        </h2>
                        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 }}>
                            Mapa de progresión matemática y financiera de 12 niveles.
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ overflowX: 'auto', margin: '0 -32px', padding: '0 32px' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left' }}>
                            <th style={thStyle}>Nivel</th>
                            <th style={thStyle}>Maestría / Rango</th>
                            <th style={thStyle}>Usuarios</th>
                            <th style={thStyle}>Aporte (TC)</th>
                            <th style={thStyle}>Total Nivel (TC)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {EXPANSION_DATA.map((item, idx) => (
                            <motion.tr
                                key={item.level}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                style={{
                                    background: 'white',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                    borderRadius: 16
                                }}
                            >
                                <td style={{ ...tdStyle, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8, background: 'var(--color-surface-2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 12, fontWeight: 800, color: 'var(--color-navy)'
                                    }}>
                                        N{item.level}
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }}></div>
                                        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-navy)' }}>{item.rank}</span>
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Users size={14} style={{ opacity: 0.3 }} />
                                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)' }}>
                                            {item.users.toLocaleString()}
                                        </span>
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)' }}>
                                        {item.perUser.toLocaleString()} <span style={{ fontSize: 10, opacity: 0.5 }}>TC</span>
                                    </span>
                                </td>
                                <td style={{ ...tdStyle, borderTopRightRadius: 16, borderBottomRightRadius: 16 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <TrendingUp size={14} style={{ color: '#10B981' }} />
                                        <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--color-navy)' }}>
                                            {item.total.toLocaleString()} <span style={{ fontSize: 10, opacity: 0.5 }}>TC</span>
                                        </span>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{
                marginTop: 32, padding: 24, borderRadius: 24,
                background: 'linear-gradient(135deg, var(--color-navy) 0%, #1e293b 100%)',
                color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div>
                    <h4 style={{ fontSize: 14, fontWeight: 800, opacity: 0.7, textTransform: 'uppercase', marginBottom: 4 }}>Potencial de Red Acumulado</h4>
                    <p style={{ fontSize: 24, fontWeight: 950 }}>
                        {EXPANSION_DATA.reduce((acc, i) => acc + i.total, 0).toLocaleString()} <span style={{ fontSize: 14, opacity: 0.5 }}>TC</span>
                    </p>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={24} fill="white" />
                </div>
            </div>
        </div>
    );
}

const thStyle: React.CSSProperties = {
    padding: '0 16px 8px',
    fontSize: 11,
    fontWeight: 800,
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const tdStyle: React.CSSProperties = {
    padding: '16px',
    verticalAlign: 'middle'
};
