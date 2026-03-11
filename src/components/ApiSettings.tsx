import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Save } from 'lucide-react';

export default function ApiSettings() {
    const [apiKeys, setApiKeys] = useState<{ wompi_public: string, wompi_private: string, wompi_integrity: string, bold_public: string }>({
        wompi_public: '',
        wompi_private: '',
        wompi_integrity: '',
        bold_public: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            const { data } = await supabase.from('app_settings').select('*').eq('key', 'payment_api_keys').single();
            if (data && data.value) {
                setApiKeys(JSON.parse(data.value));
            }
        };
        load();
    }, []);

    const handleChange = (field: string, value: string) => {
        setApiKeys(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await supabase.from('app_settings').upsert({
                key: 'payment_api_keys',
                value: JSON.stringify(apiKeys)
            });
            alert("¡Llaves API actualizadas exitosamente! El ecosistema ahora podrá recibir transacciones automatizadas.");
        } catch (e) {
            console.error(e);
            alert("Error guardando ajustes.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ maxWidth: 800 }}>
            <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 4 }}>Configuración de Pasarelas API</h2>
                <div style={{ background: '#EEF2FF', padding: 16, borderRadius: 12, marginBottom: 24, border: '1px solid #C7D2FE' }}>
                    <p style={{ fontSize: 13, color: '#3730A3', lineHeight: 1.5 }}>
                        <strong>Modo Intermediario (Escrow):</strong> Todo el dinero FIAT que los usuarios paguen por la app entrará directamente a estas pasarelas corporativas. TrueCoin se encarga de asignar puntos TC y realizar las retenciones del MLM del 10%.
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>

                {/* Wompi */}
                <div className="card-lg" style={{ padding: 24, borderTop: '4px solid #1D4ED8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-navy)' }}>Wompi (Bancolombia)</h3>
                        <span style={{ fontSize: 11, fontWeight: 800, background: '#DBEAFE', color: '#1D4ED8', padding: '4px 10px', borderRadius: 999 }}>PRINCIPAL</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 6 }}>Llave Pública (pub_prod_...)</label>
                            <input type="text" value={apiKeys.wompi_public} onChange={e => handleChange('wompi_public', e.target.value)} className="input" placeholder="pub_prod_..." />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 6 }}>Llave Privada (prv_prod_...)</label>
                            <input type="password" value={apiKeys.wompi_private} onChange={e => handleChange('wompi_private', e.target.value)} className="input" placeholder="prv_prod_..." />
                        </div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 6 }}>Secreto de Integridad (Events/Webhooks)</label>
                        <input type="password" value={apiKeys.wompi_integrity} onChange={e => handleChange('wompi_integrity', e.target.value)} className="input" placeholder="Secret..." />
                    </div>
                </div>

                {/* Bold */}
                <div className="card-lg" style={{ padding: 24, borderTop: '4px solid #E11D48' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-navy)' }}>Bold </h3>
                        <span style={{ fontSize: 11, fontWeight: 800, background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', padding: '4px 10px', borderRadius: 999 }}>SECUNDARIO</span>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 6 }}>API Key (Bold)</label>
                        <input type="password" value={apiKeys.bold_public} onChange={e => handleChange('bold_public', e.target.value)} className="input" placeholder="PK_BOLD_..." />
                    </div>
                </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleSave} disabled={saving} className="btn btn-admin btn-lg" style={{ minWidth: 200, justifyContent: 'center' }}>
                    <Save size={18} /> {saving ? 'Guardando...' : 'Aplicar Llaves API'}
                </button>
            </div>
        </div>
    );
}
