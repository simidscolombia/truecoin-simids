const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.BRIDGE_PORT || 3001;
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
const WAHA_URL = process.env.WAHA_URL || 'http://localhost:3000';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.VITE_SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE;

let WOMPI_INTEGRITY = process.env.WOMPI_INTEGRITY;
const crypto = require('crypto');

// Helper to format phone for WAHA
function formatPhoneForWAHA(phone) {
    if (!phone) return '';
    if (phone.includes('@')) return phone;
    let clean = phone.replace(/\+/g, '');
    // Asumir Colombia (+57) si tiene 10 dígitos (ej: 3001234567)
    if (clean.length === 10 && clean.startsWith('3')) {
        clean = '57' + clean;
    }
    return `${clean}@c.us`;
}

// Cargar WOMPI_INTEGRITY dinámicamente desde la DB si no está en el .env
async function loadDynamicConfig() {
    try {
        const response = await axios.get(`${SUPABASE_URL}/rest/v1/app_settings?key=eq.payment_api_keys`, {
            headers: {
                'apikey': SUPABASE_SERVICE_ROLE,
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE}`
            }
        });
        if (response.data && response.data.length > 0) {
            const keys = JSON.parse(response.data[0].value);
            // Priorizar secreto de eventos para el webhook si existe
            WOMPI_INTEGRITY = keys.wompi_events || keys.wompi_integrity || WOMPI_INTEGRITY;
            console.log("✅ Configuración de seguridad Wompi cargada desde la Base de Datos.");
        }
    } catch (e) {
        console.error("⚠️ No se pudo cargar la configuración dinámica:", e.message);
    }
}
loadDynamicConfig();

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `Eres 'Shopy', la asistente experta de ShopyBrands. 
    Tu misión es asesorar a prospectos por WhatsApp para que se unan a la red.
    
    INFORMACIÓN CLAVE:
    1. Modelo de Negocio: Red de regalos 1x4 (invitas a 4 para avanzar).
    2. Niveles: Hay 12 niveles. Cada nivel duplica el valor.
    3. Moneda: TrueCoins (TC). 1 TC = $1,000 COP.
    4. Beneficios: Acceso a precios de mayorista en el Marketplace VIP.
    5. Distribución: 50% para el socio, 25% puntos/premios, 25% plataforma.
    
    TONO:
    - Amable, entusiasta y muy profesional.
    - Respuestas breves (máximo 3 párrafos cortos).
    - Usa emojis de forma estratégica (🚀, 💎, 📱).
    - Siempre cierra con una pregunta para mantener la conversación o invita a registrarse.`
});

// Endpoint receptor de WAHA (WhatsApp HTTP API)
app.post('/whatsapp/webhook', async (req, res) => {
    // WAHA envía el mensaje en req.body.data si es un evento session.message
    // Dependiendo de la versión de WAHA, el formato puede variar.
    const messageData = req.body.payload || req.body;
    const body = messageData.body || messageData.text;
    const from = messageData.from || messageData.chatId;

    if (!body || !from) {
        return res.status(400).json({ error: "Datos de mensaje incompletos" });
    }

    console.log(`📩 Mensaje de ${from}: ${body}`);

    try {
        // 1. Preguntarle a Shopy AI
        const result = await model.generateContent(body);
        const responseText = result.response.text();

        // 2. Enviar respuesta real vía WAHA
        console.log(`🤖 Shopy responde a ${from}: ${responseText}`);

        try {
            await axios.post(`${WAHA_URL}/api/sendText`, {
                chatId: from,
                text: responseText,
                session: 'default' // WAHA usa sesiones, 'default' es la estándar
            });
            console.log(`✅ Mensaje enviado exitosamente a ${from}`);
        } catch (wahaError) {
            console.error("❌ Error enviando mensaje a WAHA:", wahaError.message);
            // Si falla WAHA, al menos devolvemos la respuesta en el log
        }

        res.status(200).json({ success: true, reply: responseText });
    } catch (error) {
        console.error("❌ Error en el motor de Shopy:", error);
        res.status(500).json({ error: "No pude procesar el mensaje" });
    }
});

// NUEVO: Endpoint para notificaciones de administración
app.post('/api/send-notice', async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({ error: "Faltan datos (phone o message)" });
    }

    // Normalizar formato de teléfono para WAHA (ej: 57300... -> 57300...@c.us)
    const chatId = formatPhoneForWAHA(phone);

    console.log(`📢 Enviando notificación a ${chatId}...`);

    try {
        await axios.post(`${WAHA_URL}/api/sendText`, {
            chatId: chatId,
            text: message,
            session: 'default'
        });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("❌ Error enviando notificación:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ── WOMPI WEBHOOK: ACTIVACIÓN AUTOMÁTICA DE REGISTROS ────────────────
app.post('/api/wompi-webhook', async (req, res) => {
    const payload = req.body;
    console.log("🔔 Webhook Wompi Recibido:", JSON.stringify(payload));

    const { event, data, timestamp, signature } = payload;

    if (event !== 'transaction.updated') {
        return res.status(200).send('Event ignored');
    }

    const transaction = data.transaction;
    const { reference, status, id: transactionId, amount_in_cents } = transaction;

    // 1. Validar Firma (Si hay secreto configurado)
    if (WOMPI_INTEGRITY && signature) {
        const str = `${transactionId}${status}${amount_in_cents}${timestamp}${WOMPI_INTEGRITY}`;
        const hash = crypto.createHash('sha256').update(str).digest('hex');

        if (hash !== signature.checksum) {
            console.error("❌ Firma de Webhook INVÁLIDA");
            console.log("DEBUG - Cadena construida:", str);
            console.log("DEBUG - Hash generado:", hash);
            console.log("DEBUG - Checksum recibido:", signature.checksum);
            return res.status(401).send('Invalid signature');
        }
        console.log("✅ Firma de Webhook Validada");
    }

    if (status !== 'APPROVED') {
        console.log(`⚠️ Transacción ${reference} con estado: ${status}. Saltando.`);
        return res.status(200).send('Not approved');
    }

    try {
        const supabaseHeaders = {
            'apikey': SUPABASE_SERVICE_ROLE,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE}`,
            'Content-Type': 'application/json'
        };

        // CASO A: Activación de usuario existente (Referencia ACT-...)
        if (reference.startsWith('ACT-')) {
            const userId = reference.split('-')[1]; // El ID está en la referencia
            console.log(`💎 Activando usuario existente ID: ${userId}`);

            // 1. Verificar si ya es VIP (Evitar duplicidad de recompensas)
            const { data: profiles } = await axios.get(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, { headers: supabaseHeaders });
            if (!profiles || profiles.length === 0) return res.status(200).send('User not found');

            const profile = profiles[0];
            if (profile.is_vip) {
                console.log("⚠️ Usuario ya es VIP. Ignorando pago duplicado.");
                return res.status(200).send('Already VIP');
            }

            // 2. Activar VIP
            await axios.patch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, { is_vip: true }, { headers: supabaseHeaders });

            // 3. Cargar Billetera
            const rewardTC = (amount_in_cents / 100) / 1000;
            const { data: wallets } = await axios.get(`${SUPABASE_URL}/rest/v1/wallets?user_id=eq.${userId}`, { headers: supabaseHeaders });

            if (wallets && wallets.length > 0) {
                const currentBalance = Number(wallets[0].balance_tc || 0);
                await axios.patch(`${SUPABASE_URL}/rest/v1/wallets?user_id=eq.${userId}`, { balance_tc: currentBalance + rewardTC }, { headers: supabaseHeaders });
            } else {
                await axios.post(`${SUPABASE_URL}/rest/v1/wallets`, { user_id: userId, balance_tc: rewardTC }, { headers: supabaseHeaders });
            }

            console.log(`✅ Usuario ${profile.full_name} activado con ${rewardTC} TC`);

            // 4. Notificar
            const welcomeMsg = `¡Felicidades ${profile.full_name}! 🚀 Tu pago ha sido confirmado y tu oficina virtual ShopyBrands ya está ACTIVA. ✅\n\n💎 Recibiste: ${rewardTC.toFixed(2)} TC\n\nYa puedes entrar y expander tu red: https://shopybrands.com`;
            await axios.post(`${WAHA_URL}/api/sendText`, { chatId: formatPhoneForWAHA(profile.phone), text: welcomeMsg, session: 'default' }).catch(() => { });

            return res.status(200).send('Activated');
        }

        // CASO B: Flujo antiguo o residual (REG-...)
        console.log(`🔍 Buscando registro pendiente para referencia: ${reference}`);
        const { data: attempts } = await axios.get(`${SUPABASE_URL}/rest/v1/registration_attempts?reference=eq.${reference}&status=eq.pending`, { headers: supabaseHeaders });
        if (!attempts || attempts.length === 0) {
            console.log("⚠️ Registro no encontrado o ya procesado.");
            return res.status(200).send('Not found');
        }
        const attempt = attempts[0];

        // 3. Crear Perfil en Supabase (Lógica similar a userService.register pero en el Bridge)

        // 3a. Buscar referente
        let referredById = null;
        if (attempt.referral_code) {
            const { data: referrers } = await axios.get(`${SUPABASE_URL}/rest/v1/profiles?referral_code=eq.${attempt.referral_code.toUpperCase()}`, {
                headers: supabaseHeaders
            });
            if (referrers && referrers.length > 0) referredById = referrers[0].id;
        }

        // 3b. Generar nuevo código de referido
        const generateCode = () => {
            const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
            let result = '';
            for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
            return result;
        };
        const newCode = generateCode();

        // 3c. Insertar Perfil
        const { data: newProfiles } = await axios.post(`${SUPABASE_URL}/rest/v1/profiles`, {
            full_name: attempt.full_name,
            email: attempt.email,
            phone: attempt.phone,
            referral_code: newCode,
            referred_by: referredById,
            password: attempt.password,
            current_level: 1,
            is_vip: true // Ya pagó
        }, {
            headers: { ...supabaseHeaders, 'Prefer': 'return=representation' }
        });

        const newProfile = newProfiles[0];

        // 3d. Crear Billetera (1 TC por cada 1.000 COP pagados)
        const paidAmountCop = amount_in_cents / 100;
        const rewardTC = paidAmountCop / 1000;

        await axios.post(`${SUPABASE_URL}/rest/v1/wallets`, {
            user_id: newProfile.id,
            balance_tc: rewardTC
        }, {
            headers: supabaseHeaders
        });

        // 4. Marcar intento como completado
        await axios.patch(`${SUPABASE_URL}/rest/v1/registration_attempts?id=eq.${attempt.id}`, {
            status: 'completed',
            payment_id: transactionId
        }, {
            headers: supabaseHeaders
        });

        console.log(`✅ Usuario creado y activado: ${newProfile.id}`);

        // 5. Notificar por WhatsApp vía Shopy
        const welcomeMessage = `¡Hola ${attempt.full_name}! 🚀 Bienvenido a la elite de ShopyBrands.\n\nTu pago de membresía ha sido confirmado y tu cuenta ya está ACTIVA. ✅\n\n💎 Recibiste: ${rewardTC.toFixed(2)} TC\n🎟️ Tu código de referido: ${newCode}\n\nYa puedes ingresar con tu correo y contraseña: ${process.env.APP_URL || 'https://shopybrands.com'}\n\n¡Estoy lista para ayudarte a crecer! 🤖`;

        try {
            await axios.post(`${WAHA_URL}/api/sendText`, {
                chatId: formatPhoneForWAHA(attempt.phone),
                text: welcomeMessage,
                session: 'default'
            });
            console.log(`📱 WhatsApp de bienvenida enviado a ${attempt.phone}`);
        } catch (waErr) {
            console.error("❌ Error enviando WhatsApp de bienvenida:", waErr.message);
        }

        res.status(200).send('Activated');

    } catch (error) {
        console.error("❌ Error procesando activación:", error.response?.data || error.message);
        res.status(500).send('Internal Error');
    }
});

app.get('/', (req, res) => {
    res.send('ShopyBridge está en línea 🚀');
});

app.listen(PORT, () => {
    console.log(`
    ================================================
    🚀 SHOPY WHATSAPP BRIDGE INICIADO
    ================================================
    Puerto: ${PORT}
    WAHA URL: ${WAHA_URL}
    Gemini API: ${GEMINI_API_KEY ? 'CONECTADA ✅' : 'SIN LLAVE ❌'}
    
    Configura tu Webhook en WAHA a:
    http://localhost:${PORT}/whatsapp/webhook
    ------------------------------------------------
    `);
});

