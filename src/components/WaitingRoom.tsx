import { motion } from 'framer-motion';
import { UserPlus, Cpu, Zap, CheckCircle2 } from 'lucide-react';

interface WaitingRoomProps {
    pendingUsers: any[];
    onPlace: (userId: string, position: number) => void;
    isPlacing?: boolean;
}

export default function WaitingRoom({ pendingUsers, onPlace, isPlacing }: WaitingRoomProps) {
    if (pendingUsers.length === 0) return null;

    return (
        <div className="card" style={{ padding: '24px', borderLeft: '4px solid var(--color-wallet)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'color-mix(in srgb, var(--color-wallet) 10%, white)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-wallet)' }}>
                    <UserPlus size={20} />
                </div>
                <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>Sala de Espera (Bandeja de Entrada)</h3>
                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>Tienes socios nuevos listos para ser ubicados en tu red.</p>
                </div>
                <div style={{ marginLeft: 'auto', background: 'var(--color-wallet)', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                    {pendingUsers.length} Pendientes
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pendingUsers.map((p, idx) => (
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
                            background: 'white',
                            borderRadius: 16,
                            border: '1px solid var(--color-border)',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-navy)', fontWeight: 800 }}>
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
                                onClick={() => onPlace(p.id, idx + 1)}
                                disabled={isPlacing}
                                className="btn btn-wallet btn-sm"
                                style={{ padding: '8px 16px', fontSize: 12 }}
                            >
                                <CheckCircle2 size={14} /> Ubicar
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ marginTop: 20, padding: 12, background: 'color-mix(in srgb, var(--color-navy) 5%, white)', borderRadius: 12, border: '1px dashed var(--color-border)', display: 'flex', gap: 10, alignItems: 'center' }}>
                <Zap size={14} style={{ color: 'var(--color-navy)' }} />
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>
                    <strong>Tip de Shannon:</strong> Si ubicas a tus socios de forma equilibrada, maximizas los bonos de mérito para toda tu organización.
                </p>
            </div>
        </div>
    );
}
