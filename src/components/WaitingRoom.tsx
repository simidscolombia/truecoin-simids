import { motion } from 'framer-motion';
import { UserPlus, CheckCircle2 } from 'lucide-react';

interface WaitingRoomProps {
    pendingUsers: any[];
    onPlace: (userId: string) => void;
    isPlacing?: boolean;
    selectedUserId?: string;
}

export default function WaitingRoom({ pendingUsers, onPlace, isPlacing, selectedUserId }: WaitingRoomProps) {
    if (pendingUsers.length === 0) return (
        <div className="card" style={{ padding: '24px', textAlign: 'center', background: 'var(--color-surface-2)', border: '1px dashed var(--color-border)' }}>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontWeight: 600 }}>Toda tu gente está ubicada ✅</p>
        </div>
    );

    return (
        <div className="card" style={{ padding: '24px', borderTop: '4px solid var(--color-wallet)', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <UserPlus size={20} style={{ color: 'var(--color-wallet)' }} />
                <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--color-navy)', margin: 0 }}>SALA DE ESPERA</h3>
            </div>

            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16, fontWeight: 600 }}>
                Elige a quién quieres ubicar en tu tablero:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pendingUsers.map((p) => {
                    const isSelected = selectedUserId === p.id;
                    return (
                        <div
                            key={p.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 16px',
                                background: isSelected ? 'color-mix(in srgb, var(--color-wallet) 10%, white)' : 'var(--color-surface-2)',
                                borderRadius: 12,
                                border: isSelected ? '2px solid var(--color-wallet)' : '1px solid transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: isSelected ? 'var(--color-wallet)' : 'white',
                                    color: isSelected ? 'white' : 'var(--color-navy)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 900, fontSize: 12
                                }}>
                                    {p.full_name.charAt(0)}
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>{p.full_name.split(' ')[0]}</span>
                            </div>

                            <button
                                onClick={() => onPlace(p.id)}
                                disabled={isPlacing}
                                className={`btn btn-sm ${isSelected ? 'btn-wallet' : 'btn-outline'}`}
                                style={{ padding: '4px 12px', fontSize: 11 }}
                            >
                                {isSelected ? 'Elegido' : 'Elegir'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
