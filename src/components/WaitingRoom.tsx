import { motion } from 'framer-motion';
import { UserPlus, Cpu, Zap, CheckCircle2 } from 'lucide-react';

interface WaitingRoomProps {
    pendingUsers: any[];
    onPlace: (userId: string) => void;
    isPlacing?: boolean;
    selectedUserId?: string;
}

export default function WaitingRoom({ pendingUsers, onPlace, isPlacing, selectedUserId }: WaitingRoomProps) {
    if (pendingUsers.length === 0) return null;

    return (
        <div className="card" style={{ padding: '24px', borderLeft: '4px solid var(--color-wallet)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ padding: '0 8px' }}>
                    <h3 style={{ fontSize: 28, fontWeight: 900, color: 'var(--color-navy)', margin: 0, letterSpacing: '-0.03em' }}>
                        <UserPlus size={24} style={{ verticalAlign: 'middle', marginRight: 12, color: 'var(--color-wallet)' }} />
                        SALA DE ESPERA
                    </h3>
                    <p style={{ fontSize: 15, color: 'var(--color-text-muted)', margin: '6px 0 0 0', fontWeight: 600 }}>
                        Socios listos para ser ubicados en tu red de regalos
                    </p>
                </div>
                <div style={{ marginLeft: 'auto', background: 'var(--color-wallet)', color: 'white', padding: '10px 20px', borderRadius: 24, fontSize: 14, fontWeight: 900, boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}>
                    {pendingUsers.length} PENDIENTES
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {pendingUsers.map((p, idx) => {
                    const isSelected = selectedUserId === p.id;
                    return (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '16px',
                                background: isSelected ? 'color-mix(in srgb, var(--color-wallet) 5%, white)' : 'white',
                                borderRadius: 16,
                                border: isSelected ? '2px solid var(--color-wallet)' : '1px solid var(--color-border)',
                                boxShadow: isSelected ? '0 4px 15px rgba(0,0,0,0.05)' : '0 2px 10px rgba(0,0,0,0.02)',
                                transition: 'all 0.3s'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: '50%',
                                    background: isSelected ? 'var(--color-wallet)' : 'var(--color-surface-2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: isSelected ? 'white' : 'var(--color-navy)', fontWeight: 800
                                }}>
                                    {p.full_name.charAt(0)}
                                </div>
                                <div>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{p.full_name}</p>
                                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>Registrado el {new Date(p.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ textAlign: 'right', marginRight: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#16A34A', fontSize: 11, fontWeight: 700 }}>
                                        <Cpu size={12} /> Sugerencia IA: Posición {idx + 1}
                                    </div>
                                    <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Cierra ciclo + rápido</span>
                                </div>
                                <button
                                    onClick={() => {
                                        onPlace(p.id);
                                        // Scroll suave a la matriz
                                        const matrixEl = document.getElementById('gift-matrix');
                                        if (matrixEl) matrixEl.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    disabled={isPlacing}
                                    className={`btn ${isSelected ? 'btn-marketplace' : 'btn-wallet'} btn-sm`}
                                    style={{ padding: '8px 16px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
                                >
                                    {isSelected ? <Zap size={14} className="animate-pulse" /> : <CheckCircle2 size={14} />}
                                    {isSelected ? 'Ubicando...' : 'Elegir'}
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div style={{ padding: 12, background: 'color-mix(in srgb, var(--color-navy) 5%, white)', borderRadius: 12, border: '1px dashed var(--color-border)', display: 'flex', gap: 10, alignItems: 'center' }}>
                <Zap size={14} style={{ color: 'var(--color-navy)' }} />
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>
                    <strong>Tip de Shannon:</strong> Si ubicas a tus socios de forma equilibrada, maximizas los bonos de mérito para toda tu organización.
                </p>
            </div>
        </div>
    );
}
